import ShippingBoxIcon from "@/components/icons/ShippingBoxIcon";
import ProductCard from "@/components/molecules/ProductCard";
import { ProductCardGridSkeleton } from "@/components/molecules/ProductCardSkeleton";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts } from "@/lib/api-helpers";
import { filterProductsByAvailability, filterProductsByVerification } from "@/lib/explore-helpers";
import { ProductWithStore } from "@/lib/types/database";
import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

const PREVIEW_COUNT = 4;

export const HomeBrowseSection: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const result = await getAllAvailableProducts();
      const ownFiltered = user
        ? result.data.filter((p) => p.store_id !== user.id)
        : result.data;
      const verified = filterProductsByVerification(ownFiltered, true);
      const inStock = filterProductsByAvailability(verified, true);
      setProducts(inStock.slice(0, PREVIEW_COUNT));
    } catch {
      // silent fail — section simply won't show products
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    router.push("/explore" as never);
  };

  const isEmpty = !loading && products.length === 0;

  return (
    <View className="mx-5 mt-5 mb-2">
      <View className="flex-row items-center justify-between mb-3">
        <Typography variation="h4" style={{ fontSize: 17, color: "#3B2F2F" }}>
          Browse Marketplace
        </Typography>
        {!isEmpty && (
          <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
            <Typography
              variation="body-sm"
              style={{ color: "#D4A373", fontSize: 14, fontWeight: "600" }}
            >
              View All
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {isEmpty ? (
        <View
          style={{
            alignItems: "center",
            paddingVertical: 36,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(59,47,47,0.08)",
            borderStyle: "dashed",
            backgroundColor: "rgba(59,47,47,0.02)",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(212,163,115,0.12)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <ShippingBoxIcon width={30} height={30} color="#D4A373" />
          </View>
          <Typography
            variation="h4"
            style={{ fontSize: 16, color: "#3B2F2F", marginBottom: 6 }}
          >
            No products yet
          </Typography>
          <Typography
            variation="body-sm"
            style={{ color: "rgba(59,47,47,0.5)", fontSize: 13, textAlign: "center", paddingHorizontal: 24 }}
          >
            Verified products from other sellers will show up here.
          </Typography>
          <TouchableOpacity
            onPress={handleViewAll}
            activeOpacity={0.8}
            style={{
              marginTop: 20,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: "#3B2F2F",
            }}
          >
            <Typography variation="label" style={{ color: "#FFFFFF", fontSize: 13 }}>
              Browse Explore
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {loading ? (
            <ProductCardGridSkeleton count={4} variant="elevated" gap={12} />
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {products.map((product) => (
                <View key={product.id} style={{ width: "47%" }}>
                  <ProductCard
                    product={product}
                    variant="elevated"
                    onPress={() => router.push(`/product/${product.id}` as any)}
                  />
                </View>
              ))}
            </View>
          )}

          {!loading && (
            <TouchableOpacity
              onPress={handleViewAll}
              activeOpacity={0.85}
              className="mt-4 py-3 rounded-xl items-center"
              style={{
                backgroundColor: "rgba(59,47,47,0.06)",
                borderWidth: 1,
                borderColor: "rgba(59,47,47,0.08)",
              }}
            >
              <Typography
                variation="label"
                style={{ color: "#3B2F2F", fontSize: 14 }}
              >
                Explore All Products
              </Typography>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};
