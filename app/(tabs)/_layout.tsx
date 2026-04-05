import { Tabs } from "expo-router";
import React from "react";

import HomeIcon from "@/components/icons/HomeIcon";
import CashIcon from "@/components/icons/CashIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";

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
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-products"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <SearchIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <PlusIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Cash",
          tabBarIcon: ({ color, size }) => (
            <CashIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserIcon size={size} color={color} />
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
