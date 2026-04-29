import CopyIcon from "@/components/icons/CopyIcon";
import QRCodeIcon from "@/components/icons/QRCodeIcon";
import StoreIcon from "@/components/icons/StoreIcon";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { StoreQRModal } from "./StoreQRModal";

interface StorefrontCardProps {
  storeUsername: string;
  /** Optional display name to show on the QR code (defaults to the username) */
  storeName?: string;
}

export const StorefrontCard: React.FC<StorefrontCardProps> = ({
  storeUsername,
  storeName,
}) => {
  const toast = useToast();
  const [qrVisible, setQrVisible] = useState(false);

  const fullUrl = `https://${storeUsername}.thriftverse.shop`;
  const displayUrl = `${storeUsername}.thriftverse.shop`;

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(fullUrl);
      toast.success("Store link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <View className="mx-5 mt-4">
        <View
          className="bg-white p-5 rounded-2xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: "rgba(59,47,47,0.05)",
          }}
        >
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 pr-3">
              <Typography
                variation="h4"
                style={{ fontSize: 18, color: "#3B2F2F" }}
              >
                Your Storefront
              </Typography>
              <Typography
                variation="body-sm"
                numberOfLines={1}
                style={{
                  color: "rgba(59,47,47,0.6)",
                  fontSize: 13,
                  fontStyle: "italic",
                  marginTop: 2,
                }}
              >
                {displayUrl}
              </Typography>
            </View>
            <View
              className="p-2 rounded-lg"
              style={{ backgroundColor: "rgba(59,47,47,0.05)" }}
            >
              <StoreIcon width={22} height={22} />
            </View>
          </View>

          <View className="flex-row" style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.85}
              accessibilityLabel="Copy store link"
              className="flex-1 flex-row items-center justify-center py-3 rounded-xl"
              style={{ backgroundColor: "#3B2F2F" }}
            >
              <CopyIcon width={14} height={16} color="#FFFFFF" />
              <Typography
                variation="label"
                style={{ color: "#FFFFFF", fontSize: 14, marginLeft: 8 }}
              >
                Copy Link
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setQrVisible(true)}
              activeOpacity={0.85}
              accessibilityLabel="Show store QR code"
              className="px-4 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(59,47,47,0.08)" }}
            >
              <QRCodeIcon width={22} height={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <StoreQRModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        storeUrl={fullUrl}
        displayUrl={displayUrl}
        storeName={storeName || storeUsername}
      />
    </>
  );
};
