import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CENTER_BUTTON_SIZE = 56;
const CENTER_BUTTON_BORDER = 4;
const CENTER_BUTTON_TOTAL = CENTER_BUTTON_SIZE + CENTER_BUTTON_BORDER * 2;

function TabButton({
  isFocused,
  options,
  onPress,
  onLongPress,
}: {
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
    opacity.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconColor = isFocused ? "#3B2F2F" : "#9CA3AF";
  const iconComponent = options.tabBarIcon
    ? options.tabBarIcon({ focused: isFocused, color: iconColor, size: 22 })
    : null;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center py-2.5 px-2 relative rounded-[20px] min-h-[50px]"
      activeOpacity={0.7}
    >
      {/* Active background pill */}
      <Animated.View
        className="absolute inset-0 bg-[rgba(59,47,47,0.1)] rounded-[22px]"
        style={animatedBackgroundStyle}
      />

      {/* Icon — full opacity always, background pill handles the active state */}
      <View>{iconComponent}</View>
    </TouchableOpacity>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  const visibleItems = state.routes
    .map((route, stateIndex) => ({ route, stateIndex }))
    .filter(
      ({ route }) => (descriptors[route.key].options as any).href !== null,
    );

  const centerVisibleIndex = Math.floor(visibleItems.length / 2);
  const centerItem = visibleItems[centerVisibleIndex];
  const isCenterFocused = centerItem
    ? state.index === centerItem.stateIndex
    : false;
  const centerButtonColor = isCenterFocused ? "#3B2F2F" : "#D4A373";

  const handleCenterPress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!centerItem) return;
    const { route, stateIndex } = centerItem;
    const isFocused = state.index === stateIndex;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-5"
      style={{ paddingBottom: bottomPadding }}
    >
      {/* paddingTop creates space for the elevated center button */}
      <View style={{ paddingTop: CENTER_BUTTON_TOTAL / 2 }}>
        {/* Elevated center button — floats above the tab bar */}
        {centerItem && (
          <View className="absolute top-0 left-0 right-0 items-center z-10">
            <TouchableOpacity
              className="items-center justify-center border-4 border-white rounded-full"
              style={{
                width: CENTER_BUTTON_TOTAL,
                height: CENTER_BUTTON_TOTAL,
                backgroundColor: centerButtonColor,
                // Shadows use style — no Tailwind equivalent for custom color/offset
                shadowColor: centerButtonColor,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 10,
                elevation: 10,
              }}
              onPress={handleCenterPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={
                descriptors[centerItem.route.key].options
                  .tabBarAccessibilityLabel
              }
            >
              {descriptors[centerItem.route.key].options.tabBarIcon?.({
                focused: isCenterFocused,
                color: "#FFFFFF",
                size: 24,
              })}
            </TouchableOpacity>
          </View>
        )}

        {/* Shadow wrapper — kept as style since Tailwind shadows don't support custom color/offset */}
        <View
          className="rounded-[30px]"
          style={
            Platform.OS === "ios"
              ? {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 20,
                }
              : { elevation: 20 }
          }
        >
          {/* Tab bar pill */}
          <View className="rounded-[30px] overflow-hidden bg-white/75">
            <View className="flex-row py-2.5 px-3">
              {visibleItems.map(({ route, stateIndex }, visibleIndex) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === stateIndex;

                // Center tab: empty placeholder to keep even spacing
                if (visibleIndex === centerVisibleIndex) {
                  return <View key={route.key} className="flex-1" />;
                }

                const onPress = () => {
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
                  navigation.emit({ type: "tabLongPress", target: route.key });
                };

                return (
                  <TabButton
                    key={route.key}
                    index={visibleIndex}
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
    </View>
  );
}
