import { GlobeIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { ProductWithStore } from "@/lib/types/database";
import * as Linking from "expo-linking";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const VERIFICATION_CONFIG = {
  pending: {
    bg: "#FEF3C7",
    text: "#92400E",
    label: "Under Review",
    message:
      "This product is under review for marketplace visibility. In the meantime, it's already live on your storefront.",
  },
  verified: {
    bg: "#D1FAE5",
    text: "#065F46",
    label: "Live on Marketplace",
    message:
      "Your product is approved and visible to buyers on the Thriftverse marketplace.",
  },
  rejected: {
    bg: "#FEE2E2",
    text: "#991B1B",
    label: "Not Approved",
    message:
      "Your product wasn't approved for the marketplace. Review the reason below, make the necessary updates, and resubmit.",
  },
};

interface Props {
  status: ProductWithStore["verification_status"];
  rejectedReason: string | null;
  storeUsername?: string;
  onEdit: () => void;
}

export function VerificationBanner({
  status,
  rejectedReason,
  storeUsername,
  onEdit,
}: Props) {
  const meta = VERIFICATION_CONFIG[status ?? "pending"];

  return (
    <View
      className="rounded-2xl p-4 gap-1"
      style={{ backgroundColor: meta.bg }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="px-2 py-0.5 rounded-full"
          style={{ backgroundColor: meta.text + "22" }}
        >
          <Typography
            variation="caption"
            style={{ color: meta.text, fontWeight: "700" }}
          >
            {meta.label}
          </Typography>
        </View>
      </View>

      <Typography variation="body-sm" style={{ color: meta.text }}>
        {meta.message}
      </Typography>

      {status === "pending" && storeUsername && (
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://${storeUsername}.thriftverse.shop`)
          }
          activeOpacity={0.75}
          className="flex-row items-center gap-1 mt-1"
        >
          <GlobeIcon width={13} height={13} color={meta.text} />
          <Typography
            variation="caption"
            style={{ color: meta.text, textDecorationLine: "underline" }}
          >
            View your storefront →
          </Typography>
        </TouchableOpacity>
      )}

      {status === "rejected" && rejectedReason && (
        <>
          <View
            className="mt-1 border-t"
            style={{ borderColor: meta.text + "33" }}
          />
          <Typography
            variation="body-sm"
            style={{ color: meta.text, fontWeight: "600" }}
            className="mt-1"
          >
            Reason:
          </Typography>
          <Typography variation="body-sm" style={{ color: meta.text }}>
            {rejectedReason}
          </Typography>
          <TouchableOpacity
            onPress={onEdit}
            className="mt-2 py-2.5 rounded-xl items-center"
            style={{ backgroundColor: meta.text }}
            activeOpacity={0.8}
          >
            <Typography variation="button" className="text-white">
              Update Product
            </Typography>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
