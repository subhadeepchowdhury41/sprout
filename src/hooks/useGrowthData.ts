/**
 * Hook for managing growth data and percentiles
 */

import { useEffect, useMemo } from 'react';
import { useGrowthStore } from '../store/growthStore';
import { GrowthMeasurement } from '../types';
import { getLMSData } from '../services/percentiles/lmsCalculator';
import { calculateMeasurementPercentiles } from '../services/percentiles/percentileCalculator';

/**
 * Hook to get growth data with calculated percentiles
 */
export function useGrowthData() {
  const store = useGrowthStore();
  const { profile, measurements } = store;

  // Get LMS data based on profile gender
  const weightLMS = useMemo(() => {
    if (!profile) return [];
    return getLMSData('weight', profile.gender);
  }, [profile]);

  const heightLMS = useMemo(() => {
    if (!profile) return [];
    return getLMSData('height', profile.gender);
  }, [profile]);

  // Calculate percentiles for all measurements
  const measurementsWithPercentiles = useMemo(() => {
    if (!profile || measurements.length === 0) return [];

    return measurements.map((measurement) =>
      calculateMeasurementPercentiles(measurement, weightLMS, heightLMS, []),
    );
  }, [measurements, profile, weightLMS, heightLMS]);

  return {
    ...store,
    measurements: measurementsWithPercentiles,
  };
}

