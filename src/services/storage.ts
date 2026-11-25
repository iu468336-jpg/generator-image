import AsyncStorage from '@react-native-async-storage/async-storage';
import { Creation } from '../types';

const CREATIONS_KEY = '@generator-image/creations';
const ONBOARDED_KEY = '@generator-image/onboarded';

export async function loadCreations(): Promise<Creation[]> {
  const raw = await AsyncStorage.getItem(CREATIONS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Creation[];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function addCreation(creation: Creation): Promise<Creation[]> {
  const existing = await loadCreations();
  const updated = [creation, ...existing];
  await AsyncStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeCreation(id: string): Promise<Creation[]> {
  const existing = await loadCreations();
  const updated = existing.filter((item) => item.id !== id);
  await AsyncStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export async function hasOnboarded(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDED_KEY);
  return value === 'true';
}

export async function setOnboarded(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
}
