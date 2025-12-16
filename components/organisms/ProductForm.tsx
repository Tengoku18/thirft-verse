import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { CompleteProfileModal } from "@/components/molecules/CompleteProfileModal";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { ProductSuccessModal } from "@/components/molecules/ProductSuccessModal";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { Product } from "@/lib/types/database";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import {
  PRODUCT_CATEGORIES,
  ProductFormData,
  productSchema,
} from "@/lib/validations/product";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createProduct as createProductAction,
  updateProduct as updateProductAction,
} from "@/store/productsSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ mode, product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const toast = useToast();
  const profile = useAppSelector((state) => state.profile.profile);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Track keyboard visibility
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShow = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true)
    );
    const keyboardHide = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  // For create mode: store local URIs
  // For edit mode: can be local URI (new image) or existing URL
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [otherImageUris, setOtherImageUris] = useState<string[]>([]);

  // Track which images are new (local) vs existing (URLs)
  const [isNewCoverImage, setIsNewCoverImage] = useState(false);
  const [newOtherImageIndices, setNewOtherImageIndices] = useState<Set<number>>(
    new Set()
  );

  // Success modal state (for create mode)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{
    id: string;
    title: string;
    price: number;
    cover_image: string;
  } | null>(null);

  // Confirm modal state (for edit mode)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProductFormData | null>(null);

  // Complete profile modal state (for create mode)
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);

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

  // Initialize form with product data in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      reset({
        title: product.title,
        description: product.description || "",
        price: product.price,
        category: product.category,
        availability_count: product.availability_count,
        cover_image: product.cover_image,
        other_images: product.other_images || [],
      });
      setCoverImageUri(product.cover_image);
      setOtherImageUris(product.other_images || []);
      setIsNewCoverImage(false);
      setNewOtherImageIndices(new Set());
    }
  }, [mode, product]);

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
        const uri = result.assets[0].uri;
        setCoverImageUri(uri);
        setValue("cover_image", uri);
        setIsNewCoverImage(true);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const pickAdditionalImages = async () => {
    const remainingSlots = 5 - otherImageUris.length;

    if (remainingSlots <= 0) {
      Alert.alert(
        "Limit Reached",
        "You can only add up to 5 additional images."
      );
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
        const selectedUris = result.assets.map((asset) => asset.uri);
        const newUris = [...otherImageUris, ...selectedUris];
        setOtherImageUris(newUris);
        setValue("other_images", newUris);

        // Mark new images
        const newIndices = new Set(newOtherImageIndices);
        for (let i = otherImageUris.length; i < newUris.length; i++) {
          newIndices.add(i);
        }
        setNewOtherImageIndices(newIndices);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeCoverImage = () => {
    setCoverImageUri(null);
    setValue("cover_image", "");
    setIsNewCoverImage(false);
  };

  const removeAdditionalImage = (index: number) => {
    const newUris = otherImageUris.filter((_, i) => i !== index);
    setOtherImageUris(newUris);
    setValue("other_images", newUris);
    const newIndices = new Set<number>();
    newOtherImageIndices.forEach((i) => {
      if (i < index) newIndices.add(i);
      else if (i > index) newIndices.add(i - 1);
    });
    setNewOtherImageIndices(newIndices);
  };

  const handleViewProduct = () => {
    if (!createdProduct) return;
    setShowSuccessModal(false);
    reset();
    setCoverImageUri(null);
    setOtherImageUris([]);
    router.push(`/product/${createdProduct.id}` as any);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    reset();
    setCoverImageUri(null);
    setOtherImageUris([]);
    setCreatedProduct(null);
    router.push("/(tabs)/product");
  };

  // Helper to check if URI is a local file
  const isLocalUri = (uri: string) => {
    return (
      uri.startsWith("file://") ||
      uri.startsWith("content://") ||
      uri.startsWith("ph://")
    );
  };

  // Check if user has completed payment details
  const hasPaymentDetails = () => {
    return !!(
      profile?.payment_username?.trim() && profile?.payment_qr_image?.trim()
    );
  };

  const handleGoToEditProfile = () => {
    setShowCompleteProfileModal(false);
    // router.push("/edit-profile");
    router.push("/edit-profile");
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please sign in to continue.");
      return;
    }

    if (!data.cover_image) {
      Alert.alert("Cover Image Required", "Please upload a cover image.");
      return;
    }

    if (mode === "edit") {
      // Show confirmation modal for edit
      setPendingData(data);
      setShowConfirmModal(true);
    } else {
      // Check payment details for create mode
      if (!hasPaymentDetails()) {
        setShowCompleteProfileModal(true);
        return;
      }
      // Direct submit for create
      await handleCreate(data);
    }
  };

  const handleCreate = async (data: ProductFormData) => {
    if (!user) return;

    setLoading(true);

    try {
      // Upload cover image
      const coverUploadResult = await uploadImageToStorage(
        data.cover_image,
        "products",
        "products"
      );

      if (!coverUploadResult.success || !coverUploadResult.url) {
        Alert.alert(
          "Upload Error",
          "Failed to upload cover image. Please try again."
        );
        setLoading(false);
        return;
      }

      // Upload additional images
      const uploadedOtherImages: string[] = [];
      for (const uri of data.other_images || []) {
        if (uri) {
          const uploadResult = await uploadImageToStorage(
            uri,
            "products",
            "products"
          );
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

      // Use Redux action to create product
      const createdProductResult = await dispatch(
        createProductAction(productData)
      ).unwrap();

      setCreatedProduct({
        id: createdProductResult.id,
        title: data.title,
        price: data.price,
        cover_image: coverUploadResult.url,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Error creating product:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to create product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!pendingData || !user || !product) return;

    setLoading(true);

    try {
      let finalCoverImage = pendingData.cover_image;

      // Upload new cover image if changed
      if (isNewCoverImage && isLocalUri(pendingData.cover_image)) {
        const uploadResult = await uploadImageToStorage(
          pendingData.cover_image,
          "products",
          "products"
        );
        if (uploadResult.success && uploadResult.url) {
          finalCoverImage = uploadResult.url;
        } else {
          Alert.alert("Upload Error", "Failed to upload cover image.");
          setShowConfirmModal(false);
          setLoading(false);
          return;
        }
      }

      // Process other images - upload new ones, keep existing URLs
      const finalOtherImages: string[] = [];
      for (let i = 0; i < (pendingData.other_images || []).length; i++) {
        const uri = pendingData.other_images![i];
        if (newOtherImageIndices.has(i) && isLocalUri(uri)) {
          const uploadResult = await uploadImageToStorage(
            uri,
            "products",
            "products"
          );
          if (uploadResult.success && uploadResult.url) {
            finalOtherImages.push(uploadResult.url);
          }
        } else {
          finalOtherImages.push(uri);
        }
      }

      // Use Redux action to update product
      await dispatch(
        updateProductAction({
          productId: product.id,
          storeId: user.id,
          data: {
            title: pendingData.title,
            description: pendingData.description,
            price: pendingData.price,
            category: pendingData.category,
            availability_count: pendingData.availability_count,
            cover_image: finalCoverImage,
            other_images: finalOtherImages,
            status:
              pendingData.availability_count > 0 ? "available" : "out_of_stock",
          },
        })
      ).unwrap();

      setShowConfirmModal(false);
      toast.success("Product updated successfully");
      router.back();
    } catch (error: any) {
      console.error("Error updating product:", error);
      setShowConfirmModal(false);
      Alert.alert(
        "Error",
        error?.message || "Failed to update product. Please try again."
      );
    } finally {
      setLoading(false);
      setPendingData(null);
    }
  };

  // Get display URI for images (handle both local and remote URLs)
  const getDisplayUri = (uri: string) => {
    if (isLocalUri(uri)) {
      return uri;
    }
    return getProductImageUrl(uri);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: isKeyboardVisible ? 40 : 120,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4">
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
              {coverImageUri ? (
                <View style={{ flex: 1, position: "relative" }}>
                  <Image
                    source={{ uri: getDisplayUri(coverImageUri) }}
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
                  color: otherImageUris.length >= 5 ? "#EF4444" : "#6B7280",
                  fontSize: 12,
                }}
              >
                {otherImageUris.length}/5
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
              {otherImageUris.map((uri, index) => (
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
                    source={{ uri: getDisplayUri(uri) }}
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

              {otherImageUris.length < 5 && (
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
                    <CaptionText className="mt-1" style={{ color: "#9CA3AF" }}>
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

            {/* Submit Button */}
            <FormButton
              title={
                loading
                  ? mode === "edit"
                    ? "Updating..."
                    : "Posting..."
                  : mode === "edit"
                  ? "Update Product"
                  : "Post"
              }
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal (Create mode) */}
      {mode === "create" && (
        <ProductSuccessModal
          visible={showSuccessModal}
          product={createdProduct}
          onShare={() => {}}
          onViewProduct={handleViewProduct}
          onClose={handleCloseSuccessModal}
        />
      )}

      {/* Confirm Update Modal (Edit mode) */}
      {mode === "edit" && (
        <ConfirmModal
          visible={showConfirmModal}
          title="Update Product"
          message="Are you sure you want to save changes to this product? The updated information will be visible to all users."
          confirmText="Update"
          cancelText="Cancel"
          onConfirm={handleConfirmUpdate}
          onCancel={() => {
            setShowConfirmModal(false);
            setPendingData(null);
          }}
          loading={loading}
          variant="default"
          icon="square.and.pencil"
        />
      )}

      {/* Complete Profile Modal (Create mode - payment details required) */}
      {mode === "create" && (
        <CompleteProfileModal
          visible={showCompleteProfileModal}
          onGoToProfile={handleGoToEditProfile}
          onCancel={() => setShowCompleteProfileModal(false)}
        />
      )}
    </>
  );
};
