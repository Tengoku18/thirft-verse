import { Typography } from "@/components/ui/Typography";

import { getProductImageUrl } from "@/lib/storage-helpers";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { AddPhotoIcon, TrashIcon } from "@/components/icons";
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
        <Typography variation="label"
          style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
        {required && (
          <Typography variation="label" className="ml-1" style={{ color: "#EF4444", fontSize: 13 }}>
            *
          </Typography>
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
              <TrashIcon width={18} height={18} color="#EF4444" />
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
              <Typography variation="caption"
                style={{ color: "#FFFFFF", textTransform: "uppercase", letterSpacing: 0.5, fontSize: 11 }}
              >
                Cover Photo
              </Typography>
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
                <Typography variation="label" className="mt-4" style={{ fontSize: 16 }}>
                  Uploading image...
                </Typography>
                <Typography variation="body" className="mt-2" style={{ color: "#6B7280", fontSize: 13 }}>
                  Please wait
                </Typography>
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
                  <AddPhotoIcon width={40} height={40} color="#3B2F2F" />
                </View>
                <Typography variation="h2" className="mb-2" style={{ fontSize: 18 }}>
                  Upload Cover Photo
                </Typography>
                <Typography variation="body" className="text-center" style={{ color: "#6B7280" }}>
                  Tap to select an image
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Hint */}
      {hint && !error && (
        <Typography variation="caption" className="mt-2" style={{ color: "#6B7280" }}>
          {hint}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Typography variation="label" className="mt-2" style={{ color: "#EF4444", fontSize: 13 }}>
          {error}
        </Typography>
      )}
    </View>
  );
};
