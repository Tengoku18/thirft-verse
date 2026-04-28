import ProductCard from "@/components/molecules/ProductCard";
import { ProductCardSkeleton } from "@/components/molecules/ProductCardSkeleton";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getAllAvailableProducts } from "@/lib/api-helpers";
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
      const filtered = user
        ? result.data.filter((p) => p.store_id !== user.id)
        : result.data;
      setProducts(filtered.slice(0, PREVIEW_COUNT));
    } catch {
      // silent fail — section simply won't show products
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    router.push("/explore" as never);
  };

  if (!loading && products.length === 0) return null;

  return (
    <View className="mx-5 mt-5 mb-2">
      <View className="flex-row items-center justify-between mb-3">
        <Typography variation="h4" style={{ fontSize: 17, color: "#3B2F2F" }}>
          Browse Marketplace
        </Typography>
        <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
          <Typography
            variation="body-sm"
            style={{ color: "#D4A373", fontSize: 14, fontWeight: "600" }}
          >
            View All
          </Typography>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {loading
          ? [0, 1, 2, 3].map((i) => (
              <View key={i} style={{ width: "47%" }}>
                <ProductCardSkeleton />
              </View>
            ))
          : products.map((product) => (
              <View key={product.id} style={{ width: "47%" }}>
                <ProductCard product={product} />
              </View>
            ))}
      </View>

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
    </View>
  );
};
