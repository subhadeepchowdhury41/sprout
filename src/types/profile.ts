/**
 * Baby Profile types
 */

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string; // ISO date string
  gender: 'male' | 'female';
}
