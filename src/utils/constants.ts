/**
 * App-wide constants
 */

// Storage keys
export const STORAGE_KEYS = {
  PROFILE: 'growth/v1/profile',
  MEASUREMENTS: 'growth/v1/measurements',
  SCHEMA_VERSION: 'growth/v1/schemaVersion',
} as const;

// Schema version for migrations
export const CURRENT_SCHEMA_VERSION = 1;

// Unit conversion constants
export const UNIT_CONVERSIONS = {
  KG_TO_LB: 2.20462,
  LB_TO_KG: 0.453592,
  CM_TO_IN: 0.393701,
  IN_TO_CM: 2.54,
} as const;

// Validation limits
export const VALIDATION_LIMITS = {
  WEIGHT_MIN_KG: 0.1,
  WEIGHT_MAX_KG: 50,
  HEIGHT_MIN_CM: 20,
  HEIGHT_MAX_CM: 200,
  HEAD_MIN_CM: 20,
  HEAD_MAX_CM: 80,
} as const;

// Chart configuration
export const CHART_CONFIG = {
  PERCENTILES: [3, 10, 25, 50, 75, 90, 97] as const,
  POINT_SIZE: 6,
  LINE_WIDTH: 2,
  ANIMATION_DURATION: 500,
} as const;

// Age calculation
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_LEAP_YEAR = 366;
