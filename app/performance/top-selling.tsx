import { CustomHeader } from "@/components/navigation/CustomHeader";
import { TopSellingItem } from "@/components/performance/TopSellingItems";
import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const rankColors: Record<number, { bg: string; text: string }> = {
  0: { bg: "#FEF9C3", text: "#A16207" },
  1: { bg: "#F1F5F9", text: "#475569" },
  2: { bg: "#FFF7ED", text: "#C2410C" },
};

const ItemRow = ({
  item,
  index,
}: {
  item: TopSellingItem;
  index: number;
}) => {
  const rankStyle = rankColors[index] ?? { bg: "#F8F4EF", text: "#6B5E5E" };

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-brand-beige/30 last:border-b-0">
      {/* Rank */}
      <View
        style={{ backgroundColor: rankStyle.bg }}
        className="w-7 h-7 rounded-full items-center justify-center flex-shrink-0"
      >
        <Typography
          variation="label"
          style={{ fontSize: 11, fontWeight: "700", color: rankStyle.text }}
        >
          #{index + 1}
        </Typography>
      </View>

      {/* Thumbnail */}
      {item.coverImage ? (
        <Image
          source={{ uri: item.coverImage }}
          resizeMode="cover"
          style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
        />
      ) : (
        <View
          className="items-center justify-center bg-brand-beige/30"
          style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
        >
          <IconSymbol
            name="cube.box"
            size={20}
            color="#3B3030"
            style={{ opacity: 0.25 }}
          />
        </View>
      )}

      {/* Title */}
      <Typography
        variation="label"
        className="flex-1 text-xs font-sans-semibold text-brand-espresso"
        numberOfLines={2}
      >
        {item.title}
      </Typography>

      {/* Order count */}
      <View className="items-end flex-shrink-0">
        <Typography
          variation="h5"
          className="text-sm font-bold text-brand-espresso"
        >
          {item.totalQuantity}
        </Typography>
        <Typography
          variation="caption"
          className="text-xs text-brand-espresso/40"
        >
          {item.totalQuantity === 1 ? "order" : "orders"}
        </Typography>
      </View>
    </View>
  );
};

export default function TopSellingScreen() {
  const { items: itemsParam } = useLocalSearchParams<{ items: string }>();

  const items = useMemo<TopSellingItem[]>(() => {
    if (!itemsParam) return [];
    try {
      return JSON.parse(itemsParam);
    } catch {
      return [];
    }
  }, [itemsParam]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FAF7F2" }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="All Selling Items" showBackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
      >
        {/* Summary pill */}
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-6 h-6 bg-orange-100 rounded-lg items-center justify-center">
            <IconSymbol name="flame.fill" size={14} color="#EA580C" />
          </View>
          <Typography
            variation="body-sm"
            className="text-xs text-brand-espresso/60"
          >
            {items.length} {items.length === 1 ? "product" : "products"} sorted
            by orders
          </Typography>
        </View>

        {/* List card */}
        <View className="bg-white rounded-xl border border-brand-beige/40 shadow-sm px-4 pt-1 pb-1">
          {items.map((item, index) => (
            <ItemRow key={item.id} item={item} index={index} />
          ))}

          {items.length === 0 && (
            <View className="py-12 items-center gap-3">
              <IconSymbol
                name="chart.bar.fill"
                size={32}
                color="rgba(59,47,47,0.2)"
              />
              <Typography
                variation="body-sm"
                className="text-sm text-brand-espresso/40 text-center"
              >
                No items to display
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
