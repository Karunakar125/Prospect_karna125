import { NicheOption } from '../types';

export const NICHES_LIST: NicheOption[] = [
  {
    id: 'dentist',
    label: 'Dentists & Dental Clinics',
    geoCategory: 'healthcare.dentist',
    iconName: 'Stethoscope'
  },
  {
    id: 'restaurant',
    label: 'Restaurants & Dining',
    geoCategory: 'catering.restaurant',
    iconName: 'Utensils'
  },
  {
    id: 'lawyer',
    label: 'Law Firms & Legal Services',
    geoCategory: 'service.financial,service.financial.lawyer,office',
    iconName: 'Scale'
  },
  {
    id: 'roofing',
    label: 'Roofing Contractors',
    geoCategory: 'building.construction,service',
    iconName: 'Home'
  },
  {
    id: 'plumbing',
    label: 'Plumbing Services',
    geoCategory: 'service,building.construction',
    iconName: 'Wrench'
  },
  {
    id: 'hvac',
    label: 'HVAC Heating & Cooling',
    geoCategory: 'service',
    iconName: 'Wind'
  },
  {
    id: 'realestate',
    label: 'Real Estate Agencies',
    geoCategory: 'office.real_estate,service',
    iconName: 'Building'
  },
  {
    id: 'autorepair',
    label: 'Auto Repair & Mechanics',
    geoCategory: 'service.vehicle,car.car_repair',
    iconName: 'Car'
  },
  {
    id: 'gym',
    label: 'Fitness Gyms & Studios',
    geoCategory: 'sport.fitness,sport.gym',
    iconName: 'Dumbbell'
  },
  {
    id: 'accounting',
    label: 'Accounting & CPA Firms',
    geoCategory: 'office.financial,service.financial',
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
    geoCategory: 'beauty.spa,beauty.hairdresser',
    iconName: 'Scissors'
  }
];
