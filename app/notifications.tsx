import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import {
  BagIcon,
  BellFillIcon,
  BellSlashFillIcon,
  RefundIcon,
  XCircleFillIcon,
} from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationType } from "@/lib/types/database";
import { fetchNotifications, fetchUnreadCount, markAsRead } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);

const NOTIFICATION_ICON: Record<
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
};

const DEFAULT_ICON = {
  color: "#6B7280",
  bg: "#F3F4F6",
  icon: <BellFillIcon width={20} height={20} color="#6B7280" />,
};

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );
  const [refreshing, setRefreshing] = useState(false);

  // Fetch on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      dispatch(fetchUnreadCount(user.id));
    }
  }, [user?.id, dispatch]);

  // Poll every 15 seconds while screen is active
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => {
      dispatch(fetchNotifications(user.id));
      dispatch(fetchUnreadCount(user.id));
    }, 15000);
    return () => clearInterval(interval);
  }, [user?.id, dispatch]);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchNotifications(user.id)),
      dispatch(fetchUnreadCount(user.id)),
    ]);
    setRefreshing(false);
  }, [user?.id, dispatch]);

  const handleNotificationPress = (notification: {
    id: string;
    is_read: boolean;
    data: Record<string, string>;
  }) => {
    // Mark as read if unread
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }

    // Navigate to order detail if order_id exists
    if (notification.data?.order_id) {
      router.push(`/order/${notification.data.order_id}` as never);
    }
  };

  const renderNotification = ({
    item,
  }: {
    item: (typeof notifications)[0];
  }) => {
    const iconConfig =
      NOTIFICATION_ICON[item.type as NotificationType] || DEFAULT_ICON;
    const timeAgo = dayjs(item.created_at).fromNow();

    const isRead = item.is_read;

    const amount = item.data?.amount
      ? `Rs.${Number(item.data.amount).toLocaleString()}`
      : null;

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        className="flex-row px-4 py-4"
        style={{
          backgroundColor: isRead ? "#FFFFFF" : "#FEFCE8",
        }}
      >
        {/* Icon with unread dot */}
        <View className="relative">
          <View
            className="w-11 h-11 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: iconConfig.bg }}
          >
            {iconConfig.icon}
          </View>
          {!isRead && (
            <View
              className="absolute top-0 right-2 w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: "#3B82F6",
                borderWidth: 1.5,
                borderColor: "#FEFCE8",
              }}
            />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Typography
              variation="body-sm"
              style={{
                color: isRead ? "#6B7280" : "#1F2937",
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
              color: isRead ? "#9CA3AF" : "#6B7280",
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
                style={{ backgroundColor: isRead ? "#F3F4F6" : "#FEF3C7" }}
              >
                <Typography
                  variation="caption"
                  style={{
                    color: isRead ? "#6B7280" : "#92400E",
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
    );
  };

  const renderSeparator = () => <View className="h-[1px] bg-[#F0F0F0]" />;

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="flex-1 items-center justify-center px-8 pt-20">
        <View className="w-20 h-20 rounded-full bg-[#F3F4F6] items-center justify-center mb-4">
          <BellSlashFillIcon width={36} height={36} color="#D1D5DB" />
        </View>
        <Typography
          variation="h3"
          className="text-center"
          style={{ marginBottom: 8, color: "#1F2937" }}
        >
          No Notifications
        </Typography>
        <Typography
          variation="body-sm"
          style={{ color: "#6B7280", textAlign: "center", lineHeight: 22 }}
        >
          You will see order updates and alerts here when they arrive.
        </Typography>
      </View>
    );
  };

  return (
    <ScreenLayout
      title={
        unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications"
      }
      scrollable={false}
      backgroundColor={Colors.light.background}
      contentBackgroundColor={Colors.light.background}
    >
      {loading && notifications.length === 0 ? (
        <FullScreenLoader message="Loading notifications..." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            notifications.length === 0 ? { flex: 1 } : { paddingBottom: 40 }
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B2F2F"
            />
          }
        />
      )}
    </ScreenLayout>
  );
}
