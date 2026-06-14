import { MMKV } from 'react-native-mmkv';
import { Note } from '@/types/note';
import { STORAGE_KEYS } from './keys';

export const storage = new MMKV({ id: 'neuronote-storage' });

export type StoredSettings = {
  openaiApiKey: string;
  darkModeOverride: 'system' | 'light' | 'dark';
};

const defaultSettings: StoredSettings = {
  openaiApiKey: '',
  darkModeOverride: 'system',
};

export function loadNotes(): Note[] {
  const raw = storage.getString(STORAGE_KEYS.NOTES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  storage.set(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function loadSettings(): StoredSettings {
  const raw = storage.getString(STORAGE_KEYS.SETTINGS);
  if (!raw) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: StoredSettings): void {
  storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
