import { FormButton } from "@/components/atoms/FormButton";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedProduct,
  deleteProduct,
  fetchProductById,
} from "@/store/productsSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const formatPrice = (amount: number) => {
  return `NPR ${amount.toLocaleString()}`;
};

const statusConfig = {
  available: { bg: "#D1FAE5", text: "#059669", label: "Available" },
  out_of_stock: { bg: "#FEE2E2", text: "#DC2626", label: "Out of Stock" },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const toast = useToast();

  // Get product from Redux store
  const {
    selectedProduct: product,
    selectedProductLoading: loading,
    deleting,
  } = useAppSelector((state) => state.products);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch product on mount or when id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  const handleShare = async () => {
    if (!product) return;

    try {
      const productUrl = `https://thriftverse.shop/product/${product.id}`;
      await Share.share({
        message: `Check out "${
          product.title
        }" on Thriftverse!\n\nPrice: ${formatPrice(
          product.price
        )}\n\n${productUrl}`,
        url: productUrl,
        title: product.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleViewInWebsite = async () => {
    if (!product) return;

    const url = `https://thriftverse.shop/product/${product.id}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Could not open the website.");
    }
  };

  const handleEdit = () => {
    if (!product) return;
    router.push(`/edit-product/${product.id}` as any);
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!product || !user) return;

    try {
      await dispatch(
        deleteProduct({ productId: product.id, storeId: user.id })
      ).unwrap();

      setShowDeleteModal(false);
      toast.success("Product deleted successfully");
      router.back();
    } catch (error: any) {
      setShowDeleteModal(false);
      Alert.alert(
        "Error",
        error || "Failed to delete product. Please try again."
      );
    }
  };

  // Get all images for the gallery
  const getAllImages = (): string[] => {
    if (!product) return [];
    const images = [product.cover_image];
    if (product.other_images && product.other_images.length > 0) {
      images.push(...product.other_images);
    }
    return images;
  };

  const allImages = getAllImages();
  const isOwner = user?.id === product?.store_id;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
        <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
          Loading product...
        </BodyMediumText>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <IconSymbol name="exclamationmark.triangle" size={48} color="#9CA3AF" />
        <HeadingBoldText className="mt-4 text-center">
          Product Not Found
        </HeadingBoldText>
        <BodyRegularText
          className="mt-2 text-center"
          style={{ color: "#6B7280" }}
        >
          This product may have been removed or is no longer available.
        </BodyRegularText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-[#3B2F2F] px-6 py-3 rounded-full"
        >
          <BodySemiboldText style={{ color: "#FFFFFF" }}>
            Go Back
          </BodySemiboldText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentStatus = statusConfig[product.status];

  return (
    <View className="flex-1 bg-white">
      <CustomHeader
        title="Product Details"
        showBackButton
        rightIcon={{
          name: "square.and.arrow.up",
          onPress: handleShare,
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Image Gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {allImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: getProductImageUrl(image) }}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_WIDTH,
                  backgroundColor: "#F3F4F6",
                }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {allImages.length > 1 && (
            <View className="flex-row justify-center items-center py-3 absolute bottom-0 left-0 right-0">
              {allImages.map((_, index) => (
                <View
                  key={index}
                  className="mx-1 rounded-full"
                  style={{
                    width: activeImageIndex === index ? 24 : 8,
                    height: 8,
                    backgroundColor:
                      activeImageIndex === index
                        ? "#3B2F2F"
                        : "rgba(59, 47, 47, 0.3)",
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-6 pt-6">
          {/* Status Badge */}
          <View
            className="self-start px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: currentStatus.bg }}
          >
            <CaptionText
              style={{ color: currentStatus.text, fontWeight: "700" }}
            >
              {currentStatus.label}
            </CaptionText>
          </View>

          {/* Title */}
          <HeadingBoldText style={{ fontSize: 24 }}>
            {product.title}
          </HeadingBoldText>

          {/* Price */}
          <HeadingBoldText
            style={{ fontSize: 28, color: "#3B2F2F", marginTop: 8 }}
          >
            {formatPrice(product.price)}
          </HeadingBoldText>

          {/* Category & Stock */}
          <View className="flex-row items-center mt-4 gap-4">
            <View className="flex-row items-center">
              <IconSymbol name="tag.fill" size={14} color="#6B7280" />
              <BodyMediumText style={{ color: "#6B7280", marginLeft: 6 }}>
                {product.category}
              </BodyMediumText>
            </View>
            <View className="flex-row items-center">
              <IconSymbol name="cube.box.fill" size={14} color="#6B7280" />
              <BodyMediumText style={{ color: "#6B7280", marginLeft: 6 }}>
                {product.availability_count} in stock
              </BodyMediumText>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View className="mt-6">
              <BodySemiboldText style={{ fontSize: 16, marginBottom: 8 }}>
                Description
              </BodySemiboldText>
              <BodyRegularText style={{ color: "#4B5563", lineHeight: 22 }}>
                {product.description}
              </BodyRegularText>
            </View>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={handleEdit}
                className="flex-1 flex-row items-center justify-center bg-[#F3F4F6] py-4 rounded-xl"
                activeOpacity={0.7}
              >
                <IconSymbol name="square.and.pencil" size={18} color="#3B2F2F" />
                <BodySemiboldText style={{ color: "#3B2F2F", marginLeft: 8 }}>
                  Edit
                </BodySemiboldText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeletePress}
                disabled={deleting}
                className="flex-1 flex-row items-center justify-center bg-[#FEE2E2] py-4 rounded-xl"
                activeOpacity={0.7}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <>
                    <IconSymbol name="trash" size={18} color="#DC2626" />
                    <BodySemiboldText
                      style={{ color: "#DC2626", marginLeft: 8 }}
                    >
                      Delete
                    </BodySemiboldText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar - View in Website */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F3F4F6] px-6 py-4"
        style={{ paddingBottom: 34 }}
      >
        <FormButton
          title="View in Website"
          onPress={handleViewInWebsite}
          variant="primary"
          icon={<IconSymbol name="globe" size={18} color="#FFFFFF" />}
        />
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
        variant="danger"
        icon="trash"
      />
    </View>
  );
}
