import { IconSymbol } from "@/components/ui/icon-symbol";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabButton({
  route,
  isFocused,
  options,
  onPress,
  onLongPress,
}: {
  route: any;
  index: number;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.95);
  const opacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.95, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
    });
  }, [isFocused]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconName = options.tabBarIcon
    ? // @ts-ignore
      options.tabBarIcon({ focused: isFocused, color: "", size: 24 }).props.name
    : "house.fill";

  return (
    <TouchableOpacity
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
      activeOpacity={0.7}
    >
      {/* Active Background Pill */}
      <Animated.View
        style={[styles.activeBackground, animatedBackgroundStyle]}
      />

      {/* Icon */}
      <IconSymbol
        name={iconName}
        size={26}
        color={isFocused ? "#3B2F2F" : "#6B7280"}
      />
    </TouchableOpacity>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 16,
          backgroundColor: Platform.OS === "android" ? "#FAFAFA" : "transparent",
        },
      ]}
    >
      {/* Shadow wrapper (separate from overflow:hidden) */}
      <View
        style={[
          styles.shadowWrapper,
          Platform.OS === "android" && styles.androidShadowWrapper,
        ]}
      >
        {/* Clipped content wrapper */}
        <View
          style={[
            styles.tabBarWrapper,
            Platform.OS === "android" && styles.androidTabBarWrapper,
          ]}
        >
          {/* Blur Background - iOS only */}
          {Platform.OS === "ios" && (
            <BlurView intensity={60} tint="light" style={styles.blurView} />
          )}

          {/* Glass overlay for iOS */}
          {Platform.OS === "ios" && <View style={styles.glassOverlay} />}

          {/* Tab buttons */}
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];

              // Filter out tabs with href: null (hidden tabs)
              if ((options as any).href === null) {
                return null;
              }

              const isFocused = state.index === index;

              const onPress = () => {
                // Haptic feedback
                if (Platform.OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <TabButton
                  key={route.key}
                  route={route}
                  index={index}
                  isFocused={isFocused}
                  options={options}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  shadowWrapper: {
    borderRadius: 30,
    // Strong shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  tabBarWrapper: {
    borderRadius: 30,
    overflow: "hidden",
  },
  androidShadowWrapper: {
    backgroundColor: "#FFFFFF",
    elevation: 8,
  },
  androidTabBarWrapper: {
    backgroundColor: "#FFFFFF",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    // Subtle border effect
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
  },
  tabBar: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    position: "relative",
    borderRadius: 20,
    minHeight: 50,
  },
  activeBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(59, 47, 47, 0.15)",
    borderRadius: 22,
  },
});
