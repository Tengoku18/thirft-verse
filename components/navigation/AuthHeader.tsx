import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity, View } from "react-native";

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
          <IconSymbol name="chevron.left" size={22} color="#3B2F2F" />
        </TouchableOpacity>
        <ThemedText
          className="text-[20px] font-[NunitoSans_700Bold] tracking-tight"
          style={{ color: "#3B2F2F" }}
        >
          {title}
        </ThemedText>
      </View>

      {rightComponent && (
        <View className="items-center justify-center">{rightComponent}</View>
      )}
    </View>
  );
}
