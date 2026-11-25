export const colors = {
  backgroundTop: '#0B0620',
  backgroundBottom: '#1A0B3D',
  gradientPurple: '#7C3AED',
  gradientBlue: '#3B82F6',
  gradientPink: '#EC4899',
  cardBackground: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(167,139,250,0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A99FD4',
  danger: '#F87171',
  success: '#34D399',
  tabBarBackground: 'rgba(11,6,32,0.95)',
} as const;

export const gradients = {
  primary: [colors.gradientPurple, colors.gradientBlue, colors.gradientPink] as const,
  background: [colors.backgroundTop, colors.backgroundBottom] as const,
  button: [colors.gradientPurple, colors.gradientBlue] as const,
  accent: [colors.gradientBlue, colors.gradientPink] as const,
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 24,
  pill: 999,
};
