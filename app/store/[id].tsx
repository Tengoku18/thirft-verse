import { SkeletonLoader } from "@/components/atoms/SkeletonLoader";
import { CubeIcon, IIcon, WarningIcon } from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import { ProductCardSkeleton } from "@/components/molecules/ProductCardSkeleton";
import ProductCard from "@/components/molecules/ProductCard";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Product, Profile } from "@/lib/types/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

function StoreHeaderSkeleton() {
  return (
    <View className="bg-white px-6 py-8 border-b border-slate-100">
      <View className="items-center mb-6">
        <SkeletonLoader width={120} height={120} borderRadius={60} />
      </View>
      <View className="items-center mb-6 gap-2">
        <SkeletonLoader width={180} height={22} borderRadius={6} />
        <SkeletonLoader width={100} height={14} borderRadius={6} />
      </View>
      <View className="flex-row items-center justify-center gap-12 mb-6 pb-6 border-b border-slate-100">
        <View className="items-center gap-2">
          <SkeletonLoader width={36} height={22} borderRadius={6} />
          <SkeletonLoader width={56} height={14} borderRadius={6} />
        </View>
        <View className="w-px h-10 bg-slate-200" />
        <View className="items-center gap-2">
          <SkeletonLoader width={36} height={22} borderRadius={6} />
          <SkeletonLoader width={56} height={14} borderRadius={6} />
        </View>
      </View>
      <SkeletonLoader height={60} borderRadius={12} />
    </View>
  );
}

function ProductsGridSkeleton() {
  return (
    <>
      <View className="flex-row gap-3 mb-3">
        <View style={{ flex: 1 }}>
          <ProductCardSkeleton />
        </View>
        <View style={{ flex: 1 }}>
          <ProductCardSkeleton />
        </View>
      </View>
      <View className="flex-row gap-3">
        <View style={{ flex: 1 }}>
          <ProductCardSkeleton />
        </View>
        <View style={{ flex: 1 }}>
          <ProductCardSkeleton />
        </View>
      </View>
    </>
  );
}

