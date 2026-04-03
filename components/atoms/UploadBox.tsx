import { Typography } from "@/components/ui/Typography/Typography";

import React from "react";
import { Image, Pressable, View } from "react-native";

interface UploadBoxProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  image?: string | null;
}

export function UploadBox({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  className,
  image,
}: UploadBoxProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={
        className ||
        `border-2 border-dashed rounded-3xl py-12 px-6 items-center justify-center bg-white`
      }
      style={{
        borderColor: "#3b303033",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {image ? (
        // Show selected image
        <Image
          source={{ uri: image }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 16,
          }}
          resizeMode="contain"
        />
      ) : (
        // Show upload prompt with icon
        <>
          {/* Icon Container */}
          <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center mb-4">
            <View className="text-3xl">{icon}</View>
          </View>

          {/* Title */}
          <Typography
            variation="h3"
            className="text-center font-sans-bold mb-1"
          >
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography
              variation="body-sm"
              className="text-slate-400 text-center"
            >
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </Pressable>
  );
}
