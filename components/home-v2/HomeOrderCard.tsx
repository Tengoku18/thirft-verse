import BagIcon from "@/components/icons/BagIcon";
import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);

interface HomeOrderCardProps {
  order: {
    id: string;
    short_id?: string;
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

const statusStyles: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Processing", bg: "#FEF3C7", text: "#B45309" },
  processing: { label: "Processing", bg: "#FEF3C7", text: "#B45309" },
  shipped: { label: "Shipped", bg: "#D1FAE5", text: "#047857" },
  completed: { label: "Delivered", bg: "#E2E8F0", text: "#475569" },
  delivered: { label: "Delivered", bg: "#E2E8F0", text: "#475569" },
  cancelled: { label: "Cancelled", bg: "#FEE2E2", text: "#B91C1C" },
};

export const HomeOrderCard: React.FC<HomeOrderCardProps> = ({
  order,
  onPress,
}) => {
  const config = statusStyles[order.status] || statusStyles.pending;
  const shortId =
    order.short_id || `TV-${order.id.slice(0, 4).toUpperCase()}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white p-4 rounded-2xl flex-row items-center"
      style={{
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.05)",
        gap: 14,
      }}
    >
      <View
        className="w-14 h-14 rounded-xl overflow-hidden items-center justify-center"
        style={{ backgroundColor: "rgba(59,47,47,0.05)" }}
      >
        {order.product?.cover_image ? (
          <Image
            source={{ uri: getProductImageUrl(order.product.cover_image) }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <BagIcon width={22} height={22} />
        )}
      </View>

      <View className="flex-1 min-w-0">
        <Typography
          variation="label"
          numberOfLines={1}
          style={{ fontSize: 14, fontWeight: "700", color: "#3B2F2F" }}
        >
          {order.product?.title || "Product"}
        </Typography>
        <Typography
          variation="caption"
          style={{ color: "rgba(59,47,47,0.6)", fontSize: 12, marginTop: 2 }}
        >
          #{shortId} • {dayjs(order.created_at).fromNow(true)} ago
        </Typography>
      </View>

      <View className="items-end" style={{ gap: 4 }}>
        <Typography
          variation="label"
          style={{ fontSize: 14, fontWeight: "700", color: "#3B2F2F" }}
        >
          Rs. {order.amount.toLocaleString()}
        </Typography>
        <View
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: config.bg }}
        >
          <Typography
            variation="caption"
            style={{
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
              color: config.text,
              textTransform: "uppercase",
            }}
          >
            {config.label}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};
