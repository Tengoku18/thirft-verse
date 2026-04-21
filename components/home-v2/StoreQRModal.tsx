import CopyIcon from "@/components/icons/CopyIcon";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import { StoreQRCode } from "./StoreQRCode";

interface StoreQRModalProps {
  visible: boolean;
  onClose: () => void;
  /** Full URL that the QR should encode (e.g. https://alex.thriftverse.shop) */
  storeUrl: string;
  /** Display label shown beneath the QR (e.g. thriftverse.shop/alex) */
  displayUrl: string;
  /** Store display name shown at the top of the card */
  storeName: string;
}

const CloseIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6l12 12M18 6L6 18"
      stroke="#3B2F2F"
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

const ShareIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 16V4M12 4l-4 4M12 4l4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StoreQRModal: React.FC<StoreQRModalProps> = ({
  visible,
  onClose,
  storeUrl,
  displayUrl,
  storeName,
}) => {
  const toast = useToast();
  const qrRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    if (copying) return;
    try {
      setCopying(true);
      await Clipboard.setStringAsync(storeUrl);
      toast.success("Store link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    try {
      setSharing(true);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        toast.error("Sharing is not available on this device");
        return;
      }

      if (!qrRef.current) {
        toast.error("QR code not ready yet");
        return;
      }

      const uri = await captureRef(qrRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: `${storeName} — ThriftVerse store`,
        UTI: "public.png",
      });
    } catch (error) {
      console.error("Failed to share QR code:", error);
      toast.error("Could not share QR code");
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.7)"
        translucent
      />
      <Pressable
        className="flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
        onPress={onClose}
      >
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          {/* Top bar with close */}
          <View className="flex-row justify-end px-5 pt-2">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Close QR code"
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <View className="flex-1 items-center justify-center px-6">
            {/* Stop propagation so taps on the card don't dismiss */}
            <Pressable onPress={(e) => e.stopPropagation()}>
              <StoreQRCode
                ref={qrRef}
                value={storeUrl}
                displayUrl={displayUrl}
                storeName={storeName}
              />
            </Pressable>

            {/* Instructions */}
            <Typography
              variation="h5"
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                marginTop: 24,
                textAlign: "center",
              }}
            >
              Share your store
            </Typography>
            <Typography
              variation="body-sm"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              Let buyers scan this code to open your shop
            </Typography>
          </View>

          {/* Bottom actions */}
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="px-5 pb-4"
            style={{ paddingBottom: Platform.OS === "ios" ? 16 : 24 }}
          >
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={handleCopy}
                activeOpacity={0.85}
                disabled={copying}
                accessibilityLabel="Copy store link"
                className="flex-1 flex-row items-center justify-center py-4 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <CopyIcon width={14} height={16} />
                <Typography
                  variation="label"
                  style={{ color: "#FFFFFF", fontSize: 14, marginLeft: 8 }}
                >
                  Copy Link
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.85}
                disabled={sharing}
                accessibilityLabel="Share QR code"
                className="flex-1 flex-row items-center justify-center py-4 rounded-2xl"
                style={{ backgroundColor: "#D4A373" }}
              >
                {sharing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <ShareIcon />
                    <Typography
                      variation="label"
                      style={{
                        color: "#FFFFFF",
                        fontSize: 14,
                        marginLeft: 8,
                      }}
                    >
                      Share QR
                    </Typography>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};
