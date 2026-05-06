import {
  BagIcon,
  BellFillIcon,
  CheckmarkSealFillIcon,
  RefundIcon,
  WarningFillIcon,
  XCircleFillIcon,
  TrashIcon,
} from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { AppNotification, NotificationType } from "@/lib/types/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

dayjs.extend(relativeTime);

const ICON_MAP: Record<
  NotificationType,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  new_order: {
    color: "#059669",
    bg: "#D1FAE5",
    icon: <BagIcon width={20} height={20} color="#059669" />,
  },
  order_cancelled: {
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: <XCircleFillIcon width={20} height={20} color="#DC2626" />,
  },
  order_refunded: {
    color: "#7C3AED",
    bg: "#E9D5FF",
    icon: <RefundIcon width={20} height={20} color="#7C3AED" />,
  },
  product_approved: {
    color: "#065F46",
    bg: "#D1FAE5",
    icon: <CheckmarkSealFillIcon width={20} height={20} color="#065F46" />,
  },
  product_rejected: {
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: <WarningFillIcon width={20} height={20} color="#DC2626" />,
  },
  product_comment_added: {
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: <BellFillIcon width={20} height={20} color="#6B7280" />,
  },
};

const DEFAULT_ICON = {
  color: "#6B7280",
  bg: "#F3F4F6",
  icon: <BellFillIcon width={20} height={20} color="#6B7280" />,
};

interface Props {
  item: AppNotification;
  onPress: (item: AppNotification) => void;
  onDelete: (id: string) => void;
  onLongPress: (item: AppNotification) => void;
  onSwipeOpen: (ref: Swipeable) => void;
}

export function NotificationItem({
  item,
  onPress,
  onDelete,
  onLongPress,
  onSwipeOpen,
}: Props) {
  const swipeableRef = useRef<Swipeable>(null);
  const iconConfig = ICON_MAP[item.type as NotificationType] ?? DEFAULT_ICON;
  const timeAgo = dayjs(item.created_at).fromNow();
  const amount = item.data?.amount
    ? `Rs.${Number(item.data.amount).toLocaleString()}`
    : null;

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(item.id);
  };

  const renderDeleteAction = (
    _progress: Animated.AnimatedInterpolation<number>,
    drag: Animated.AnimatedInterpolation<number>,
  ) => {
    const translateX = drag.interpolate({
      inputRange: [-96, 0],
      outputRange: [0, 96],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={{ transform: [{ translateX }] }}>
        <TouchableOpacity
          onPress={handleDelete}
          activeOpacity={0.85}
          className="w-28 h-full items-center justify-center gap-1"
          style={{ backgroundColor: "#DC2626" }}
        >
          <TrashIcon width={20} height={20} color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>
            Delete
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderDeleteAction}
      rightThreshold={80}
      friction={2}
      overshootRight={false}
      onSwipeableOpen={() => {
        if (swipeableRef.current) onSwipeOpen(swipeableRef.current);
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (swipeableRef.current) swipeableRef.current.close();
          onPress(item);
        }}
        onLongPress={() => onLongPress(item)}
        delayLongPress={400}
        activeOpacity={0.7}
        className="flex-row px-4 py-4"
        style={{ backgroundColor: item.is_read ? "#FFFFFF" : "#FEFCE8" }}
      >
        {/* Icon bubble + unread dot */}
        <View className="relative mr-3">
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: iconConfig.bg }}
          >
            {iconConfig.icon}
          </View>
          {!item.is_read && (
            <View
              className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: "#3B82F6",
                borderWidth: 1.5,
                borderColor: "#FEFCE8",
              }}
            />
          )}
        </View>

        {/* Text content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Typography
              variation="body-sm"
              style={{
                color: item.is_read ? "#6B7280" : "#1F2937",
                flex: 1,
                marginRight: 8,
                fontWeight: "600",
              }}
              numberOfLines={2}
            >
              {item.title}
            </Typography>
            <Typography
              variation="caption"
              style={{ color: "#9CA3AF", fontSize: 11 }}
            >
              {timeAgo}
            </Typography>
          </View>

          <Typography
            variation="body-sm"
            style={{
              color: item.is_read ? "#9CA3AF" : "#6B7280",
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {item.body}
          </Typography>

          {amount && (
            <View className="flex-row mt-2">
              <View
                className="px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: item.is_read ? "#F3F4F6" : "#FEF3C7",
                }}
              >
                <Typography
                  variation="caption"
                  style={{
                    color: item.is_read ? "#6B7280" : "#92400E",
                    fontWeight: "700",
                  }}
                >
                  {amount}
                </Typography>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
