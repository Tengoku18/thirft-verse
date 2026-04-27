import PlusIcon from "@/components/icons/PlusIcon";
import XIcon from "@/components/icons/XIcon";
import { ProductPickerCard } from "@/components/order/ProductPickerCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SearchInput } from "@/components/ui/SearchInput/SearchInput";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsByStoreId } from "@/lib/database-helpers";
import { Product } from "@/lib/types/database";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../ui/Button";

const PAGE_SIZE = 20;

export interface PickerItem {
  product: Product;
  quantity: number;
}

interface ProductPickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (items: PickerItem[]) => void;
  initialSelection?: PickerItem[];
}

type SelectionMap = Record<string, PickerItem>;

export function ProductPickerModal({
  visible,
  onDismiss,
  onSelect,
  initialSelection,
}: ProductPickerModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [serverHasMore, setServerHasMore] = useState(false);
  const [serverOffset, setServerOffset] = useState(PAGE_SIZE);
  const [selection, setSelection] = useState<SelectionMap>({});
  // Ref so the open-effect can read initialSelection without it being a dep
  const initialSelectionRef = useRef(initialSelection);
  useEffect(() => {
    initialSelectionRef.current = initialSelection;
  }, [initialSelection]);

  const filteredProducts = useMemo(
    () =>
      search.trim()
        ? allProducts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase()),
          )
        : allProducts,
    [allProducts, search],
  );

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const clientHasMore = filteredProducts.length > displayCount;
  const selectedCount = Object.keys(selection).length;

  const loadInitial = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await getProductsByStoreId({
        storeId: user.id,
        limit: PAGE_SIZE,
        offset: 0,
        status: "available",
      });
      setAllProducts(result.data);
      setDisplayCount(PAGE_SIZE);
      setServerOffset(PAGE_SIZE);
      setServerHasMore((result.count ?? 0) > PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMoreFromServer = useCallback(async () => {
    if (!user || !serverHasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await getProductsByStoreId({
        storeId: user.id,
        limit: PAGE_SIZE,
        offset: serverOffset,
        status: "available",
      });
      setAllProducts((prev) => [...prev, ...result.data]);
      setServerOffset((prev) => prev + PAGE_SIZE);
      setServerHasMore(serverOffset + PAGE_SIZE < (result.count ?? 0));
    } finally {
      setLoadingMore(false);
    }
  }, [user, serverHasMore, serverOffset, loadingMore]);

  useEffect(() => {
    if (visible) {
      loadInitial();
      // Seed from parent selection so seller can edit existing picks
      const seed = initialSelectionRef.current;
      if (seed?.length) {
        const map: SelectionMap = {};
        seed.forEach((item) => {
          map[item.product.id] = item;
        });
        setSelection(map);
      }
    } else {
      setSearch("");
      setAllProducts([]);
      setDisplayCount(PAGE_SIZE);
      setSelection({});
    }
  }, [visible, loadInitial]);

  const handleShowMore = () => {
    const next = displayCount + PAGE_SIZE;
    setDisplayCount(next);
    if (next >= allProducts.length && serverHasMore) {
      loadMoreFromServer();
    }
  };

  const handleAddProduct = () => {
    onDismiss();
    router.push("/(tabs)/product" as any);
  };

  const handleCardPress = (product: Product) => {
    setSelection((prev) => {
      if (prev[product.id]) {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.id]: { product, quantity: 1 } };
    });
  };

  const handleQuantityChange = (product: Product, delta: number) => {
    setSelection((prev) => {
      const current = prev[product.id];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.id]: { ...current, quantity: newQty } };
    });
  };

  const handleConfirm = () => {
    if (selectedCount === 0) return;
    onSelect(Object.values(selection));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        {/* Blur backdrop */}
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.45)" },
          ]}
        />
        {/* Tap-to-dismiss area above the sheet */}
        <Pressable style={{ flex: 1 }} onPress={onDismiss} />

        {/* Sheet */}
        <View
          style={{
            height: "80%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-2">
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E5E7EB",
              }}
            />
          </View>

          {/* Header */}
          <View
            className="flex-row items-center justify-between px-5 pb-4"
            style={{ borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}
          >
            <View className="flex-1 pr-4">
              <Typography variation="h3" className="text-brand-espresso">
                Select Products
              </Typography>
              <Typography
                variation="caption"
                className="text-ui-secondary mt-0.5"
              >
                Pick items & set quantities for this order
              </Typography>
            </View>
            <TouchableOpacity
              onPress={onDismiss}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <XIcon width={15} height={15} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="px-5 pt-3 pb-2">
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search products..."
              clearable
            />
          </View>

          {/* Section label */}
          <View className="px-5 pt-3 pb-1">
            <Typography
              variation="caption"
              className="text-ui-secondary font-sans-semibold"
              style={{ letterSpacing: 0.8 }}
            >
              YOUR ACTIVE PRODUCTS
            </Typography>
          </View>

          {/* Product grid */}
          {loading ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color="#3B2F2F" />
              <Typography variation="body-sm" className="text-ui-secondary">
                Loading products...
              </Typography>
            </View>
          ) : (
            <FlatList
              data={visibleProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 10, paddingBottom: 16 }}
              renderItem={({ item }) => (
                <ProductPickerCard
                  product={item}
                  selected={!!selection[item.id]}
                  quantity={selection[item.id]?.quantity ?? 1}
                  onPress={() => handleCardPress(item)}
                  onQuantityChange={(delta) =>
                    handleQuantityChange(item, delta)
                  }
                />
              )}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center px-8 gap-4 py-12">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    <IconSymbol name="cube" size={30} color="#9CA3AF" />
                  </View>
                  <View className="items-center gap-1">
                    <Typography
                      variation="h4"
                      className="text-brand-espresso text-center"
                    >
                      {search ? "No results found" : "No active products"}
                    </Typography>
                    <Typography
                      variation="body-sm"
                      className="text-ui-secondary text-center"
                    >
                      {search
                        ? `No products match "${search}"`
                        : "Add products to your store first."}
                    </Typography>
                  </View>

                  {!search && (
                    <View className="w-full">
                      <Button
                        fullWidth
                        icon={<PlusIcon size={14} color="#fff" />}
                        iconPosition="left"
                        onPress={handleAddProduct}
                        label="Add product"
                      />
                    </View>
                  )}
                </View>
              }
              ListFooterComponent={
                clientHasMore || loadingMore ? (
                  <View className="py-4 items-center">
                    {loadingMore ? (
                      <ActivityIndicator size="small" color="#3B2F2F" />
                    ) : (
                      <TouchableOpacity
                        onPress={handleShowMore}
                        activeOpacity={0.7}
                        className="px-8 py-3 rounded-full border border-gray-200"
                      >
                        <Typography
                          variation="label"
                          className="text-brand-espresso"
                        >
                          Load More
                        </Typography>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null
              }
            />
          )}

          {/* Confirm button */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
            }}
          >
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={selectedCount === 0}
              activeOpacity={0.8}
              className="rounded-2xl py-4 items-center"
              style={{
                backgroundColor: selectedCount > 0 ? "#3B2F2F" : "#E5E7EB",
              }}
            >
              <Typography
                variation="label"
                style={{
                  color: selectedCount > 0 ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {selectedCount > 0
                  ? `Add ${selectedCount} Item${selectedCount > 1 ? "s" : ""} to Order`
                  : "Select products above"}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
