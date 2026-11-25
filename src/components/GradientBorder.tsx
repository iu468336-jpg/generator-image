import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius as themeRadius } from '../theme/colors';

interface GradientBorderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  borderWidth?: number;
}

export function GradientBorder({
  children,
  style,
  borderRadius = themeRadius.pill,
  borderWidth = 1.5,
}: GradientBorderProps) {
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius, padding: borderWidth }, style]}
    >
      <View style={[styles.inner, { borderRadius: borderRadius - borderWidth }]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  inner: {
    backgroundColor: colors.backgroundTop,
    overflow: 'hidden',
  },
});
