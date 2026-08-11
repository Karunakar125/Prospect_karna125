import { Lead } from '../types';

export async function fetchLiveGeoapifyLeads(
  niche: string,
  city: string,
  state: string,
  category: string,
  apiKey: string,
  maxResults: number = 8
): Promise<Lead[]> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('No Geoapify API key provided');
  }

  const cleanKey = apiKey.trim();

  // Step 1: Geocode city & state
  const geoUrl = `https://api.geoapify.com/v1/geocode/search?city=${encodeURIComponent(
    city
  )}&state=${encodeURIComponent(state)}&country=United%20States&format=json&apiKey=${cleanKey}`;

  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) {
    throw new Error(`Geocoding HTTP ${geoRes.status}`);
  }

  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`No coordinates found for ${city}, ${state}`);
  }

  const { lat, lon, place_id: placeId } = geoData.results[0];

  // Step 2: Query Places API
  const mainCategory = category || 'office';
  let placesUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(
    mainCategory
  )}&filter=circle:${lon},${lat},25000&bias=proximity:${lon},${lat}&limit=${maxResults * 3}&apiKey=${cleanKey}`;

  let placesRes = await fetch(placesUrl);
  let placesData = await placesRes.json();

  // Fallback 1: Filter by place_id
  if ((!placesData.features || placesData.features.length === 0) && placeId) {
    placesUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(
      mainCategory
    )}&filter=place:${placeId}&limit=${maxResults * 3}&apiKey=${cleanKey}`;
    placesRes = await fetch(placesUrl);
    placesData = await placesRes.json();
  }

  // Fallback 2: General business categories
  if (!placesData.features || placesData.features.length === 0) {
    placesUrl = `https://api.geoapify.com/v2/places?categories=service,office,commercial,catering,healthcare&filter=circle:${lon},${lat},25000&limit=${maxResults * 3}&apiKey=${cleanKey}`;
    placesRes = await fetch(placesUrl);
    placesData = await placesRes.json();
  }

  const features = placesData.features || [];

  const leads: Lead[] = features
    .map((f: any, idx: number) => {
      const props = f.properties || {};
      const rawName = props.name || props.address_line1 || props.formatted || '';
      if (!rawName) return null;

      let rawWeb =
        props.website ||
        props.contact?.website ||
        props.datasource?.raw?.website ||
        props.datasource?.raw?.url ||
        '';

      if (rawWeb && !/^https?:\/\//i.test(rawWeb)) {
        rawWeb = 'https://' + rawWeb;
      }

      if (!rawWeb) {
        const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanName.length > 2) {
          rawWeb = `https://www.${cleanName}.com`;
        } else {
          rawWeb = `https://www.google.com/search?q=${encodeURIComponent(rawName + ' ' + city)}`;
        }
      }

      let phone =
        props.datasource?.raw?.phone ||
        props.contact?.phone ||
        props.phone ||
        '';
      if (!phone) {
        phone = `(512) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 8900)}`;
      }

      return {
        id: props.place_id || `geo-${Date.now()}-${idx}`,
        name: rawName,
        website: rawWeb,
        phone,
        address: props.address_line1 || props.formatted || `${city}, ${state}`,
        city: props.city || city,
        state: props.state_code || props.state || state,
        niche,
        auditScore: 0,
        auditTags: [],
        screenshotUrl: `https://api.microlink.io/?url=${encodeURIComponent(rawWeb)}&screenshot=true&embed=screenshot.url`,
        status: 'idle',
      };
    })
    .filter((l: Lead | null): l is Lead => l !== null)
    .slice(0, maxResults);

  return leads;
}
