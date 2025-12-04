/**
 * Growth data store using Zustand
 */

import { create } from 'zustand';
import { GrowthStore } from './types';
import { BabyProfile, GrowthMeasurement } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { storageService } from '../services/storage/storageService';

export const useGrowthStore = create<GrowthStore>((set, get) => ({
  // Initial state
  profile: null,
  measurements: [],
  displayUnits: {
    weight: 'kg',
    height: 'cm',
  },
  isLoading: false,
  error: null,

  // Actions
  setProfile: (profile: BabyProfile) => {
    set({ profile });
    get().saveData();
  },

  addMeasurement: (measurement: GrowthMeasurement) => {
    set((state) => ({
      measurements: [...state.measurements, measurement].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
    get().saveData();
  },

  updateMeasurement: (id: string, data: Partial<GrowthMeasurement>) => {
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m.id === id ? { ...m, ...data } : m
      ),
    }));
    get().saveData();
  },

  deleteMeasurement: (id: string) => {
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
    }));
    get().saveData();
  },

  setDisplayUnits: (units: { weight: 'kg' | 'lb'; height: 'cm' | 'in' }) => {
    set({ displayUnits: units });
  },

  // Storage actions
  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await storageService.get<BabyProfile>(STORAGE_KEYS.PROFILE);
      const measurements = await storageService.get<GrowthMeasurement[]>(
        STORAGE_KEYS.MEASUREMENTS
      ) || [];

      set({
        profile,
        measurements: measurements.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false,
      });
    }
  },

  saveData: async () => {
    try {
      const { profile, measurements } = get();
      if (profile) {
        await storageService.set(STORAGE_KEYS.PROFILE, profile);
      }
      await storageService.set(STORAGE_KEYS.MEASUREMENTS, measurements);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save data',
      });
    }
  },

  // Computed
  getLatestMeasurement: () => {
    const { measurements } = get();
    return measurements.length > 0 ? measurements[0] : null;
  },

  getMeasurementsByMetric: (metric: 'weight' | 'height' | 'head') => {
    const { measurements } = get();
    return measurements.filter((m) => {
      switch (metric) {
        case 'weight':
          return m.weightKg > 0;
        case 'height':
          return m.heightCm > 0;
        case 'head':
          return m.headCm > 0;
        default:
          return false;
      }
    });
  },
}));

