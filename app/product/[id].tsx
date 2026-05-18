import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import { InfoBox } from "@/components/atoms/InfoBox";
import { BagIcon, ShareIcon, TrashIcon, WarningIcon } from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import {
  BuyerActions,
  OwnerActions,
  ProductDescription,
  ProductImageGallery,
  ProductInfo,
  ProductStats,
  ProductStatusRow,
  VerificationBanner,
} from "@/components/product";
import { ActionModal } from "@/components/ui/ActionModal";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedProduct,
  deleteProduct,
  fetchProductById,
} from "@/store/productsSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Share, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const formatPrice = (amount: number) => `NPR ${amount.toLocaleString()}`;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const {
    selectedProduct: product,
    selectedProductLoading: loading,
    selectedProductError: error,
    deleting,
  } = useAppSelector((state) => state.products);
  const storeUsername = useAppSelector(
    (state) => state.profile.profile?.store_username,
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => { dispatch(clearSelectedProduct()); };
  }, [id, dispatch]);

  const handleRefresh = async () => {
    if (id) await dispatch(fetchProductById(id));
  };

  const handleShare = async () => {
    if (!product) return;
    const productUrl = `https://thriftverse.shop/product/${product.id}`;
    try {
      await Share.share({
        message: `Check out "${product.title}" on Thriftverse!\n\nPrice: ${formatPrice(product.price)}\n\n${productUrl}`,
        url: productUrl,
        title: product.title,
      });
    } catch {
      // share sheet dismissed
    }
  };

  const handleWebsite = async () => {
    if (!product) return;
    const url = storeUsername
      ? `https://${storeUsername}.thriftverse.shop/product/${product.id}`
      : `https://thriftverse.shop/product/${product.id}`;
    try {
      await Linking.openURL(url);
    } catch {
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
    } catch (err: any) {
      setShowDeleteModal(false);
      Alert.alert("Error", err || "Failed to delete product. Please try again.");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}` as any);
  };

  if (loading && !product) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: "#F5F5F5" }}>
        <FullScreenLoader message="Loading product..." />
      </SafeAreaView>
    );
  }

  if (error && !product) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] justify-center items-center px-6">
        <WarningIcon width={48} height={48} color="#EF4444" />
        <Typography variation="h3" className="text-brand-espresso mt-4 text-center">
          Something Went Wrong
        </Typography>
        <InfoBox message={error} type="error" className="mt-3 w-full" />
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={handleRefresh}
            className="bg-brand-espresso px-6 py-3 rounded-full"
          >
            <Typography variation="button" className="text-white">
              Try Again
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-brand-beige px-6 py-3 rounded-full"
          >
            <Typography variation="button" className="text-brand-espresso">
              Go Back
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] justify-center items-center px-6">
        <WarningIcon width={48} height={48} color="#9CA3AF" />
        <Typography variation="h3" className="text-brand-espresso mt-4 text-center">
          Product Not Found
        </Typography>
        <InfoBox
          message="This product may have been removed or is no longer available."
          type="secondary"
          className="mt-3 w-full"
        />
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

  const isOwner = user?.id === product.store_id;
  const isAvailable = product.status === "available";
  const allImages = [product.cover_image, ...(product.other_images ?? [])];

  const shareButton = (
    <TouchableOpacity
      onPress={handleShare}
      className="w-10 h-10 justify-center items-center rounded-full"
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <ShareIcon width={20} height={20} color="#3B3030" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenLayout
        title="Product Details"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
        rightComponent={shareButton}
        onRefresh={handleRefresh}
      >
        <ProductImageGallery images={allImages} />

        <View
          className="px-4 mt-5 gap-4"
          style={{ paddingBottom: isOwner ? 24 : insets.bottom + 104 }}
        >
          <ProductStatusRow status={product.status} category={product.category} />

          {isOwner && (
            <VerificationBanner
              status={product.verification_status}
              rejectedReason={product.rejected_reason}
              storeUsername={storeUsername}
              onEdit={handleEdit}
            />
          )}

          <ProductInfo title={product.title} price={product.price} />

          <ProductStats
            availabilityCount={product.availability_count}
            category={product.category}
          />

          {product.description && (
            <ProductDescription description={product.description} />
          )}

          {isOwner ? (
            <OwnerActions
              onEdit={handleEdit}
              onShare={handleShare}
              onWebsite={handleWebsite}
              onDelete={() => setShowDeleteModal(true)}
            />
          ) : (
            <BuyerActions
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onViewStore={() => router.push(`/store/${product.store_id}` as any)}
            />
          )}
        </View>

        <ActionModal
          visible={showDeleteModal}
          icon={<TrashIcon width={24} height={24} color="#DC2626" />}
          title="Delete Product?"
          description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
          primaryLabel={deleting ? "Deleting…" : "Delete"}
          secondaryLabel="Keep Product"
          onPrimary={handleConfirmDelete}
          onSecondary={() => setShowDeleteModal(false)}
          primaryLoading={deleting}
        />
      </ScreenLayout>

      {/* Docked bottom action bar — buyer only */}
      {!isOwner && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F1F5F9",
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 12),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Typography variation="caption" className="text-ui-secondary">
                {quantity > 1 ? `${quantity} × ${formatPrice(product.price)}` : "Total"}
              </Typography>
              <Typography variation="h3" className="text-brand-espresso">
                {formatPrice(product.price * quantity)}
              </Typography>
            </View>

            <View style={{ flex: 1.3 }}>
              <Button
                label={isAvailable ? "Buy Now" : "Out of Stock"}
                variant="primary"
                onPress={handleBuyNow}
                disabled={!isAvailable}
                icon={<BagIcon width={18} height={18} color="#FFFFFF" />}
                noShadow
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
