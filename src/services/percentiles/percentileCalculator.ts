/**
 * Percentile calculation service
 * 
 * This service calculates percentiles using WHO LMS method
 * LMS = Lambda (skewness), Median, Sigma (coefficient of variation)
 */

import { GrowthMeasurement, LMSData } from '../../types';

/**
 * Calculate Z-score from LMS parameters
 */
function calculateZScore(value: number, L: number, M: number, S: number): number {
  if (L === 0) {
    // Normal distribution
    return Math.log(value / M) / S;
  } else {
    // Box-Cox transformation
    return ((Math.pow(value / M, L) - 1) / (L * S));
  }
}

/**
 * Convert Z-score to percentile (0-100)
 */
function zScoreToPercentile(zScore: number): number {
  // Using approximation formula for normal distribution
  // More accurate methods can be implemented using statistical libraries
  const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
  const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  if (zScore > 0) {
    return (1 - prob) * 100;
  } else {
    return prob * 100;
  }
}

/**
 * Interpolate LMS values for a given age
 */
function interpolateLMS(ageInDays: number, lmsData: LMSData[]): LMSData | null {
  if (lmsData.length === 0) return null;
  
  // Find the two closest data points
  let lower = lmsData[0];
  let upper = lmsData[lmsData.length - 1];
  
  for (let i = 0; i < lmsData.length - 1; i++) {
    if (lmsData[i].ageDays <= ageInDays && lmsData[i + 1].ageDays >= ageInDays) {
      lower = lmsData[i];
      upper = lmsData[i + 1];
      break;
    }
  }
  
  // If exact match
  if (lower.ageDays === ageInDays) {
    return lower;
  }
  
  // Linear interpolation
  const ratio = (ageInDays - lower.ageDays) / (upper.ageDays - lower.ageDays);
  
  return {
    ageDays: ageInDays,
    L: lower.L + (upper.L - lower.L) * ratio,
    M: lower.M + (upper.M - lower.M) * ratio,
    S: lower.S + (upper.S - lower.S) * ratio,
  };
}

/**
 * Calculate percentile for a measurement value
 */
export function calculatePercentile(
  value: number,
  ageInDays: number,
  lmsData: LMSData[]
): number {
  const lms = interpolateLMS(ageInDays, lmsData);
  
  if (!lms) {
    throw new Error(`No LMS data found for age ${ageInDays} days`);
  }
  
  const zScore = calculateZScore(value, lms.L, lms.M, lms.S);
  return zScoreToPercentile(zScore);
}

/**
 * Calculate all percentiles for a measurement
 */
export function calculateMeasurementPercentiles(
  measurement: GrowthMeasurement,
  weightLMS: LMSData[],
  heightLMS: LMSData[],
  headLMS: LMSData[]
): GrowthMeasurement {
  const updated = { ...measurement };
  
  if (measurement.weightKg > 0 && weightLMS.length > 0) {
    updated.weightPercentile = calculatePercentile(
      measurement.weightKg,
      measurement.ageInDays,
      weightLMS
    );
  }
  
  if (measurement.heightCm > 0 && heightLMS.length > 0) {
    updated.heightPercentile = calculatePercentile(
      measurement.heightCm,
      measurement.ageInDays,
      heightLMS
    );
  }
  
  if (measurement.headCm > 0 && headLMS.length > 0) {
    updated.headPercentile = calculatePercentile(
      measurement.headCm,
      measurement.ageInDays,
      headLMS
    );
  }
  
  return updated;
}

