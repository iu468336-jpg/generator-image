import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AspectRatio, ArtStyle } from '../types';

const SETTINGS_KEY = '@generator-image/settings';

interface Settings {
  aspectRatio: AspectRatio;
  style: ArtStyle;
}

const DEFAULT_SETTINGS: Settings = {
  aspectRatio: '1:1',
  style: 'Photo',
};

interface SettingsContextValue extends Settings {
  setAspectRatio: (ratio: AspectRatio) => void;
  setStyle: (style: ArtStyle) => void;
  isReady: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Settings;
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setAspectRatio = useCallback(
    (aspectRatio: AspectRatio) => persist({ ...settings, aspectRatio }),
    [settings, persist]
  );

  const setStyle = useCallback((style: ArtStyle) => persist({ ...settings, style }), [settings, persist]);

  const value = useMemo(
    () => ({ ...settings, setAspectRatio, setStyle, isReady }),
    [settings, setAspectRatio, setStyle, isReady]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
