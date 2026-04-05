import { LOGOS } from "@/constants/logos";
import { Typography } from "@/components/ui/Typography";
import React, { forwardRef } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

interface StoreQRCodeProps {
  /** Full URL that the QR should encode (e.g., https://alex.thriftverse.shop) */
  value: string;
  /** Display label shown beneath the QR (e.g., thriftverse.shop/alex) */
  displayUrl: string;
  /** Store display name shown at the top */
  storeName: string;
  /** Visual size of the QR matrix in pixels */
  size?: number;
}

/**
 * StoreQRCode — brand-styled QR card for a user's storefront.
 *
 * Forwards a ref to the underlying `ViewShot` instance so the caller can
 * call `captureRef(ref, ...)` to export the card as an image (used for
 * sharing and saving to the device).
 */
export const StoreQRCode = forwardRef<ViewShot, StoreQRCodeProps>(
  ({ value, displayUrl, storeName, size = 220 }, ref) => {
    return (
      <ViewShot
        ref={ref}
        options={{ format: "png", quality: 1, result: "tmpfile" }}
      >
        <View
          className="bg-white rounded-3xl px-6 pt-6 pb-7 items-center"
          style={{ width: size + 80 }}
        >
          {/* Brand header */}
          <Typography
            variation="h3"
            numberOfLines={1}
            style={{
              fontSize: 20,
              color: "#3B2F2F",
              textAlign: "center",
            }}
          >
            {storeName}
          </Typography>
          <Typography
            variation="body-xs"
            style={{
              fontSize: 12,
              color: "rgba(59,47,47,0.5)",
              marginTop: 2,
              textAlign: "center",
            }}
          >
            Scan to visit my store
          </Typography>

          {/* QR */}
          <View
            className="mt-5 rounded-2xl p-4"
            style={{
              backgroundColor: "#FAF7F2",
              borderWidth: 1,
              borderColor: "rgba(59,47,47,0.08)",
            }}
          >
            <QRCode
              value={value}
              size={size}
              color="#3B2F2F"
              backgroundColor="#FAF7F2"
              logo={LOGOS.icon}
              logoSize={size * 0.22}
              logoBackgroundColor="#FFFFFF"
              logoBorderRadius={10}
              logoMargin={4}
              ecl="H"
              quietZone={8}
            />
          </View>

          {/* URL */}
          <Typography
            variation="label"
            numberOfLines={1}
            style={{
              fontSize: 13,
              color: "#3B2F2F",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {displayUrl}
          </Typography>

          {/* Watermark */}
          <View className="flex-row items-center mt-3" style={{ gap: 6 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#D4A373",
              }}
            />
            <Typography
              variation="caption"
              style={{
                fontSize: 10,
                color: "rgba(59,47,47,0.5)",
                letterSpacing: 0.8,
              }}
            >
              POWERED BY THRIFTVERSE
            </Typography>
          </View>
        </View>
      </ViewShot>
    );
  },
);

StoreQRCode.displayName = "StoreQRCode";
