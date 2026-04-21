import { ScreenLayout } from "@/components/layouts";
import { ActionModal } from "@/components/ui/ActionModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Carousel } from "@/components/ui/Carousel";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
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
  Share,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const formatPrice = (amount: number) => {
  return `NPR ${amount.toLocaleString()}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  const {
    selectedProduct: product,
    selectedProductLoading: loading,
    deleting,
  } = useAppSelector((state) => state.products);
  const storeUsername = useAppSelector(
    (state) => state.profile.profile?.store_username,
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  const handleShare = async () => {
    if (!product) return;
    try {
      const productUrl = `https://thriftverse.shop/product/${product.id}`;
      await Share.share({
        message: `Check out "${product.title}" on Thriftverse!\n\nPrice: ${formatPrice(product.price)}\n\n${productUrl}`,
        url: productUrl,
        title: product.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleViewInWebsite = async () => {
    if (!product) return;
    const url = storeUsername
      ? `https://${storeUsername}.thriftverse.shop/product/${product.id}`
      : `https://thriftverse.shop/product/${product.id}`;
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

  const handleConfirmDelete = async () => {
    if (!product || !user) return;
    try {
      await dispatch(
        deleteProduct({ productId: product.id, storeId: user.id }),
      ).unwrap();
      setShowDeleteModal(false);
      toast.success("Product deleted successfully");
      router.back();
    } catch (error: any) {
      setShowDeleteModal(false);
      Alert.alert(
        "Error",
        error || "Failed to delete product. Please try again.",
      );
    }
  };

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
      <SafeAreaView className="flex-1 bg-[#F5F5F5] justify-center items-center">
        <ActivityIndicator size="large" color="#3B3030" />
        <Typography variation="body-sm" className="text-ui-secondary mt-3">
          Loading product...
        </Typography>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] justify-center items-center px-6">
        <IconSymbol name="exclamationmark.triangle" size={48} color="#9CA3AF" />
        <Typography variation="h3" className="text-brand-espresso mt-4 text-center">
          Product Not Found
        </Typography>
        <Typography variation="body-sm" className="text-ui-secondary mt-2 text-center">
          This product may have been removed or is no longer available.
        </Typography>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-brand-espresso px-6 py-3 rounded-full"
        >
          <Typography variation="button" className="text-white">
            Go Back
          </Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentStatus = statusConfig[product.status];
  const imageCarouselData = allImages.map((img, i) => ({
    id: String(i),
    uri: getProductImageUrl(img),
  }));

  const shareButton = (
    <TouchableOpacity
      onPress={handleShare}
      className="w-10 h-10 justify-center items-center rounded-full"
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <IconSymbol name="square.and.arrow.up" size={20} color="#3B3030" />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout
      title="Product Details"
      contentBackgroundColor="#F5F5F5"
      paddingHorizontal={0}
      rightComponent={shareButton}
    >
      {/* Image Carousel */}
      <View className="pt-4">
        <Carousel
          data={imageCarouselData}
          itemWidth={SCREEN_WIDTH * 0.85}
          itemHeight={SCREEN_WIDTH * 0.85 * 1.25}
          autoPlayInterval={0}
          showDots={allImages.length > 1}
          snapToAlignment="center"
          renderItem={(item) => (
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%", borderRadius: 16 }}
              resizeMode="cover"
            />
          )}
        />
      </View>

      {/* Content */}
      <View className="px-4 mt-5 gap-4 pb-6">
        {/* Status + Category row */}
        <View className="flex-row items-center justify-between">
          <View
            className="flex-row items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ backgroundColor: currentStatus.bg }}
          >
            <IconSymbol name="checkmark.circle.fill" size={14} color={currentStatus.text} />
            <Typography
              variation="caption"
              style={{ color: currentStatus.text, fontWeight: "700" }}
            >
              {currentStatus.label}
            </Typography>
          </View>
          <Typography variation="body-sm" className="text-ui-secondary">
            Category:{" "}
            <Typography variation="body-sm" className="text-brand-tan font-semibold">
              {product.category}
            </Typography>
          </Typography>
        </View>

        {/* Title + Price */}
        <View className="gap-1">
          <Typography variation="h2" className="text-brand-espresso leading-tight">
            {product.title}
          </Typography>
          <Typography variation="h1" className="text-brand-espresso">
            {formatPrice(product.price)}
          </Typography>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          <Card variant="outlined" className="flex-1">
            <Typography
              variation="caption"
              className="text-ui-secondary uppercase tracking-widest font-sans-bold mb-1"
            >
              Stock Level
            </Typography>
            <Typography variation="h4" className="text-amber-700">
              {product.availability_count} items left
            </Typography>
          </Card>
          <Card variant="outlined" className="flex-1">
            <Typography
              variation="caption"
              className="text-ui-secondary uppercase tracking-widest font-sans-bold mb-1"
            >
              Category
            </Typography>
            <Typography variation="h4" className="text-brand-espresso" numberOfLines={1}>
              {product.category}
            </Typography>
          </Card>
        </View>

        {/* Description */}
        {product.description && (
          <Card variant="outlined">
            <Typography variation="h5" className="text-brand-espresso mb-2">
              Description
            </Typography>
            <Typography variation="body-sm" className="text-ui-secondary leading-relaxed">
              {product.description}
            </Typography>
          </Card>
        )}

        {/* Action Buttons (owner only) */}
        {isOwner && (
          <View className="gap-3">
            <Button
              label="Edit Product"
              variant="primary"
              onPress={handleEdit}
              icon={<IconSymbol name="square.and.pencil" size={18} color="#FFFFFF" />}
              noShadow
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  label="Share"
                  variant="secondary"
                  onPress={handleShare}
                  icon={<IconSymbol name="square.and.arrow.up" size={18} color="#3B3030" />}
                  noShadow
                />
              </View>
              <View className="flex-1">
                <Button
                  label="Website"
                  variant="secondary"
                  onPress={handleViewInWebsite}
                  icon={<IconSymbol name="globe" size={18} color="#3B3030" />}
                  noShadow
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              className="w-full h-14 flex-row items-center justify-center gap-2 rounded-3xl bg-red-50 border border-red-200"
              activeOpacity={0.8}
            >
              <IconSymbol name="trash" size={18} color="#DC2626" />
              <Typography variation="button" className="text-red-600">
                Delete Product
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Timestamps */}
        <View className="flex-row justify-between pt-2 border-t border-brand-beige/60">
          <Typography variation="body-xs" className="text-ui-secondary/60 italic">
            Created: {formatDate(product.created_at)}
          </Typography>
          <Typography variation="body-xs" className="text-ui-secondary/60 italic">
            Updated: {formatDate(product.updated_at)}
          </Typography>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <ActionModal
        visible={showDeleteModal}
        icon={<IconSymbol name="trash" size={24} color="#DC2626" />}
        title="Delete Product?"
        description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        primaryLabel={deleting ? "Deleting…" : "Delete"}
        secondaryLabel="Keep Product"
        onPrimary={handleConfirmDelete}
        onSecondary={() => setShowDeleteModal(false)}
        primaryLoading={deleting}
      />
    </ScreenLayout>
  );
}
