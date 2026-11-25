import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { AppLogo } from '../components/AppLogo';
import { GradientButton } from '../components/GradientButton';
import { StarsField } from '../components/StarsField';
import { colors, gradients } from '../theme/colors';
import { setOnboarded } from '../services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const EXAMPLES = [
  { title: 'Astronaut', subtitle: 'portrait', image: require('../../assets/examples/astronaut.jpg') },
  { title: 'Neon Cyberpunk', subtitle: 'street', image: require('../../assets/examples/cyberpunk.jpg') },
  { title: 'Fantasy', subtitle: 'Forest', image: require('../../assets/examples/fantasy-forest.jpg') },
];

export function OnboardingScreen({ navigation }: Props) {
  const handleStart = async () => {
    await setOnboarded();
    navigation.replace('MainTabs');
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.flex}>
      <StarsField count={30} />
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content}>
          <AppLogo size={130} />

          <Text style={styles.title}>Créez vos images</Text>
          <Text style={styles.subtitle}>Générez de l’art unique instantanément</Text>

          <GradientButton label="Commencer" onPress={handleStart} style={styles.cta} />

          <View style={styles.examplesRow}>
            {EXAMPLES.map((example) => (
              <View key={example.title} style={styles.exampleCard}>
                <Image source={example.image} style={styles.exampleImage} />
                <Text style={styles.exampleTitle} numberOfLines={1}>
                  {example.title}
                </Text>
                <Text style={styles.exampleSubtitle} numberOfLines={1}>
                  {example.subtitle}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  cta: {
    width: '70%',
    marginBottom: 24,
  },
  examplesRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  exampleCard: {
    width: 96,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingBottom: 8,
  },
  exampleImage: {
    width: '100%',
    height: 96,
  },
  exampleTitle: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    marginTop: 4,
  },
  exampleSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    paddingHorizontal: 6,
  },
});
