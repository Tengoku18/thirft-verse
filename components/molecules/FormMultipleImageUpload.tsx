import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { uploadMultipleImages } from "@/lib/upload-helpers";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface FormMultipleImageUploadProps {
  label?: string;
  value?: string[]; // Array of URLs
  onChange: (urls: string[]) => void;
  error?: string;
  hint?: string;
  maxImages?: number;
  bucket?: string;
  folder?: string;
}

export const FormMultipleImageUpload: React.FC<
  FormMultipleImageUploadProps
> = ({
  label = "Additional Images",
  value = [],
  onChange,
  error,
  hint,
  maxImages = 4,
  bucket = "products",
  folder = "products",
}) => {
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
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

      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) {
        Alert.alert(
          "Limit Reached",
          `You can only upload up to ${maxImages} additional images.`
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);

        try {
          const localUris = result.assets.map((asset) => asset.uri);
          const uploadResults = await uploadMultipleImages(
            localUris,
            bucket,
            folder
          );

          const failedUploads = uploadResults.filter((r) => !r.success);
          if (failedUploads.length > 0) {
            Alert.alert(
              "Upload Error",
              failedUploads[0].error || "Some images failed to upload"
            );
            setUploading(false);
            return;
          }

          const newUrls = uploadResults
            .filter((r) => r.success && r.url)
            .map((r) => r.url!);

          onChange([...value, ...newUrls]);
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload images. Please try again."
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <View className="mb-6">
      {/* Label with count */}
      <View className="flex-row items-center justify-between mb-3">
        <ThemedText
          className="text-[13px] font-[NunitoSans_600SemiBold] tracking-wide uppercase"
          style={{ color: "#3B2F2F" }}
        >
          {label}
        </ThemedText>
        <ThemedText
          className="text-[12px] font-[NunitoSans_600SemiBold]"
          style={{ color: value.length >= maxImages ? "#EF4444" : "#6B7280" }}
        >
          {value.length}/{maxImages}
        </ThemedText>
      </View>

      {/* Images Grid */}
      {value.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, marginBottom: 12 }}
        >
          {value.map((url, index) => (
            <View
              key={index}
              style={{
                width: 120,
                height: 120,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#F3F4F6",
              }}
            >
              <Image
                source={{ uri: getProductImageUrl(url) }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol name="xmark" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add Images Button */}
      {value.length < maxImages && (
        <TouchableOpacity
          onPress={pickImages}
          disabled={uploading}
          style={{
            height: value.length > 0 ? 100 : 160,
            borderRadius: 20,
            borderWidth: 3,
            borderStyle: "dashed",
            borderColor: error ? "#EF4444" : "#E5E1DB",
            backgroundColor: "#FAFAFA",
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
                className="text-[14px] font-[NunitoSans_600SemiBold] mt-3"
                style={{ color: "#3B2F2F" }}
              >
                Uploading...
              </ThemedText>
            </View>
          ) : (
            <View className="items-center px-6">
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <IconSymbol name="photo.stack" size={32} color="#3B2F2F" />
              </View>
              <ThemedText
                className="text-[16px] font-[PlayfairDisplay_700Bold] mb-1"
                style={{ color: "#3B2F2F" }}
              >
                {value.length > 0
                  ? "Add More Photos"
                  : "Upload Additional Photos"}
              </ThemedText>
              <ThemedText
                className="text-[13px] font-[NunitoSans_400Regular] text-center"
                style={{ color: "#6B7280" }}
              >
                {value.length > 0
                  ? `Add ${maxImages - value.length} more`
                  : `Select up to ${maxImages} images`}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Hint - only show when no images uploaded */}
      {hint && !error && value.length === 0 && (
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
