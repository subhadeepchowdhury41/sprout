/**
 * Unit conversion utilities
 */

import { UNIT_CONVERSIONS } from './constants';

/**
 * Convert kilograms to pounds
 */
export function kgToLb(kg: number): number {
  return kg * UNIT_CONVERSIONS.KG_TO_LB;
}

/**
 * Convert pounds to kilograms
 */
export function lbToKg(lb: number): number {
  return lb * UNIT_CONVERSIONS.LB_TO_KG;
}

/**
 * Convert centimeters to inches
 */
export function cmToIn(cm: number): number {
  return cm * UNIT_CONVERSIONS.CM_TO_IN;
}

/**
 * Convert inches to centimeters
 */
export function inToCm(inches: number): number {
  return inches * UNIT_CONVERSIONS.IN_TO_CM;
}

/**
 * Round to specified decimal places
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format weight for display
 */
export function formatWeight(kg: number, unit: 'kg' | 'lb'): string {
  const value = unit === 'kg' ? kg : kgToLb(kg);
  return `${round(value, 1)} ${unit}`;
}

/**
 * Format height for display
 */
export function formatHeight(cm: number, unit: 'cm' | 'in'): string {
  const value = unit === 'cm' ? cm : cmToIn(cm);
  return `${round(value, 1)} ${unit}`;
}
