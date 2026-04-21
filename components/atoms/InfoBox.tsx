import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { View, ViewProps } from "react-native";

interface InfoBoxProps extends ViewProps {
  message: string;
  type?: "info" | "success" | "warning" | "error" | "secondary";
  showIcon?: boolean;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  message,
  type = "info",
  showIcon = true,
  className,
  ...props
}) => {
  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "#DC2626",
          text: "#DC2626",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "#10b981",
          text: "#10b981",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: "#F59E0B",
          text: "#F59E0B",
        };
      case "secondary":
        return {
          bg: "rgba(212, 163, 115, 0.08)",
          border: "rgba(212, 163, 115, 0.25)",
          icon: "#D4A373",
          text: "#6B705C",
        };
      case "info":
      default:
        return {
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: "#3B82F6",
          text: "#3B82F6",
        };
    }
  };

  const styles = getStyles();

  return (
    <View
      className={`flex-row items-start rounded-3xl px-4 py-3 border ${
        typeof styles.bg === "string" ? styles.bg : ""
      } ${typeof styles.border === "string" ? styles.border : ""} ${
        className || ""
      }`}
      style={
        typeof styles.bg !== "string" || typeof styles.border !== "string"
          ? {
              backgroundColor:
                typeof styles.bg !== "string" ? styles.bg : undefined,
              borderColor:
                typeof styles.border !== "string" ? styles.border : undefined,
              borderWidth: 1,
            }
          : undefined
      }
      {...props}
    >
      {showIcon && (
        <View style={{ marginRight: 12, marginTop: 2 }}>
          <IconSymbol name="info.circle.fill" size={20} color={styles.icon} />
        </View>
      )}
      <Typography
        variation="body-sm"
        className="flex-1 font-sans-regular"
        style={{
          color: typeof styles.text === "string" ? styles.text : "#6B705C",
        }}
      >
        {message}
      </Typography>
    </View>
  );
};
