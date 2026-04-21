import EyeCloseIcon from "@/components/icons/EyeCloseIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import { INPUT_COLORS } from "@/constants/theme";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Typography from "../Typography";

export type InputVariant = "default" | "error" | "success" | "disabled";

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
}

export function Input({
  label,
  placeholder,
  variant = "default",
  leftIcon,
  rightIcon,
  containerClassName,
  inputClassName,
  labelClassName,
  errorMessage,
  containerStyle,
  editable = true,
  secureTextEntry = false,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = variant === "disabled" || !editable;
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  console.log("label", label, "variant", variant);

  // Get variant-specific styles
  const getContainerStyle = () => {
    const verticalPadding = Platform.OS === "ios" ? "py-4" : "";
    const baseClasses = `flex-row items-center rounded-3xl px-4 bg-white ${verticalPadding}`;

    switch (variant) {
      case "disabled":
        return (
          baseClasses +
          " border border-ui-border-light bg-brand-off-white opacity-50 "
        );
      default:
        return baseClasses + " border";
    }
  };

  const EyeToggleIcon = (): React.ReactElement => (
    <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
      {showPassword ? (
        <EyeIcon width={20} height={20} />
      ) : (
        <EyeCloseIcon width={20} height={20} />
      )}
    </Pressable>
  );

  // Determine border color based on focus and error state
  const borderColor = isFocused
    ? INPUT_COLORS.borderFocus
    : errorMessage
      ? "#DC2626"
      : INPUT_COLORS.border;

  return (
    <View>
      {label && (
        <Typography
          variation="body"
          className={
            labelClassName || "text-input-label font-sans-semibold mb-2"
          }
        >
          {label}
        </Typography>
      )}

      <View
        className={containerClassName || getContainerStyle()}
        style={[
          {
            borderColor,
          },
          containerStyle,
        ]}
      >
        {/* Left Icon Container */}
        {leftIcon && (
          <View className="mr-2 h-full flex-row items-center justify-center">
            {leftIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={{
            flex: 1,
            textAlignVertical: "center",
            minHeight: 26,
            color: INPUT_COLORS.text,
            fontSize: Platform.OS === "ios" ? 20 : 16,
          }}
          className={
            inputClassName ||
            "flex-1 font-sans-regular flex-row items-center text-input-text"
          }
          placeholder={placeholder}
          placeholderTextColor={INPUT_COLORS.placeholder}
          editable={!isDisabled}
          scrollEnabled={false}
          secureTextEntry={showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon Container */}

        {secureTextEntry
          ? EyeToggleIcon()
          : rightIcon && (
              <View className="ml-2 h-full flex-row items-center justify-center">
                {rightIcon}
              </View>
            )}
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
