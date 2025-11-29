import { ThemedText } from "@/components/themed-text";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export interface FormTextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
}

export const FormTextarea = React.forwardRef<TextInput, FormTextareaProps>(
  ({ label, error, maxLength = 1000, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(props.value?.toString().length || 0);
    const textColor = "#3B2F2F";

    const handleTextChange = (text: string) => {
      setCharCount(text.length);
      props.onChangeText?.(text);
    };

    return (
      <View className="mb-6">
        {/* Label with character count */}
        <View className="flex-row items-center justify-between mb-3">
          {label && (
            <ThemedText
              className="text-[13px] font-[NunitoSans_600SemiBold]"
              style={{ color: '#3B2F2F' }}
            >
              {label}
            </ThemedText>
          )}
          {maxLength && (
            <ThemedText
              className="text-[12px] font-[NunitoSans_600SemiBold]"
              style={{ color: charCount > maxLength ? '#EF4444' : '#6B7280' }}
            >
              {charCount}/{maxLength}
            </ThemedText>
          )}
        </View>

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
          className={`min-h-[120px] px-4 py-4 rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
            error
              ? "border-red-500 bg-red-50"
              : isFocused
                ? "border-[#3B2F2F] bg-white"
                : "border-[#E5E7EB] bg-white"
          } ${className || ""}`}
          style={{ color: textColor, textAlignVertical: 'top' }}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={5}
          maxLength={maxLength}
          autoCorrect={true}
          onChangeText={handleTextChange}
          {...props}
        />

        {error && (
          <ThemedText className="text-[13px] text-red-500 mt-2 font-[NunitoSans_500Medium]">
            {error}
          </ThemedText>
        )}
      </View>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
