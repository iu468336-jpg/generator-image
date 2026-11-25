import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PreviewScreen } from '../screens/PreviewScreen';
import { MainTabsNavigator } from './MainTabsNavigator';
import { RootStackParamList } from './types';
import { hasOnboarded } from '../services/storage';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    hasOnboarded().then((seen) => setInitialRoute(seen ? 'MainTabs' : 'Onboarding'));
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundTop, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen name="Preview" component={PreviewScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
