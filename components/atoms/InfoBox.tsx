import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { View, ViewProps } from "react-native";

interface InfoBoxProps extends ViewProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  message,
  type = "info",
  className,
  ...props
}) => {
  const getStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border border-red-200";
      case "success":
        return "bg-green-50 border border-green-200";
      case "warning":
        return "bg-yellow-50 border border-yellow-200";
      case "info":
      default:
        return "bg-slate-50 border border-slate-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-700";
      case "info":
      default:
        return "text-slate-600";
    }
  };

  return (
    <View
      className={`p-4 rounded-xl ${getStyles()} ${className || ""}`}
      {...props}
    >
      <Typography
        variation="body-sm"
        className={`leading-relaxed ${getTextColor()}`}
      >
        {message}
      </Typography>
    </View>
  );
};
