/**
 * Date utility functions
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

/**
 * Calculate age in days from birth date to measurement date
 * Handles leap years correctly
 */
export function calculateAgeInDays(
  birthDate: string,
  measurementDate: string,
): number {
  const birth = dayjs.utc(birthDate).startOf('day');
  const measurement = dayjs.utc(measurementDate).startOf('day');

  if (!birth.isValid() || !measurement.isValid()) {
    throw new Error('Invalid date format');
  }

  if (measurement.isBefore(birth)) {
    throw new Error('Measurement date cannot be before birth date');
  }

  return measurement.diff(birth, 'day');
}

/**
 * Format date for display
 */
export function formatDate(
  date: string,
  format: string = 'MMM D, YYYY',
): string {
  return dayjs.utc(date).format(format);
}

/**
 * Format age as "X months Y days"
 */
export function formatAge(ageInDays: number): string {
  const months = Math.floor(ageInDays / 30);
  const days = ageInDays % 30;

  if (months === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  if (days === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }

  return `${months} month${months !== 1 ? 's' : ''} ${days} day${
    days !== 1 ? 's' : ''
  }`;
}

/**
 * Get today's date in ISO format (UTC)
 */
export function getTodayISO(): string {
  return dayjs.utc().startOf('day').toISOString();
}

/**
 * Check if date is valid ISO format
 */
export function isValidISODate(date: string): boolean {
  return dayjs.utc(date).isValid();
}
