import { BlurModal } from "@/components/ui/BlurModal";
import { Typography } from "@/components/ui/Typography/Typography";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ForceUpdateModalProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string;
  onUpdate: () => void;
}

export function ForceUpdateModal({
  visible,
  currentVersion,
  latestVersion,
  onUpdate,
}: ForceUpdateModalProps) {
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = 0.88;
      opacity.value = 0;
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <BlurModal
      visible={visible}
      onDismiss={() => {}}
      showCloseButton={false}
    >
      <Animated.View style={[cardStyle, { width: "100%" }]}>
        <View className="bg-white rounded-3xl p-8 gap-5 w-full">
          {/* Icon badge */}
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-brand-tan/20 items-center justify-center">
              <Typography variation="h1" className="text-3xl">
                🔒
              </Typography>
            </View>
          </View>

          {/* Title */}
          <View className="gap-0.5">
            <Typography
              variation="h2"
              className="text-brand-espresso text-center font-bold"
            >
              Update Required
            </Typography>
            <Typography
              variation="body-sm"
              className="text-slate-400 text-center"
            >
              ThriftVerse
            </Typography>
          </View>

          {/* Version info */}
          <View className="bg-gray-50 rounded-2xl px-5 py-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Typography variation="body-sm" className="text-slate-500">
                Your version
              </Typography>
              <Typography
                variation="body-sm"
                className="text-slate-700 font-semibold"
              >
                v{currentVersion}
              </Typography>
            </View>
            <View className="h-px bg-gray-200" />
            <View className="flex-row justify-between items-center">
              <Typography variation="body-sm" className="text-slate-500">
                Latest version
              </Typography>
              <View className="bg-brand-tan/20 px-3 py-0.5 rounded-full">
                <Typography
                  variation="body-sm"
                  className="text-brand-espresso font-semibold"
                >
                  v{latestVersion}
                </Typography>
              </View>
            </View>
          </View>

          {/* Notice */}
          <Typography variation="body-sm" className="text-slate-400 text-center">
            Please update to continue using ThriftVerse. This ensures you have
            the latest features and security fixes.
          </Typography>

          {/* CTA */}
          <Pressable
            className="bg-brand-espresso rounded-2xl py-4 items-center active:opacity-75"
            onPress={onUpdate}
          >
            <Typography variation="button" className="text-white font-semibold">
              Update Now
            </Typography>
          </Pressable>
        </View>
      </Animated.View>
    </BlurModal>
  );
}
