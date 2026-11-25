import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, gradients, radius } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useSettings } from '../context/SettingsContext';
import { useTabBarHeight } from '../navigation/tabBarMetrics';
import { AspectRatio, ArtStyle } from '../types';

const RATIOS: AspectRatio[] = ['1:1', '3:4', '16:9'];
const STYLES: ArtStyle[] = ['Photo', 'Cinématique', 'Anime', '3D', 'Peinture'];

export function SettingsScreen() {
  const { aspectRatio, style, setAspectRatio, setStyle } = useSettings();
  const tabBarHeight = useTabBarHeight();

  const select = (action: () => void) => {
    Haptics.selectionAsync().catch(() => {});
    action();
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 32 + tabBarHeight }]}>
          <Text style={styles.title}>Paramètres</Text>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Format d’image</Text>
            <View style={styles.chipsRow}>
              {RATIOS.map((ratio) => (
                <Chip key={ratio} label={ratio} active={ratio === aspectRatio} onPress={() => select(() => setAspectRatio(ratio))} />
              ))}
            </View>
          </GlassCard>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Style artistique</Text>
            <View style={styles.chipsRow}>
              {STYLES.map((item) => (
                <Chip key={item} label={item} active={item === style} onPress={() => select(() => setStyle(item))} />
              ))}
            </View>
          </GlassCard>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Thème</Text>
            <View style={styles.chipsRow}>
              <Chip label="Sombre" active onPress={() => {}} />
              <Chip label="Clair (bientôt)" active={false} disabled onPress={() => {}} />
            </View>
          </GlassCard>

          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.aboutText}>Generator Image — v1.0.0</Text>
            <Text style={styles.aboutText}>
              Application de génération d’images par intelligence artificielle. Décrivez une idée, l’IA la transforme en
              image unique en quelques secondes.
            </Text>
            <Pressable onPress={() => Linking.openURL('https://pollinations.ai')}>
              <Text style={styles.link}>Propulsé par Pollinations.ai</Text>
            </Pressable>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Chip({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  if (active) {
    return (
      <LinearGradient colors={gradients.button} style={[styles.chip, disabled && styles.chipDisabled]}>
        <Text style={styles.chipTextActive}>{label}</Text>
      </LinearGradient>
    );
  }
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.chip, styles.chipInactive, disabled && styles.chipDisabled]}>
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  aboutText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  link: {
    color: colors.gradientBlue,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
