import { BodySemiboldText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OrderBottomActionsProps {
  /** "pending" shows Edit + Send to NCM. Other statuses render nothing. */
  status: string;
  isEditable: boolean;
  submitting?: boolean;
  onEditOrder: () => void;
  onSendToNCM: () => void;
}

export function OrderBottomActions({
  status,
  isEditable,
  submitting = false,
  onEditOrder,
  onSendToNCM,
}: OrderBottomActionsProps) {
  // Only show for pending orders (seller must take action)
  if (status !== "pending") return null;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FAF7F2",
        borderTopWidth: 1,
        borderTopColor: "rgba(59,48,48,0.08)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
      }}
    >
      <SafeAreaView edges={["bottom"]}>
        <View style={{ flexDirection: "row", padding: 16, gap: 12 }}>
          {/* Edit Order — secondary */}
          {isEditable && (
            <TouchableOpacity
              onPress={onEditOrder}
              activeOpacity={0.75}
              disabled={submitting}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 16,
                borderRadius: 16,
                backgroundColor: "#FFFFFF",
                borderWidth: 1.5,
                borderColor: "rgba(59,48,48,0.15)",
              }}
            >
              <IconSymbol name="pencil" size={16} color="#3B2F2F" />
              <BodySemiboldText style={{ fontSize: 15, color: "#3B2F2F" }}>
                Edit Order
              </BodySemiboldText>
            </TouchableOpacity>
          )}

          {/* Send to NCM — primary */}
          <TouchableOpacity
            onPress={onSendToNCM}
            activeOpacity={0.85}
            disabled={submitting}
            style={{
              flex: isEditable ? 1.4 : 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 16,
              borderRadius: 16,
              backgroundColor: "#3B2F2F",
              shadowColor: "#3B2F2F",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <IconSymbol name="shippingbox.fill" size={16} color="#FFFFFF" />
            )}
            <BodySemiboldText style={{ fontSize: 15, color: "#FFFFFF" }}>
              {submitting ? "Processing..." : "Send to NCM"}
            </BodySemiboldText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
