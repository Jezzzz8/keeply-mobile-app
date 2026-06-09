// src/utils/imageUtils.ts
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

export async function pickImageFromGallery(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('Failed to download image', e);
    return null;
  }
}