import { ThemedText } from "@/components/themed-text";
import { LOGOS } from "@/constants/logos";
import React from "react";
import { Image, View } from "react-native";

interface TabHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

export function TabHeader({ title, rightComponent }: TabHeaderProps) {
  return (
    <View className="px-4 pt-3 pb-3 bg-white">
      <View className="flex-row items-center justify-between">
        {/* Logo on the left */}
        <View className="w-10 items-start">
          <Image
            source={LOGOS.icon}
            style={{ width: 38, height: 38 }}
            resizeMode="contain"
          />
        </View>

        {/* Centered title */}
        <View className="flex-1 items-center">
          <ThemedText
            className="text-[18px] font-[NunitoSans_800ExtraBold]"
            style={{ color: "#3B2F2F" }}
          >
            {title}
          </ThemedText>
        </View>

        {/* Right component or placeholder for balance */}
        <View className="w-10 items-end">
          {rightComponent}
        </View>
      </View>
    </View>
  );
}
