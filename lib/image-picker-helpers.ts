import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export interface ImagePickerResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export interface ImagePickerOptions {
  aspectRatio?: [number, number];
  quality?: number;
}

const defaultOptions: ImagePickerOptions = {
  aspectRatio: [1, 1], // 1:1 square
  quality: 0.8,
};

/**
 * Pick an image from the library with built-in crop editor
 */
export const pickAndCropImage = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult> => {
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Request permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload images."
      );
      return { success: false, error: "Permission denied" };
    }

    // Launch image picker with built-in editing/cropping
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // This enables the crop UI
      aspect: mergedOptions.aspectRatio, // 1:1 square crop
      quality: mergedOptions.quality,
    });

    if (result.canceled || !result.assets[0]) {
      return { success: false, error: "User cancelled" };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
    };
  } catch (error) {
    console.error("Error picking image:", error);
    return { success: false, error: "Failed to pick image" };
  }
};

/**
 * Take a photo with camera and crop it
 */
export const takePhotoAndCrop = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult> => {
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your camera to take photos."
      );
      return { success: false, error: "Permission denied" };
    }

    // Launch camera with built-in editing/cropping
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // This enables the crop UI
      aspect: mergedOptions.aspectRatio, // 1:1 square crop
      quality: mergedOptions.quality,
    });

    if (result.canceled || !result.assets[0]) {
      return { success: false, error: "User cancelled" };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
    };
  } catch (error: any) {
    console.error("Error taking photo:", error);

    if (error?.message?.includes("Camera not available")) {
      Alert.alert(
        "Camera Not Available",
        "The camera is not available on simulator. Please use 'Choose from Library' or test on a physical device."
      );
      return { success: false, error: "Camera not available" };
    }

    return { success: false, error: "Failed to take photo" };
  }
};

/**
 * Show options to pick from library or take photo, then crop
 */
export const showImagePickerOptions = (
  options: ImagePickerOptions = {},
  onResult: (result: ImagePickerResult) => void,
  hasExistingImage: boolean = false,
  onRemove?: () => void
): void => {
  const alertOptions: any[] = [
    {
      text: "Take Photo",
      onPress: async () => {
        const result = await takePhotoAndCrop(options);
        onResult(result);
      },
    },
    {
      text: "Choose from Library",
      onPress: async () => {
        const result = await pickAndCropImage(options);
        onResult(result);
      },
    },
    { text: "Cancel", style: "cancel" },
  ];

  if (hasExistingImage && onRemove) {
    alertOptions.push({
      text: "Remove Image",
      onPress: onRemove,
      style: "destructive",
    });
  }

  Alert.alert("Select Image", "Choose an option", alertOptions);
};

/**
 * Pick multiple images from library (no cropping for multi-select)
 */
export const pickMultipleImages = async (
  maxImages: number = 5
): Promise<{ success: boolean; uris?: string[]; error?: string }> => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to upload images."
      );
      return { success: false, error: "Permission denied" };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: maxImages,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return { success: false, error: "User cancelled" };
    }

    const uris = result.assets.map((asset) => asset.uri);
    return { success: true, uris };
  } catch (error) {
    console.error("Error picking images:", error);
    return { success: false, error: "Failed to pick images" };
  }
};
