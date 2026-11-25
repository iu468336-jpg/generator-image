import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, gradients, radius } from '../theme/colors';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'accent';
  style?: ViewStyle;
}

export function GradientButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
  variant = 'primary',
  style,
}: GradientButtonProps) {
  const colorsSet = variant === 'primary' ? gradients.button : gradients.accent;

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled || loading} style={[styles.wrapper, style]}>
      <LinearGradient
        colors={colorsSet}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, (disabled || loading) && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <View style={styles.content}>
            {icon}
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});
