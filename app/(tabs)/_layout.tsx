import BagIcon from "@/components/icons/BagIcon";
import CashIcon from "@/components/icons/CashIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React from "react";

const { Navigator } = createMaterialTopTabNavigator();

// Wrap the material-top-tabs Navigator so expo-router manages the routes.
// This preserves focus effects, deep links, and all routing features while
// adding left/right swipe between tabs.
const SwipeTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <SwipeTabs
      tabBar={(props) => <FloatingTabBar {...(props as any)} />}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
      }}
    >
      <SwipeTabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: any) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <SwipeTabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }: any) => (
            <BagIcon size={size} color={color} />
          ),
        }}
      />
      <SwipeTabs.Screen
        name="product"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }: any) => (
            <PlusIcon size={size} color={color} />
          ),
        }}
      />
      <SwipeTabs.Screen
        name="earnings"
        options={{
          title: "Cash",
          tabBarIcon: ({ color, size }: any) => (
            <CashIcon size={size} color={color} />
          ),
        }}
      />
      <SwipeTabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: any) => (
            <UserIcon size={size} color={color} />
          ),
        }}
      />
    </SwipeTabs>
  );
}
