import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

const formatPrice = (amount: number) => `NPR ${amount.toLocaleString()}`;

interface Props {
  title: string;
  price: number;
}

export function ProductInfo({ title, price }: Props) {
  return (
    <View className="gap-1">
      <Typography variation="h2" className="text-brand-espresso leading-tight">
        {title}
      </Typography>
      <Typography variation="h1" className="text-brand-espresso">
        {formatPrice(price)}
      </Typography>
    </View>
  );
}
