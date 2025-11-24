import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabButton({
  route,
  index,
  isFocused,
  options,
  onPress,
  onLongPress,
  activeColor,
  inactiveColor,
}: {
  route: any;
  index: number;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  activeColor: string;
  inactiveColor: string;
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
      options.tabBarIcon({ focused: isFocused, color: '', size: 24 }).props.name
    : 'house.fill';

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
        style={[styles.activeBackground, { backgroundColor: `${activeColor}` }, animatedBackgroundStyle]}
      />

      {/* Icon */}
      <IconSymbol
        name={iconName}
        size={26}
        color={isFocused ? "#ffffff" : "#000000"}
      />
    </TouchableOpacity>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const activeColor = Colors[colorScheme].tabIconSelected;
  const inactiveColor = Colors[colorScheme].tabIconDefault;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 16,
        },
      ]}
    >
      {/* Floating Tab Bar with Glassmorphism */}
      <View style={styles.tabBarWrapper}>
        <BlurView
          intensity={80}
          tint="systemChromeMaterialLight"
          style={styles.blurView}
        />
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];

            // Filter out tabs with href: null (hidden tabs)
            if (options.href === null) {
              return null;
            }

            const isFocused = state.index === index;

            const onPress = () => {
              // Haptic feedback
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
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
                activeColor={activeColor}
                inactiveColor={inactiveColor}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  tabBarWrapper: {
    borderRadius: 99999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
    borderRadius: 999999,
    minHeight: 20,
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 99999,
  },
});
