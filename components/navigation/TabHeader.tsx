import { IconSymbol } from "@/components/ui/icon-symbol";
import { LOGOS } from "@/constants/logos";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StatusBar, TouchableOpacity, View } from "react-native";
import { HeadingBoldText } from "../Typography";

interface TabHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  showDefaultIcons?: boolean; // Show search & profile icons (Messenger-style)
  showTextLogo?: boolean; // Show text logo instead of icon + title (for dashboard)
}

export function TabHeader({
  title,
  showBackButton = false,
  onBack,
  rightComponent,
  showDefaultIcons = true,
  showTextLogo = false,
}: TabHeaderProps) {
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile.profile);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      className="px-4 pb-4 bg-red-500"
      style={{ backgroundColor: "#3B2F2F" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3B2F2F" />
      <View className="flex-row items-center justify-between h-10">
        {/* Left - Logo + Title or Back Button */}
        <View className="flex-row items-center">
          {showBackButton ? (
            <>
              <TouchableOpacity
                onPress={handleBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <IconSymbol name="chevron.left" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              {title && (
                <HeadingBoldText style={{ fontSize: 18, color: "#FFFFFF" }}>
                  {title}
                </HeadingBoldText>
              )}
            </>
          ) : showTextLogo ? (
            <Image
              source={LOGOS.text}
              style={{ width: 120, height: 32 }}
              resizeMode="contain"
            />
          ) : (
            <View className="flex-row items-center">
              <Image
                source={LOGOS.icon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <HeadingBoldText
                style={{ fontSize: 20, color: "#FFFFFF", marginLeft: 10 }}
              >
                {title || "ThriftVerse"}
              </HeadingBoldText>
            </View>
          )}
        </View>

        {/* Right - Icons or Custom Component */}
        <View className="flex-row items-center" style={{ gap: 16 }}>
          {rightComponent ? (
            rightComponent
          ) : showDefaultIcons ? (
            <>
              <TouchableOpacity
                onPress={() => router.push("/explore")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <IconSymbol name="magnifyingglass" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/settings")}
                className="rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <IconSymbol name="gearshape.fill" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}
