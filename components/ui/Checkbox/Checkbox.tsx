import { INPUT_COLORS } from "@/constants/theme";
import ExpoCheckbox from "expo-checkbox";
import React, { ReactNode } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Typography from "../Typography";

export type CheckboxVariant = "default" | "disabled";

interface CheckboxProps {
  checked?: boolean;
  onPress?: (checked: boolean) => void;
  label?: string | ReactNode;
  variant?: CheckboxVariant;
  containerClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  errorMessage?: string;
}

/**
 * Checkbox Component
 *
 * A reusable checkbox input using expo-checkbox library with custom UI styling.
 * Features:
 * - Uses expo-checkbox library for native support
 * - Matches Input component styling
 * - Label support with customizable styling
 * - Variants: default, disabled
 * - iOS and Android compatible
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onPress={(checked) => setIsChecked(checked)}
 *   label="Remember me"
 * />
 * ```
 */
export function Checkbox({
  checked = false,
  onPress,
  label,
  variant = "default",
  containerClassName,
  checkboxClassName,
  labelClassName,
  containerStyle,
  disabled = false,
  errorMessage,
}: CheckboxProps) {
  const isDisabled = variant === "disabled" || disabled;

  // Always use 1px border width for consistent light appearance
  const borderWidth = 1;

  return (
    <View>
      <View
        className={containerClassName || "flex-row items-start gap-3"}
        style={containerStyle}
      >
        {/* Checkbox Box */}
        <View
          className={
            checkboxClassName ||
            "w-5 h-5 border  rounded-xl items-center justify-center"
          }
          style={[
            {
              borderColor: errorMessage ? "#EF4444" : INPUT_COLORS.border,
              borderWidth,
              backgroundColor: isDisabled ? "#F5F1ED" : "white",
              opacity: isDisabled ? 0.5 : 1,
            },
          ]}
        >
          <ExpoCheckbox
            value={checked}
            onValueChange={!isDisabled ? onPress : undefined}
            color={
              checked
                ? errorMessage
                  ? "#EF4444"
                  : INPUT_COLORS.borderFocus
                : errorMessage
                  ? "#EF4444"
                  : INPUT_COLORS.border
            }
            disabled={isDisabled}
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
            }}
          />
        </View>

        {/* Label */}
        {label && (
          <Pressable
            onPress={() => {
              if (!isDisabled) {
                onPress?.(!checked);
              }
            }}
            disabled={isDisabled}
            style={{ flex: 1 }}
          >
            {typeof label === "string" ? (
              <Typography
                variation="body"
                className={
                  labelClassName || "font-sans-regular text-input-text"
                }
              >
                {label}
              </Typography>
            ) : (
              label
            )}
          </Pressable>
        )}
      </View>

      {/* Error Message */}
      {errorMessage && (
        <Typography
          variation="caption"
          className="text-red-600 mt-2"
          style={{ color: "#EF4444", marginLeft: 28, marginTop: 8 }}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  );
}

export default Checkbox;
