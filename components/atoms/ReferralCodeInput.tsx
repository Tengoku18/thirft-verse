import React from "react";
import { TextInput, View } from "react-native";
import { Button } from "../ui/Button";

interface ReferralCodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onVerify: () => void;
  isVerifying?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export function ReferralCodeInput({
  value,
  onChangeText,
  onVerify,
  isVerifying = false,
  isDisabled = false,
  placeholder = "Enter code here",
}: ReferralCodeInputProps) {
  const shouldDisableButton = !value?.trim() || isVerifying || isDisabled;

  return (
    <View className="mb-6 flex-row items-center justify-between pr-2 pl-4 py-2 bg-white rounded-3xl border border-slate-100">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholderTextColor="#B8AFA7"
        className="flex-1 text-slate-900 font-sans-medium text-base"
        style={{
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
      />

      <View style={{ marginLeft: 16 }}>
        <Button
          label={"VERIFY"}
          variant="primary"
          size="compact"
          onPress={onVerify}
          isLoading={isVerifying}
          disabled={shouldDisableButton}
          className="flex-row items-center justify-center px-8 py-3 rounded-full bg-brand-espresso active:opacity-80"
          textClassName="text-white font-sans-bold !text-xs"
          style={{
            backgroundColor: shouldDisableButton ? "#D4CCC5" : "#3B2F2F",
            shadowOpacity: 0,
          }}
          fullWidth={false}
        />
      </View>
    </View>
  );
}
