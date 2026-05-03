import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { TextInput, TextInputProps, View } from "react-native";

export interface FormTextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
}

export const FormTextarea = React.forwardRef<TextInput, FormTextareaProps>(
  ({ label, error, maxLength = 1000, required, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(
      props.value?.toString().length || 0,
    );
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
            <Typography variation="label" style={{ fontSize: 13 }}>
              {label}
              {required && (
                <Typography variation="label" style={{ color: "#EF4444", fontSize: 13 }}>
                  {" "}
                  *
                </Typography>
              )}
            </Typography>
          )}
          {maxLength && (
            <Typography variation="label"
              style={{
                color: charCount > maxLength ? "#EF4444" : "#6B7280",
                fontSize: 12,
              }}
            >
              {charCount}/{maxLength}
            </Typography>
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
          style={{ color: textColor, textAlignVertical: "top" }}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={5}
          maxLength={maxLength}
          autoCorrect={true}
          onChangeText={handleTextChange}
          {...props}
        />

        {error && (
          <Typography variation="caption"
            className="mt-2"
            style={{ color: "#EF4444", fontSize: 13 }}
          >
            {error}
          </Typography>
        )}
      </View>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
