import { ChevronRightIcon, UserIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { ProductWithStore } from "@/lib/types/database";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface Props {
  store: ProductWithStore["store"];
  onPress: () => void;
}

export function SellerCard({ store, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-100"
    >
      {store?.profile_image ? (
        <Image
          source={{ uri: getProfileImageUrl(store.profile_image) }}
          style={{ width: 44, height: 44, borderRadius: 22 }}
        />
      ) : (
        <View className="w-11 h-11 rounded-full bg-brand-beige items-center justify-center">
          <UserIcon width={20} height={20} color="#3B3030" />
        </View>
      )}
      <View className="flex-1">
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-semibold"
        >
          {store?.name ?? "Unknown Seller"}
        </Typography>
        {store?.store_username && (
          <Typography variation="caption" className="text-ui-secondary">
            @{store.store_username}
          </Typography>
        )}
      </View>
      <View className="flex-row items-center gap-1">
        <Typography variation="caption" className="text-brand-tan font-semibold">
          View Store
        </Typography>
        <ChevronRightIcon width={14} height={14} color="#B8860B" />
      </View>
    </TouchableOpacity>
  );
}
