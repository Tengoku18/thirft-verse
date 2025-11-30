import { IconSymbol } from "@/components/ui/icon-symbol";
import { LOGOS } from "@/constants/logos";
import { getProfileImageUrl } from "@/lib/storage-helpers";
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
}

export function TabHeader({
  title,
  showBackButton = false,
  onBack,
  rightComponent,
  showDefaultIcons = true,
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
                onPress={() => router.push("/profile")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                {profile?.profile_image ? (
                  <Image
                    source={{ uri: getProfileImageUrl(profile.profile_image) }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: "#FFFFFF",
                    }}
                  />
                ) : (
                  <IconSymbol name="person.circle" size={26} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}
