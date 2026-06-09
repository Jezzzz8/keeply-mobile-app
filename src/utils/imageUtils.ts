import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Helper to get document directory safely (bypass TypeScript issue)
const getDocumentDir = (): string => {
  // @ts-ignore - documentDirectory exists at runtime
  return FileSystem.documentDirectory as string;
};

export async function pickImageFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
    base64: false,
  });
  if (!result.canceled && result.assets[0].uri) {
    return compressAndSaveImage(result.assets[0].uri);
  }
  return null;
}

export async function takePhotoWithCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') return null;
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.7,
    base64: false,
  });
  if (!result.canceled && result.assets[0].uri) {
    return compressAndSaveImage(result.assets[0].uri);
  }
  return null;
}

export async function pasteImageFromClipboard(): Promise<string | null> {
  const image = await Clipboard.getImageAsync({ format: 'png' });
  if (image?.data) {
    const base64 = `data:image/png;base64,${image.data}`;
    return saveBase64Image(base64);
  }
  return null;
}

async function compressAndSaveImage(uri: string): Promise<string> {
  const manipResult = await manipulateAsync(uri, [{ resize: { width: 1024 } }], {
    compress: 0.7,
    format: SaveFormat.JPEG,
  });
  const newUri = manipResult.uri;
  const fileName = `${Date.now()}.jpg`;
  const docDir = getDocumentDir();
  const directoryUri = `${docDir}keeply_images/`;
  const destinationUri = directoryUri + fileName;

  const dirInfo = await FileSystem.getInfoAsync(directoryUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
  await FileSystem.copyAsync({ from: newUri, to: destinationUri });
  return destinationUri;
}

async function saveBase64Image(base64: string): Promise<string> {
  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64');
  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const fileName = `${Date.now()}.${ext}`;
  const docDir = getDocumentDir();
  const directoryUri = `${docDir}keeply_images/`;
  const destinationUri = directoryUri + fileName;

  const dirInfo = await FileSystem.getInfoAsync(directoryUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(destinationUri, matches[2], { encoding: FileSystem.EncodingType.Base64 });
  return destinationUri;
}