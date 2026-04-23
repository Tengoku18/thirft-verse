import {
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface OrderItemCardProps {
  title: string;
  image: string | null;
  category: string;
  price: number;
  quantity: number;
  isLast?: boolean;
  onPress?: () => void;
}

export function OrderItemCard({
  title,
  image,
  category,
  price,
  quantity,
  isLast = false,
  onPress,
}: OrderItemCardProps) {
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      {/* Product image */}
      {image ? (
        <Image
          source={{ uri: getProductImageUrl(image) }}
          style={{
            width: 76,
            height: 76,
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 12,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol name="bag.fill" size={28} color="#D1D5DB" />
        </View>
      )}

      {/* Details */}
      <View style={{ flex: 1, justifyContent: "space-between", height: 76 }}>
        <View>
          <BodySemiboldText style={{ fontSize: 14, color: "#3B2F2F" }} numberOfLines={2}>
            {title}
          </BodySemiboldText>
          {category ? (
            <CaptionText style={{ color: "rgba(59,48,48,0.5)", fontSize: 12, marginTop: 3 }}>
              {category}
            </CaptionText>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <BodySemiboldText style={{ fontSize: 16, color: "#D4A373" }}>
            Rs. {price.toLocaleString()}
          </BodySemiboldText>
          <CaptionText style={{ color: "rgba(59,48,48,0.4)", fontSize: 12 }}>
            Qty: {quantity}
          </CaptionText>
        </View>
      </View>

      {onPress && (
        <IconSymbol name="chevron.right" size={13} color="#D4CEBE" />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
