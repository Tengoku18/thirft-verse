import { BodyMediumText, HeadingSemiboldText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  backRoute?: string;
  rightIcon?: {
    name: string;
    onPress: () => void;
  };
  rightAction?: {
    label: string;
    icon?: string;
    onPress: () => void;
    color?: string;
  };
}

export function CustomHeader({
  title,
  showBackButton = false,
  backRoute,
  rightIcon,
  rightAction,
}: CustomHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backRoute) {
      router.push(backRoute as any);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="px-4 pb-4 border-b border-[#F3F4F6] bg-white">
        <View className="flex-row items-center justify-between">
          {/* Left Section - Back Button + Title (left-aligned) or just Back Button (centered) */}
          <View className="flex-row items-center flex-1">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBack}
                className="w-10 h-10 justify-center items-start"
                activeOpacity={0.7}
              >
                <IconSymbol name="chevron.left" size={22} color="#3B2F2F" />
              </TouchableOpacity>
            )}
            <HeadingSemiboldText style={{ fontSize: 18 }}>
              {title}
            </HeadingSemiboldText>
          </View>

          {/* Right Section - Text Action, Icon, or Empty Space */}
          <View className="flex-1 items-end">
            {rightAction ? (
              <TouchableOpacity
                onPress={rightAction.onPress}
                className="flex-row items-center px-3 py-1.5 rounded-full"
                style={{ backgroundColor: rightAction.color ? `${rightAction.color}15` : "#3B2F2F15" }}
                activeOpacity={0.7}
              >
                {rightAction.icon && (
                  <IconSymbol
                    name={rightAction.icon as any}
                    size={14}
                    color={rightAction.color || "#3B2F2F"}
                    style={{ marginRight: 4 }}
                  />
                )}
                <BodyMediumText
                  style={{
                    fontSize: 13,
                    color: rightAction.color || "#3B2F2F",
                  }}
                >
                  {rightAction.label}
                </BodyMediumText>
              </TouchableOpacity>
            ) : rightIcon ? (
              <TouchableOpacity
                onPress={rightIcon.onPress}
                className="w-10 h-10 justify-center items-end"
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={rightIcon.name as any}
                  size={24}
                  color="#3B2F2F"
                />
              </TouchableOpacity>
            ) : (
              <View className="w-10" />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
