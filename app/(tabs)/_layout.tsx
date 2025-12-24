import { Tabs } from "expo-router";
import React from "react";

import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-products"
        options={{
          title: "My Products",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shippingbox.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="chart.line.uptrend.xyaxis"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
