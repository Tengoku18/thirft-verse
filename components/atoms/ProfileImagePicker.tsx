import { CameraIcon, UserIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

interface ProfileImagePickerProps {
  value?: string | null;
  onChange: (uri: string | null) => void;
  name?: string;
  label?: string;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  value,
  onChange,
  name = "User",
  label = "Profile Picture",
}) => {
  const pickImage = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to upload a profile picture.",
        );
        return;
      }

      // Launch image picker
      // On Android: disable cropper to avoid dark UI theme
      // On iOS: enable cropper for better UX
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your camera to take a photo.",
        );
        return;
      }

      // Launch camera
      // On Android: disable cropper to avoid dark UI theme
      // On iOS: enable cropper for better UX
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error("Error taking photo:", error);

      // Handle camera not available on simulator gracefully
      if (error?.message?.includes("Camera not available")) {
        Alert.alert(
          "Camera Not Available",
          'The camera is not available on simulator. Please use "Choose from Library" or test on a physical device.',
          [{ text: "OK" }],
        );
      } else {
        Alert.alert("Error", "Failed to take photo. Please try again.");
      }
    }
  };

  const showOptions = () => {
    Alert.alert("Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
      ...(value
        ? [
            {
              text: "Remove Photo",
              onPress: () => onChange(null),
              style: "destructive" as const,
            },
          ]
        : []),
    ]);
  };

  return (
    <View className="items-center mb-6">
      <Typography
        variation="label"
        className="mb-3"
        style={{ color: "#3B2F2F", fontSize: 14 }}
      >
        {label}
      </Typography>

      <TouchableOpacity onPress={showOptions} className="relative">
        {value ? (
          <Image
            source={{ uri: getProfileImageUrl(value) }}
            className="w-24 h-24 rounded-full border-[3px] border-[#D4A373]"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-[#D4A373] justify-center items-center border-[3px] border-[#C7BFB3]">
            <UserIcon width={48} height={48} color="#FFFFFF" />
          </View>
        )}

        {/* Add/Edit Icon */}
        <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#D4A373] border-2 border-white justify-center items-center">
          <CameraIcon width={12} height={12} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Typography
        variation="caption"
        className="mt-2 text-center"
        style={{ color: "#6B705C" }}
      >
        Tap to {value ? "change" : "add"} photo
      </Typography>
    </View>
  );
};
