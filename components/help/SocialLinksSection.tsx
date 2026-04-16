import Ionicons from "@expo/vector-icons/Ionicons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Linking, Pressable, View } from "react-native";

interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

interface SocialLinksSectionProps {
  links: SocialLink[];
}

export function SocialLinksSection({ links }: SocialLinksSectionProps) {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View className="px-4 py-10 items-center gap-4">
      <Typography
        variation="caption"
        className="text-slate-500 font-sans-bold uppercase tracking-widest"
      >
        Follow the Community
      </Typography>

      <View className="flex-row gap-6">
        {links.map((link, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(link.url)}
            className="w-12 h-12 rounded-full items-center justify-center active:opacity-60"
            style={{ backgroundColor: "rgba(107, 112, 92, 0.1)" }}
          >
            <Ionicons name={link.icon as any} size={22} color="#3B3030" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
