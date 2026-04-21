import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SocialAuthButtonProps {
  label: string;
  icon?: ImageSourcePropType;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  fullWidth?: boolean;
  testID?: string;
}

/**
 * SocialAuthButton Component
 *
 * A reusable button for social authentication (Google, Apple, etc.).
 *
 * Features:
 * - Icon support with customizable sizing
 * - Loading state with spinner
 * - Disabled state with reduced opacity
 * - Consistent styling with white background and border
 * - Full width option
 *
 * @example
 * ```tsx
 * <SocialAuthButton
 *   label="Continue with Google"
 *   icon={require("@/assets/auth/signin/google.png")}
 *   onPress={handleGoogleSignIn}
 *   isLoading={googleLoading}
 * />
 * ```
 */
export function SocialAuthButton({
  label,
  icon,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  className,
  fullWidth = true,
  testID,
}: SocialAuthButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseClasses = `flex-row items-center justify-center rounded-xl py-4 gap-3 transition-all ${
    fullWidth ? "w-full" : ""
  } ${isDisabled ? "opacity-50" : ""}`;

  const containerClass =
    className ||
    `${baseClasses} bg-white dark:bg-slate-900 border border-ui-border-light dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-800`;

  return (
    <TouchableOpacity
      className={containerClass}
      style={style}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {icon && <Image source={icon} className="w-5 h-5" resizeMode="contain" />}

      {isLoading ? (
        <ActivityIndicator size="small" color="#3B3030" />
      ) : (
        <Text className="text-slate-700 dark:text-slate-200 font-sans-bold text-base">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default SocialAuthButton;
