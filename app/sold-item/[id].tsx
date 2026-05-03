import { RefreshIcon } from "@/components/icons";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import { Typography } from "@/components/ui/Typography";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

/**
 * This screen is deprecated.
 * Orders are now managed through the /order/[id] route with real database data.
 * This redirect helps users who may have old bookmarks or cached links.
 */
export default function SoldItemDetailScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to orders after a brief delay
    const timer = setTimeout(() => {
      router.replace("/(tabs)/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Order Details" showBackButton />

      <View className="flex-1 justify-center items-center px-8">
        <View className="w-20 h-20 rounded-full bg-[#FEF3C7] justify-center items-center mb-6">
          <RefreshIcon width={36} height={36} color="#D97706" />
        </View>

        <Typography
          variation="h3"
          style={{
            fontSize: 20,
            textAlign: "center",
            marginBottom: 8,
            fontWeight: "700",
          }}
        >
          Orders Updated
        </Typography>

        <Typography
          variation="body-sm"
          style={{
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 24,
          }}
        >
          We've improved how orders are tracked! You'll be redirected to the new
          Orders screen where you can see real-time order status.
        </Typography>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/orders")}
          className="bg-[#3B2F2F] px-8 py-4 rounded-xl"
          activeOpacity={0.8}
        >
          <Typography
            variation="body-sm"
            style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}
          >
            Go to Orders
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
