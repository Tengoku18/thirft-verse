import { usePostHog } from 'posthog-react-native';

// Central registry of all PostHog feature flag keys.
// Add new flags here before creating them in the PostHog dashboard.
export const FeatureFlags = {
  FOUNDER_CIRCLE: 'founder-circle',
  REFERRAL_CODE: 'referral-code',
} as const;

export type FeatureFlagKey = (typeof FeatureFlags)[keyof typeof FeatureFlags];

/** Returns true if the flag is enabled, false if disabled, false if not yet loaded. */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  const posthog = usePostHog();
  return posthog.isFeatureEnabled(flag) ?? false;
}

/**
 * Returns the raw flag value without a default — undefined means flags are still loading.
 * Use this when you need to distinguish "not loaded yet" from "definitively OFF",
 * e.g. in signup steps where skipping a step on a loading flag would be wrong.
 */
export function useFeatureFlagRaw(flag: FeatureFlagKey): boolean | undefined {
  const posthog = usePostHog();
  return posthog.isFeatureEnabled(flag);
}

/** Returns the variant key for a multivariate flag, or undefined if not matched. */
export function useFeatureFlagVariant(flag: FeatureFlagKey): string | boolean | undefined {
  const posthog = usePostHog();
  return posthog.getFeatureFlag(flag);
}