type StoreError = "not_found" | "network_error" | null;

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [store, setStore] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeLoading, setStoreLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [storeError, setStoreError] = useState<StoreError>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStore = useCallback(
    async (storeId: string): Promise<{ data: Profile | null; notFound: boolean }> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", storeId)
          .maybeSingle();
        if (error) throw error;
        return { data, notFound: !data };
      } catch (e) {
        console.error("❌ Error fetching store:", e);
        return { data: null, notFound: false };
      }
    },
    [],
  );

  const fetchProducts = useCallback(
    async (storeId: string, opts?: { silent?: boolean }) => {
      if (!opts?.silent) {
        setProductsLoading(true);
        setProductsError(null);
      }
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", storeId)
          .eq("is_active", true)
          .eq("status", "available")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data ?? []);
      } catch (e) {
        console.error("❌ Error fetching products:", e);
        if (!opts?.silent) {
          setProductsError("Failed to load products. Please try again.");
        }
      } finally {
        if (!opts?.silent) setProductsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!id) return;
    const init = async () => {
      setStoreLoading(true);
      setStoreError(null);

      const { data: fetchedStore, notFound } = await fetchStore(id);
      setStoreLoading(false);

      if (!fetchedStore) {
        setStoreError(notFound ? "not_found" : "network_error");
        return;
      }
      setStore(fetchedStore);
      await fetchProducts(id);
    };
    init();
  }, [id, fetchStore, fetchProducts]);

  const onRefresh = useCallback(async () => {
    if (!id) return;
    setRefreshing(true);
    const { data: fetchedStore } = await fetchStore(id);
    if (fetchedStore) {
      setStore(fetchedStore);
      await fetchProducts(id, { silent: true });
    }
    setRefreshing(false);
  }, [id, fetchStore, fetchProducts]);

  const handleRetryStore = useCallback(async () => {
    if (!id) return;
    setStoreLoading(true);
    setStoreError(null);
    const { data: fetchedStore, notFound } = await fetchStore(id);
    setStoreLoading(false);
    if (!fetchedStore) {
      setStoreError(notFound ? "not_found" : "network_error");
      return;
    }
    setStore(fetchedStore);
    await fetchProducts(id);
  }, [id, fetchStore, fetchProducts]);

  return (
    <ScreenLayout
      title="Store"
      backgroundColor={Colors.light.background}
      contentBackgroundColor={Colors.light.background}
      scrollable={false}
    >
      {storeLoading ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <StoreHeaderSkeleton />
          <View className="px-4 pt-6">
            <View className="flex-row items-center justify-between mb-4 px-2">
              <SkeletonLoader width={80} height={20} borderRadius={6} />
              <SkeletonLoader width={50} height={14} borderRadius={6} />
            </View>
            <ProductsGridSkeleton />
          </View>
        </ScrollView>
      ) : storeError === "not_found" ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center mb-4">
            <IIcon width={48} height={48} color="#CCCCCC" />
          </View>
          <Typography variation="h3" className="mb-2 text-center text-slate-900">
            Store Not Found
          </Typography>
          <Typography variation="body-sm" className="text-center text-slate-600 mb-6">
            This store is no longer available.
          </Typography>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-brand-espresso px-6 py-3 rounded-full"
            activeOpacity={0.8}
          >
            <Typography variation="button" className="text-white">
              Go Back
            </Typography>
          </TouchableOpacity>
        </View>
      ) : storeError === "network_error" ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center mb-4">
            <WarningIcon width={36} height={36} color="#EF4444" />
          </View>
          <Typography variation="h3" className="mb-2 text-center text-slate-900">
            Something Went Wrong
          </Typography>
          <Typography variation="body-sm" className="text-center text-slate-600 mb-6">
            Could not load this store. Please check your connection and try again.
          </Typography>
          <TouchableOpacity
            onPress={handleRetryStore}
            className="bg-brand-espresso px-6 py-3 rounded-full"
            activeOpacity={0.8}
          >
            <Typography variation="button" className="text-white">
              Try Again
            </Typography>
          </TouchableOpacity>
        </View>
      ) : store ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B2F2F"
              progressBackgroundColor="#FFFFFF"
            />
          }
        >
          {/* Store Header */}
          <View className="bg-white px-6 py-8 border-b border-slate-100">
            <View className="items-center mb-6">
              {store.profile_image ? (
                <Image
                  source={{ uri: store.profile_image }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 3,
                    borderColor: "#E5E7EB",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="w-32 h-32 rounded-full items-center justify-center border-4"
                  style={{
                    backgroundColor: Colors.light.text,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Typography
                    variation="h1"
                    className="text-white"
                    style={{ fontSize: 48 }}
                  >
                    {store.name.charAt(0).toUpperCase()}
                  </Typography>
                </View>
              )}
            </View>

            <View className="items-center mb-6">
              <Typography variation="h2" className="text-center text-slate-900 mb-1">
                {store.name}
              </Typography>
              <Typography
                variation="body-sm"
                className="text-slate-500 text-center font-semibold"
              >
                @{store.store_username}
              </Typography>
            </View>

            <View className="flex-row items-center justify-center gap-8 mb-6 pb-6 border-b border-slate-100">
              <View className="items-center">
                <Typography variation="h2" className="text-slate-900 mb-1">
                  {products.length}
                </Typography>
                <Typography variation="caption" className="text-slate-600">
                  Products
                </Typography>
              </View>
              <View className="w-px h-10 bg-slate-200" />
              <View className="items-center">
                <Typography
                  variation="h2"
                  className="mb-1"
                  style={{ color: Colors.light.tint }}
                >
                  {store.currency || "PKR"}
                </Typography>
                <Typography variation="caption" className="text-slate-600">
                  Currency
                </Typography>
              </View>
            </View>

            {store.bio && (
              <View
                className="rounded-2xl p-4 mb-2"
                style={{
                  backgroundColor: Colors.light.background,
                  borderWidth: 1,
                  borderColor: Colors.light.tint + "20",
                }}
              >
                <Typography
                  variation="body-sm"
                  className="text-center text-slate-700"
                  style={{ lineHeight: 20 }}
                >
                  {store.bio}
                </Typography>
              </View>
            )}
          </View>

          {/* Products Section */}
          <View className="px-4 pt-6">
            <View className="flex-row items-center justify-between mb-4 px-2">
              <Typography variation="h3" className="text-slate-900">
                Products
              </Typography>
              {!productsLoading && (
                <Typography
                  variation="caption"
                  className="text-slate-600 font-semibold"
                >
                  {products.length} items
                </Typography>
              )}
            </View>

            {productsLoading ? (
              <ProductsGridSkeleton />
            ) : productsError ? (
              <View className="py-12 items-center px-8">
                <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-3">
                  <WarningIcon width={28} height={28} color="#EF4444" />
                </View>
                <Typography
                  variation="body-sm"
                  className="text-slate-600 text-center mb-4"
                >
                  {productsError}
                </Typography>
                <TouchableOpacity
                  onPress={() => fetchProducts(id!)}
                  className="bg-brand-espresso px-5 py-2.5 rounded-full"
                  activeOpacity={0.8}
                >
                  <Typography variation="button" className="text-white">
                    Try Again
                  </Typography>
                </TouchableOpacity>
              </View>
            ) : products.length === 0 ? (
              <View className="py-16 items-center px-8">
                <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                  <CubeIcon width={32} height={32} color="#CCCCCC" />
                </View>
                <Typography variation="h3" className="text-slate-900 mb-2 text-center">
                  No Products Yet
                </Typography>
                <Typography variation="body-sm" className="text-slate-600 text-center">
                  This store has not listed any products yet.
                </Typography>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <View style={{ width: "48%" }}>
                    <ProductCard
                      product={{
                        ...item,
                        store: {
                          id: store.id,
                          name: store.name,
                          store_username: store.store_username,
                          currency: store.currency,
                        },
                      }}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            )}
          </View>
        </ScrollView>
      ) : null}
    </ScreenLayout>
  );
}
