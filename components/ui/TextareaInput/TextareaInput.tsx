import { INPUT_COLORS } from "@/constants/theme";
import { useState } from "react";
import {
  Platform,
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
  informationMessage,
  infoMessageType = "default",
  value = "",
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = variant === "disabled" || !editable;

  const getContainerStyle = () => {
    const baseClasses = `rounded-3xl px-4 ${Platform.OS === "ios" ? "py-4" : ""} bg-white`;
    if (variant === "disabled") {
      return (
        baseClasses +
        " border border-ui-border-light bg-brand-off-white opacity-50"
      );
    }
    if (errorMessage) {
      return baseClasses + " border border-status-error";
    }
    return baseClasses + " border";
  };

  const borderColor = isFocused
    ? INPUT_COLORS.borderFocus
    : errorMessage
      ? "#DC2626"
      : INPUT_COLORS.border;

  const characterCount = typeof value === "string" ? value.length : 0;
  const charCounterColor =
    characterCount >= (maxLength || 500) ? "#DC2626" : "#9CA3AF";

  // Line height 22 per line + internal padding
  const inputMinHeight = numberOfLines * 22 + 16;

  return (
    <View>
      {/* Label + character counter */}
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

      {/* Textarea container */}
      <View
        className={containerClassName || getContainerStyle()}
        style={[{ borderColor }, containerStyle]}
      >
        <TextInput
          style={{
            color: INPUT_COLORS.text,
            fontSize: Platform.OS === "ios" ? 20 : 16,
            lineHeight: 22,
            textAlignVertical: "top",
            minHeight: inputMinHeight,
          }}
          className={inputClassName || "font-sans-regular text-input-text"}
          placeholder={placeholder}
          placeholderTextColor={INPUT_COLORS.placeholder}
          editable={!isDisabled}
          scrollEnabled={false}
          multiline
          maxLength={maxLength}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>

      {/* Error message */}
      {errorMessage && (
        <Typography variation="caption" className="text-status-error mt-2 ml-1">
          {errorMessage}
        </Typography>
      )}

      {/* Info message — only shown when no error */}
      {!errorMessage && informationMessage && (
        <Typography
          variation="caption"
          className="mt-2 ml-1"
          style={{
            color: infoMessageType === "secondary" ? "#9CA3AF" : "#6B7280",
          }}
        >
          {informationMessage}
        </Typography>
      )}
    </View>
  );
}
