import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { ProductWithStore } from "@/lib/types/database";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";

interface ProductCardProps {
  product: ProductWithStore;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const currency = product.store?.currency || "NPR";
  const isOutOfStock = product.availability_count === 0;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Open product page in default browser
      const productUrl = `https://www.thriftverse.shop/product/${product.id}`;
      Linking.openURL(productUrl);
    }
  };

  const imageUrl = product.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, isOutOfStock && styles.cardOutOfStock]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, isOutOfStock && styles.imageOutOfStock]}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <IconSymbol name="photo" size={40} color="#D1D5DB" />
          </View>
        )}
        {isOutOfStock && (
          <View style={styles.soldOutOverlay}>
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>Sold Out</Text>
            </View>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, isOutOfStock && styles.titleOutOfStock]} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.price, isOutOfStock && styles.priceOutOfStock]}>
            {currency} {product.price.toLocaleString()}
          </Text>
          <View style={styles.arrowButton}>
            <IconSymbol name="arrow.up.right" size={16} color={isOutOfStock ? "#9CA3AF" : "#3B2F2F"} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#1A1A1A",
    marginBottom: 6,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 15,
    fontFamily: "NunitoSans_700Bold",
    color: "#DC2626",
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardOutOfStock: {
    opacity: 0.75,
  },
  imageOutOfStock: {
    opacity: 0.5,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  soldOutBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  soldOutText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "NunitoSans_700Bold",
    letterSpacing: 0.5,
  },
  titleOutOfStock: {
    color: "#9CA3AF",
  },
  priceOutOfStock: {
    color: "#9CA3AF",
  },
});
