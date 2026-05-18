import React from "react";
import { View } from "react-native";
import type { Control } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import { Typography } from "@/components/ui/Typography";
import { districtsOfNepal } from "@/lib/constants/districts";
import { CheckoutForm } from "@/lib/validations/checkout";

interface Props {
  control: Control<CheckoutForm>;
}

export function DetailsStep({ control }: Props) {
  return (
    <View className="gap-6">
      <View className="gap-3">
        <Typography variation="h4" className="text-brand-espresso">
          Contact
        </Typography>

        <RHFInput
          control={control}
          name="buyerName"
          label="Full Name"
          placeholder="John Doe"
        />
        <RHFInput
          control={control}
          name="buyerEmail"
          label="Email"
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <RHFInput
          control={control}
          name="buyerPhone"
          label="Phone Number"
          placeholder="98XXXXXXXX"
          keyboardType="phone-pad"
        />
      </View>

      <View className="gap-3">
        <Typography variation="h4" className="text-brand-espresso">
          Your Address
        </Typography>

        <RHFInput
          control={control}
          name="street"
          label="Street / Area"
          placeholder="Thamel, Marg 4"
        />
        <RHFInput
          control={control}
          name="city"
          label="City"
          placeholder="Kathmandu"
        />
        <RHFSelect
          control={control}
          name="district"
          label="District"
          placeholder="Select district"
          searchable
          searchPlaceholder="Search district..."
          modalTitle="Select District"
          options={districtsOfNepal.map((d) => ({ label: d, value: d }))}
        />
      </View>

      <View className="gap-3">
        <Typography variation="h4" className="text-brand-espresso">
          Notes
        </Typography>
        <RHFTextarea
          control={control}
          name="buyerNotes"
          label="Anything for the seller? (optional)"
          placeholder="E.g. preferred delivery time, gift wrap…"
        />
      </View>
    </View>
  );
}
