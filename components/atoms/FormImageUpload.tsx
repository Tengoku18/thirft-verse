import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

interface FormImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  bucket?: string;
  folder?: string;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  label = "Cover Image",
  value,
  onChange,
  error,
  hint,
  required = false,
  bucket = "products",
  folder = "products",
}) => {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploading(true);

        try {
          const uploadResult = await uploadImageToStorage(
            result.assets[0].uri,
            bucket,
            folder
          );
          if (uploadResult.success && uploadResult.url) {
            onChange(uploadResult.url);
          } else {
            Alert.alert(
              "Upload Error",
              uploadResult.error || "Failed to upload image"
            );
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload image. Please try again."
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onChange(""),
      },
    ]);
  };

  return (
    <View className="mb-6">
      {/* Label */}
      <View className="flex-row items-center mb-3">
        <ThemedText
          className="text-[13px] font-[NunitoSans_600SemiBold] tracking-wide uppercase"
          style={{ color: "#3B2F2F" }}
        >
          {label}
        </ThemedText>
        {required && (
          <ThemedText
            className="text-[13px] font-[NunitoSans_600SemiBold] ml-1"
            style={{ color: "#EF4444" }}
          >
            *
          </ThemedText>
        )}
      </View>

      <View
        style={{
          height: 240,
          borderRadius: 24,
          overflow: "hidden",
          borderWidth: 3,
          borderStyle: value ? "solid" : "dashed",
          borderColor: error ? "#EF4444" : value ? "#3B2F2F" : "#E5E1DB",
          backgroundColor: value ? "transparent" : "#FAFAFA",
        }}
      >
        {value ? (
          // Display uploaded image
          <View style={{ flex: 1, position: "relative" }}>
            <Image
              source={{ uri: getProductImageUrl(value) }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {/* Remove Button */}
            <TouchableOpacity
              onPress={removeImage}
              disabled={uploading}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
            {/* Cover Badge */}
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor: "rgba(59, 47, 47, 0.9)",
              }}
            >
              <ThemedText
                className="text-[11px] font-[NunitoSans_700Bold] uppercase tracking-wider"
                style={{ color: "#FFFFFF" }}
              >
                Cover Photo
              </ThemedText>
            </View>
          </View>
        ) : (
          // Upload button (empty state)
          <TouchableOpacity
            onPress={pickImage}
            disabled={uploading}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              opacity: uploading ? 0.6 : 1,
            }}
            activeOpacity={0.7}
          >
            {uploading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#3B2F2F" />
                <ThemedText
                  className="text-[16px] font-[NunitoSans_600SemiBold] mt-4"
                  style={{ color: "#3B2F2F" }}
                >
                  Uploading image...
                </ThemedText>
                <ThemedText
                  className="text-[13px] font-[NunitoSans_400Regular] mt-2"
                  style={{ color: "#6B7280" }}
                >
                  Please wait
                </ThemedText>
              </View>
            ) : (
              <View className="items-center px-6">
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <IconSymbol name="photo" size={40} color="#3B2F2F" />
                </View>
                <ThemedText
                  className="text-[18px] font-[PlayfairDisplay_700Bold] mb-2"
                  style={{ color: "#3B2F2F" }}
                >
                  Upload Cover Photo
                </ThemedText>
                <ThemedText
                  className="text-[14px] font-[NunitoSans_400Regular] text-center"
                  style={{ color: "#6B7280" }}
                >
                  Tap to select an image
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Hint */}
      {hint && !error && (
        <ThemedText
          className="text-[12px] font-[NunitoSans_400Regular] mt-2"
          style={{ color: "#6B7280" }}
        >
          {hint}
        </ThemedText>
      )}

      {/* Error Message */}
      {error && (
        <ThemedText
          className="text-[13px] font-[NunitoSans_600SemiBold] mt-2"
          style={{ color: "#EF4444" }}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
};
