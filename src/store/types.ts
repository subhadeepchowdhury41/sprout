/**
 * Store-related types
 */

import { BabyProfile, GrowthMeasurement } from '../types';

export interface GrowthStore {
  // State
  profile: BabyProfile | null;
  measurements: GrowthMeasurement[];
  displayUnits: {
    weight: 'kg' | 'lb';
    height: 'cm' | 'in';
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: BabyProfile) => void;
  addMeasurement: (measurement: GrowthMeasurement) => void;
  updateMeasurement: (id: string, data: Partial<GrowthMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  setDisplayUnits: (units: {
    weight: 'kg' | 'lb';
    height: 'cm' | 'in';
  }) => void;

  // Storage actions
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;

  // Computed
  getLatestMeasurement: () => GrowthMeasurement | null;
  getMeasurementsByMetric: (
    metric: 'weight' | 'height' | 'head',
  ) => GrowthMeasurement[];
}
