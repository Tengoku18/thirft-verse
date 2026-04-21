import Typography from "@/components/ui/Typography";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

interface SocialAuthButtonProps {
  onPress: () => void;
  label: string;
  icon: ImageSourcePropType;
  disabled?: boolean;
  isLoading?: boolean;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * SocialAuthButton Component
 *
 * A standalone, reusable button component for social authentication.
 * Can be used for Google, Apple, or any other social provider.
 *
 * Features:
 * - Icon/Logo support with Image
 * - Clean pill-shaped design
 * - Disabled and loading states
 * - Customizable styling
 * - Reusable anywhere in the app
 *
 * @example
 * ```tsx
 * <SocialAuthButton
 *   onPress={handleGoogleSignIn}
 *   label="Continue with Google"
 *   icon={require("@/assets/auth/signin/google.png")}
 * />
 * ```
 */
export function SocialAuthButton({
  onPress,
  label,
  icon,
  disabled = false,
  isLoading = false,
  containerClassName,
  containerStyle,
}: SocialAuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={
        containerClassName ||
        "flex-row items-center justify-center rounded-full border border-ui-border-light bg-white px-6 py-4"
      }
      style={[
        {
          opacity: disabled || isLoading ? 0.5 : 1,
        },
        containerStyle,
      ]}
    >
      {/* Icon/Logo */}
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          marginRight: 12,
          resizeMode: "contain",
        }}
      />

      {/* Label */}
      <Typography
        variation="body"
        className="font-sans-semibold text-button-primary"
      >
        {label}
      </Typography>
    </Pressable>
  );
}

export default SocialAuthButton;
