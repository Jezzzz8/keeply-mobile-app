// src/utils/imageUtils.ts
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

export async function pickImageFromGallery(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
    base64: true,
  });
  if (!result.canceled && result.assets[0].base64) {
    return `data:image/jpeg;base64,${result.assets[0].base64}`;
  }
  return null;
}

export async function pasteImageFromClipboard(): Promise<string | null> {
  // getImageAsync expects an options object
  const image = await Clipboard.getImageAsync({ format: 'png' });
  if (image && image.data) {
    return `data:image/png;base64,${image.data}`;
  }
  return null;
}

export async function downloadImageAsBase64(url: string): Promise<string | null> {
  try {
    const tempFile = new FileSystem.File(FileSystem.Paths.cache, `keeply-image-${Date.now()}`);
    const downloadedFile = await FileSystem.File.downloadFileAsync(url, tempFile, {
      idempotent: true,
    });
    const base64 = await downloadedFile.base64();

    const extension = url.split('.').pop()?.split('?')[0]?.split('#')[0]?.toLowerCase();
    const mimeType = extension === 'png'
      ? 'image/png'
      : extension === 'gif'
      ? 'image/gif'
      : 'image/jpeg';

    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    console.warn('Failed to download image', e);
    return null;
  }
}