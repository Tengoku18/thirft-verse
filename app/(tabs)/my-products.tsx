import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import {
  BodyBoldText,
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
import { Product } from "@/lib/types/database";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteProduct, fetchUserProducts } from "@/store/productsSlice";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type StatusFilter = "all" | "available" | "out_of_stock";

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const formatPrice = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

const statusConfig = {
  available: { bg: "#D1FAE5", text: "#059669", label: "Available" },
  out_of_stock: { bg: "#FEE2E2", text: "#DC2626", label: "Out of Stock" },
};

function ProductCard({ product, onPress, onEdit, onDelete }: ProductCardProps) {
  const currentStatus = statusConfig[product.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Status Bar at Top */}
      <View
        style={{ backgroundColor: currentStatus.bg }}
        className="px-4 py-2 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: currentStatus.text }}
          />
          <CaptionText
            style={{
              color: currentStatus.text,
              fontWeight: "700",
              fontSize: 12,
            }}
          >
            {currentStatus.label}
          </CaptionText>
        </View>
        <CaptionText style={{ color: currentStatus.text, fontSize: 11 }}>
          Stock: {product.availability_count}
        </CaptionText>
      </View>

      <View className="p-4">
        {/* Product Info Row */}
        <View className="flex-row">
          {/* Product Image */}
          {product.cover_image ? (
            <Image
              source={{ uri: getProductImageUrl(product.cover_image) }}
              className="w-24 h-24 rounded-xl"
              style={{ backgroundColor: "#F3F4F6" }}
            />
          ) : (
            <View className="w-24 h-24 rounded-xl bg-[#F3F4F6] justify-center items-center">
              <IconSymbol name="photo" size={28} color="#9CA3AF" />
            </View>
          )}

          {/* Product Details */}
          <View className="flex-1 ml-4 justify-center">
            <BodyBoldText style={{ fontSize: 16 }} numberOfLines={2}>
              {product.title}
            </BodyBoldText>

            <View className="flex-row items-center mt-2">
              <IconSymbol name="tag.fill" size={12} color="#6B7280" />
              <BodyMediumText
                style={{ color: "#6B7280", fontSize: 13, marginLeft: 4 }}
                numberOfLines={1}
              >
                {product.category}
              </BodyMediumText>
            </View>

            <HeadingBoldText
              style={{ fontSize: 18, color: "#3B2F2F", marginTop: 8 }}
            >
              {formatPrice(product.price)}
            </HeadingBoldText>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-4 pt-3 border-t border-[#F3F4F6] flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onEdit}
            className="flex-row items-center bg-[#F3F4F6] px-4 py-2 rounded-lg"
            activeOpacity={0.7}
          >
            <IconSymbol name="square.and.pencil" size={14} color="#3B2F2F" />
            <BodySemiboldText
              style={{ color: "#3B2F2F", marginLeft: 6, fontSize: 13 }}
            >
              Edit
            </BodySemiboldText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className="flex-row items-center bg-[#FEE2E2] px-4 py-2 rounded-lg"
            activeOpacity={0.7}
          >
            <IconSymbol name="trash" size={14} color="#DC2626" />
            <BodySemiboldText
              style={{ color: "#DC2626", marginLeft: 6, fontSize: 13 }}
            >
              Delete
            </BodySemiboldText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ onAddProduct }: { onAddProduct: () => void }) {
  return (
    <View className="py-16 items-center px-6">
      <View className="w-24 h-24 rounded-full bg-[#F3F4F6] justify-center items-center mb-4">
        <IconSymbol name="bag.fill" size={40} color="#9CA3AF" />
      </View>
      <HeadingBoldText className="mb-2 text-center">
        No Products Yet
      </HeadingBoldText>
      <BodyRegularText
        className="text-center leading-relaxed mb-6"
        style={{ color: "#6B7280" }}
      >
        Start selling by adding your first product. Your listed products will
        appear here.
      </BodyRegularText>
      <TouchableOpacity
        onPress={onAddProduct}
        className="bg-[#3B2F2F] px-6 py-3 rounded-full flex-row items-center"
        activeOpacity={0.7}
      >
        <IconSymbol name="plus" size={18} color="#FFFFFF" />
        <BodySemiboldText style={{ color: "#FFFFFF", marginLeft: 8 }}>
          Add Product
        </BodySemiboldText>
      </TouchableOpacity>
    </View>
  );
}

