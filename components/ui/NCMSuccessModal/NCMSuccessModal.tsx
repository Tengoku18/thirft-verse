import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { BlurModal } from "@/components/ui/BlurModal";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

interface NCMSuccessModalProps {
  visible: boolean;
  ncmOrderId: number | null;
  /** Navigates away to the processing orders list */
  onDone: () => void;
  /** Stays on the order details screen and triggers a refetch */
  onClose: () => void;
}

export function NCMSuccessModal({
  visible,
  ncmOrderId,
  onDone,
  onClose,
}: NCMSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!ncmOrderId) return;
    await Clipboard.setStringAsync(String(ncmOrderId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BlurModal visible={visible} onDismiss={onClose} showCloseButton={false}>
      <Pressable
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                <IconSymbol name="checkmark" size={16} color="#059669" />
              </View>
              <Typography variation="h4" className="flex-1">
                Sent to NCM!
              </Typography>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="ml-3"
            >
              <IconSymbol name="xmark" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* NCM Order ID card */}
          {ncmOrderId && (
            <View className="bg-gray-50 rounded-2xl px-4 py-3 flex-row items-center justify-between border border-gray-100 mb-4">
              <View className="gap-0.5">
                <Typography variation="caption" intent="muted">
                  NCM Order ID
                </Typography>
                <Typography variation="label" className="text-brand-espresso">
                  #{ncmOrderId}
                </Typography>
              </View>
              <TouchableOpacity
                onPress={handleCopy}
                activeOpacity={0.7}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200"
              >
                <IconSymbol
                  name={copied ? "checkmark" : "doc.on.doc"}
                  size={14}
                  color={copied ? "#059669" : "#6B7280"}
                />
                <Typography
                  variation="caption"
                  style={{ color: copied ? "#059669" : "#6B7280" }}
                >
                  {copied ? "Copied" : "Copy"}
                </Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Info text */}
          <View className="flex-row items-start gap-2 mb-6">
            <IconSymbol
              name="info.circle"
              size={16}
              color="#9CA3AF"
              style={{ marginTop: 2 }}
            />
            <Typography variation="body-sm" intent="muted" className="flex-1">
              Your order has been submitted to Nepal Can Move for delivery. You
              can track it from the order details page.
            </Typography>
          </View>

          {/* Actions */}
          <View className="gap-3">
            <Button label="Done" variant="primary" onPress={onDone} />
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="items-center justify-center py-3"
            >
              <Typography variation="body-sm" intent="muted">
                View order details
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </BlurModal>
  );
}
