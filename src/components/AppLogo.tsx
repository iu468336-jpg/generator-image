import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 120 }: AppLogoProps) {
  return (
    <Image
      source={require('../../assets/icon.png')}
      style={[styles.logo, { width: size, height: size, borderRadius: size * 0.22 }]}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
