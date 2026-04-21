import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";

interface StoreProfileActionsProps {
  onFollow?: () => void;
  onShare?: () => void;
  isFollowing?: boolean;
}

export function StoreProfileActions({
  onFollow,
  onShare,
  isFollowing,
}: StoreProfileActionsProps) {
  return (
    <View className="flex-row px-5 py-5 gap-3">
      <View className="flex-1">
        <Button
          label={isFollowing ? "Following" : "Follow"}
          variant={isFollowing ? "secondary" : "primary"}
          size="compact"
          fullWidth
          onPress={onFollow}
          icon={
            <IconSymbol
              name="person.badge.plus"
              size={18}
              color={isFollowing ? "#3B3030" : "#FFFFFF"}
            />
          }
          noShadow
          iconPosition="left"
        />
      </View>
      <View className="flex-1">
        <Button
          label="Share Store"
          variant="accent"
          size="compact"
          fullWidth
          onPress={onShare}
          icon={
            <IconSymbol name="square.and.arrow.up" size={18} color="#fff" />
          }
          iconPosition="left"
          noShadow
        />
      </View>
    </View>
  );
}
