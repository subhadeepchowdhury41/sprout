/**
 * Growth reference data types
 */

export interface LMSData {
  ageDays: number;
  L: number; // Lambda (skewness)
  M: number; // Median
  S: number; // Coefficient of variation
}

export interface GrowthReference {
  sex: 'male' | 'female';
  metric: 'weight' | 'height' | 'head';
  data: LMSData[];
}

export interface PercentileData {
  ageDays: number;
  p3: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97: number;
}

export type Percentile = 3 | 10 | 25 | 50 | 75 | 90 | 97;
