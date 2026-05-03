import { CheckmarkIcon, CopyIcon } from "@/components/icons";
import Typography from "@/components/ui/Typography";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface NCMSuccessContentProps {
  ncmOrderId: number | null;
}

export function NCMSuccessContent({ ncmOrderId }: NCMSuccessContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!ncmOrderId) return;
    await Clipboard.setStringAsync(String(ncmOrderId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="gap-3">
      <Typography variation="body-sm" className="text-gray-500">
        Your order has been submitted to Nepal Can Move for delivery.
      </Typography>

      {ncmOrderId && (
        <View className="bg-gray-50 rounded-2xl px-4 py-3 flex-row items-center justify-between border border-gray-100">
          <View className="gap-0.5">
            <Typography variation="caption" className="text-gray-400">
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
            {copied
              ? <CheckmarkIcon width={14} height={14} color="#059669" />
              : <CopyIcon width={14} height={14} color="#6B7280" />
            }
            <Typography
              variation="caption"
              style={{ color: copied ? "#059669" : "#6B7280" }}
            >
              {copied ? "Copied" : "Copy"}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
