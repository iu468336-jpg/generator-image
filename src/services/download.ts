import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface SaveResult {
  success: boolean;
  message: string;
}

export async function saveImageToGallery(localUri: string): Promise<SaveResult> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      return {
        success: false,
        message: "Autorisation d'accès à la galerie refusée. Activez-la dans les paramètres de votre téléphone.",
      };
    }
    await MediaLibrary.saveToLibraryAsync(localUri);
    return { success: true, message: 'Image enregistrée dans votre galerie ✔' };
  } catch {
    return { success: false, message: "Impossible d'enregistrer l'image. Réessayez." };
  }
}

export async function shareImage(localUri: string): Promise<SaveResult> {
  try {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      return { success: false, message: 'Le partage n’est pas disponible sur cet appareil.' };
    }
    await Sharing.shareAsync(localUri);
    return { success: true, message: '' };
  } catch {
    return { success: false, message: 'Le partage a échoué. Réessayez.' };
  }
}
