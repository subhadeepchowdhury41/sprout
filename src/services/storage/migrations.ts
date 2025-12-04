/**
 * Storage migration utilities
 */

import { CURRENT_SCHEMA_VERSION, STORAGE_KEYS } from '../../utils/constants';
import { storageService } from './storageService';

/**
 * Run migrations if schema version is outdated
 */
export async function runMigrations(): Promise<void> {
  try {
    const currentVersion = await storageService.get<number>(STORAGE_KEYS.SCHEMA_VERSION) || 0;

    if (currentVersion < CURRENT_SCHEMA_VERSION) {
      // Run migrations sequentially
      for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version++) {
        await migrateToVersion(version);
      }

      // Update schema version
      await storageService.set(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

/**
 * Migrate to specific version
 */
async function migrateToVersion(version: number): Promise<void> {
  switch (version) {
    case 1:
      // Initial migration - ensure data structure is correct
      await migrateToV1();
      break;
    // Add future migrations here
    default:
      console.warn(`Unknown migration version: ${version}`);
  }
}

/**
 * Migration to version 1
 */
async function migrateToV1(): Promise<void> {
  // Ensure measurements array exists and is valid
  const measurements = await storageService.get<any[]>(STORAGE_KEYS.MEASUREMENTS);
  if (measurements && !Array.isArray(measurements)) {
    // Invalid data structure, reset to empty array
    await storageService.set(STORAGE_KEYS.MEASUREMENTS, []);
  }
}

