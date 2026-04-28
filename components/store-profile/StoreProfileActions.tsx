import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { View } from "react-native";

interface StoreProfileActionsProps {
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function StoreProfileActions({
  onEditProfile,
  onShare,
}: StoreProfileActionsProps) {
  return (
    <View className="flex-row px-5 py-5 gap-3">
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
      <View className="flex-1">
        <Button
          label="Edit Profile"
          variant="secondary"
          size="compact"
          fullWidth
          onPress={onEditProfile}
          icon={<IconSymbol name="pencil" size={18} color="#3B3030" />}
          iconPosition="left"
          noShadow
        />
      </View>
    </View>
  );
}
