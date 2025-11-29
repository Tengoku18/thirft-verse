import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct } from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import {
  uploadImageToStorage,
  uploadMultipleImages,
} from "@/lib/upload-helpers";
import {
  PRODUCT_CATEGORIES,
  ProductFormData,
  productSchema,
} from "@/lib/validations/product";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ProductCreationForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingOther, setUploadingOther] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      availability_count: 1,
      cover_image: "",
      other_images: [] as string[],
    },
  });

  const coverImage = watch("cover_image");
  const otherImages = watch("other_images") || [];

  // Category options for picker
  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const pickCoverImage = async () => {
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
        setUploadingCover(true);

        try {
          const uploadResult = await uploadImageToStorage(
            result.assets[0].uri,
            "products",
            "products"
          );
          if (uploadResult.success && uploadResult.url) {
            setValue("cover_image", uploadResult.url);
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
          setUploadingCover(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const pickAdditionalImages = async () => {
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

      const maxOtherImages = 5;
      const remainingSlots = maxOtherImages - otherImages.length;

      if (remainingSlots <= 0) {
        Alert.alert(
          "Limit Reached",
          `You can only upload up to ${maxOtherImages} additional images.`
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploadingOther(true);

        try {
          const localUris = result.assets.map((asset) => asset.uri);
          const uploadResults = await uploadMultipleImages(
            localUris,
            "products",
            "products"
          );

          const successfulUrls = uploadResults
            .filter((r) => r.success && r.url)
            .map((r) => r.url!);

          const failedCount = uploadResults.filter((r) => !r.success).length;

          if (successfulUrls.length > 0) {
            setValue("other_images", [...otherImages, ...successfulUrls]);
          }

          if (failedCount > 0) {
            Alert.alert(
              "Upload Warning",
              `${failedCount} image(s) failed to upload. ${successfulUrls.length} image(s) uploaded successfully.`
            );
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          Alert.alert(
            "Upload Failed",
            "Failed to upload images. Please try again."
          );
        } finally {
          setUploadingOther(false);
        }
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const removeCoverImage = () => {
    setValue("cover_image", "");
  };

  const removeAdditionalImage = (index: number) => {
    const newOtherImages = otherImages.filter((_, i) => i !== index);
    setValue("other_images", newOtherImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to create a product."
      );
      return;
    }

    if (!data.cover_image) {
      Alert.alert("Cover Image Required", "Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        availability_count: data.availability_count,
        store_id: user.id,
        cover_image: data.cover_image,
        other_images: data.other_images,
      };

      const result = await createProduct(productData);

      if (result.success) {
        const message = (result as any).profileRecovered
          ? "Your profile was automatically recovered and your product has been listed successfully!"
          : "Your product has been listed successfully.";

        Alert.alert("Success!", message, [
          {
            text: "OK",
            onPress: () => {
              reset();
              router.push("/(tabs)");
            },
          },
        ]);
      } else {
        if (result.tableNotFound) {
          Alert.alert(
            "Setup Required",
            "The products table is not set up. Please contact support or check the database migration."
          );
        } else if (result.rlsError) {
          Alert.alert(
            "Permission Error",
            "There was a permission issue. Please try signing out and back in."
          );
        } else {
          const errorMessage =
            result.error &&
            typeof result.error === "object" &&
            "message" in result.error
              ? (result.error as { message: string }).message
              : "Failed to create product. Please try again.";
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error) {
      console.error("Unexpected error creating product:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-2">
        <AuthHeader title="Add your product" onBack={() => router.back()} />
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-[#E5E7EB]" />

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 pt-4">
          {/* Cover Image Section */}
          <ThemedText
            className="text-[13px] font-[NunitoSans_600SemiBold] mb-3"
            style={{ color: "#3B2F2F" }}
          >
            Cover Photo
          </ThemedText>
          <View
            style={{
              aspectRatio: 1.15,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#E5E7EB",
              flex: 1,
            }}
          >
            {coverImage ? (
              <View style={{ flex: 1, position: "relative" }}>
                <Image
                  source={{ uri: getProductImageUrl(coverImage) }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {/* Remove Button */}
                <TouchableOpacity
                  onPress={removeCoverImage}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "rgba(59, 47, 47, 0.85)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="xmark" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                {/* Change Photo Button */}
                <TouchableOpacity
                  onPress={pickCoverImage}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    className="text-[13px] font-[NunitoSans_600SemiBold]"
                    style={{ color: "#FFFFFF" }}
                  >
                    Change Photo
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickCoverImage}
                disabled={uploadingCover}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                {uploadingCover ? (
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
                  <View className="items-center">
                    <IconSymbol name="photo" size={48} color="#9CA3AF" />
                    <ThemedText
                      className="text-[16px] font-[NunitoSans_600SemiBold] mt-3"
                      style={{ color: "#6B7280" }}
                    >
                      Tap to add cover photo
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Additional Photos Section */}
          <View className="flex-row items-center justify-between my-3">
            <ThemedText
              className="text-[13px] font-[NunitoSans_600SemiBold]"
              style={{ color: "#3B2F2F" }}
            >
              Additional Photos
            </ThemedText>
            <ThemedText
              className="text-[12px] font-[NunitoSans_600SemiBold]"
              style={{ color: otherImages.length >= 5 ? "#EF4444" : "#6B7280" }}
            >
              {otherImages.length}/5
            </ThemedText>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {otherImages.map((image, index) => (
              <View
                key={index}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  source={{ uri: getProductImageUrl(image) }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => removeAdditionalImage(index)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "rgba(59, 47, 47, 0.85)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="xmark" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Button */}
            {otherImages.length < 5 && (
              <TouchableOpacity
                onPress={pickAdditionalImages}
                disabled={uploadingOther}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: "#D1D5DB",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FAFAFA",
                }}
                activeOpacity={0.7}
              >
                {uploadingOther ? (
                  <ActivityIndicator size="small" color="#9CA3AF" />
                ) : (
                  <View className="items-center">
                    <IconSymbol name="camera" size={24} color="#9CA3AF" />
                    <ThemedText
                      className="text-[12px] font-[NunitoSans_500Medium] mt-1"
                      style={{ color: "#9CA3AF" }}
                    >
                      Add
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Product Name */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Product name"
                placeholder="Eg: HUBA X VEK Cloth Jersey - Blue"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.title?.message}
                autoCapitalize="words"
              />
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextarea
                label="Description"
                placeholder="Explain your product here..."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.description?.message}
                maxLength={1000}
              />
            )}
          />

          {/* Category */}
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <FormPicker
                label="Category"
                placeholder="Select a category"
                value={value}
                onChange={onChange}
                options={categoryOptions}
                error={errors.category?.message}
              />
            )}
          />

          {/* Pricing */}
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Pricing"
                placeholder="NPR"
                value={value?.toString()}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const numValue = parseFloat(text) || 0;
                  onChange(numValue);
                }}
                error={errors.price?.message}
                keyboardType="decimal-pad"
              />
            )}
          />

          {/* Quantity */}
          <Controller
            control={control}
            name="availability_count"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Quantity"
                placeholder="1"
                value={value?.toString()}
                onBlur={onBlur}
                onChangeText={(text) => {
                  const numValue = parseInt(text) || 1;
                  onChange(numValue);
                }}
                error={errors.availability_count?.message}
                keyboardType="number-pad"
              />
            )}
          />

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
              <ThemedText
                className="text-[14px] font-[NunitoSans_600SemiBold] mb-2"
                style={{ color: "#EF4444" }}
              >
                Please fix the following errors:
              </ThemedText>
              {Object.entries(errors).map(([field, error]) => (
                <ThemedText
                  key={field}
                  className="text-[13px] font-[NunitoSans_400Regular]"
                  style={{ color: "#DC2626" }}
                >
                  • {(error as FieldError)?.message}
                </ThemedText>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Post Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingBottom: 32,
          paddingTop: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        <FormButton
          title={loading ? "Posting..." : "Post"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};
