import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography/Typography";

export type ButtonVariant = "primary" | "secondary" | "accent";
export type ButtonSize = "large" | "compact";

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  fullWidth?: boolean;
  testID?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

interface ButtonStyles {
  container: string;
  text: string;
  indicator: string;
}

function getButtonStyles(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  disabled: boolean,
): ButtonStyles {
  const heightClass = size === "compact" ? "h-14" : "h-16";
  const widthClass = fullWidth ? "" : "";
  const baseStyles = `flex-row items-center justify-center ${heightClass} ${widthClass} rounded-3xl active:scale-95 transition-all`;

  switch (variant) {
    case "secondary":
      return {
        container: `${baseStyles} border border-brand-espresso bg-transparent active:opacity-80`,
        text: "text-brand-espresso font-sans-bold text-base",
        indicator: "#3B3030",
      };

    case "accent":
      const accentHeight = size === "compact" ? "h-10" : "h-12";
      return {
        container: `flex-row items-center justify-center ${accentHeight} ${widthClass} rounded-lg bg-brand-tan active:opacity-90 transition-all px-4`,
        text: "text-white font-sans-bold text-base",
        indicator: "#FFFFFF",
      };

    case "primary":
    default:
      return {
        container: `${baseStyles} bg-brand-espresso shadow-md active:opacity-90`,
        text: "text-white font-sans-extrabold text-base",
        indicator: "#FFFFFF",
      };
  }
}

/**
 * Button Component - Unified implementation with variants
 * Variants: primary | secondary | accent
 * Sizes: large (56px) | compact (48px)
 *
 * Usage:
 * <Button label="Sign In" variant="primary" onPress={() => {}} />
 * <Button label="Skip" variant="secondary" size="compact" />
 * <Button label="View" variant="accent" icon={<Icon />} />
 */
export function Button({
  label,
  variant = "primary",
  size = "large",
  onPress,
  isLoading = false,
  disabled = false,
  style,
  className = "",
  fullWidth = true,
  testID,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const styles = getButtonStyles(variant, size, fullWidth, disabled);
  const containerClass = className || styles.container;

  console.log({ styles, disabled });

  return (
    <View style={{ opacity: disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        className={containerClass}
        style={style}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.9}
        testID={testID}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={styles.indicator} />
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            {icon && iconPosition === "left" && (
              <View className="h-6 w-6 items-center justify-center flex-shrink-0">
                {icon}
              </View>
            )}
            <Typography
              className={styles.text}
              variation="button"
              numberOfLines={1}
              allowFontScaling={false}
            >
              {label}
            </Typography>
            {icon && iconPosition === "right" && (
              <View className="h-6 w-6 items-center justify-center flex-shrink-0">
                {icon}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
