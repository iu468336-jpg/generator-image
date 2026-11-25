import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { colors, gradients, radius } from '../theme/colors';
import { GradientButton } from '../components/GradientButton';
import { loadCreations } from '../services/storage';
import { saveImageToGallery } from '../services/download';
import { Creation } from '../types';
import { MainTabsParamList, RootStackParamList } from '../navigation/types';
import { useTabBarHeight } from '../navigation/tabBarMetrics';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Gallery'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function GalleryScreen({ navigation }: Props) {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const tabBarHeight = useTabBarHeight();

  useFocusEffect(
    useCallback(() => {
      loadCreations().then(setCreations);
    }, [])
  );

  const handleQuickDownload = async (creation: Creation) => {
    setDownloadingId(creation.id);
    const result = await saveImageToGallery(creation.uri);
    setDownloadingId(null);
    Alert.alert(result.success ? 'Succès' : 'Erreur', result.message);
  };

  const mostRecent = creations[0];

  return (
    <LinearGradient colors={gradients.background} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <Text style={styles.title}>Mes créations</Text>

        {creations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={styles.emptyText}>Aucune création pour le moment.{'\n'}Générez votre première image !</Text>
          </View>
        ) : (
          <FlatList
            data={creations}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={[styles.grid, { paddingBottom: 16 + (mostRecent ? 0 : tabBarHeight) }]}
            columnWrapperStyle={styles.column}
            renderItem={({ item }) => (
              <Pressable style={styles.thumbWrapper} onPress={() => navigation.navigate('Preview', { creation: item })}>
                <Image source={{ uri: item.uri }} style={styles.thumbImage} contentFit="cover" />
                <Pressable
                  style={styles.thumbDownload}
                  onPress={() => handleQuickDownload(item)}
                  disabled={downloadingId === item.id}
                >
                  <Text style={styles.thumbDownloadText}>⬇</Text>
                </Pressable>
              </Pressable>
            )}
          />
        )}

        {mostRecent ? (
          <View style={[styles.footer, { paddingBottom: 16 + tabBarHeight }]}>
            <GradientButton label="Télécharger" onPress={() => handleQuickDownload(mostRecent)} />
          </View>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 14,
  },
  column: {
    gap: 14,
  },
  thumbWrapper: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbDownload: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(11,6,32,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbDownloadText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
