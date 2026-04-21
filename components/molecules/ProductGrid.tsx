import { BodyBoldText, CaptionText } from "@/components/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { Product } from "@/lib/types/database";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductGridProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
  numColumns?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 1; // Minimal space between items (Instagram style)
const MAX_SINGLE_ITEM_SIZE = 320; // Max size for single column layout

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  numColumns = 3,
}) => {
  // Calculate item size to fit exactly columns with minimal spacing (Instagram style)
  // For single column, cap the size to MAX_SINGLE_ITEM_SIZE
  let itemSize = (SCREEN_WIDTH - SPACING * (numColumns - 1)) / numColumns;
  if (numColumns === 1 && itemSize > MAX_SINGLE_ITEM_SIZE) {
    itemSize = MAX_SINGLE_ITEM_SIZE;
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => onProductPress?.(item)}
      style={{
        width: itemSize,
        height: itemSize,
        position: "relative",
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getProductImageUrl(item.cover_image) }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />

      {/* Sold overlay - Semi-transparent with checkmark */}
      {item.status === "out_of_stock" && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(59, 47, 47, 0.75)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <BodyBoldText style={{ fontSize: 24 }}>✓</BodyBoldText>
          </View>
          <CaptionText
            style={{
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Sold
          </CaptionText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      scrollEnabled={false}
      contentContainerStyle={{
        paddingHorizontal: 0,
        ...(numColumns === 1 && { alignItems: "center" }),
      }}
      columnWrapperStyle={{
        gap: SPACING,
        marginBottom: SPACING,
        ...(numColumns === 1 && { justifyContent: "center" }),
      }}
    />
  );
};
