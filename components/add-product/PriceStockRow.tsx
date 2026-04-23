import { RHFInput } from "@/components/forms/ReactHookForm";
import { ProductFormData } from "@/lib/validations/product";
import React from "react";
import { Control } from "react-hook-form";
import { View } from "react-native";
import Typography from "../ui/Typography";

interface PriceStockRowProps {
  control: Control<ProductFormData>;
}

const RsPrefix = (
  <Typography variation="body" intent="muted">
    Rs.
  </Typography>
);

export function PriceStockRow({ control }: PriceStockRowProps) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <RHFInput
          control={control}
          name="price"
          label="Price (NPR)"
          placeholder="0.00"
          keyboardType="decimal-pad"
          leftIcon={RsPrefix}
        />
      </View>
      <View style={{ flex: 1 }}>
        <RHFInput
          control={control}
          name="availability_count"
          label="Stock Count"
          placeholder="1"
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
}
