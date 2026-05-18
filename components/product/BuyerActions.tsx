import { ProductWithStore } from "@/lib/types/database";
import React from "react";
import { View } from "react-native";
import { QuantityStepper } from "./QuantityStepper";
import { SellerCard } from "./SellerCard";

interface Props {
  product: ProductWithStore;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onViewStore: () => void;
}

export function BuyerActions({
  product,
  quantity,
  onQuantityChange,
  onViewStore,
}: Props) {
  const isAvailable = product.status === "available";

  return (
    <View className="gap-4">
      <SellerCard store={product.store} onPress={onViewStore} />

      {isAvailable && (
        <QuantityStepper
          quantity={quantity}
          max={product.availability_count}
          onChange={onQuantityChange}
        />
      )}
    </View>
  );
}
