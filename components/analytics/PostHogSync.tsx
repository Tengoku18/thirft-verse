import { useAppSelector } from '@/store/hooks';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

/**
 * Syncs the authenticated Supabase user into PostHog so that feature flags
 * and analytics events are scoped to the correct user identity.
 * Must be rendered inside both <Provider> (Redux) and <PostHogProvider>.
 */
export function PostHogSync() {
  const posthog = usePostHog();
  const user = useAppSelector((s) => s.auth.user);
  const profile = useAppSelector((s) => s.profile.profile);

  useEffect(() => {
    if (!user) {
      posthog.reset();
      return;
    }

    posthog.identify(user.id, {
      email: user.email,
      name: profile?.name,
      store_username: profile?.store_username,
      role: profile?.role,
      plan: profile?.plan,
    });
  }, [user?.id, profile?.id]);

  return null;
}
