import { AddPhotoIcon, ArrowUpRightIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { ProductWithStore } from "@/lib/types/database";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: ProductWithStore;
  variant?: "elevated" | "grid";
  aspectRatio?: number;
  onPress?: () => void;
}

export default function ProductCard({
  product,
  variant = "grid",
  aspectRatio = 4 / 5,
  onPress,
}: ProductCardProps) {
  const router = useRouter();
  const imageUrl = product.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;
  const isSoldOut = product.availability_count === 0;
  const currency = product.store?.currency ?? "NPR";
  const storeHandle = product.store?.store_username;

  const handlePress = () => {
    if (onPress) return onPress();
    router.push(`/product/${product.id}` as any);
  };

  if (variant === "elevated") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={{
          opacity: isSoldOut ? 0.75 : 1,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
          marginBottom: 12,
        }}
      >
        {/* Image */}
        <View
          className="w-full overflow-hidden rounded-t-2xl"
          style={{ height: 180, opacity: isSoldOut ? 0.5 : 1 }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <AddPhotoIcon width={40} height={40} color="#D1D5DB" />
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

        {/* Info */}
        <View className="px-3 py-3">
          <Typography
            variation="body-sm"
            numberOfLines={1}
            style={{
              color: isSoldOut ? "#9CA3AF" : "#1A1A1A",
              fontWeight: "600",
              marginBottom: 6,
            }}
          >
            {product.title}
          </Typography>
          <View className="flex-row justify-between items-center">
            <Typography
              variation="body"
              style={{
                color: isSoldOut ? "#9CA3AF" : "#DC2626",
                fontWeight: "700",
              }}
            >
              {currency} {product.price.toLocaleString()}
            </Typography>
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <ArrowUpRightIcon
                width={16}
                height={16}
                color={isSoldOut ? "#9CA3AF" : "#3B2F2F"}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // grid variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="flex-1"
    >
      {/* Image */}
      <View
        className="overflow-hidden rounded-2xl bg-[#eeecec]"
        style={{ aspectRatio }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <AddPhotoIcon width={36} height={36} color="#C4C4C4" />
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

      {/* Info */}
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
            @{storeHandle}
          </Typography>
        )}
        <Typography
          variation="body"
          numberOfLines={1}
          style={{ color: "#3B2F2F", fontWeight: "800", marginTop: 2 }}
        >
          {currency} {product.price.toLocaleString()}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
