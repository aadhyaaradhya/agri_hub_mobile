import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Non-sensitive, larger-payload data (profile, config cache, mock records).
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`storage.get error for key "${key}":`, err);
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`storage.set error for key "${key}":`, err);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn(`storage.remove error for key "${key}":`, err);
    }
  },
};

// Sensitive, small-payload data (auth tokens). SecureStore has a ~2KB value
// limit and no JSON helpers built in, so keep this to short strings/small
// objects — the session token+expiry, not the full user profile.
//
// `expo-secure-store` is native-only in this SDK — calling it on web throws
// (`getValueWithKeyAsync is not a function`) rather than degrading
// gracefully. On native (Android/iOS), keystore errors or emulator issues
// can also cause rejections, so we catch errors and fall back gracefully to AsyncStorage.
export const secureStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      let raw: string | null = null;
      if (Platform.OS === 'web') {
        raw = await AsyncStorage.getItem(key);
      } else {
        try {
          raw = await SecureStore.getItemAsync(key);
        } catch (secureError) {
          console.warn(`SecureStore.getItemAsync failed for "${key}", falling back to AsyncStorage:`, secureError);
          raw = await AsyncStorage.getItem(key);
        }
      }
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`secureStorage.get error for key "${key}":`, err);
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const raw = JSON.stringify(value);
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, raw);
      } else {
        try {
          await SecureStore.setItemAsync(key, raw);
        } catch (secureError) {
          console.warn(`SecureStore.setItemAsync failed for "${key}", falling back to AsyncStorage:`, secureError);
          await AsyncStorage.setItem(key, raw);
        }
      }
    } catch (err) {
      console.warn(`secureStorage.set error for key "${key}":`, err);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (secureError) {
          console.warn(`SecureStore.deleteItemAsync failed for "${key}", falling back to AsyncStorage:`, secureError);
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (err) {
      console.warn(`secureStorage.remove error for key "${key}":`, err);
    }
  },
};

export const STORAGE_KEYS = {
  session: 'agrihub.session',
  user: 'agrihub.user',
  themeMode: 'agrihub.themeMode',
  mockUsers: 'agrihub.mockUsers.v1',
  marketplace: 'agrihub.marketplace.v1',
} as const;
