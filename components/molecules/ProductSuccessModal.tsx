import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  Share,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductSuccessModalProps {
  visible: boolean;
  product: {
    id: string;
    title: string;
    price: number;
    cover_image: string;
  } | null;
  storeUsername?: string;
  onShare: () => void;
  onViewProduct: () => void;
  onClose: () => void;
}

export const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({
  visible,
  product,
  storeUsername,
  onShare,
  onViewProduct,
  onClose,
}) => {
  const handleShare = async () => {
    if (!product) return;

    try {
      const productUrl = storeUsername
        ? `https://${storeUsername}.thriftverse.shop/product/${product.id}`
        : `https://thriftverse.shop/product/${product.id}`;
      await Share.share({
        message: `Check out "${product.title}" on Thriftverse!\n\n${productUrl}`,
        title: product.title,
      });
      onShare();
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const displayStoreDomain = storeUsername
    ? `${storeUsername}.thriftverse.com`
    : "your-store.thriftverse.com";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Product Image */}
          {product && (
            <Image
              source={{ uri: product.cover_image }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          )}

          {/* Content */}
          <View className="p-6">
            {/* Success Icon */}
            <View className="items-center mb-4">
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#10B981",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -52,
                  borderWidth: 4,
                  borderColor: "#FFFFFF",
                }}
              >
                <IconSymbol name="checkmark" size={28} color="#FFFFFF" />
              </View>
            </View>

            <HeadingBoldText
              className="text-center mb-2"
              style={{ fontSize: 20 }}
            >
              Product Listed!
            </HeadingBoldText>

            {product && (
              <View className="items-center mb-4">
                <BodySemiboldText
                  className="text-center"
                  style={{ color: "#3B2F2F" }}
                >
                  {product.title}
                </BodySemiboldText>
                <BodyRegularText style={{ color: "#6B7280", marginTop: 4 }}>
                  NPR {product.price.toLocaleString()}
                </BodyRegularText>
              </View>
            )}

            <View
              style={{
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                overflow: "hidden",
                marginTop: 8,
                marginBottom: 20,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: 12,
                  backgroundColor: "#F8FAFC",
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#DBEAFE",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 1,
                  }}
                >
                  <IconSymbol name="storefront" size={12} color="#1D4ED8" />
                </View>
                <View style={{ flex: 1 }}>
                  <CaptionText style={{ color: "#475569", lineHeight: 18 }}>
                    The product will be visible on your store (
                    {displayStoreDomain}) immediately.
                  </CaptionText>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: 12,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#F1F5F9",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 1,
                  }}
                >
                  <IconSymbol name="clock" size={12} color="#475569" />
                </View>
                <View style={{ flex: 1 }}>
                  <CaptionText style={{ color: "#475569", lineHeight: 18 }}>
                    It will appear on the main marketplace (thriftverse.com)
                    after it is verified by our team.
                  </CaptionText>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Share Button */}
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#3B2F2F",
                  paddingVertical: 14,
                  borderRadius: 12,
                  gap: 8,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol
                  name="square.and.arrow.up"
                  size={18}
                  color="#FFFFFF"
                />
                <BodySemiboldText style={{ color: "#FFFFFF" }}>
                  Share Product
                </BodySemiboldText>
              </TouchableOpacity>

              {/* View Product Button */}
              <TouchableOpacity
                onPress={onViewProduct}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F3F4F6",
                  paddingVertical: 14,
                  borderRadius: 12,
                  gap: 8,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol name="eye" size={18} color="#3B2F2F" />
                <BodySemiboldText style={{ color: "#3B2F2F" }}>
                  View Product
                </BodySemiboldText>
              </TouchableOpacity>

              {/* Done Button */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                }}
                activeOpacity={0.7}
              >
                <BodyRegularText style={{ color: "#6B7280" }}>
                  Done
                </BodyRegularText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
