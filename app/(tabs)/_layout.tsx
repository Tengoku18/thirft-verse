import { Tabs } from "expo-router";
import React from "react";

import BagIcon from "@/components/icons/BagIcon";
import CashIcon from "@/components/icons/CashIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="my-products"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <BagIcon size={size} color={color} />
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
        name="earnings"
        options={{
          title: "Cash",
          tabBarIcon: ({ color, size }) => (
            <CashIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