export default function MyProductsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Get products from Redux store
  const {
    userProducts: products,
    userProductsLoading: loading,
    deleting,
  } = useAppSelector((state) => state.products);

  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Set filter from query params
  useEffect(() => {
    if (filter === "available" || filter === "out_of_stock") {
      setStatusFilter(filter);
    }
  }, [filter]);

  // Fetch products on mount or when user changes
  useFocusEffect(
    useCallback(() => {
      if (user) {
        dispatch(fetchUserProducts(user.id));
      }
    }, [user, dispatch])
  );

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    await dispatch(fetchUserProducts(user.id));
    setRefreshing(false);
  }, [user, dispatch]);

  const handleDeletePress = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || !user) return;

    try {
      await dispatch(
        deleteProduct({ productId: productToDelete.id, storeId: user.id })
      ).unwrap();

      setShowDeleteModal(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      setShowDeleteModal(false);
      setProductToDelete(null);
      Alert.alert(
        "Error",
        error || "Failed to delete product. Please try again."
      );
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/edit-product/${product.id}` as any);
  };

  const handleProductPress = (product: Product) => {
    // Navigate to product detail screen when tapping the card
    router.push(`/product/${product.id}` as any);
  };

  const handleAddProduct = () => {
    router.push("/(tabs)/product" as any);
  };

  // Filter products based on status
  const filteredProducts = products.filter((product) => {
    if (statusFilter === "all") return true;
    return product.status === statusFilter;
  });

  // Count by status
  const statusCounts = {
    all: products.length,
    available: products.filter((p) => p.status === "available").length,
    out_of_stock: products.filter((p) => p.status === "out_of_stock").length,
  };

  // Calculate total value
  const totalValue = filteredProducts.reduce(
    (sum, p) => sum + p.price * p.availability_count,
    0
  );

  if (loading) {
    return (
      <TabScreenLayout title="My Products">
        <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading products...
          </BodyMediumText>
        </View>
      </TabScreenLayout>
    );
  }

  const filterOptions: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "available", label: "Available" },
    { key: "out_of_stock", label: "Sold Out" },
  ];

  return (
    <TabScreenLayout title="My Products">
      <View className="flex-1 bg-[#FAFAFA]">
        {/* Status Filter Tabs */}
        {products.length > 0 && (
          <View className="px-4 pt-4 pb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {filterOptions.map((option) => {
                const isActive = statusFilter === option.key;
                const count = statusCounts[option.key];

                return (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setStatusFilter(option.key)}
                    className="flex-row items-center px-4 py-2.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "#3B2F2F" : "#FFFFFF",
                      borderWidth: isActive ? 0 : 1,
                      borderColor: "#E5E7EB",
                    }}
                    activeOpacity={0.7}
                  >
                    <BodySemiboldText
                      style={{
                        color: isActive ? "#FFFFFF" : "#374151",
                        fontSize: 14,
                      }}
                    >
                      {option.label}
                    </BodySemiboldText>
                    <View
                      className="ml-2 px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.2)"
                          : "#F3F4F6",
                      }}
                    >
                      <CaptionText
                        style={{
                          color: isActive ? "#FFFFFF" : "#6B7280",
                          fontWeight: "700",
                          fontSize: 11,
                        }}
                      >
                        {count}
                      </CaptionText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Products List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B2F2F"
              colors={["#3B2F2F"]}
            />
          }
        >
          {filteredProducts.length === 0 ? (
            <EmptyState onAddProduct={handleAddProduct} />
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDeletePress(product)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        loading={deleting}
        variant="danger"
        icon="trash"
      />
    </TabScreenLayout>
  );
}
