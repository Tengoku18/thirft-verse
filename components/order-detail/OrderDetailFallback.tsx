import { CustomHeader } from "@/components/navigation/CustomHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Typography from "@/components/ui/Typography";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";

// ─── Animated skeleton block ───

function Bone({ width, height, borderRadius = 8 }: { width: number | string; height: number; borderRadius?: number }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius,
        backgroundColor: "#E5DDD5",
        opacity,
      }}
    />
  );
}

// ─── Skeleton card shell ───

function SkeletonCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={[{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 12,
      }, style]}
    >
      {children}
    </View>
  );
}

export function OrderDetailLoading() {
  return (
    <View className="flex-1 bg-[#FAF7F2]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Order Details" showBackButton />

      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status card */}
        <SkeletonCard>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ gap: 8 }}>
              <Bone width={100} height={28} borderRadius={20} />
              <Bone width={60} height={14} />
            </View>
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              <Bone width={110} height={26} />
              <Bone width={80} height={12} />
            </View>
          </View>
        </SkeletonCard>

        {/* Section label */}
        <Bone width={120} height={14} />

        {/* Item card */}
        <SkeletonCard style={{ flexDirection: "row", gap: 12 } as any}>
          <Bone width={72} height={72} borderRadius={12} />
          <View style={{ flex: 1, gap: 10, justifyContent: "center" }}>
            <Bone width="80%" height={14} />
            <Bone width="50%" height={12} />
            <Bone width="35%" height={12} />
          </View>
        </SkeletonCard>

        {/* Section label */}
        <Bone width={140} height={14} />

        {/* Buyer card */}
        <SkeletonCard style={{ gap: 10 } as any}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Bone width={80} height={12} />
            <Bone width={130} height={12} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Bone width={60} height={12} />
            <Bone width={160} height={12} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Bone width={60} height={12} />
            <Bone width={110} height={12} />
          </View>
        </SkeletonCard>

        {/* Section label */}
        <Bone width={130} height={14} />

        {/* Shipping card */}
        <SkeletonCard style={{ gap: 10 } as any}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Bone width={90} height={12} />
            <Bone width={120} height={12} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Bone width={70} height={12} />
            <Bone width={140} height={12} />
          </View>
        </SkeletonCard>
      </ScrollView>
    </View>
  );
}

export function OrderDetailError() {
  return (
    <View className="flex-1 bg-[#FAF7F2]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Order Details" showBackButton />
      <View className="flex-1 items-center justify-center px-8 gap-4">
        <View
          className="items-center justify-center rounded-full bg-red-100"
          style={{ width: 72, height: 72 }}
        >
          <IconSymbol name="exclamationmark.triangle.fill" size={34} color="#DC2626" />
        </View>
        <Typography variation="h3" className="text-brand-espresso">Order Not Found</Typography>
        <Typography variation="body" className="text-gray-500 text-center">
          We could not find the details for this order.
        </Typography>
      </View>
    </View>
  );
}
