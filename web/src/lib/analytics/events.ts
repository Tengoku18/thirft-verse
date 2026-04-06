import { sendGAEvent } from "@next/third-parties/google";

// ──────────────────────────────────────────────
// Event definitions
// Add or remove events here as tracking needs change.
// ──────────────────────────────────────────────

export const AnalyticsEvents = {
  // Checkout funnel
  CHECKOUT_START: "checkout_start",
  PAYMENT_METHOD_SELECT: "payment_method_select",
  PLACE_ORDER: "place_order",
} as const;

type EventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

// ──────────────────────────────────────────────
// Event parameter types
// ──────────────────────────────────────────────

type EventParams = {
  [AnalyticsEvents.CHECKOUT_START]: {
    store_id: string;
    item_count?: number;
  };
  [AnalyticsEvents.PAYMENT_METHOD_SELECT]: {
    method: "esewa" | "cod" | "fonepay";
  };
  [AnalyticsEvents.PLACE_ORDER]: {
    payment_method: "esewa" | "cod" | "fonepay";
    total_amount?: number;
    currency?: string;
  };
};

// ──────────────────────────────────────────────
// Track function — type-safe wrapper around sendGAEvent
// ──────────────────────────────────────────────

export function trackEvent<T extends EventName>(
  event: T,
  params: T extends keyof EventParams ? EventParams[T] : never
) {
  try {
    sendGAEvent("event", event, params);
  } catch {
    // Analytics should never block user functionality
  }
}
