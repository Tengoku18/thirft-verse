import { Typography } from "@/components/ui/Typography";
import { getNCMOrderStatus, NCMOrderStatusItem } from "@/lib/ncm-helpers";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { ClockIcon, CopyIcon, RefreshIcon, ShippingBoxIcon, TrendingUpIcon, WifiSlashIcon } from "@/components/icons";
import { renderSFSymbolIcon } from "@/lib/icon-mapper";

// ============================================================================
// TYPES
// ============================================================================

interface NCMTrackingSectionProps {
  ncmOrderId: number;
  deliveryStatus: string | null;
  paymentStatus: string | null;
  deliveryCharge: number | null;
  lastSyncedAt: string | null;
  onSync?: () => Promise<void>;
  refreshTrigger?: number;
}

// ============================================================================
// NCM BRAND THEME
// ============================================================================

const NCM = {
  primary: "#D32F2F",
  primaryDark: "#B71C1C",
  primaryLight: "#FFEBEE",
  accent: "#FF3C26",
  surface: "#FFF5F5",
  white: "#FFFFFF",
};

// ============================================================================
// STATUS CONFIGURATION
// ============================================================================

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    { color: string; bgColor: string; icon: string }
  > = {
    "Pickup Order Created": {
      color: "#D97706",
      bgColor: "#FEF3C7",
      icon: "doc.text.fill",
    },
    "Drop off Order Created": {
      color: "#D97706",
      bgColor: "#FEF3C7",
      icon: "doc.text.fill",
    },
    "Sent for Pickup": {
      color: "#2563EB",
      bgColor: "#DBEAFE",
      icon: "shippingbox.fill",
    },
    "Pickup Complete": {
      color: "#0891B2",
      bgColor: "#CFFAFE",
      icon: "checkmark.circle.fill",
    },
    "In Transit": {
      color: "#7C3AED",
      bgColor: "#EDE9FE",
      icon: "arrow.right.circle.fill",
    },
    Arrived: {
      color: "#0891B2",
      bgColor: "#CFFAFE",
      icon: "mappin.circle.fill",
    },
    "Sent for Delivery": {
      color: "#2563EB",
      bgColor: "#DBEAFE",
      icon: "paperplane.fill",
    },
    Delivered: {
      color: "#059669",
      bgColor: "#D1FAE5",
      icon: "checkmark.seal.fill",
    },
    Returned: {
      color: "#DC2626",
      bgColor: "#FEE2E2",
      icon: "arrow.uturn.backward.circle.fill",
    },
    Cancelled: {
      color: "#DC2626",
      bgColor: "#FEE2E2",
      icon: "xmark.circle.fill",
    },
  };

  return (
    configs[status] || {
      color: "#6B7280",
      bgColor: "#F3F4F6",
      icon: "clock",
    }
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

export const NCMTrackingSection: React.FC<NCMTrackingSectionProps> = ({
  ncmOrderId,
  deliveryStatus,
  paymentStatus,
  deliveryCharge,
  lastSyncedAt,
  onSync,
  refreshTrigger,
}) => {
  const [statusHistory, setStatusHistory] = useState<NCMOrderStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch status history from NCM
  const fetchStatusHistory = useCallback(async () => {
    if (!ncmOrderId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getNCMOrderStatus(ncmOrderId);
      if (result.success && result.data) {
        const statusArray = Array.isArray(result.data) ? result.data : [];
        const sorted = statusArray.sort(
          (a, b) =>
            new Date(a.added_time).getTime() - new Date(b.added_time).getTime(),
        );
        setStatusHistory(sorted);
      } else {
        setError(result.error || "Could not load tracking");
      }
    } catch (err) {
      console.error("Error fetching NCM status:", err);
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  }, [ncmOrderId]);

  useEffect(() => {
    // Small delay on initial load so we don't race with any background sync
    // that fires right after NCM order creation (avoids 429 rate limit).
    const timer = setTimeout(fetchStatusHistory, 1500);
    return () => clearTimeout(timer);
  }, [fetchStatusHistory]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchStatusHistory();
    }
  }, [refreshTrigger, fetchStatusHistory]);

  const handleSync = async () => {
    if (!onSync) return;
    setSyncing(true);
    try {
      await onSync();
      await fetchStatusHistory();
    } finally {
      setSyncing(false);
    }
  };

  const latestStatus =
    statusHistory.length > 0
      ? statusHistory[statusHistory.length - 1].status
      : deliveryStatus;
  const latestConfig = getStatusConfig(latestStatus || "");

  return (
    <View className="mt-4">
      <View
        className="rounded-2xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* ── NCM Branded Header ── */}
        <View style={{ backgroundColor: NCM.primary }}>
          {/* Top bar: Brand + Sync */}
          <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
            <View className="flex-row items-center">
              <View
                className="w-7 h-7 rounded-lg items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <ShippingBoxIcon width={15} height={15} color={NCM.white} />
              </View>
              <Typography
                variation="label"
                style={{ color: NCM.white, fontSize: 14, marginLeft: 8 }}
              >
                Nepal Can Move
              </Typography>
            </View>
            <TouchableOpacity
              onPress={handleSync}
              disabled={syncing}
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              activeOpacity={0.7}
            >
              {syncing ? (
                <ActivityIndicator size="small" color={NCM.white} />
              ) : (
                <RefreshIcon width={12} height={12} color={NCM.white} />
              )}
              <Typography
                variation="caption"
                style={{ color: NCM.white, marginLeft: 4, fontSize: 11 }}
              >
                {syncing ? "Syncing..." : "Sync"}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* NCM ID & Order ID - Highlighted */}
          <View className="flex-row px-4 pb-1" style={{ gap: 10 }}>
            {/* Thriftverse NCM ID (fixed) */}
            <TouchableOpacity
              onPress={async () => {
                await Clipboard.setStringAsync("37588");
                Alert.alert("Copied!", "NCM ID copied to clipboard");
              }}
              className="flex-1 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              activeOpacity={0.6}
            >
              <Typography
                variation="caption"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 10,
                  letterSpacing: 0.5,
                }}
              >
                NCM ID
              </Typography>
              <View className="flex-row items-center mt-1">
                <Typography
                  variation="label"
                  style={{ fontSize: 22, color: NCM.white, letterSpacing: 0.5 }}
                >
                  #37588
                </Typography>
                <View
                  className="ml-2 px-1.5 py-1 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <CopyIcon width={11} height={11} color={NCM.white} />
                </View>
              </View>
            </TouchableOpacity>

            {/* NCM Order ID (dynamic per order) */}
            <TouchableOpacity
              onPress={async () => {
                await Clipboard.setStringAsync(String(ncmOrderId));
                Alert.alert("Copied!", "NCM Order ID copied to clipboard");
              }}
              className="flex-1 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              activeOpacity={0.6}
            >
              <Typography
                variation="caption"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 10,
                  letterSpacing: 0.5,
                }}
              >
                NCM ORDER ID
              </Typography>
              <View className="flex-row items-center mt-1">
                <Typography
                  variation="label"
                  style={{ fontSize: 22, color: NCM.white, letterSpacing: 0.5 }}
                >
                  #{ncmOrderId}
                </Typography>
                <View
                  className="ml-2 px-1.5 py-1 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <CopyIcon width={11} height={11} color={NCM.white} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Current Status Badge */}
          <View className="px-4 pt-2 pb-4">
            <View
              className="flex-row items-center px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: NCM.white }}
              >
                {renderSFSymbolIcon(latestConfig.icon, { size: 16, color: latestConfig.color })}
              </View>
              <View className="ml-3 flex-1">
                <Typography
                  variation="caption"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}
                >
                  CURRENT STATUS
                </Typography>
                <Typography
                  variation="label"
                  style={{ color: NCM.white, fontSize: 15, marginTop: 1 }}
                >
                  {latestStatus || "Processing"}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* ── Info Row: Payment + Delivery Fee ── */}
        <View className="flex-row" style={{ backgroundColor: NCM.white }}>
          <View className="flex-1 px-4 py-3.5 border-r border-[#F3F4F6]">
            <Typography
              variation="caption"
              style={{ color: "#9CA3AF", fontSize: 10, letterSpacing: 0.5 }}
            >
              PAYMENT
            </Typography>
            <View className="flex-row items-center mt-1.5">
              <View
                className="w-5 h-5 rounded-full items-center justify-center mr-2"
                style={{
                  backgroundColor:
                    paymentStatus === "Completed" ? "#D1FAE5" : "#FEF3C7",
                }}
              >
                {renderSFSymbolIcon(
                  paymentStatus === "Completed" ? "checkmark" : "clock",
                  { size: 10, color: paymentStatus === "Completed" ? "#059669" : "#D97706" },
                )}
              </View>
              <Typography
                variation="label"
                style={{
                  fontSize: 14,
                  color: paymentStatus === "Completed" ? "#059669" : "#D97706",
                }}
              >
                {paymentStatus || "Pending"}
              </Typography>
            </View>
          </View>
          <View className="flex-1 px-4 py-3.5">
            <Typography
              variation="caption"
              style={{ color: "#9CA3AF", fontSize: 10, letterSpacing: 0.5 }}
            >
              DELIVERY FEE
            </Typography>
            <Typography
              variation="label"
              style={{ fontSize: 14, color: "#1F2937", marginTop: 4 }}
            >
              {deliveryCharge ? `Rs. ${deliveryCharge}` : "—"}
            </Typography>
          </View>
        </View>

        {/* ── Tracking Timeline ── */}
        <View
          style={{
            backgroundColor: NCM.white,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          }}
        >
          <View className="px-4 py-3 flex-row items-center">
            <TrendingUpIcon width={14} height={14} color={NCM.primary} />
            <Typography
              variation="label"
              style={{ fontSize: 13, color: "#374151", marginLeft: 8 }}
            >
              Tracking Updates
            </Typography>
          </View>

          <View className="px-4 pb-4">
            {error ? (
              <View className="items-center py-6">
                <WifiSlashIcon width={28} height={28} color="#D1D5DB" />
                <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 8 }}>
                  {error}
                </Typography>
                <Typography
                  variation="caption"
                  style={{ color: "#B0B0B0", marginTop: 4, fontSize: 11 }}
                >
                  Pull down to retry
                </Typography>
              </View>
            ) : loading ? (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color={NCM.primary} />
                <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 8 }}>
                  Loading tracking...
                </Typography>
              </View>
            ) : statusHistory.length === 0 ? (
              <View className="items-center py-6">
                <ClockIcon width={28} height={28} color="#D1D5DB" />
                <Typography variation="caption" style={{ color: "#9CA3AF", marginTop: 8 }}>
                  No updates yet
                </Typography>
              </View>
            ) : (
              <View>
                {statusHistory.map((item, index) => {
                  const config = getStatusConfig(item.status);
                  const isLast = index === statusHistory.length - 1;
                  const isFirst = index === 0;

                  return (
                    <View key={`${item.orderid}-${index}`} className="flex-row">
                      {/* Stepper Line & Dot */}
                      <View className="items-center" style={{ width: 36 }}>
                        {!isFirst && (
                          <View
                            style={{
                              width: 2,
                              height: 12,
                              backgroundColor: NCM.primary,
                              opacity: 0.3,
                            }}
                          />
                        )}
                        <View
                          className="rounded-full items-center justify-center"
                          style={{
                            width: isLast ? 30 : 22,
                            height: isLast ? 30 : 22,
                            backgroundColor: isLast
                              ? config.color
                              : NCM.primary,
                            opacity: isLast ? 1 : 0.8,
                          }}
                        >
                          {renderSFSymbolIcon(
                            isLast ? config.icon : "checkmark",
                            { size: isLast ? 14 : 11, color: "#FFFFFF" },
                          )}
                        </View>
                        {!isLast && (
                          <View
                            style={{
                              width: 2,
                              flex: 1,
                              minHeight: 18,
                              backgroundColor: NCM.primary,
                              opacity: 0.3,
                            }}
                          />
                        )}
                      </View>

                      {/* Content */}
                      <View
                        className="flex-1 pb-4 pl-3"
                        style={{ paddingTop: isFirst ? 0 : 8 }}
                      >
                        <Typography
                          variation="body-sm"
                          style={{
                            fontSize: isLast ? 14 : 13,
                            color: isLast ? config.color : "#374151",
                            fontWeight: isLast ? "600" : "500",
                          }}
                        >
                          {item.status}
                        </Typography>
                        <Typography
                          variation="caption"
                          style={{
                            color: "#9CA3AF",
                            marginTop: 2,
                            fontSize: 11,
                          }}
                        >
                          {dayjs(item.added_time).format("DD MMM YYYY, h:mm A")}
                        </Typography>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* ── Footer: Last Synced ── */}
        {lastSyncedAt && (
          <View
            className="px-4 py-2"
            style={{
              backgroundColor: "#FAFAFA",
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
            }}
          >
            <Typography
              variation="caption"
              style={{ color: "#B0B0B0", fontSize: 10, textAlign: "center" }}
            >
              Last synced {dayjs(lastSyncedAt).format("DD MMM, h:mm A")}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};
