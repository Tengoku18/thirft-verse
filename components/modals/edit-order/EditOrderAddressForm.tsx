import { Input } from "@/components/ui/Input";
import { Select, SelectOption } from "@/components/ui/Select";
import Typography from "@/components/ui/Typography";
import { districtsOfNepal } from "@/lib/constants/districts";
import React from "react";
import { View } from "react-native";

const districtOptions: SelectOption[] = districtsOfNepal.map((d) => ({
  label: d,
  value: d,
}));

interface Props {
  street: string;
  city: string;
  district: string;
  onStreetChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onDistrictChange: (v: string) => void;
  errors: Record<string, string>;
}

export function EditOrderAddressForm({
  street, city, district,
  onStreetChange, onCityChange, onDistrictChange,
  errors,
}: Props) {
  return (
    <View className="gap-4">
      <Typography variation="h5" className="text-brand-espresso">
        Shipping Address
      </Typography>

      <Input
        label="Street Address"
        placeholder="House number, street name, area"
        value={street}
        onChangeText={onStreetChange}
        errorMessage={errors.street}
        multiline
        numberOfLines={2}
      />

      <Input
        label="City / Town"
        placeholder="Enter city or town"
        value={city}
        onChangeText={onCityChange}
        errorMessage={errors.city}
      />

      <Select
        label="District"
        placeholder="Select district"
        value={district}
        onChange={onDistrictChange}
        options={districtOptions}
        errorMessage={errors.district}
        searchable
        searchPlaceholder="Search districts..."
      />
    </View>
  );
}
