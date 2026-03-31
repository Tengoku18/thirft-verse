import { Typography } from "@/components/ui/Typography/Typography";
import type { TypographyVariation } from "@/components/ui/Typography/Typography.types";
import { Link as ExpoLink } from "expo-router";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

export type LinkVariant = "primary" | "secondary" | "destructive";
export type LinkType = "internal" | "external";

interface BaseLinkProps {
  label: string;
  variant?: LinkVariant;
  typographyVariation?: TypographyVariation;
  underline?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  testID?: string;
  href: string;
  onPress?: () => void;
}

interface InternalLinkProps extends BaseLinkProps {
  type?: "internal";
}

interface ExternalLinkProps extends BaseLinkProps {
  type: "external";
}

type LinkProps = InternalLinkProps | ExternalLinkProps;

interface LinkStyles {
  text: string;
}

function getVariantClasses(
  variant: LinkVariant,
  disabled: boolean,
  underline: boolean,
): LinkStyles {
  const underlineClass = underline ? "underline" : "";
  const baseStyle = "text-base";

  if (disabled) {
    return {
      text: `${baseStyle} text-ui-tertiary opacity-50 ${underlineClass}`,
    };
  }

  switch (variant) {
    case "secondary":
      return {
        text: `${baseStyle} font-sans-semibold text-secondary-500 ${underlineClass}`,
      };

    case "destructive":
      return {
        text: `${baseStyle} font-sans-bold text-status-error ${underlineClass}`,
      };

    case "primary":
    default:
      return {
        text: `${baseStyle} font-sans-bold text-brand-espresso ${underlineClass}`,
      };
  }
}

/**
 * Link Component - Unified implementation with variants and typography support
 *
 * Link Variants (color): primary | secondary | destructive
 * Typography Variations (size/weight): h1-h5 | body | body-sm | body-xs | button | caption | label
 * Types: internal (routing) | external (URL/onPress)
 *
 * Usage:
 * <Link label="Home" href="/" type="internal" variant="primary" typographyVariation="body-sm" />
 * <Link label="Visit Site" href="https://example.com" type="external" typographyVariation="caption" />
 */
export function Link({
  label,
  variant = "primary",
  typographyVariation = "body-sm",
  underline = false,
  disabled = false,
  style,
  className,
  testID,
  href,
  onPress,
  type = "internal",
}: LinkProps) {
  const styles = getVariantClasses(variant, disabled, underline);
  const textClass = className || styles.text;

  if (type === "external") {
    return (
      <Pressable
        style={style}
        onPress={onPress}
        disabled={disabled}
        accessible={true}
        accessibilityRole="link"
      >
        {({ pressed }) => (
          <Typography
            variation={typographyVariation}
            className={textClass}
            style={{ opacity: pressed ? 0.7 : 1 }}
            numberOfLines={1}
            allowFontScaling={false}
            testID={testID}
          >
            {label}
          </Typography>
        )}
      </Pressable>
    );
  }

  return (
    <ExpoLink href={href as any} asChild>
      <Pressable
        disabled={disabled}
        accessible={true}
        accessibilityRole="link"
        style={style}
      >
        {({ pressed }) => (
          <Typography
            variation={typographyVariation}
            className={textClass}
            style={{ opacity: pressed ? 0.7 : 1 }}
            numberOfLines={1}
            allowFontScaling={false}
            testID={testID}
          >
            {label}
          </Typography>
        )}
      </Pressable>
    </ExpoLink>
  );
}
