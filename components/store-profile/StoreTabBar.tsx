import { Typography } from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export type StoreTab = "items";

const TABS: { key: StoreTab; label: string }[] = [
  { key: "items", label: "All Items" },
];

interface StoreTabBarProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
}

export function StoreTabBar({ activeTab, onTabChange }: StoreTabBarProps) {
  return (
    <View className="flex-row border-b border-brand-beige px-5 gap-7 bg-brand-off-white">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
            className={`py-3.5 border-b-2 ${isActive ? "border-brand-espresso" : "border-transparent"}`}
          >
            <Typography
              variation="label"
              className={`${isActive ? "text-brand-espresso font-sans-bold" : "text-ui-secondary font-sans-semibold"}`}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
