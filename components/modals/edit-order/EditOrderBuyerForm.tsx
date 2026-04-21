import { Input } from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface Props {
  name: string;
  email: string;
  phone: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  errors: Record<string, string>;
}

export function EditOrderBuyerForm({
  name, email, phone,
  onNameChange, onEmailChange, onPhoneChange,
  errors,
}: Props) {
  return (
    <View className="gap-4">
      <Typography variation="h5" className="text-brand-espresso">
        Buyer Information
      </Typography>

      <Input
        label="Full Name"
        placeholder="Enter buyer's full name"
        value={name}
        onChangeText={onNameChange}
        errorMessage={errors.name}
        autoCapitalize="words"
      />

      <Input
        label="Email Address"
        placeholder="Enter buyer's email"
        value={email}
        onChangeText={onEmailChange}
        errorMessage={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View>
        <Input
          label="Phone Number"
          placeholder="98XXXXXXXX"
          value={phone}
          onChangeText={onPhoneChange}
          errorMessage={errors.phone}
          keyboardType="phone-pad"
          maxLength={15}
        />
        {!errors.phone && (
          <Typography variation="caption" className="text-gray-400 mt-1">
            Enter 10-digit Nepali mobile number
          </Typography>
        )}
      </View>
    </View>
  );
}
