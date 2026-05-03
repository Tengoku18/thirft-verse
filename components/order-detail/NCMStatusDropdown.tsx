import Typography from "@/components/ui/Typography";
import { getNCMOrderStatus, NCMOrderStatusItem } from "@/lib/ncm-helpers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon, ShippingBoxIcon } from "@/components/icons";

const NCM_RED = "#D32F2F";

const STATUS_COLOR: Record<string, string> = {
  Delivered: "#059669",
  Returned: "#DC2626",
  Cancelled: "#DC2626",
  "In Transit": "#7C3AED",
  "Pickup Complete": "#0891B2",
  "Sent for Pickup": "#2563EB",
  "Sent for Delivery": "#2563EB",
  Arrived: "#0891B2",
};

interface Props {
  ncmOrderId: number;
}

export function NCMStatusDropdown({ ncmOrderId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState<NCMOrderStatusItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expanded || steps.length > 0) return;
    setLoading(true);
    getNCMOrderStatus(ncmOrderId)
      .then((r) => {
        if (r.success && Array.isArray(r.data)) {
          const sorted = [...r.data].sort(
            (a, b) => new Date(b.added_time).getTime() - new Date(a.added_time).getTime(),
          );
          setSteps(sorted);
        }
      })
      .finally(() => setLoading(false));
  }, [expanded, ncmOrderId, steps.length]);

  return (
    <View style={{ marginTop: 8 }}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
        style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" }}
      >
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: NCM_RED, alignItems: "center", justifyContent: "center" }}>
          <ShippingBoxIcon width={9} height={9} color="#FFF" />
        </View>
        <Typography variation="caption" style={{ color: NCM_RED, fontWeight: "600" }}>
          NCM Delivery Updates
        </Typography>
        <ChevronRightIcon width={10} height={10} color={NCM_RED} style={{ transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }} />
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: 10, marginLeft: 4 }}>
          {loading ? (
            <ActivityIndicator size="small" color={NCM_RED} style={{ alignSelf: "flex-start" }} />
          ) : steps.length === 0 ? (
            <Typography variation="caption" style={{ color: "#9CA3AF" }}>No NCM updates yet</Typography>
          ) : (
            steps.map((item, idx) => {
              const color = STATUS_COLOR[item.status] ?? "#6B7280";
              const isLatest = idx === 0;
              return (
                <View key={idx} style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={{ alignItems: "center", width: 18 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isLatest ? color : "#D1D5DB", marginTop: 4 }} />
                    {idx < steps.length - 1 && (
                      <View style={{ width: 1, flex: 1, minHeight: 20, backgroundColor: "#E5E7EB" }} />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingLeft: 8, paddingBottom: 12 }}>
                    <Typography
                      variation="caption"
                      style={{ color: isLatest ? color : "#374151", fontWeight: isLatest ? "600" : "400" }}
                    >
                      {item.status}
                    </Typography>
                    <Typography variation="caption" style={{ color: "#9CA3AF", fontSize: 10, marginTop: 1 }}>
                      {dayjs(item.added_time).format("DD MMM, h:mm A")}
                    </Typography>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}
