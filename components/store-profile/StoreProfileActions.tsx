import { Button } from "@/components/ui/Button";
import React from "react";
import { View } from "react-native";
import { PencilIcon, ShareIcon } from "@/components/icons";

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
            <ShareIcon width={18} height={18} color="#fff" />
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
          icon={<PencilIcon width={18} height={18} color="#3B3030" />}
          iconPosition="left"
          noShadow
        />
      </View>
    </View>
  );
}
