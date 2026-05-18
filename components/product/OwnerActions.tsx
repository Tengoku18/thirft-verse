import { GlobeIcon, ShareIcon, SquarePencilIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  onEdit: () => void;
  onShare: () => void;
  onWebsite: () => void;
  onDelete: () => void;
}

export function OwnerActions({ onEdit, onShare, onWebsite, onDelete }: Props) {
  return (
    <View className="gap-3">
      <Button
        label="Edit Product"
        variant="primary"
        onPress={onEdit}
        icon={<SquarePencilIcon width={18} height={18} color="#FFFFFF" />}
        noShadow
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label="Share"
            variant="secondary"
            onPress={onShare}
            icon={<ShareIcon width={18} height={18} color="#3B3030" />}
            noShadow
          />
        </View>
        <View className="flex-1">
          <Button
            label="Website"
            variant="secondary"
            onPress={onWebsite}
            icon={<GlobeIcon width={18} height={18} color="#3B3030" />}
            noShadow
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={onDelete}
        className="w-full h-14 flex-row items-center justify-center gap-2 rounded-3xl bg-red-50 border border-red-200"
        activeOpacity={0.8}
      >
        <TrashIcon width={18} height={18} color="#DC2626" />
        <Typography variation="button" className="text-red-600">
          Delete Product
        </Typography>
      </TouchableOpacity>
    </View>
  );
}
