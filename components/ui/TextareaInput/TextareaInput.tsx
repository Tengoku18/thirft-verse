import { INPUT_COLORS } from "@/constants/theme";
import { useState } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Typography from "../Typography";

export type TextareaVariant = "default" | "error" | "success" | "disabled";

export interface TextareaProps extends Omit<TextInputProps, "multiline"> {
  label?: string;
  placeholder?: string;
  variant?: TextareaVariant;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  maxLength?: number;
  numberOfLines?: number;
  informationMessage?: string;
  infoMessageType?: "default" | "secondary";
}

export function Textarea({
  label,
  placeholder,
  variant = "default",
  containerClassName,
  inputClassName,
  labelClassName,
  errorMessage,
  containerStyle,
  editable = true,
  maxLength = 500,
  numberOfLines = 6,
  value = "",
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = variant === "disabled" || !editable;

  // Get variant-specific styles
  const getContainerStyle = () => {
    const baseClasses = `rounded-3xl px-4 py-4 bg-white`;

    switch (variant) {
      case "disabled":
        return (
          baseClasses +
          " border border-ui-border-light bg-brand-off-white opacity-50"
        );
      default:
        return baseClasses + " border";
    }
  };

  // Determine border color based on focus and error state
  const borderColor = isFocused
    ? INPUT_COLORS.borderFocus
    : errorMessage
      ? "#DC2626"
      : INPUT_COLORS.border;

  // Calculate character count
  const characterCount = typeof value === "string" ? value.length : 0;
  const charCounterColor =
    characterCount >= (maxLength || 500) ? "#DC2626" : "#9CA3AF";

  return (
    <View>
      {/* Label with Character Counter */}
      <View className="flex-row items-center justify-between mb-2">
        {label && (
          <Typography
            variation="body"
            className={labelClassName || "text-input-label font-sans-semibold"}
          >
            {label}
          </Typography>
        )}
        {maxLength && (
          <Typography
            variation="caption"
            className="font-sans-regular"
            style={{ color: charCounterColor }}
          >
            {characterCount} / {maxLength}
          </Typography>
        )}
      </View>

      {/* Textarea Container */}
      <View
        className={containerClassName || getContainerStyle()}
        style={[
          {
            borderColor,
          },
          containerStyle,
        ]}
      >
        {/* Text Input */}
        <TextInput
          style={{
            color: INPUT_COLORS.text,
            fontSize: 16,
            textAlignVertical: "top",
          }}
          className={
            inputClassName || "font-sans-regular text-input-text flex-1"
          }
          placeholder={placeholder}
          placeholderTextColor={INPUT_COLORS.placeholder}
          editable={!isDisabled}
          scrollEnabled={true}
          multiline={true}
          numberOfLines={8}
          maxLength={maxLength}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>

      {/* Error Message */}
      {errorMessage && (
        <Typography variation="caption" className="text-status-error mt-2">
          {errorMessage}
        </Typography>
      )}
    </View>
  );
}
