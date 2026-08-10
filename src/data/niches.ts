import { NicheOption } from '../types';

export const NICHES_LIST: NicheOption[] = [
  {
    id: 'dentist',
    label: 'Dentists & Dental Clinics',
    geoCategory: 'healthcare.dentist,healthcare.clinic',
    iconName: 'Stethoscope'
  },
  {
    id: 'restaurant',
    label: 'Restaurants & Dining',
    geoCategory: 'catering.restaurant,catering',
    iconName: 'Utensils'
  },
  {
    id: 'lawyer',
    label: 'Law Firms & Legal Services',
    geoCategory: 'office.lawyer,office.financial,office',
    iconName: 'Scale'
  },
  {
    id: 'roofing',
    label: 'Roofing Contractors',
    geoCategory: 'building.construction,service,office',
    iconName: 'Home'
  },
  {
    id: 'plumbing',
    label: 'Plumbing Services',
    geoCategory: 'service,building.construction,office',
    iconName: 'Wrench'
  },
  {
    id: 'hvac',
    label: 'HVAC Heating & Cooling',
    geoCategory: 'service,building.construction,office',
    iconName: 'Wind'
  },
  {
    id: 'realestate',
    label: 'Real Estate Agencies',
    geoCategory: 'office.real_estate,office',
    iconName: 'Building'
  },
  {
    id: 'autorepair',
    label: 'Auto Repair & Mechanics',
    geoCategory: 'service.vehicle.car_repair,service.vehicle',
    iconName: 'Car'
  },
  {
    id: 'gym',
    label: 'Fitness Gyms & Studios',
    geoCategory: 'sport.fitness,sport.sports_centre',
    iconName: 'Dumbbell'
  },
  {
    id: 'accounting',
    label: 'Accounting & CPA Firms',
    geoCategory: 'office.financial,office',
    iconName: 'Calculator'
  },
  {
    id: 'chiropractic',
    label: 'Chiropractors & Wellness',
    geoCategory: 'healthcare.clinic,healthcare',
    iconName: 'Activity'
  },
  {
    id: 'salon',
    label: 'Hair Salons & Day Spas',
    geoCategory: 'beauty.hairdresser,beauty.spa',
    iconName: 'Scissors'
  }
];
