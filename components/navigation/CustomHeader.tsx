import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HeadingSemiboldText } from '@/components/Typography';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  backRoute?: string;
  rightIcon?: {
    name: string;
    onPress: () => void;
  };
  centered?: boolean;
}

export function CustomHeader({
  title,
  showBackButton = false,
  backRoute,
  rightIcon,
  centered = true,
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
    <View className="px-6 pt-16 pb-6 border-b border-[#F3F4F6] bg-white">
      <View className="flex-row items-center justify-between">
        {/* Left Section - Back Button or Empty Space */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 justify-center items-start"
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={24} color="#3B2F2F" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}

        {/* Center Section - Title */}
        <HeadingSemiboldText style={{ fontSize: 24 }}>
          {title}
        </HeadingSemiboldText>

        {/* Right Section - Icon or Empty Space */}
        {rightIcon ? (
          <TouchableOpacity
            onPress={rightIcon.onPress}
            className="w-10 h-10 justify-center items-end"
            activeOpacity={0.7}
          >
            <IconSymbol name={rightIcon.name as any} size={24} color="#3B2F2F" />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>
    </View>
  );
}
