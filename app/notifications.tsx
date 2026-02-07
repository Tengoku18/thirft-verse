import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationType } from "@/lib/types/database";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

const NOTIFICATION_ICON: Record<
  NotificationType,
  { name: string; color: string; bg: string }
> = {
  new_order: {
    name: "bag.fill",
    color: "#059669",
    bg: "#D1FAE5",
  },
  order_cancelled: {
    name: "xmark.circle.fill",
    color: "#DC2626",
    bg: "#FEE2E2",
  },
  order_refunded: {
    name: "arrow.uturn.left.circle.fill",
    color: "#7C3AED",
    bg: "#E9D5FF",
  },
};

const DEFAULT_ICON = {
  name: "bell.fill",
  color: "#6B7280",
  bg: "#F3F4F6",
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

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        className="flex-row px-4 py-4"
        style={{
          backgroundColor: isRead ? "#F3F4F6" : "#FFFFFF",
        }}
      >
        {/* Icon */}
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: iconConfig.bg }}
        >
          <IconSymbol
            name={iconConfig.name as any}
            size={20}
            color={iconConfig.color}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <BodySemiboldText
              style={{
                fontSize: 14,
                color: isRead ? "#6B7280" : "#1F2937",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {item.title}
            </BodySemiboldText>
            <CaptionText style={{ color: "#9CA3AF", fontSize: 11 }}>
              {timeAgo}
            </CaptionText>
          </View>
          <BodyRegularText
            style={{
              color: isRead ? "#9CA3AF" : "#6B7280",
              fontSize: 13,
              marginTop: 2,
            }}
            numberOfLines={2}
          >
            {item.body}
          </BodyRegularText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => (
    <View className="h-[1px] bg-[#F0F0F0]" />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="flex-1 items-center justify-center px-8 pt-20">
        <View className="w-20 h-20 rounded-full bg-[#F3F4F6] items-center justify-center mb-4">
          <IconSymbol name="bell.slash.fill" size={36} color="#D1D5DB" />
        </View>
        <HeadingBoldText style={{ marginBottom: 8, textAlign: "center" }}>
          No Notifications
        </HeadingBoldText>
        <BodyRegularText
          style={{ color: "#6B7280", textAlign: "center", lineHeight: 22 }}
        >
          You will see order updates and alerts here when they arrive.
        </BodyRegularText>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader
        title={unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications"}
        showBackButton
      />

      {loading && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading notifications...
          </BodyMediumText>
        </View>
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
    </View>
  );
}
