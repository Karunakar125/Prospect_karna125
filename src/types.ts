export type LeadStatus =
  | 'idle'
  | 'scraping'
  | 'extracting'
  | 'screenshot'
  | 'auditing'
  | 'drafting'
  | 'ready'
  | 'failed';

export interface AuditObservation {
  observation: string;
  insight: string;
  gap: string;
}

export interface AuditDetail {
  score: number;
  summary: string;
  mobileScore: number;
  loadScore: number;
  ctaScore: number;
  observations: AuditObservation[];
  tags: string[];
}

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface Lead {
  id: string;
  name: string;
  website: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  niche: string;
  auditScore: number;
  auditTags: string[];
  screenshotUrl: string;
  foundEmail?: string;
  manualEmail?: string;
  status: LeadStatus;
  statusMessage?: string;
  auditDetail?: AuditDetail;
  emailDraft?: EmailDraft;
}

export interface SearchForm {
  niche: string;
  city: string;
  state: string;
  geoCategory?: string;
  customKey?: string;
  sampleMode: boolean;
  maxResults: number;
}

export interface NicheOption {
  id: string;
  label: string;
  geoCategory: string;
  iconName: string;
}
