import { ThemedText } from "@/components/themed-text";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const textColor = "#3B2F2F";

    return (
      <View className="mb-6">
        {label && (
          <ThemedText className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 tracking-wide uppercase" style={{ color: '#3B2F2F' }}>
            {label}
          </ThemedText>
        )}

        <View className="relative">
          <TextInput
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`${
              props.multiline ? "min-h-[58px] py-4" : "h-[58px]"
            } px-4 rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
              error
                ? "border-red-500 bg-red-50"
                : isFocused
                  ? "border-[#3B2F2F] bg-white"
                  : "border-[#E5E7EB] bg-white"
            } ${className || ""}`}
            style={{
              color: textColor,
              textAlignVertical: props.multiline ? 'top' : 'center',
            }}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
        </View>

        {error && (
          <ThemedText className="text-[13px] text-red-500 mt-2 font-[NunitoSans_500Medium]">
            {error}
          </ThemedText>
        )}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";
