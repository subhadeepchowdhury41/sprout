/**
 * Hook for age calculation
 */

import { useMemo } from 'react';
import { calculateAgeInDays } from '../utils/dateUtils';

/**
 * Calculate age in days from birth date to measurement date
 */
export function useAgeCalculation(
  birthDate: string | null,
  measurementDate: string | null,
): number | null {
  return useMemo(() => {
    if (!birthDate || !measurementDate) {
      return null;
    }

    try {
      return calculateAgeInDays(birthDate, measurementDate);
    } catch (error) {
      console.error('Age calculation error:', error);
      return null;
    }
  }, [birthDate, measurementDate]);
}
