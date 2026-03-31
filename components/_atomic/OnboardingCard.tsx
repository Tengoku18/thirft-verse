import { Typography } from "@/components/ui/Typography/Typography";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";

interface OnboardingCardProps {
  image: ImageSourcePropType;
  tag: string;
  title: string;
  subtitle: string;
}

export function OnboardingCard({
  image,
  tag,
  title,
  subtitle,
}: OnboardingCardProps) {
  return (
    <View className="rounded-xl overflow-hidden shadow-lg aspect-video">
      {/* Background Image */}
      <Image source={image} className="w-full h-full" resizeMode="cover" />

      {/* Gradient Overlay - transparent at top, dark at bottom */}
      <LinearGradient
        colors={[
          "rgba(59, 48, 48, 0)",
          "rgba(59, 48, 48, 0.3)",
          "rgba(59, 48, 48, 1)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      {/* Content Container */}
      <View className="absolute inset-0 justify-end p-4">
        {/* Tag Badge */}
        <View className="bg-brand-tan rounded-full px-3 py-1 mb-2 self-start">
          <Typography
            variation="caption"
            className="!text-white uppercase font-sans-bold"
            style={{ letterSpacing: 1.3 }}
          >
            {tag}
          </Typography>
        </View>

        {/* Title */}
        <Typography
          variation="h2"
          className="text-white mb-1 tracking-widest"
          style={{ fontWeight: "900" }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {/* <Typography variation="body" className="text-white font-sans-medium">
          {subtitle}
        </Typography> */}
      </View>
    </View>
  );
}

export default OnboardingCard;
