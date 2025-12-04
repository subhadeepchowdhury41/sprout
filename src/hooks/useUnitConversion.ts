/**
 * Hook for unit conversion
 */

import { useMemo } from 'react';
import { kgToLb, lbToKg, cmToIn, inToCm } from '../utils/unitConversion';

export interface UnitConversionResult {
  value: number;
  convertedValue: number;
  unit: string;
  convertedUnit: string;
}

/**
 * Convert weight between kg and lb
 */
export function useWeightConversion(value: number, fromUnit: 'kg' | 'lb'): UnitConversionResult {
  return useMemo(() => {
    if (fromUnit === 'kg') {
      return {
        value,
        convertedValue: kgToLb(value),
        unit: 'kg',
        convertedUnit: 'lb',
      };
    } else {
      return {
        value,
        convertedValue: lbToKg(value),
        unit: 'lb',
        convertedUnit: 'kg',
      };
    }
  }, [value, fromUnit]);
}

/**
 * Convert height between cm and in
 */
export function useHeightConversion(value: number, fromUnit: 'cm' | 'in'): UnitConversionResult {
  return useMemo(() => {
    if (fromUnit === 'cm') {
      return {
        value,
        convertedValue: cmToIn(value),
        unit: 'cm',
        convertedUnit: 'in',
      };
    } else {
      return {
        value,
        convertedValue: inToCm(value),
        unit: 'in',
        convertedUnit: 'cm',
      };
    }
  }, [value, fromUnit]);
}

