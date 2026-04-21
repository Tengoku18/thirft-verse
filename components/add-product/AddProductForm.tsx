import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import { CompleteProfileModal } from "@/components/molecules/CompleteProfileModal";
import { ProductSuccessModal } from "@/components/molecules/ProductSuccessModal";
import { TabHeader } from "@/components/navigation/TabHeader";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import {
  PRODUCT_CATEGORIES,
  ProductFormData,
  productSchema,
} from "@/lib/validations/product";
import { fetchUserProfile } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProduct as createProductAction } from "@/store/productsSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoCarousel } from "./PhotoCarousel";
import { PriceStockRow } from "./PriceStockRow";

const BG = "#FAF7F2";

export function AddProductForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const profile = useAppSelector((state) => state.profile.profile);

  const [loading, setLoading] = useState(false);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [additionalUris, setAdditionalUris] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [createdProduct, setCreatedProduct] = useState<{
    id: string;
    title: string;
    price: number;
    cover_image: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) dispatch(fetchUserProfile(user.id));
    }, [user?.id, dispatch]),
  );

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
      availability_count: undefined,
      cover_image: "",
      other_images: [],
    },
  });

  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
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
      setCoverUri(uri);
      setValue("cover_image", uri);
    }
  };

  const pickAdditionalImages = async () => {
    const remaining = 5 - additionalUris.length;
    if (remaining <= 0) {
      Alert.alert(
        "Limit Reached",
        "You can only add up to 5 additional images.",
      );
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((a) => a.uri);
      const merged = [...additionalUris, ...uris];
      setAdditionalUris(merged);
      setValue("other_images", merged);
    }
  };

  const removeCover = () => {
    setCoverUri(null);
    setValue("cover_image", "");
  };

  const removeAdditional = (index: number) => {
    const updated = additionalUris.filter((_, i) => i !== index);
    setAdditionalUris(updated);
    setValue("other_images", updated);
  };

  const getDisplayUri = (uri: string) =>
    uri.startsWith("file://") ||
    uri.startsWith("content://") ||
    uri.startsWith("ph://")
      ? uri
      : getProductImageUrl(uri);

  const hasPaymentDetails = () =>
    !!(profile?.payment_username?.trim() && profile?.payment_qr_image?.trim());

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      Alert.alert("Authentication Required", "Please sign in to continue.");
      return;
    }
    if (!data.cover_image) {
      Alert.alert("Cover Image Required", "Please upload a cover image.");
      return;
    }
    if (!hasPaymentDetails()) {
      setShowCompleteProfileModal(true);
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const coverUpload = await uploadImageToStorage(
        data.cover_image,
        "products",
        "products",
      );
      if (!coverUpload.success || !coverUpload.url) {
        Alert.alert(
          "Upload Error",
          "Failed to upload cover image. Please try again.",
        );
        return;
      }
      const uploadedOthers: string[] = [];
      for (const uri of data.other_images ?? []) {
        const res = await uploadImageToStorage(uri, "products", "products");
        if (res.success && res.url) uploadedOthers.push(res.url);
      }
      const result = await dispatch(
        createProductAction({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          availability_count: data.availability_count,
          store_id: user.id,
          cover_image: coverUpload.url,
          other_images: uploadedOthers,
          is_verified: false,
        }),
      ).unwrap();

      setCreatedProduct({
        id: result.id,
        title: data.title,
        price: data.price,
        cover_image: coverUpload.url,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to create product. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setCoverUri(null);
    setAdditionalUris([]);
    setCreatedProduct(null);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <TabHeader
          variant="light"
          title="Add Product"
          showDefaultIcons={false}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Photo upload carousel */}
            <PhotoCarousel
              coverUri={coverUri ? getDisplayUri(coverUri) : null}
              additionalUris={additionalUris.map(getDisplayUri)}
              onPickCover={pickCoverImage}
              onPickAdditional={pickAdditionalImages}
              onRemoveCover={removeCover}
              onRemoveAdditional={removeAdditional}
              coverError={errors.cover_image?.message}
            />

            {/* Form fields */}
            <View className="px-8 gap-4">
              <RHFInput
                control={control}
                name="title"
                label="Product Title"
                placeholder="e.g. Oversized Vintage Denim Jacket"
                autoCapitalize="words"
              />
              <View>
                <RHFSelect
                  control={control}
                  name="category"
                  label="Category"
                  placeholder="Select Category"
                  options={categoryOptions}
                  modalTitle="Select Category"
                />
              </View>

              <View>
                <PriceStockRow control={control} />
              </View>
              <View>
                <RHFTextarea
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Describe the item condition, size, material..."
                  maxLength={500}
                  numberOfLines={4}
                />
              </View>

              <View>
                <Button
                  label="Post Product"
                  variant="primary"
                  fullWidth
                  onPress={handleSubmit(onSubmit)}
                  isLoading={loading}
                  disabled={loading}
                />
              </View>

              <Typography
                variation="caption"
                style={{ color: "#94a3b8", textAlign: "center", marginTop: 12 }}
              >
                By posting, you agree to ThriftVerse Community Guidelines.
              </Typography>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ProductSuccessModal
        visible={showSuccessModal}
        product={createdProduct}
        storeUsername={profile?.store_username}
        onClose={() => {
          setShowSuccessModal(false);
          resetForm();
        }}
        onViewMyProducts={() => {
          setShowSuccessModal(false);
          resetForm();
          router.push("/(tabs)/profile" as any);
        }}
        onViewProduct={() => {
          setShowSuccessModal(false);
          resetForm();
          router.push(`/product/${createdProduct?.id}` as any);
        }}
      />

      <CompleteProfileModal
        visible={showCompleteProfileModal}
        onGoToProfile={() => {
          setShowCompleteProfileModal(false);
          router.push("/(tabs)/earnings");
        }}
        onCancel={() => setShowCompleteProfileModal(false)}
      />
    </>
  );
}
