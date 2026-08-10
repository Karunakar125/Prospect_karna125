import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Sliders, Key, Zap, CheckCircle2 } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { NICHES_LIST } from '../data/niches';
import { US_CITIES_MAP, US_CITIES_LIST } from '../data/usCities';

interface SearchFormProps {
  onSearch: (form: SearchFormType) => void;
  isLoading: boolean;
  defaultGeoapifyKey?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  defaultGeoapifyKey = '',
}) => {
  const [niche, setNiche] = useState<string>('Dentists & Dental Clinics');
  const [city, setCity] = useState<string>('Austin');
  const [state, setState] = useState<string>('TX');
  const [maxResults, setMaxResults] = useState<number>(6);
  const [sampleMode, setSampleMode] = useState<boolean>(false);
  const [customKey, setCustomKey] = useState<string>(defaultGeoapifyKey);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  useEffect(() => {
    if (defaultGeoapifyKey) {
      setCustomKey(defaultGeoapifyKey);
    }
  }, [defaultGeoapifyKey]);

  // City Logic Requirement: When a city is selected, the state updates automatically and becomes readonly/disabled
  useEffect(() => {
    if (city && US_CITIES_MAP[city]) {
      setState(US_CITIES_MAP[city]);
    }
  }, [city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedNiche = NICHES_LIST.find((n) => n.label === niche);
    onSearch({
      niche,
      city,
      state,
      geoCategory: selectedNiche?.geoCategory,
      maxResults,
      sampleMode,
      customKey: customKey.trim() ? customKey.trim() : undefined,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-slate-950/40">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Niche Dropdown */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Target Niche / Category
            </label>
            <div className="relative">
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 transition-all appearance-none cursor-pointer"
              >
                {NICHES_LIST.map((n) => (
                  <option key={n.id} value={n.label} className="bg-slate-900 text-slate-200">
                    {n.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* City Dropdown */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              US City (100+ Available)
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 transition-all appearance-none cursor-pointer"
              >
                {US_CITIES_LIST.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-200">
                    {c}, {US_CITIES_MAP[c]}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Readonly/Disabled State Input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>State</span>
              <span className="text-[10px] text-slate-500 font-normal">Auto-mapped</span>
            </label>
            <input
              type="text"
              value={state}
              readOnly
              disabled
              className="w-full bg-slate-950/70 border border-slate-800/80 text-slate-400 font-medium text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed select-none"
              title="State is auto-filled based on selected US City"
            />
          </div>
        </div>

        {/* Options Row & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-4 text-xs text-slate-300 w-full sm:w-auto">
            {/* Max Results Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Leads limit:</span>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={4}>4 Leads</option>
                <option value={6}>6 Leads</option>
                <option value={8}>8 Leads</option>
                <option value={12}>12 Leads</option>
              </select>
            </div>

            {/* Sample Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sampleMode}
                onChange={(e) => setSampleMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative" />
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Sample Mode
              </span>
            </label>

            {/* Config Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>API Key Config</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Pipeline...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scrape & AI Audit Leads</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible API Key Config */}
        {showAdvanced && (
          <div className="mt-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Key className="w-3.5 h-3.5" />
                Geoapify Places API Key
              </span>
              <span className="text-slate-500">Optional if using server default or sample mode</span>
            </div>
            <input
              type="password"
              placeholder="Enter Geoapify API Key (e.g. 840c1...)"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Geoapify is used for scraping real US local business leads. If no key is provided, ProspectPilot automatically uses verified domain leads so you can evaluate the entire AI audit & cold email pipeline!
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
