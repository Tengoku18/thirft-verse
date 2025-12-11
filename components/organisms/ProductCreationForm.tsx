import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { ProductSuccessModal } from "@/components/molecules/ProductSuccessModal";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct } from "@/lib/database-helpers";
import { uploadImageToStorage } from "@/lib/upload-helpers";
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
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export const ProductCreationForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  // Store local URIs - upload happens on submit
  const [localCoverUri, setLocalCoverUri] = useState<string | null>(null);
  const [localOtherUris, setLocalOtherUris] = useState<string[]>([]);
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{
    id: string;
    title: string;
    price: number;
    cover_image: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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
      other_images: [] as string[],
    },
  });


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
        // Store local URI and sync with form field
        const uri = result.assets[0].uri;
        setLocalCoverUri(uri);
        setValue("cover_image", uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const pickAdditionalImages = async () => {
    const remainingSlots = 5 - localOtherUris.length;

    if (remainingSlots <= 0) {
      Alert.alert("Limit Reached", "You can only add up to 5 additional images.");
      return;
    }

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
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        // Get all selected image URIs
        const selectedUris = result.assets.map((asset) => asset.uri);
        const newUris = [...localOtherUris, ...selectedUris];
        setLocalOtherUris(newUris);
        setValue("other_images", newUris);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeCoverImage = () => {
    setLocalCoverUri(null);
    setValue("cover_image", "");
  };

  const removeAdditionalImage = (index: number) => {
    const newUris = localOtherUris.filter((_, i) => i !== index);
    setLocalOtherUris(newUris);
    setValue("other_images", newUris);
  };

  const handleViewProduct = () => {
    if (!createdProduct) return;
    setShowSuccessModal(false);
    reset();
    setLocalCoverUri(null);
    setLocalOtherUris([]);
    router.push(`/product/${createdProduct.id}` as any);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    reset();
    setLocalCoverUri(null);
    setLocalOtherUris([]);
    setCreatedProduct(null);
    router.push("/(tabs)");
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to create a product."
      );
      return;
    }

    setLoading(true);

    try {
      // Upload cover image (data.cover_image is validated by yup)
      const coverUploadResult = await uploadImageToStorage(
        data.cover_image,
        "products",
        "products"
      );

      if (!coverUploadResult.success || !coverUploadResult.url) {
        Alert.alert("Upload Error", "Failed to upload cover image. Please try again.");
        setLoading(false);
        return;
      }

      // Upload additional images
      const uploadedOtherImages: string[] = [];
      for (const uri of data.other_images || []) {
        if (uri) {
          const uploadResult = await uploadImageToStorage(uri, "products", "products");
          if (uploadResult.success && uploadResult.url) {
            uploadedOtherImages.push(uploadResult.url);
          }
        }
      }

      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        availability_count: data.availability_count,
        store_id: user.id,
        cover_image: coverUploadResult.url,
        other_images: uploadedOtherImages,
      };

      const result = await createProduct(productData);

      if (result.success && result.data) {
        // Store created product info and show success modal
        setCreatedProduct({
          id: result.data.id,
          title: data.title,
          price: data.price,
          cover_image: coverUploadResult.url,
        });
        setShowSuccessModal(true);
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
    <TabScreenLayout title="Add Product">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
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
              {localCoverUri ? (
                <View style={{ flex: 1, position: "relative" }}>
                  <Image
                    source={{ uri: localCoverUri }}
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
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <IconSymbol name="photo" size={48} color="#9CA3AF" />
                    <BodySemiboldText
                      className="mt-3"
                      style={{ color: "#6B7280", fontSize: 16 }}
                    >
                      Tap to add cover photo
                    </BodySemiboldText>
                  </View>
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
                  color: localOtherUris.length >= 5 ? "#EF4444" : "#6B7280",
                  fontSize: 12,
                }}
              >
                {localOtherUris.length}/5
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
              {localOtherUris.map((uri, index) => (
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
                    source={{ uri: uri }}
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
              {localOtherUris.length < 5 && (
                <TouchableOpacity
                  onPress={pickAdditionalImages}
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
                  <View className="items-center">
                    <IconSymbol name="camera" size={24} color="#9CA3AF" />
                    <CaptionText
                      className="mt-1"
                      style={{ color: "#9CA3AF" }}
                    >
                      Add
                    </CaptionText>
                  </View>
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

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
                <BodySemiboldText className="mb-2" style={{ color: "#EF4444" }}>
                  Please fix the following errors:
                </BodySemiboldText>
                {Object.entries(errors).map(([field, error]) => (
                  <BodyRegularText
                    key={field}
                    style={{ color: "#DC2626", fontSize: 13 }}
                  >
                    • {(error as FieldError)?.message}
                  </BodyRegularText>
                ))}
              </View>
            )}

            {/* Post Button */}
            <FormButton
              title={loading ? "Posting..." : "Post"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <ProductSuccessModal
        visible={showSuccessModal}
        product={createdProduct}
        onShare={() => {}}
        onViewProduct={handleViewProduct}
        onClose={handleCloseSuccessModal}
      />
    </TabScreenLayout>
  );
};
