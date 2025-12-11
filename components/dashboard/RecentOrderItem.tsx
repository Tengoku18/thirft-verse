import {
  BodyMediumText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);

interface RecentOrderItemProps {
  order: {
    id: string;
    buyer_name: string;
    amount: number;
    status: string;
    created_at: string;
    product?: {
      id: string;
      title: string;
      cover_image: string;
    } | null;
  };
  onPress?: () => void;
}

const statusConfig: Record<
  string,
  { color: string; bgColor: string; icon: string }
> = {
  pending: {
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    icon: "clock.fill",
  },
  completed: {
    color: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.1)",
    icon: "checkmark.circle.fill",
  },
  cancelled: {
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    icon: "xmark.circle.fill",
  },
  refunded: {
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
    icon: "arrow.uturn.backward.circle.fill",
  },
};

export const RecentOrderItem: React.FC<RecentOrderItemProps> = ({
  order,
  onPress,
}) => {
  const config = statusConfig[order.status] || statusConfig.pending;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center py-3 px-4"
    >
      {/* Product Image */}
      <View
        className="w-12 h-12 rounded-xl overflow-hidden mr-3"
        style={{ backgroundColor: "#F3F4F6" }}
      >
        {order.product?.cover_image ? (
          <Image
            source={{ uri: getProductImageUrl(order.product.cover_image) }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="bag.fill" size={20} color="#9CA3AF" />
          </View>
        )}
      </View>

      {/* Order Info */}
      <View className="flex-1">
        <BodySemiboldText style={{ fontSize: 14 }} numberOfLines={1}>
          {order.product?.title || "Product"}
        </BodySemiboldText>
        <View className="flex-row items-center mt-1">
          <CaptionText style={{ color: "#6B7280" }}>
            {order.buyer_name}
          </CaptionText>
          <View
            className="w-1 h-1 rounded-full mx-2"
            style={{ backgroundColor: "#D1D5DB" }}
          />
          <CaptionText style={{ color: "#9CA3AF" }}>
            {dayjs(order.created_at).fromNow()}
          </CaptionText>
        </View>
      </View>

      {/* Amount & Status */}
      <View className="items-end">
        <BodySemiboldText style={{ fontSize: 14 }}>
          Rs. {order.amount.toLocaleString()}
        </BodySemiboldText>
        <View
          className="flex-row items-center px-2 py-0.5 rounded-full mt-1"
          style={{ backgroundColor: config.bgColor }}
        >
          <IconSymbol name={config.icon as any} size={10} color={config.color} />
          <BodyMediumText
            style={{ color: config.color, fontSize: 10, marginLeft: 3 }}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </BodyMediumText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
