import { BodyBoldText } from "@/components/Typography";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export interface FormButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  fullWidth?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  className,
  ...props
}) => {
  const getVariantClasses = () => {
    if (disabled || loading) {
      return "bg-[#E5E1DB] opacity-70";
    }

    switch (variant) {
      case "primary":
        return "bg-[#3B2F2F] shadow-lg"; // Modern dark button
      case "secondary":
        return "bg-[#6B705C]";
      case "outline":
        return "bg-transparent border-[2px] border-[#3B2F2F]";
      default:
        return "bg-[#3B2F2F] shadow-lg";
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return "#3B2F2F";
    return "#FFFFFF";
  };

  return (
    <TouchableOpacity
      className={`h-[58px] rounded-2xl justify-center items-center px-6 ${getVariantClasses()} ${
        fullWidth ? "w-full" : ""
      } ${className || ""}`}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <BodyBoldText
          style={{
            color: getTextColor(),
            fontSize: 16,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </BodyBoldText>
      )}
    </TouchableOpacity>
  );
};
