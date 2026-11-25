import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, gradients } from '../theme/colors';
import { GradientButton } from '../components/GradientButton';
import { saveImageToGallery, shareImage } from '../services/download';
import { removeCreation } from '../services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

export function PreviewScreen({ route, navigation }: Props) {
  const { creation } = route.params;
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    setIsSaving(true);
    const result = await saveImageToGallery(creation.uri);
    setIsSaving(false);
    Alert.alert(result.success ? 'Succès' : 'Erreur', result.message);
  };

  const handleShare = async () => {
    const result = await shareImage(creation.uri);
    if (!result.success && result.message) {
      Alert.alert('Erreur', result.message);
    }
  };

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer cette création de votre galerie ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await removeCreation(creation.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <Image source={{ uri: creation.uri }} style={styles.image} contentFit="contain" />

        <View style={styles.infoBlock}>
          <Text style={styles.prompt} numberOfLines={3}>
            {creation.prompt}
          </Text>
          <Text style={styles.meta}>
            {creation.style} · {creation.aspectRatio} · {new Date(creation.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.actions}>
          <GradientButton label="Télécharger" onPress={handleDownload} loading={isSaving} style={styles.actionButton} />
          <GradientButton label="Partager" onPress={handleShare} variant="accent" style={styles.actionButton} />
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Supprimer</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  image: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  infoBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  prompt: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    alignSelf: 'center',
    paddingVertical: 16,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});
