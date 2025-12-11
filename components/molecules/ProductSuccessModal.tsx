import {
  BodyRegularText,
  BodySemiboldText,
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
  onShare: () => void;
  onViewProduct: () => void;
  onClose: () => void;
}

export const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({
  visible,
  product,
  onShare,
  onViewProduct,
  onClose,
}) => {
  const handleShare = async () => {
    if (!product) return;

    try {
      const productUrl = `https://thriftverse.app/product/${product.id}`;
      await Share.share({
        message: `Check out "${product.title}" on Thriftverse!\n\n${productUrl}`,
        url: productUrl,
        title: product.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

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

            <HeadingBoldText className="text-center mb-2" style={{ fontSize: 20 }}>
              Product Listed!
            </HeadingBoldText>

            {product && (
              <View className="items-center mb-4">
                <BodySemiboldText className="text-center" style={{ color: "#3B2F2F" }}>
                  {product.title}
                </BodySemiboldText>
                <BodyRegularText style={{ color: "#6B7280", marginTop: 4 }}>
                  NPR {product.price.toLocaleString()}
                </BodyRegularText>
              </View>
            )}

            <BodyRegularText className="text-center mb-6" style={{ color: "#6B7280" }}>
              Your product has been listed successfully and is now visible to buyers.
            </BodyRegularText>

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
                <IconSymbol name="square.and.arrow.up" size={18} color="#FFFFFF" />
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
