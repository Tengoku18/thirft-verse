import { fetchNotifications, fetchUnreadCount } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

// Renders nothing — subscribes to Supabase Realtime so the unread badge
// updates instantly when a notification is inserted, without relying on push.
export function NotificationSync() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          dispatch(fetchUnreadCount(userId));
          dispatch(fetchNotifications(userId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, dispatch]);

  return null;
}
