import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';
import { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<keyof MainTabsParamList, IoniconName> = {
  Home: 'home',
  Gallery: 'images',
  Settings: 'settings',
};

const LABELS: Record<keyof MainTabsParamList, string> = {
  Home: 'Accueil',
  Gallery: 'Galerie',
  Settings: 'Paramètres',
};

export function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />,
        tabBarLabel: LABELS[route.name],
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
    height: 64,
    paddingTop: 6,
    paddingBottom: 10,
  },
});
