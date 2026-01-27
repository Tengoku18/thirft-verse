import {
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
        // Ensure data is an array before processing
        const statusArray = Array.isArray(result.data) ? result.data : [];
        // Sort by added_time ascending (oldest first for stepper view)
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

  // Refetch when parent triggers refresh (pull-to-refresh)
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
      {/* Header Card */}
      <View
        className="bg-white rounded-2xl overflow-hidden mb-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* NCM Header */}
        <View className="p-4" style={{ backgroundColor: latestConfig.bgColor }}>
          <View className="flex-row items-start justify-between">
            {/* Left: Icon + Info */}
            <View className="flex-row flex-1">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: latestConfig.color }}
              >
                <IconSymbol name={latestConfig.icon as any} size={28} color="#FFFFFF" />
              </View>

              <View className="ml-4 flex-1 justify-center">
                {/* Status */}
                <BodySemiboldText style={{ color: latestConfig.color, fontSize: 17 }}>
                  {latestStatus || "Processing"}
                </BodySemiboldText>

                {/* NCM ID - Tappable */}
                <TouchableOpacity
                  onPress={async () => {
                    await Clipboard.setStringAsync(String(ncmOrderId));
                    Alert.alert("Copied!", `NCM ID copied to clipboard`);
                  }}
                  className="flex-row items-center mt-1"
                  activeOpacity={0.6}
                >
                  <CaptionText style={{ color: latestConfig.color, opacity: 0.7, fontSize: 13 }}>
                    NCM ID:
                  </CaptionText>
                  <BodyMediumText style={{ color: latestConfig.color, fontSize: 13, marginLeft: 4 }}>
                    {ncmOrderId}
                  </BodyMediumText>
                  <IconSymbol
                    name="doc.on.doc"
                    size={14}
                    color={latestConfig.color}
                    style={{ marginLeft: 8, opacity: 0.7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Right: Sync Button */}
            <TouchableOpacity
              onPress={handleSync}
              disabled={syncing}
              className="w-10 h-10 rounded-full items-center justify-center ml-2"
              style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
              activeOpacity={0.7}
            >
              {syncing ? (
                <ActivityIndicator size="small" color={latestConfig.color} />
              ) : (
                <IconSymbol name="arrow.clockwise" size={16} color={latestConfig.color} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment & Delivery Fee */}
        <View className="flex-row">
          <View className="flex-1 px-4 py-3 border-r border-[#F3F4F6]">
            <CaptionText style={{ color: "#9CA3AF", fontSize: 11 }}>Payment</CaptionText>
            <BodyMediumText
              style={{
                fontSize: 13,
                color: paymentStatus === "Completed" ? "#059669" : "#D97706",
                marginTop: 2,
              }}
            >
              {paymentStatus || "Pending"}
            </BodyMediumText>
          </View>
          <View className="flex-1 px-4 py-3">
            <CaptionText style={{ color: "#9CA3AF", fontSize: 11 }}>Delivery Fee</CaptionText>
            <BodyMediumText style={{ fontSize: 13, color: "#1F2937", marginTop: 2 }}>
              {deliveryCharge ? `Rs. ${deliveryCharge}` : "—"}
            </BodyMediumText>
          </View>
        </View>
      </View>

      {/* Tracking Stepper Card */}
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="px-4 py-3 border-b border-[#F3F4F6]">
          <BodySemiboldText style={{ fontSize: 14, color: "#1F2937" }}>
            Tracking Updates
          </BodySemiboldText>
        </View>

        <View className="px-4 py-4">
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
              <ActivityIndicator size="small" color="#9CA3AF" />
              <CaptionText style={{ color: "#9CA3AF", marginTop: 8 }}>Loading...</CaptionText>
            </View>
          ) : statusHistory.length === 0 ? (
            <View className="items-center py-6">
              <IconSymbol name="clock" size={28} color="#D1D5DB" />
              <CaptionText style={{ color: "#9CA3AF", marginTop: 8 }}>
                No updates yet
              </CaptionText>
            </View>
          ) : (
            /* Stepper Timeline */
            <View>
              {statusHistory.map((item, index) => {
                const config = getStatusConfig(item.status);
                const isLast = index === statusHistory.length - 1;
                const isFirst = index === 0;

                return (
                  <View key={`${item.orderid}-${index}`} className="flex-row">
                    {/* Stepper Line & Dot */}
                    <View className="items-center" style={{ width: 40 }}>
                      {/* Top Line */}
                      {!isFirst && (
                        <View
                          style={{
                            width: 2,
                            height: 12,
                            backgroundColor: "#059669",
                          }}
                        />
                      )}

                      {/* Dot */}
                      <View
                        className="rounded-full items-center justify-center"
                        style={{
                          width: isLast ? 32 : 24,
                          height: isLast ? 32 : 24,
                          backgroundColor: isLast ? config.color : "#059669",
                          borderWidth: isLast ? 3 : 0,
                          borderColor: isLast ? config.bgColor : undefined,
                        }}
                      >
                        <IconSymbol
                          name={isLast ? (config.icon as any) : "checkmark"}
                          size={isLast ? 14 : 12}
                          color="#FFFFFF"
                        />
                      </View>

                      {/* Bottom Line */}
                      {!isLast && (
                        <View
                          style={{
                            width: 2,
                            flex: 1,
                            minHeight: 20,
                            backgroundColor: "#059669",
                          }}
                        />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 pb-5 pl-3" style={{ paddingTop: isFirst ? 0 : 8 }}>
                      <BodyMediumText
                        style={{
                          fontSize: isLast ? 15 : 14,
                          color: isLast ? config.color : "#374151",
                          fontWeight: isLast ? "600" : "500",
                        }}
                      >
                        {item.status}
                      </BodyMediumText>
                      <CaptionText style={{ color: "#9CA3AF", marginTop: 2, fontSize: 12 }}>
                        {dayjs(item.added_time).format("DD MMM YYYY, h:mm A")}
                      </CaptionText>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Last Synced */}
        {lastSyncedAt && (
          <View className="px-4 py-2 border-t border-[#F3F4F6]" style={{ backgroundColor: "#FAFAFA" }}>
            <CaptionText style={{ color: "#B0B0B0", fontSize: 10, textAlign: "center" }}>
              Updated {dayjs(lastSyncedAt).format("DD MMM, h:mm A")}
            </CaptionText>
          </View>
        )}
      </View>
    </View>
  );
};
