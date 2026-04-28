import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { Product } from "@/lib/types/database";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

interface ProductItemProps {
  product: Product;
}

function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();
  const imageUri = product.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;
  const isSoldOut = product.availability_count === 0;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/product/${product.id}` as any)}
      activeOpacity={0.85}
      style={{ width: "50%" }}
      className="p-1.5"
    >
      {/* Image container */}
      <View className="rounded-[18px] overflow-hidden bg-primary/5 aspect-square">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="photo" size={32} color="#D1D5DB" />
          </View>
        )}

        {/* Heart button */}
        {/* <TouchableOpacity
          activeOpacity={0.8}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 items-center justify-center"
        >
          <IconSymbol name="heart" size={16} color="#3B3030" />
        </TouchableOpacity> */}

        {/* Sold out overlay */}
        {isSoldOut && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-status-error px-2.5 py-1 rounded-md">
              <Typography
                variation="caption"
                className="text-white font-sans-bold tracking-wide"
              >
                Sold Out
              </Typography>
            </View>
          </View>
        )}
      </View>

      {/* Info */}
      <View className="px-0.5 pt-2">
        <Typography
          variation="body-sm"
          numberOfLines={1}
          className="text-brand-espresso font-sans-medium"
        >
          {product.title}
        </Typography>
        <Typography
          variation="body"
          className="text-brand-espresso font-sans-bold mt-0.5"
        >
          NPR {product.price.toLocaleString()}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

interface StoreProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function StoreProductGrid({
  products,
  emptyMessage = "No products yet",
}: StoreProductGridProps) {
  if (products.length === 0) {
    return (
      <View className="py-16 items-center">
        <IconSymbol name="cube" size={48} color="#D1D5DB" />
        <Typography
          variation="body"
          className="text-ui-secondary font-sans-semibold mt-3"
        >
          {emptyMessage}
        </Typography>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => <ProductItem product={item} />}
    />
  );
}
