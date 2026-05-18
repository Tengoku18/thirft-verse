import { SkeletonLoader } from "@/components/atoms/SkeletonLoader";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { ProductCardGridSkeleton } from "@/components/molecules/ProductCardSkeleton";
import React from "react";
import { View } from "react-native";

interface ProfileScreenSkeletonProps {
  /** Settings button rendered in the header, kept consistent with the loaded screen. */
  rightComponent?: React.ReactNode;
}

/**
 * Loading placeholder for the Profile tab. Mirrors the layout of the
 * loaded profile screen (avatar, actions, tab bar, product grid).
 */
export function ProfileScreenSkeleton({
  rightComponent,
}: ProfileScreenSkeletonProps) {
  return (
    <TabScreenLayout
      title="Profile"
      headerVariant="light"
      scrollable={false}
      rightComponent={rightComponent}
    >
      {/* Avatar + name skeleton */}
      <View
        style={{
          alignItems: "center",
          paddingTop: 28,
          paddingBottom: 8,
          paddingHorizontal: 24,
        }}
      >
        <SkeletonLoader
          width={112}
          height={112}
          borderRadius={56}
          style={{ marginBottom: 14 }}
        />
        <SkeletonLoader
          width={140}
          height={18}
          borderRadius={8}
          style={{ marginBottom: 8 }}
        />
        <SkeletonLoader width={96} height={13} borderRadius={6} />
      </View>

      {/* Action buttons skeleton */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 20,
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <SkeletonLoader height={38} borderRadius={20} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader height={38} borderRadius={20} />
        </View>
      </View>

      {/* Tab bar skeleton */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingBottom: 14,
          gap: 28,
          borderBottomWidth: 1,
          borderBottomColor: "#E8E4E0",
        }}
      >
        <SkeletonLoader width={52} height={13} borderRadius={6} />
        <SkeletonLoader width={86} height={13} borderRadius={6} />
      </View>

      {/* Product grid skeleton */}
      <View style={{ padding: 10 }}>
        <ProductCardGridSkeleton
          count={4}
          variant="grid"
          aspectRatio={1}
          showHandle={false}
        />
      </View>
    </TabScreenLayout>
  );
}
