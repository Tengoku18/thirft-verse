import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BackIcon } from "@/components/icons";

interface AuthHeaderProps {
  title: string;
  onBack: () => void;
  rightComponent?: React.ReactNode;
}

export function AuthHeader({ title, onBack, rightComponent }: AuthHeaderProps) {
  return (
    <View className="flex-row items-center justify-between h-12 mb-4">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <BackIcon width={22} height={22} color="#3B2F2F" />
        </TouchableOpacity>
        <Typography variation="h3" style={{ letterSpacing: -0.5 }}>
          {title}
        </Typography>
      </View>

      {rightComponent && (
        <View className="items-center justify-center">{rightComponent}</View>
      )}
    </View>
  );
}
