import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, gradients, radius } from '../theme/colors';
import { GradientButton } from '../components/GradientButton';
import { GradientBorder } from '../components/GradientBorder';
import { StarsField } from '../components/StarsField';
import { ShimmerSkeleton } from '../components/ShimmerSkeleton';
import { generateImage } from '../services/imageGeneration';
import { saveImageToGallery, shareImage } from '../services/download';
import { addCreation } from '../services/storage';
import { useSettings } from '../context/SettingsContext';
import { Creation, GenerationError } from '../types';

export function HomeScreen() {
  const { aspectRatio, style } = useSettings();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Creation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    try {
      const generation = await generateImage({ prompt, aspectRatio, style });
      const creation: Creation = {
        id: `${Date.now()}`,
        prompt,
        uri: generation.localUri,
        createdAt: Date.now(),
        aspectRatio,
        style,
      };
      await addCreation(creation);
      setResult(creation);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (err) {
      const message =
        err instanceof GenerationError
          ? err.message
          : "Une erreur réseau est survenue. Vérifiez votre connexion internet et réessayez.";
      setErrorMessage(message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setIsSaving(true);
    const saveResult = await saveImageToGallery(result.uri);
    setIsSaving(false);
    if (saveResult.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    Alert.alert(saveResult.success ? 'Succès' : 'Erreur', saveResult.message);
  };

  const handleShare = async () => {
    if (!result) return;
    const shareResult = await shareImage(result.uri);
    if (!shareResult.success && shareResult.message) {
      Alert.alert('Erreur', shareResult.message);
    }
  };

  const handleRegenerate = () => {
    setResult(null);
    handleGenerate();
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Generator Image</Text>
          {result ? (
            <Pressable style={styles.downloadIcon} onPress={handleDownload} disabled={isSaving}>
              {isSaving ? <ActivityIndicator color={colors.textPrimary} size="small" /> : <Text style={styles.downloadIconText}>⬇</Text>}
            </Pressable>
          ) : (
            <View style={styles.downloadIconPlaceholder} />
          )}
        </View>

        <View style={styles.canvas}>
          {isGenerating ? (
            <View style={styles.canvasInner}>
              <ShimmerSkeleton style={StyleSheet.absoluteFill} />
              <StarsField count={22} />
              <Text style={styles.loadingText}>Génération en cours…</Text>
            </View>
          ) : result ? (
            <Image source={{ uri: result.uri }} style={styles.resultImage} contentFit="cover" transition={200} />
          ) : (
            <View style={styles.canvasInner}>
              <StarsField count={22} />
              <Text style={styles.placeholderIcon}>✨</Text>
              <Text style={styles.placeholderText}>Votre image apparaîtra ici</Text>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            </View>
          )}
        </View>

        {result && !isGenerating ? (
          <View style={styles.actionsRow}>
            <GradientButton label="Télécharger" onPress={handleDownload} variant="primary" style={styles.actionButton} />
            <GradientButton label="Partager" onPress={handleShare} variant="accent" style={styles.actionButton} />
            <GradientButton label="Régénérer" onPress={handleRegenerate} variant="primary" style={styles.actionButton} />
          </View>
        ) : null}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.promptRow}>
            <GradientBorder style={styles.promptInputWrapper} borderRadius={radius.pill}>
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Décrivez votre image… (ex : Une lionne majestueuse sous la pluie, style cinématique)"
                placeholderTextColor={colors.textSecondary}
                style={styles.promptInput}
                multiline
                editable={!isGenerating}
              />
            </GradientBorder>
            <GradientButton
              label="Générer"
              onPress={handleGenerate}
              loading={isGenerating}
              disabled={!prompt.trim()}
              style={styles.generateButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  downloadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIconPlaceholder: {
    width: 40,
    height: 40,
  },
  downloadIconText: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  canvas: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  canvasInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    fontSize: 42,
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  promptInputWrapper: {
    flex: 1,
  },
  promptInput: {
    color: colors.textPrimary,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 80,
  },
  generateButton: {
    minWidth: 100,
  },
});
