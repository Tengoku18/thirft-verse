import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, isPassword, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
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
            className={`h-[58px] ${
              isPassword ? "pr-12 pl-4" : "px-4"
            } rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
              error
                ? "border-red-500 bg-red-50"
                : isFocused
                  ? "border-[#3B2F2F] bg-white"
                  : "border-transparent bg-[#FAFAFA]"
            } ${className || ""}`}
            style={{ color: textColor }}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword && !showPassword}
            autoComplete={isPassword ? 'password-new' : props.autoComplete}
            textContentType={isPassword ? 'newPassword' : props.textContentType}
            autoCorrect={false}
            autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-[58px] w-12 justify-center items-center"
              activeOpacity={0.7}
            >
              <IconSymbol
                name={showPassword ? "eye.slash" : "eye"}
                size={22}
                color="#6B705C"
              />
            </TouchableOpacity>
          )}
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
