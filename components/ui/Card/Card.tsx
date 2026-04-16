import React from "react";
import { View, ViewProps } from "react-native";

export type CardVariant = "elevated" | "outlined" | "flat";

interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
}

function getCardStyles(variant: CardVariant): string {
  const base = "rounded-2xl p-4 bg-white";

  switch (variant) {
    case "outlined":
      return `${base} border border-ui-border-light`;
    case "flat":
      return `${base}`;
    case "elevated":
    default:
      return `${base} shadow-sm`;
  }
}

export function Card({
  variant = "elevated",
  children,
  className,
  style,
  ...props
}: CardProps) {
  const variantClass = getCardStyles(variant);
  const containerClass = className ? `${variantClass} ${className}` : variantClass;

  return (
    <View className={containerClass} style={style} {...props}>
      {children}
    </View>
  );
}
