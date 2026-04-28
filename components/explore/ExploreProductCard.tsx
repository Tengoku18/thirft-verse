import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { ProductWithStore } from "@/lib/types/database";
import * as Linking from "expo-linking";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface Props {
  product: ProductWithStore;
  onPress?: () => void;
}

export function ExploreProductCard({ product, onPress }: Props) {
  const imageUrl = product.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;
  const currency = product.store?.currency || "NPR";
  const storeHandle = product.store?.store_username
    ? `@${product.store.store_username}`
    : null;
  const isSoldOut = product.availability_count === 0;

  const handlePress = () => {
    if (onPress) return onPress();
    Linking.openURL(`https://www.thriftverse.shop/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="flex-1"
    >
      {/* Image container — 4:5 ratio matching reference */}
      <View
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          aspectRatio: 4 / 5,
          backgroundColor: "#eeecec",
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="photo" size={36} color="#C4C4C4" />
          </View>
        )}

        {isSoldOut && (
          <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-red-600 px-3 py-1 rounded-md">
              <Typography
                variation="caption"
                style={{ color: "#FFFFFF", fontWeight: "700" }}
              >
                Sold Out
              </Typography>
            </View>
          </View>
        )}
      </View>

      {/* Product info */}
      <View className="pt-2 px-0.5">
        <Typography
          variation="body-sm"
          numberOfLines={1}
          style={{ color: "#3B2F2F", fontWeight: "700" }}
        >
          {product.title}
        </Typography>
        {storeHandle && (
          <Typography
            variation="body-xs"
            style={{ color: "#D4A373", fontWeight: "600" }}
          >
            {storeHandle}
          </Typography>
        )}
        <Typography
          variation="body"
          numberOfLines={1}
          style={{ color: "#3B2F2F", fontWeight: "800", marginTop: 2 }}
        >
          {currency}{" "}
          {typeof product.price === "number"
            ? product.price.toLocaleString()
            : String(product.price)}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
