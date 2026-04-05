import NotificationIcon from "@/components/icons/NotificationIcon";
import { Typography } from "@/components/ui/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface HomeGreetingHeaderProps {
  name: string;
  avatarUrl?: string | null;
  hasUnread?: boolean;
}

export const HomeGreetingHeader: React.FC<HomeGreetingHeaderProps> = ({
  name,
  avatarUrl,
  hasUnread = false,
}) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-5 pt-5 pb-2">
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center overflow-hidden mr-3"
          style={{
            backgroundColor: "rgba(212, 163, 115, 0.25)",
            borderWidth: 2,
            borderColor: "#D4A373",
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Typography
              variation="h4"
              style={{ color: "#3B2F2F", fontSize: 18 }}
            >
              {name.charAt(0).toUpperCase()}
            </Typography>
          )}
        </View>
        <View>
          <Typography
            variation="body-sm"
            style={{ color: "rgba(59,47,47,0.6)", fontSize: 13 }}
          >
            Welcome back,
          </Typography>
          <Typography
            variation="h2"
            style={{ fontSize: 22, color: "#3B2F2F" }}
          >
            Hi, {name}! 👋
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/notifications" as never)}
        activeOpacity={0.8}
        className="relative p-2.5 rounded-2xl bg-white"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.05)",
        }}
      >
        <NotificationIcon width={22} height={22} fill="#3B2F2F" />
        {hasUnread && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 9,
              height: 9,
              borderRadius: 5,
              backgroundColor: "#EF4444",
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
