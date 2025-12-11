import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import { BodySemiboldText, CaptionText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import {
  pickAndCropImage,
  pickMultipleImages,
} from "@/lib/image-picker-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
      availability_count: undefined,
      cover_image: "",
      other_images: [],
    },
  });

  const coverImage = watch("cover_image");
  const otherImages = watch("other_images") || [];

  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Error", "Failed to load product.");
        router.back();
        return;
      }

      if (data) {
        reset({
          title: data.title,
          description: data.description || "",
          price: data.price,
          category: data.category,
          availability_count: data.availability_count,
          cover_image: data.cover_image,
          other_images: data.other_images || [],
        });
      }
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Failed to load product.");
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const pickCoverImage = async () => {
    const result = await pickAndCropImage({
      aspectRatio: [1, 1],
      quality: 0.8,
    });

    if (!result.success || !result.uri) return;

    setUploadingCover(true);

    try {
      const uploadResult = await uploadImageToStorage(
        result.uri,
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
      Alert.alert("Upload Failed", "Failed to upload image. Please try again.");
    } finally {
      setUploadingCover(false);
    }
  };

  const pickAdditionalImages = async () => {
    const maxOtherImages = 5;
    const remainingSlots = maxOtherImages - otherImages.length;

    if (remainingSlots <= 0) {
      Alert.alert(
        "Limit Reached",
        `You can only upload up to ${maxOtherImages} additional images.`
      );
      return;
    }

    const result = await pickMultipleImages(remainingSlots);

    if (!result.success || !result.uris || result.uris.length === 0) return;

    setUploadingOther(true);

    try {
      const uploadResults = await uploadMultipleImages(
        result.uris,
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
  };

  const removeCoverImage = () => {
    setValue("cover_image", "");
  };

  const removeAdditionalImage = (index: number) => {
    const newOtherImages = otherImages.filter((_, i) => i !== index);
    setValue("other_images", newOtherImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user || !id) {
      Alert.alert("Error", "Unable to update product.");
      return;
    }

    if (!data.cover_image) {
      Alert.alert("Cover Image Required", "Please upload a cover image.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          availability_count: data.availability_count,
          cover_image: data.cover_image,
          other_images: data.other_images,
          status: data.availability_count > 0 ? "available" : "out_of_stock",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("store_id", user.id);

      if (error) {
        console.error("Error updating product:", error);
        Alert.alert("Error", "Failed to update product. Please try again.");
        return;
      }

      Alert.alert("Success", "Product updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <CustomHeader title="Edit Product" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <CustomHeader title="Edit Product" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4">
            {/* Cover Image Section */}
            <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
              Cover Photo
            </BodySemiboldText>
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
                    <BodySemiboldText
                      style={{ color: "#FFFFFF", fontSize: 13 }}
                    >
                      Change Photo
                    </BodySemiboldText>
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
                      <BodySemiboldText className="mt-3">
                        Uploading...
                      </BodySemiboldText>
                    </View>
                  ) : (
                    <View className="items-center">
                      <IconSymbol name="photo" size={48} color="#9CA3AF" />
                      <BodySemiboldText
                        className="mt-3"
                        style={{ color: "#6B7280", fontSize: 16 }}
                      >
                        Tap to add cover photo
                      </BodySemiboldText>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Additional Photos Section */}
            <View className="flex-row items-center justify-between my-3">
              <BodySemiboldText style={{ fontSize: 13 }}>
                Additional Photos
              </BodySemiboldText>
              <BodySemiboldText
                style={{
                  color: otherImages.length >= 5 ? "#EF4444" : "#6B7280",
                  fontSize: 12,
                }}
              >
                {otherImages.length}/5
              </BodySemiboldText>
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
                      <CaptionText
                        className="mt-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        Add
                      </CaptionText>
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
                  placeholder="Eg: Jeans"
                  required
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
                  required
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
                  required
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
                  required
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
                  defaultValue="1"
                  required
                  value={value?.toString()}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    const numValue = parseInt(text);
                    onChange(isNaN(numValue) ? undefined : numValue);
                  }}
                  error={errors.availability_count?.message}
                  keyboardType="number-pad"
                />
              )}
            />

            {/* Update Button */}
            <FormButton
              title={loading ? "Updating..." : "Update Product"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
