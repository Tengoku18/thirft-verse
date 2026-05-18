import { MinusIcon, PlusIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  quantity: number;
  max: number;
  onChange: (q: number) => void;
}

export function QuantityStepper({ quantity, max, onChange }: Props) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 border border-slate-100">
      <Typography
        variation="body-sm"
        className="text-brand-espresso font-semibold"
      >
        Quantity
      </Typography>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          onPress={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-9 h-9 rounded-full bg-brand-beige items-center justify-center"
          activeOpacity={0.7}
        >
          <MinusIcon
            width={16}
            height={16}
            color={quantity <= 1 ? "#C4B5A5" : "#3B3030"}
          />
        </TouchableOpacity>
        <Typography
          variation="h4"
          className="text-brand-espresso w-6 text-center"
        >
          {quantity}
        </Typography>
        <TouchableOpacity
          onPress={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="w-9 h-9 rounded-full bg-brand-beige items-center justify-center"
          activeOpacity={0.7}
        >
          <PlusIcon
            width={16}
            height={16}
            color={quantity >= max ? "#C4B5A5" : "#3B3030"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
