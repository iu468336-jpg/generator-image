import { Creation } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Preview: { creation: Creation };
};

export type MainTabsParamList = {
  Home: undefined;
  Gallery: undefined;
  Settings: undefined;
};
