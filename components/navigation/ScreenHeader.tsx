import { Typography } from "@/components/ui/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../icons/BackIcon";

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  backRoute?: string;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
}

/**
 * Clean, centered header component for screens
 * Displays title in center with back arrow on left
 */
export function ScreenHeader({
  title,
  showBackButton = true,
  backRoute,
  rightComponent,
  backgroundColor = "#FFFFFF",
}: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.push(backRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor }}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View
        className="px-6 py-4 border-b border-[#F3F4F6]"
        style={{ backgroundColor }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left - Back Button */}
          {showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 justify-center items-center"
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <BackIcon color={"#3B3030"} />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}

          {/* Center - Title */}
          <View className="flex-1 items-center">
            <Typography variation="h3" className="text-brand-espresso">
              {title}
            </Typography>
          </View>

          {/* Right - Custom Component or Empty Space */}
          {rightComponent ? (
            <View style={{ alignItems: "flex-end" }}>{rightComponent}</View>
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
