/**
 * Measurement validation utilities
 */

import { MeasurementFormData } from '../../types';
import { VALIDATION_LIMITS } from '../../utils/constants';
import { lbToKg, inToCm } from '../../utils/unitConversion';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate measurement form data
 */
export function validateMeasurement(
  data: MeasurementFormData,
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Date validation
  if (!data.date) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'date', message: 'Invalid date format' });
    }
  }

  // Weight validation
  if (data.weight <= 0) {
    errors.push({ field: 'weight', message: 'Weight must be greater than 0' });
  } else {
    const weightKg = data.unit === 'metric' ? data.weight : lbToKg(data.weight);
    if (weightKg < VALIDATION_LIMITS.WEIGHT_MIN_KG) {
      errors.push({
        field: 'weight',
        message: `Weight must be at least ${VALIDATION_LIMITS.WEIGHT_MIN_KG} kg`,
      });
    }
    if (weightKg > VALIDATION_LIMITS.WEIGHT_MAX_KG) {
      errors.push({
        field: 'weight',
        message: `Weight must be less than ${VALIDATION_LIMITS.WEIGHT_MAX_KG} kg`,
      });
    }
  }

  // Height validation
  if (data.height <= 0) {
    errors.push({ field: 'height', message: 'Height must be greater than 0' });
  } else {
    const heightCm = data.unit === 'metric' ? data.height : inToCm(data.height);
    if (heightCm < VALIDATION_LIMITS.HEIGHT_MIN_CM) {
      errors.push({
        field: 'height',
        message: `Height must be at least ${VALIDATION_LIMITS.HEIGHT_MIN_CM} cm`,
      });
    }
    if (heightCm > VALIDATION_LIMITS.HEIGHT_MAX_CM) {
      errors.push({
        field: 'height',
        message: `Height must be less than ${VALIDATION_LIMITS.HEIGHT_MAX_CM} cm`,
      });
    }
  }

  // Head circumference validation
  if (data.head <= 0) {
    errors.push({
      field: 'head',
      message: 'Head circumference must be greater than 0',
    });
  } else {
    const headCm = data.unit === 'metric' ? data.head : inToCm(data.head);
    if (headCm < VALIDATION_LIMITS.HEAD_MIN_CM) {
      errors.push({
        field: 'head',
        message: `Head circumference must be at least ${VALIDATION_LIMITS.HEAD_MIN_CM} cm`,
      });
    }
    if (headCm > VALIDATION_LIMITS.HEAD_MAX_CM) {
      errors.push({
        field: 'head',
        message: `Head circumference must be less than ${VALIDATION_LIMITS.HEAD_MAX_CM} cm`,
      });
    }
  }

  return errors;
}

/**
 * Check if measurement data is valid
 */
export function isValidMeasurement(data: MeasurementFormData): boolean {
  return validateMeasurement(data).length === 0;
}
