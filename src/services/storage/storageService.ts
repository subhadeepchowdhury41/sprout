/**
 * Storage service wrapper around AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  /**
   * Get item from storage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      throw new Error(`Failed to read data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set item in storage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      throw new Error(`Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove item from storage
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
      throw new Error(`Failed to remove data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear all app data
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error(`Failed to clear data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys() as string[];
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw new Error(`Failed to get keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const storageService = new StorageService();

