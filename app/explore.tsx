import { ExploreProductsTab, ExploreStoresTab } from "@/components/explore";
import NotificationIcon from "@/components/icons/NotificationIcon";
import { ScreenLayout } from "@/components/layouts";
import { Typography } from "@/components/ui/Typography";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

const renderScene = SceneMap({
  products: ExploreProductsTab,
  stores: ExploreStoresTab,
});

const ROUTES = [
  { key: "products", title: "Products" },
  { key: "stores", title: "Stores" },
];

function NotificationButton() {
  const router = useRouter();
  const unreadCount = useAppSelector(
    (state) => state.notifications.unreadCount,
  );

  return (
    <TouchableOpacity
      onPress={() => router.push("/notifications" as never)}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.06)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <NotificationIcon width={20} height={20} fill="#3B2F2F" />
      {unreadCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#EF4444",
            borderWidth: 1.5,
            borderColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Typography
            variation="body-xs"
            style={{ color: "#FFFFFF", fontSize: 9, lineHeight: 12 }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderTabBar = ({ navigationState, jumpTo }: any) => (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        backgroundColor: "#FAF7F2",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(59,47,47,0.1)",
      }}
    >
      {navigationState.routes.map((route: any, i: number) => {
        const isActive = i === navigationState.index;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => jumpTo(route.key)}
            activeOpacity={0.7}
            style={{
              paddingBottom: 12,
              paddingTop: 8,
              marginRight: 32,
              borderBottomWidth: 2,
              borderBottomColor: isActive ? "#3B2F2F" : "transparent",
            }}
          >
            <Typography
              variation="body-sm"
              style={{
                fontWeight: "700",
                color: isActive ? "#3B2F2F" : "rgba(59,47,47,0.4)",
              }}
            >
              {route.title}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScreenLayout
      title="Explore"
      headerBackgroundColor="#FAF7F2"
      backgroundColor="#FAF7F2"
      contentBackgroundColor="#FAF7F2"
      scrollable={false}
      rightComponent={<NotificationButton />}
    >
      <TabView
        navigationState={{ index, routes: ROUTES }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        lazy
      />
    </ScreenLayout>
  );
}
