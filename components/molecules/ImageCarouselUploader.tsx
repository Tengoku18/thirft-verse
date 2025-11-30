import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { uploadMultipleImages } from "@/lib/upload-helpers";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductImage {
  uri: string;
  id: string;
}

interface ImageCarouselUploaderProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
  error?: string;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_WIDTH = SCREEN_WIDTH - 48; // Full width minus padding

export const ImageCarouselUploader: React.FC<ImageCarouselUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  error,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to add product images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);

        try {
          // Get local URIs from selected images
          const localUris = result.assets.map((asset) => asset.uri);
          const uploadResults = await uploadMultipleImages(localUris);

          // Check for upload failures
          const failedUploads = uploadResults.filter((r) => !r.success);
          if (failedUploads.length > 0) {
            const errorMsg = failedUploads[0].error || "Unknown error";
            Alert.alert("Upload Error", errorMsg);
            setUploading(false);
            return;
          }

          // Create ProductImage objects with uploaded URLs
          const newImages = uploadResults
            .filter((r) => r.success && r.url)
            .map((r) => ({
              uri: r.url!,
              id: Math.random().toString(36).substr(2, 9),
            }));

          onImagesChange([...images, ...newImages]);
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload images to storage. Please try again."
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

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    onImagesChange(newImages);
    if (activeIndex >= newImages.length && newImages.length > 0) {
      setActiveIndex(newImages.length - 1);
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="mb-6">
      {/* Label */}
      <View className="flex-row items-center justify-between mb-3">
        <BodySemiboldText
          style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Product Photos
        </BodySemiboldText>
        <BodySemiboldText
          style={{ color: images.length >= maxImages ? "#EF4444" : "#6B7280", fontSize: 12 }}
        >
          {images.length}/{maxImages}
        </BodySemiboldText>
      </View>

      {/* Main Image Display / Upload Area */}
      <View
        style={{
          height: IMAGE_WIDTH,
          borderRadius: 24,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {images.length === 0 ? (
          // Empty State - Large Upload Button
          <TouchableOpacity
            onPress={pickImages}
            disabled={uploading}
            style={{
              flex: 1,
              backgroundColor: "#FAFAFA",
              borderWidth: 3,
              borderStyle: "dashed",
              borderColor: error ? "#EF4444" : "#E5E1DB",
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              opacity: uploading ? 0.6 : 1,
            }}
            activeOpacity={0.7}
          >
            {uploading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#3B2F2F" />
                <BodySemiboldText className="mt-4" style={{ fontSize: 16 }}>
                  Uploading images...
                </BodySemiboldText>
                <BodyRegularText className="mt-2" style={{ color: "#6B7280", fontSize: 13 }}>
                  Please wait
                </BodyRegularText>
              </View>
            ) : (
              <View className="items-center">
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
                  <IconSymbol
                    name="photo.on.rectangle"
                    size={40}
                    color="#3B2F2F"
                  />
                </View>
                <HeadingBoldText className="mb-2" style={{ fontSize: 18 }}>
                  Add Product Photos
                </HeadingBoldText>
                <BodyRegularText className="text-center px-8" style={{ color: "#6B7280" }}>
                  Upload up to {maxImages} high-quality images
                </BodyRegularText>
                <CaptionText className="mt-2" style={{ color: "#9CA3AF" }}>
                  First image will be the cover photo
                </CaptionText>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          // Carousel Display
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images.map((image) => (
                <View
                  key={image.id}
                  style={{
                    width: IMAGE_WIDTH,
                    height: IMAGE_WIDTH,
                    position: "relative",
                  }}
                >
                  <Image
                    source={{ uri: getProductImageUrl(image.uri) }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 24,
                    }}
                    resizeMode="cover"
                  />
                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => removeImage(image.id)}
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
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
                    <IconSymbol name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                  {/* Cover Badge */}
                  {image.id === images[0].id && (
                    <View
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        backgroundColor: "rgba(59, 47, 47, 0.9)",
                      }}
                    >
                      <CaptionText
                        style={{ color: "#FFFFFF", textTransform: "uppercase", letterSpacing: 0.5, fontSize: 11 }}
                      >
                        Cover Photo
                      </CaptionText>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Carousel Indicators */}
            <View
              style={{
                position: "absolute",
                bottom: 16,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: index === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      index === activeIndex
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.5)",
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Thumbnails & Add More Button */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => setActiveIndex(index)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 3,
                borderColor: activeIndex === index ? "#3B2F2F" : "#E5E7EB",
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: getProductImageUrl(image.uri) }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}

          {/* Add More Button */}
          {images.length < maxImages && (
            <TouchableOpacity
              onPress={pickImages}
              disabled={uploading}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                backgroundColor: "#FAFAFA",
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: "#E5E1DB",
                justifyContent: "center",
                alignItems: "center",
                opacity: uploading ? 0.6 : 1,
              }}
              activeOpacity={0.7}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#3B2F2F" />
              ) : (
                <>
                  <IconSymbol name="plus" size={20} color="#3B2F2F" />
                  <CaptionText className="mt-1" style={{ color: "#6B7280", fontSize: 9 }}>
                    Add More
                  </CaptionText>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Error Message */}
      {error && (
        <View className="mt-2">
          <BodySemiboldText style={{ color: "#EF4444", fontSize: 12 }}>
            {error}
          </BodySemiboldText>
        </View>
      )}

      {/* Helper Text */}
      {!error && images.length > 0 && (
        <View className="mt-2">
          <CaptionText style={{ color: "#6B7280" }}>
            Swipe to reorder images. First image is the cover photo.
          </CaptionText>
        </View>
      )}
    </View>
  );
};
