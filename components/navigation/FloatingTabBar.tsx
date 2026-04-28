import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Animated,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CENTER_TAB_INDEX = 2;
const BAR_HEIGHT = 72;
const CENTER_BUTTON_SIZE = 52;
const CENTER_BUTTON_OVERFLOW = CENTER_BUTTON_SIZE * 0.1;

type AnimatedPosition = Animated.AnimatedInterpolation<number>;

function getProgress(
  position: AnimatedPosition | undefined,
  stateIndex: number,
  isFocused: boolean,
): AnimatedPosition | number {
  if (!position) return isFocused ? 1 : 0;
  return position.interpolate({
    inputRange: [stateIndex - 1, stateIndex, stateIndex + 1],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });
}

function CenterTabButton({
  isFocused,
  options,
  onPress,
  onLongPress,
  stateIndex,
  position,
}: {
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  stateIndex: number;
  position?: AnimatedPosition;
}) {
  const progress = getProgress(position, stateIndex, isFocused);
  const inverseProgress =
    typeof progress === "number"
      ? 1 - progress
      : Animated.subtract(1, progress);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={{
        position: "absolute",
        top: -CENTER_BUTTON_OVERFLOW,
        alignSelf: "center",
        zIndex: 10,
      }}
    >
      <View
        style={{
          width: CENTER_BUTTON_SIZE + 8,
          height: CENTER_BUTTON_SIZE + 8,
          borderRadius: (CENTER_BUTTON_SIZE + 8) / 2,
          backgroundColor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Golden circle — fades out as this tab becomes active */}
        <Animated.View
          style={{
            position: "absolute",
            width: CENTER_BUTTON_SIZE,
            height: CENTER_BUTTON_SIZE,
            borderRadius: CENTER_BUTTON_SIZE / 2,
            backgroundColor: "#D4A373",
            opacity: inverseProgress,
          }}
        />
        {/* Espresso circle — fades in as this tab becomes active */}
        <Animated.View
          style={{
            position: "absolute",
            width: CENTER_BUTTON_SIZE,
            height: CENTER_BUTTON_SIZE,
            borderRadius: CENTER_BUTTON_SIZE / 2,
            backgroundColor: "#3B2F2F",
            opacity: progress,
          }}
        />
        <View style={{ zIndex: 1 }}>
          {options.tabBarIcon?.({ focused: isFocused, color: "#FFFFFF", size: 24 })}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TabButton({
  isFocused,
  options,
  onPress,
  onLongPress,
  stateIndex,
  position,
}: {
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  stateIndex: number;
  position?: AnimatedPosition;
}) {
  const progress = getProgress(position, stateIndex, isFocused);
  const inverseProgress =
    typeof progress === "number"
      ? 1 - progress
      : Animated.subtract(1, progress);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 52,
          height: 52,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated dark background — slides in with the swipe */}
        <Animated.View
          style={{
            position: "absolute",
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#3B2F2F",
            opacity: progress,
          }}
        />

        {/* Inactive icon (dark color) — fades out as tab activates */}
        <Animated.View style={{ position: "absolute", opacity: inverseProgress }}>
          {options.tabBarIcon?.({ focused: false, color: "#3B2F2F", size: 18 })}
        </Animated.View>

        {/* Active icon (white color) — fades in as tab activates */}
        <Animated.View style={{ position: "absolute", opacity: progress }}>
          {options.tabBarIcon?.({ focused: true, color: "#FFFFFF", size: 18 })}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
  position,
}: BottomTabBarProps & { position?: AnimatedPosition }) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom - 100, 20);

  const visibleItems = state.routes
    .map((route, stateIndex) => ({ route, stateIndex }))
    .filter(
      ({ route }) => (descriptors[route.key].options as any).href !== null,
    );

  const buildHandlers = (route: any, stateIndex: number) => {
    const isFocused = state.index === stateIndex;
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
    return { isFocused, onPress, onLongPress };
  };

  const centerItem = visibleItems[CENTER_TAB_INDEX];
  const leftItems = visibleItems.slice(0, CENTER_TAB_INDEX);
  const rightItems = visibleItems.slice(CENTER_TAB_INDEX + 1);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: bottomPadding,
        zIndex: 50,
      }}
    >
      <View
        style={{
          width: "96%",
          maxWidth: 380,
          paddingTop: CENTER_BUTTON_OVERFLOW,
        }}
      >
        {/* Center button rendered above the bar */}
        {centerItem &&
          (() => {
            const { route, stateIndex } = centerItem;
            const { options } = descriptors[route.key];
            const { isFocused, onPress, onLongPress } = buildHandlers(
              route,
              stateIndex,
            );
            return (
              <CenterTabButton
                key={route.key}
                isFocused={isFocused}
                options={options}
                onPress={onPress}
                onLongPress={onLongPress}
                stateIndex={stateIndex}
                position={position}
              />
            );
          })()}

        {/* The pill bar */}
        <BlurView
          intensity={55}
          tint="light"
          style={{
            height: BAR_HEIGHT,
            borderRadius: BAR_HEIGHT / 2,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.4)",
            shadowColor: "#3B2F2F",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 30,
            elevation: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            }}
          >
            {leftItems.map(({ route, stateIndex }) => {
              const { options } = descriptors[route.key];
              const { isFocused, onPress, onLongPress } = buildHandlers(
                route,
                stateIndex,
              );
              return (
                <TabButton
                  key={route.key}
                  isFocused={isFocused}
                  options={options}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  stateIndex={stateIndex}
                  position={position}
                />
              );
            })}

            {/* Empty space for center button */}
            <View style={{ flex: 1 }} />

            {rightItems.map(({ route, stateIndex }) => {
              const { options } = descriptors[route.key];
              const { isFocused, onPress, onLongPress } = buildHandlers(
                route,
                stateIndex,
              );
              return (
                <TabButton
                  key={route.key}
                  isFocused={isFocused}
                  options={options}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  stateIndex={stateIndex}
                  position={position}
                />
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}
