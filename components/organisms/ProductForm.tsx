import { Button } from "@/components/ui/Button";
import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { ProductPhotoPicker } from "@/components/product";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { Product, ProductCondition } from "@/lib/types/database";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  ProductFormData,
  productSchema,
} from "@/lib/validations/product";
import { useAppDispatch } from "@/store/hooks";
import { updateProduct as updateProductAction } from "@/store/productsSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

interface ProductFormProps {
  product: Product | null;
}

const RsPrefix = (
  <Typography variation="body" intent="muted">
    Rs.
  </Typography>
);

const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
  label: cat,
  value: cat,
}));

const conditionOptions = PRODUCT_CONDITIONS.map((c) => ({
  label: c.label,
  value: c.value,
  description: c.description,
}));

export const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // For edit mode an image can be a local URI (newly picked) or an existing URL.
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [otherImageUris, setOtherImageUris] = useState<string[]>([]);

  // Track which images are new (local) vs existing (remote URL) to avoid
  // re-uploading images that are already in storage.
  const [isNewCoverImage, setIsNewCoverImage] = useState(false);
  const [newOtherImageIndices, setNewOtherImageIndices] = useState<Set<number>>(
    new Set(),
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProductFormData | null>(null);

  // Track keyboard visibility (controls scroll padding)
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShow = Keyboard.addListener(showEvent, () =>
      setIsKeyboardVisible(true),
    );
    const keyboardHide = Keyboard.addListener(hideEvent, () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

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
      price: undefined,
      category: "",
      condition: "",
      availability_count: undefined,
      cover_image: "",
      other_images: [] as string[],
    },
  });

  // Initialize the form with the product being edited
  useEffect(() => {
    if (!product) return;
    reset({
      title: product.title,
      description: product.description || "",
      price: product.price,
      category: product.category,
      condition: product.condition || "",
      availability_count: product.availability_count,
      cover_image: product.cover_image,
      other_images: product.other_images || [],
    });
    setCoverImageUri(product.cover_image);
    setOtherImageUris(product.other_images || []);
    setIsNewCoverImage(false);
    setNewOtherImageIndices(new Set());
  }, [product, reset]);

  const pickCoverImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images.",
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
        setValue("cover_image", uri, { shouldValidate: true });
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
        "You can only add up to 5 additional images.",
      );
      return;
    }
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images.",
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
    setValue("cover_image", "", { shouldValidate: true });
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

  const isLocalUri = (uri: string) =>
    uri.startsWith("file://") ||
    uri.startsWith("content://") ||
    uri.startsWith("ph://");

  const getDisplayUri = (uri: string) =>
    isLocalUri(uri) ? uri : getProductImageUrl(uri);

  const onSubmit = (data: ProductFormData) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please sign in to continue.");
      return;
    }
    setPendingData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingData || !user || !product) return;

    setLoading(true);
    try {
      let finalCoverImage = pendingData.cover_image;

      // Upload a new cover image only if it changed
      if (isNewCoverImage && isLocalUri(pendingData.cover_image)) {
        const uploadResult = await uploadImageToStorage(
          pendingData.cover_image,
          "products",
          "products",
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

      // Upload only newly added additional images, keep existing URLs
      const finalOtherImages: string[] = [];
      for (let i = 0; i < (pendingData.other_images || []).length; i++) {
        const uri = pendingData.other_images![i];
        if (newOtherImageIndices.has(i) && isLocalUri(uri)) {
          const uploadResult = await uploadImageToStorage(
            uri,
            "products",
            "products",
          );
          if (uploadResult.success && uploadResult.url) {
            finalOtherImages.push(uploadResult.url);
          }
        } else {
          finalOtherImages.push(uri);
        }
      }

      const isResubmit = product.verification_status === "rejected";

      await dispatch(
        updateProductAction({
          productId: product.id,
          storeId: user.id,
          data: {
            title: pendingData.title,
            description: pendingData.description,
            price: pendingData.price,
            category: pendingData.category,
            condition: pendingData.condition as ProductCondition,
            availability_count: pendingData.availability_count,
            cover_image: finalCoverImage,
            other_images: finalOtherImages,
            status:
              pendingData.availability_count > 0 ? "available" : "out_of_stock",
            // Re-enter review only if the product was previously rejected
            ...(isResubmit && {
              verification_status: "pending",
              rejected_reason: null,
            }),
          },
        }),
      ).unwrap();

      setShowConfirmModal(false);
      toast.success(
        isResubmit
          ? "Product re-submitted for review"
          : "Product updated successfully",
      );
      router.back();
    } catch (error: any) {
      console.error("Error updating product:", error);
      setShowConfirmModal(false);
      Alert.alert(
        "Error",
        error?.message || "Failed to update product. Please try again.",
      );
    } finally {
      setLoading(false);
      setPendingData(null);
    }
  };

  if (!product) return null;

  const isRejected = product.verification_status === "rejected";

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
        <ScrollView
          className="flex-1 bg-white "
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: isKeyboardVisible ? 40 : 120,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 gap-4">
            <ProductPhotoPicker
              coverUri={coverImageUri ? getDisplayUri(coverImageUri) : null}
              additionalUris={otherImageUris.map(getDisplayUri)}
              onPickCover={pickCoverImage}
              onRemoveCover={removeCoverImage}
              onPickAdditional={pickAdditionalImages}
              onRemoveAdditional={removeAdditionalImage}
              coverError={errors.cover_image?.message}
            />

            <RHFInput
              control={control}
              name="title"
              label="Product name"
              placeholder="Eg: Jeans"
              autoCapitalize="words"
            />

            <RHFSelect
              control={control}
              name="category"
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              modalTitle="Select Category"
            />

            <RHFSelect
              control={control}
              name="condition"
              label="Condition"
              placeholder="Select item condition"
              options={conditionOptions}
              modalTitle="How worn is this item?"
              searchable={false}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <RHFInput
                  control={control}
                  name="price"
                  label="Price (NPR)"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  leftIcon={RsPrefix}
                />
              </View>
              <View style={{ flex: 1 }}>
                <RHFInput
                  control={control}
                  name="availability_count"
                  label="Quantity"
                  placeholder="1"
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <RHFTextarea
              control={control}
              name="description"
              label="Description"
              placeholder="Explain your product here..."
              maxLength={1000}
              numberOfLines={4}
            />

            <Button
              label="Update Product"
              variant="primary"
              fullWidth
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showConfirmModal}
        title={isRejected ? "Re-submit for Review" : "Update Product"}
        message={
          isRejected
            ? "Your updates will re-submit this product for review. It will remain visible on your storefront but won't appear on the marketplace until approved."
            : "Are you sure you want to save these changes? The updated product details will be visible to all buyers."
        }
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
    </>
  );
};
