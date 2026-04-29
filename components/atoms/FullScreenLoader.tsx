import React from "react";
import { Typography } from "@/components/ui/Typography";
import { ActivityIndicator, View } from "react-native";

interface FullScreenLoaderProps {
  message?: string;
  backgroundColor?: string;
  color?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message,
  backgroundColor,
  color = "#3B2F2F",
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      <ActivityIndicator size="large" color={color} />
      {message && (
        <Typography variation="body-sm" style={{ color: "#9CA3AF", marginTop: 12 }}>
          {message}
        </Typography>
      )}
    </View>
  );
};
