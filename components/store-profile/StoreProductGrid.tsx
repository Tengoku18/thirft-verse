import { CubeIcon } from "@/components/icons";
import ProductCard from "@/components/molecules/ProductCard";
import { Typography } from "@/components/ui/Typography";
import { Product } from "@/lib/types/database";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

interface StoreProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function StoreProductGrid({
  products,
  emptyMessage = "No products yet",
}: StoreProductGridProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <View className="py-16 items-center">
        <CubeIcon width={48} height={48} color="#D1D5DB" />
        <Typography
          variation="body"
          className="text-ui-secondary font-sans-semibold mt-3"
        >
          {emptyMessage}
        </Typography>
      </View>
    );
  }

  const paddedProducts: (Product | { __placeholder: true })[] =
    products.length % 2 === 1
      ? [...products, { __placeholder: true }]
      : products;

  return (
    <FlatList
      data={paddedProducts}
      keyExtractor={(item, index) =>
        "__placeholder" in item ? `placeholder-${index}` : item.id
      }
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => {
        if ("__placeholder" in item) {
          return <View style={{ flex: 1 }} />;
        }
        return (
          <View style={{ flex: 1 }}>
            <ProductCard
              product={{ ...item, store: null }}
              variant="grid"
              aspectRatio={1}
              onPress={() => router.push(`/product/${item.id}` as any)}
            />
          </View>
        );
      }}
    />
  );
}
