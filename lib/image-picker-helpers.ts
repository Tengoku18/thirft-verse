import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface ImagePickerOptions {
  aspectRatio?: [number, number];
  quality?: number;
}

interface ImagePickerResult {
  success: boolean;
  uri?: string;
  error?: string;
}

/**
 * Pick an image from the library (no crop)
 */
export const pickImage = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult> => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return {
        success: false,
        error: "Permission to access photos was denied",
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: options.quality ?? 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return { success: false };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
    };
  } catch (error) {
    console.error("Error picking image:", error);
    return {
      success: false,
      error: "Failed to pick image",
    };
  }
};

/**
 * Take a photo with camera (no crop)
 */
export const takePhoto = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult> => {
  try {
    const permissionResult =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      return {
        success: false,
        error: "Permission to access camera was denied",
      };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: options.quality ?? 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return { success: false };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
    };
  } catch (error: any) {
    console.error("Error taking photo:", error);
    if (error?.message?.includes("Camera not available")) {
      return {
        success: false,
        error: "Camera not available on simulator",
      };
    }
    return {
      success: false,
      error: "Failed to take photo",
    };
  }
};

/**
 * Pick and crop image - now just picks without crop
 * Kept for backward compatibility
 */
export const pickAndCropImage = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult> => {
  return pickImage(options);
};

/**
 * Pick multiple images from the library (no crop)
 */
export const pickMultipleImages = async (
  options: ImagePickerOptions & { selectionLimit?: number } = {}
): Promise<{ success: boolean; uris?: string[]; error?: string }> => {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return {
        success: false,
        error: "Permission to access photos was denied",
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit: options.selectionLimit ?? 10,
      quality: options.quality ?? 0.8,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false };
    }

    return {
      success: true,
      uris: result.assets.map((asset) => asset.uri),
    };
  } catch (error) {
    console.error("Error picking multiple images:", error);
    return {
      success: false,
      error: "Failed to pick images",
    };
  }
};

/**
 * Show image picker options (camera, library, remove)
 */
export const showImagePickerOptions = (
  options: ImagePickerOptions,
  onResult: (result: ImagePickerResult) => void,
  hasExistingImage: boolean = false,
  onRemove?: () => void
) => {
  const alertOptions: any[] = [
    {
      text: "Take Photo",
      onPress: async () => {
        const result = await takePhoto(options);
        onResult(result);
      },
    },
    {
      text: "Choose from Library",
      onPress: async () => {
        const result = await pickImage(options);
        onResult(result);
      },
    },
    { text: "Cancel", style: "cancel" },
  ];

  if (hasExistingImage && onRemove) {
    alertOptions.push({
      text: "Remove Photo",
      onPress: onRemove,
      style: "destructive",
    });
  }

  Alert.alert("Select Image", "Choose an option", alertOptions);
};
