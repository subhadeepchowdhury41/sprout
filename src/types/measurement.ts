/**
 * Growth Measurement types
 */

export interface GrowthMeasurement {
  id: string;
  date: string; // ISO date string (UTC 00:00)
  ageInDays: number; // Derived from birthDate -> date
  weightKg: number; // Stored in SI units
  heightCm: number; // Stored in SI units
  headCm: number; // Stored in SI units
  weightPercentile?: number; // 0–100
  heightPercentile?: number; // 0–100
  headPercentile?: number; // 0–100
}

export type MeasurementUnit = 'metric' | 'imperial';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';

export interface MeasurementFormData {
  date: string;
  weight: number;
  height: number;
  head: number;
  unit: MeasurementUnit;
}
