import { SkeletonLoader } from "@/components/atoms/SkeletonLoader";
import React from "react";
import { View } from "react-native";

export function ExploreProductSkeleton() {
  return (
    <View className="flex-1">
      <View style={{ aspectRatio: 4 / 5, borderRadius: 16, overflow: "hidden" }}>
        <SkeletonLoader width="100%" height="100%" borderRadius={16} />
      </View>
      <View className="pt-2" style={{ gap: 6 }}>
        <SkeletonLoader width="80%" height={14} borderRadius={4} />
        <SkeletonLoader width="50%" height={11} borderRadius={4} />
        <SkeletonLoader width="60%" height={16} borderRadius={4} />
      </View>
    </View>
  );
}
