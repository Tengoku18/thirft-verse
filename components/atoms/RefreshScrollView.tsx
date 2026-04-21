import React from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";

interface RefreshScrollViewProps extends ScrollViewProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

export function RefreshScrollView({
  refreshing,
  onRefresh,
  children,
  contentContainerStyle,
  ...props
}: RefreshScrollViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ paddingBottom: 140 }, contentContainerStyle]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#000000"
          colors={["#000000"]}
        />
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}
