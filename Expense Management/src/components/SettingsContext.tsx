import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsConfig } from './settings/index';

interface SettingsContextType {
  settings: SettingsConfig;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
  updateSetting: (key: keyof SettingsConfig, value: any) => void;
  saveSettings: () => Promise<{ success: boolean; error?: string }>;
  resetSettings: () => void;
  getSetting: (key: keyof SettingsConfig) => any;
  exportSettings: () => void;
  importSettings: (settingsData: string) => { success: boolean; error?: string };
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settingsHook = useSettings();

  return (
    <SettingsContext.Provider value={settingsHook}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

// Hook to get specific setting with type safety
export const useSetting = <T = any>(key: keyof SettingsConfig): T => {
  const { getSetting } = useSettingsContext();
  return getSetting(key) as T;
};

// Hook to update specific setting
export const useUpdateSetting = () => {
  const { updateSetting } = useSettingsContext();
  return updateSetting;
};

// Hook to check if a feature is enabled based on settings
export const useFeatureFlag = (featureKey: keyof SettingsConfig): boolean => {
  const { getSetting } = useSettingsContext();
  return Boolean(getSetting(featureKey));
};