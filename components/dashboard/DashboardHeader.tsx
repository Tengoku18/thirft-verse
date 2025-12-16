import {
  BodyMediumText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { Profile } from "@/lib/types/database";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface DashboardHeaderProps {
  profile: Profile | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
}) => {
  const router = useRouter();

  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {profile?.profile_image ? (
            <Image
              source={{ uri: getProfileImageUrl(profile.profile_image) }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#F3F4F6",
              }}
            />
          ) : (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#3B2F2F",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 18 }}>
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </BodySemiboldText>
            </View>
          )}
          <View className="ml-3">
            <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
              Welcome back,
            </BodyMediumText>
            <HeadingBoldText style={{ fontSize: 18 }}>
              {profile?.name?.split(" ")[0] || "User"}
            </HeadingBoldText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <IconSymbol name="gearshape.fill" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
