import {
  BodyBoldText,
  BodyMediumText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getNCMOrderStatus,
  NCMOrderStatusItem,
} from "@/lib/ncm-helpers";
import * as Clipboard from "expo-clipboard";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
} from "react-native";

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
  const configs: Record<string, { color: string; bgColor: string; icon: string }> = {
    "Pickup Order Created": { color: "#D97706", bgColor: "#FEF3C7", icon: "doc.text.fill" },
    "Drop off Order Created": { color: "#D97706", bgColor: "#FEF3C7", icon: "doc.text.fill" },
    "Sent for Pickup": { color: "#2563EB", bgColor: "#DBEAFE", icon: "shippingbox.fill" },
    "Pickup Complete": { color: "#0891B2", bgColor: "#CFFAFE", icon: "checkmark.circle.fill" },
    "In Transit": { color: "#7C3AED", bgColor: "#EDE9FE", icon: "arrow.right.circle.fill" },
    "Arrived": { color: "#0891B2", bgColor: "#CFFAFE", icon: "mappin.circle.fill" },
    "Sent for Delivery": { color: "#2563EB", bgColor: "#DBEAFE", icon: "paperplane.fill" },
    "Delivered": { color: "#059669", bgColor: "#D1FAE5", icon: "checkmark.seal.fill" },
    "Returned": { color: "#DC2626", bgColor: "#FEE2E2", icon: "arrow.uturn.backward.circle.fill" },
    "Cancelled": { color: "#DC2626", bgColor: "#FEE2E2", icon: "xmark.circle.fill" },
  };

  return configs[status] || { color: "#6B7280", bgColor: "#F3F4F6", icon: "circle.fill" };
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
          (a, b) => new Date(a.added_time).getTime() - new Date(b.added_time).getTime()
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
    fetchStatusHistory();
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

  const latestStatus = statusHistory.length > 0
    ? statusHistory[statusHistory.length - 1].status
    : deliveryStatus;
  const latestConfig = getStatusConfig(latestStatus || "");

  return (
    <View className="mx-4 mt-5">
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
                <IconSymbol name="shippingbox.fill" size={15} color={NCM.white} />
              </View>
              <BodyBoldText style={{ color: NCM.white, fontSize: 14, marginLeft: 8 }}>
                Nepal Can Move
              </BodyBoldText>
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
                <IconSymbol name="arrow.clockwise" size={12} color={NCM.white} />
              )}
              <CaptionText style={{ color: NCM.white, marginLeft: 4, fontSize: 11 }}>
                {syncing ? "Syncing..." : "Sync"}
              </CaptionText>
            </TouchableOpacity>
          </View>

          {/* NCM Order ID */}
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(String(ncmOrderId));
              Alert.alert("Copied!", "NCM ID copied to clipboard");
            }}
            className="flex-row items-center px-4 pb-1"
            activeOpacity={0.6}
          >
            <BodyBoldText style={{ fontSize: 28, color: NCM.white, letterSpacing: 0.5 }}>
              #{ncmOrderId}
            </BodyBoldText>
            <View
              className="ml-3 px-2 py-1 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <IconSymbol name="doc.on.doc" size={13} color={NCM.white} />
            </View>
          </TouchableOpacity>

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
                <IconSymbol name={latestConfig.icon as any} size={16} color={latestConfig.color} />
              </View>
              <View className="ml-3 flex-1">
                <CaptionText style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>
                  CURRENT STATUS
                </CaptionText>
                <BodySemiboldText style={{ color: NCM.white, fontSize: 15, marginTop: 1 }}>
                  {latestStatus || "Processing"}
                </BodySemiboldText>
              </View>
            </View>
          </View>
        </View>

        {/* ── Info Row: Payment + Delivery Fee ── */}
        <View className="flex-row" style={{ backgroundColor: NCM.white }}>
          <View className="flex-1 px-4 py-3.5 border-r border-[#F3F4F6]">
            <CaptionText style={{ color: "#9CA3AF", fontSize: 10, letterSpacing: 0.5 }}>
              PAYMENT
            </CaptionText>
            <View className="flex-row items-center mt-1.5">
              <View
                className="w-5 h-5 rounded-full items-center justify-center mr-2"
                style={{
                  backgroundColor: paymentStatus === "Completed" ? "#D1FAE5" : "#FEF3C7",
                }}
              >
                <IconSymbol
                  name={paymentStatus === "Completed" ? "checkmark" : "clock"}
                  size={10}
                  color={paymentStatus === "Completed" ? "#059669" : "#D97706"}
                />
              </View>
              <BodySemiboldText
                style={{
                  fontSize: 14,
                  color: paymentStatus === "Completed" ? "#059669" : "#D97706",
                }}
              >
                {paymentStatus || "Pending"}
              </BodySemiboldText>
            </View>
          </View>
          <View className="flex-1 px-4 py-3.5">
            <CaptionText style={{ color: "#9CA3AF", fontSize: 10, letterSpacing: 0.5 }}>
              DELIVERY FEE
            </CaptionText>
            <BodySemiboldText style={{ fontSize: 14, color: "#1F2937", marginTop: 4 }}>
              {deliveryCharge ? `Rs. ${deliveryCharge}` : "—"}
            </BodySemiboldText>
          </View>
        </View>

        {/* ── Tracking Timeline ── */}
        <View style={{ backgroundColor: NCM.white, borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          <View className="px-4 py-3 flex-row items-center">
            <IconSymbol name="point.topleft.down.to.point.bottomright.curvepath.fill" size={14} color={NCM.primary} />
            <BodySemiboldText style={{ fontSize: 13, color: "#374151", marginLeft: 8 }}>
              Tracking Updates
            </BodySemiboldText>
          </View>

          <View className="px-4 pb-4">
            {error ? (
              <View className="items-center py-6">
                <IconSymbol name="wifi.slash" size={28} color="#D1D5DB" />
                <CaptionText style={{ color: "#9CA3AF", marginTop: 8 }}>{error}</CaptionText>
                <CaptionText style={{ color: "#B0B0B0", marginTop: 4, fontSize: 11 }}>
                  Pull down to retry
                </CaptionText>
              </View>
            ) : loading ? (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color={NCM.primary} />
                <CaptionText style={{ color: "#9CA3AF", marginTop: 8 }}>Loading tracking...</CaptionText>
              </View>
            ) : statusHistory.length === 0 ? (
              <View className="items-center py-6">
                <IconSymbol name="clock" size={28} color="#D1D5DB" />
                <CaptionText style={{ color: "#9CA3AF", marginTop: 8 }}>
                  No updates yet
                </CaptionText>
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
                            backgroundColor: isLast ? config.color : NCM.primary,
                            opacity: isLast ? 1 : 0.8,
                          }}
                        >
                          <IconSymbol
                            name={isLast ? (config.icon as any) : "checkmark"}
                            size={isLast ? 14 : 11}
                            color="#FFFFFF"
                          />
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
                      <View className="flex-1 pb-4 pl-3" style={{ paddingTop: isFirst ? 0 : 8 }}>
                        <BodyMediumText
                          style={{
                            fontSize: isLast ? 14 : 13,
                            color: isLast ? config.color : "#374151",
                            fontWeight: isLast ? "600" : "500",
                          }}
                        >
                          {item.status}
                        </BodyMediumText>
                        <CaptionText style={{ color: "#9CA3AF", marginTop: 2, fontSize: 11 }}>
                          {dayjs(item.added_time).format("DD MMM YYYY, h:mm A")}
                        </CaptionText>
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
            style={{ backgroundColor: "#FAFAFA", borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
          >
            <CaptionText style={{ color: "#B0B0B0", fontSize: 10, textAlign: "center" }}>
              Last synced {dayjs(lastSyncedAt).format("DD MMM, h:mm A")}
            </CaptionText>
          </View>
        )}
      </View>
    </View>
  );
};
