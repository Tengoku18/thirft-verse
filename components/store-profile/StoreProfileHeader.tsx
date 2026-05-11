import { CrownCircleIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import React from "react";
import { Image, View } from "react-native";

interface StoreProfileHeaderProps {
  name: string;
  storeUsername: string;
  bio?: string | null;
  profileImage?: string | null;
  isFounder?: boolean;
}

export function StoreProfileHeader({
  name,
  storeUsername,
  bio,
  profileImage,
  isFounder,
}: StoreProfileHeaderProps) {
  const avatarUri = profileImage ? getProfileImageUrl(profileImage) : null;

  return (
    <>
      {/* Avatar + info */}
      <View className="items-center pt-7 pb-2 px-6">
        {/* Avatar */}
        <View className="relative">
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="w-28 h-28 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-ui-border-light items-center justify-center">
              <Typography variation="h1" className="text-ui-secondary">
                {name.charAt(0).toUpperCase()}
              </Typography>
            </View>
          )}
          {isFounder && (
            <View className="absolute bottom-1 right-1 border-2 border-white rounded-full">
              <CrownCircleIcon size={26} />
            </View>
          )}
        </View>

        {/* Name */}
        <Typography
          variation="h3"
          className="text-brand-espresso font-folito-bold text-center mt-3"
        >
          {name}
        </Typography>

        {/* Username */}
        <Typography
          variation="body-sm"
          className="text-brand-tan font-sans-semibold mt-0.5"
        >
          @{storeUsername}
        </Typography>

        {/* Bio */}
        {bio ? (
          <Typography
            variation="body-sm"
            className="text-ui-secondary text-center mt-2.5 leading-relaxed max-w-xs"
          >
            {bio}
          </Typography>
        ) : null}
      </View>
    </>
  );
}
