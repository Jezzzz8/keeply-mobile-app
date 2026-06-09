declare module 'expo-image-manipulator' {
  export type ImageResult = {
    uri: string;
    width: number;
    height: number;
    base64?: string;
  };
  export enum SaveFormat {
    JPEG = 'jpeg',
    PNG = 'png',
  }
  export function manipulateAsync(
    uri: string,
    actions: any[],
    options?: { compress?: number; format?: SaveFormat; base64?: boolean }
  ): Promise<ImageResult>;
}
