import { FullScreenLoader } from '@/components/atoms/FullScreenLoader';
import { BellSlashFillIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/layouts';
import { NotificationActionSheet } from '@/components/notifications/NotificationActionSheet';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { AppNotification } from '@/lib/types/database';
import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAsUnread,
} from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const openSwipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      dispatch(fetchUnreadCount(user.id));
    }
  }, [user?.id, dispatch]);

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

  const handlePress = useCallback(
    (item: AppNotification) => {
      if (openSwipeableRef.current) {
        openSwipeableRef.current.close();
        openSwipeableRef.current = null;
        return;
      }
      if (!item.is_read) dispatch(markAsRead(item.id));
      if (item.data?.href) router.push(item.data.href as never);
      else if (item.data?.order_id) router.push(`/order/${item.data.order_id}` as never);
      else if (item.data?.product_id) router.push(`/product/${item.data.product_id}` as never);
    },
    [dispatch, router],
  );

  const handleLongPress = useCallback((item: AppNotification) => {
    setSelectedNotification(item);
    setShowActionSheet(true);
  }, []);

  const handleToggleRead = useCallback(() => {
    if (!selectedNotification) return;
    if (selectedNotification.is_read) {
      dispatch(markAsUnread(selectedNotification.id));
    } else {
      dispatch(markAsRead(selectedNotification.id));
    }
  }, [selectedNotification, dispatch]);

  const handleDelete = useCallback(() => {
    if (!selectedNotification) return;
    dispatch(deleteNotification(selectedNotification.id));
  }, [selectedNotification, dispatch]);

  const handleReport = useCallback(() => {
    router.push('/settings/report-issue' as never);
  }, [router]);

  const handleSwipeOpen = useCallback((ref: Swipeable) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== ref) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = ref;
  }, []);

  const handleSwipeDelete = useCallback(
    (id: string) => dispatch(deleteNotification(id)),
    [dispatch],
  );

  const renderItem = ({ item }: { item: AppNotification }) => (
    <NotificationItem
      item={item}
      onPress={handlePress}
      onDelete={handleSwipeDelete}
      onLongPress={handleLongPress}
      onSwipeOpen={handleSwipeOpen}
    />
  );

  const renderSeparator = () => <View className="h-[1px] bg-[#F0F0F0]" />;

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="flex-1 items-center justify-center px-8 pt-20">
        <View className="w-20 h-20 rounded-full bg-[#F3F4F6] items-center justify-center mb-4">
          <BellSlashFillIcon width={36} height={36} color="#D1D5DB" />
        </View>
        <Typography variation="h3" className="text-center mb-2" style={{ color: '#1F2937' }}>
          No Notifications
        </Typography>
        <Typography
          variation="body-sm"
          style={{ color: '#6B7280', textAlign: 'center', lineHeight: 22 }}
        >
          You will see order updates and alerts here when they arrive.
        </Typography>
      </View>
    );
  };

  return (
    <ScreenLayout
      title={unreadCount > 0 ? `Notifications (${unreadCount})` : 'Notifications'}
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
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            notifications.length === 0 ? { flex: 1 } : { paddingBottom: 40 }
          }
          onScrollBeginDrag={() => openSwipeableRef.current?.close()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B2F2F" />
          }
        />
      )}

      <NotificationActionSheet
        item={selectedNotification}
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        onToggleRead={handleToggleRead}
        onDelete={handleDelete}
        onReport={handleReport}
      />
    </ScreenLayout>
  );
}
