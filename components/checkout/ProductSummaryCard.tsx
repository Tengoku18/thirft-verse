import React from "react";
import { Image, View } from "react-native";
import { Typography } from "@/components/ui/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { formatPrice } from "@/lib/validations/checkout";

interface Props {
  coverImage: string | null | undefined;
  title: string;
  quantity: number;
  unitPrice: number;
}

export function ProductSummaryCard({ coverImage, title, quantity, unitPrice }: Props) {
  return (
    <View className="bg-white rounded-2xl p-4 flex-row gap-3 border border-slate-100">
      <Image
        source={{ uri: getProductImageUrl(coverImage ?? "") }}
        style={{ width: 64, height: 64, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View className="flex-1 gap-0.5">
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-semibold"
          numberOfLines={2}
        >
          {title}
        </Typography>
        <Typography variation="caption" className="text-ui-secondary">
          Qty: {quantity}
        </Typography>
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-bold"
        >
          {formatPrice(unitPrice)}
        </Typography>
      </View>
    </View>
  );
}
