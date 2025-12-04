/**
 * Color palette for the app
 */

export const colors = {
  // Primary
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E8',

  // Secondary
  secondary: '#FF6B6B',
  secondaryDark: '#E55555',
  secondaryLight: '#FF8585',

  // Status
  success: '#51CF66',
  warning: '#FFD93D',
  error: '#FF6B6B',
  info: '#4A90E2',

  // Backgrounds
  background: '#FEFEFE',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Text
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textDisabled: '#BDC3C7',

  // Borders & Dividers
  border: '#E8ECEF',
  divider: '#E8ECEF',

  // Chart
  chartGrid: '#E8ECEF',
  chartLine: '#4A90E2',
  chartPoint: '#FF6B6B',

  // Percentile colors
  percentile3: '#E8ECEF',
  percentile10: '#D5DDE5',
  percentile25: '#B8C5D1',
  percentile50: '#4A90E2',
  percentile75: '#B8C5D1',
  percentile90: '#D5DDE5',
  percentile97: '#E8ECEF',
} as const;

export type ColorKey = keyof typeof colors;
