/**
 * LMS Calculator - Loads and provides access to WHO growth reference data
 */

import { GrowthReference, LMSData } from '../../types';
import weightMaleData from '../../data/growthReferences/whoWeightMale.json';
import weightFemaleData from '../../data/growthReferences/whoWeightFemale.json';
import heightMaleData from '../../data/growthReferences/whoHeightMale.json';
import heightFemaleData from '../../data/growthReferences/whoHeightFemale.json';

const growthReferences: GrowthReference[] = [
  weightMaleData as GrowthReference,
  weightFemaleData as GrowthReference,
  heightMaleData as GrowthReference,
  heightFemaleData as GrowthReference,
];

/**
 * Get LMS data for a specific metric and sex
 */
export function getLMSData(
  metric: 'weight' | 'height',
  sex: 'male' | 'female',
): LMSData[] {
  const ref = growthReferences.find(
    (r) => r.metric === metric && r.sex === sex,
  );
  return ref?.data || [];
}

/**
 * Get all available growth references
 */
export function getAllGrowthReferences(): GrowthReference[] {
  return growthReferences;
}

