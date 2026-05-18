import { CheckMarkCircleIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { ProductWithStore } from "@/lib/types/database";
import React from "react";
import { View } from "react-native";

const STATUS_CONFIG = {
  available: { bg: "#D1FAE5", text: "#059669", label: "Available" },
  out_of_stock: { bg: "#FEE2E2", text: "#DC2626", label: "Out of Stock" },
};

interface Props {
  status: ProductWithStore["status"];
  category: string;
}

export function ProductStatusRow({ status, category }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View className="flex-row items-center justify-between">
      <View
        className="flex-row items-center gap-1.5 px-3 py-1 rounded-full"
        style={{ backgroundColor: cfg.bg }}
      >
        <CheckMarkCircleIcon width={14} height={14} color={cfg.text} />
        <Typography
          variation="caption"
          style={{ color: cfg.text, fontWeight: "700" }}
        >
          {cfg.label}
        </Typography>
      </View>
      <Typography variation="body-sm" className="text-ui-secondary">
        Category:{" "}
        <Typography variation="body-sm" className="text-brand-tan font-semibold">
          {category}
        </Typography>
      </Typography>
    </View>
  );
}
