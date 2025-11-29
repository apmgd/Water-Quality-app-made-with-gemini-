export enum StatusLevel {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  DANGER = 'DANGER'
}

export interface WaterDataPoint {
  date: string; // ISO Date
  value: number; // e.g., Enterococcus MPN/100ml
  threshold: number; // The danger line for this specific location
}

export interface BeachGroup {
  id: string;
  name: string;
  region: string; // e.g., "South Bay", "Central", "North County"
  currentStatus: StatusLevel;
  lastUpdated: string;
  history: WaterDataPoint[];
  latitude: number;
  longitude: number;
}
