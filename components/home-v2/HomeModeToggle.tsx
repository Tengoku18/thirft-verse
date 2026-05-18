import { Typography } from "@/components/ui/Typography";
import { setHomeMode, type HomeMode } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

const TRACK_PADDING = 4;
const TRACK_HEIGHT = 44;

export const HomeModeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const homeMode = useAppSelector((state) => state.ui.homeMode);

  const [trackWidth, setTrackWidth] = useState(0);
  const thumbTranslate = useRef(
    new Animated.Value(homeMode === "buyer" ? 0 : 1),
  ).current;

  useEffect(() => {
    Animated.spring(thumbTranslate, {
      toValue: homeMode === "buyer" ? 0 : 1,
      useNativeDriver: true,
      friction: 9,
      tension: 90,
    }).start();
  }, [homeMode, thumbTranslate]);

  const handlePress = (mode: HomeMode) => {
    if (mode === homeMode) return;
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dispatch(setHomeMode(mode));
  };

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== trackWidth) setTrackWidth(w);
  };

  const segmentWidth =
    trackWidth > 0 ? (trackWidth - TRACK_PADDING * 2) / 2 : 0;

  const thumbStyle = {
    transform: [
      {
        translateX: thumbTranslate.interpolate({
          inputRange: [0, 1],
          outputRange: [0, segmentWidth],
        }),
      },
    ],
  };

  return (
    <View className="px-5 mt-2 mb-1">
      <View
        onLayout={handleTrackLayout}
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(59,47,47,0.06)",
          borderRadius: 999,
          padding: TRACK_PADDING,
          width: "100%",
          height: TRACK_HEIGHT,
          position: "relative",
          borderWidth: 1,
          borderColor: "rgba(59,47,47,0.06)",
        }}
      >
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: TRACK_PADDING,
                left: TRACK_PADDING,
                width: segmentWidth,
                height: TRACK_HEIGHT - TRACK_PADDING * 2,
                borderRadius: 999,
                backgroundColor: "#3B2F2F",
                shadowColor: "#3B2F2F",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 6,
                elevation: 3,
              },
              thumbStyle,
            ]}
          />
        )}
        <Segment
          label="I'm Buying"
          active={homeMode === "buyer"}
          onPress={() => handlePress("buyer")}
        />
        <Segment
          label="I'm Selling"
          active={homeMode === "seller"}
          onPress={() => handlePress("seller")}
        />
      </View>
    </View>
  );
};

interface SegmentProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const Segment: React.FC<SegmentProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    }}
  >
    <Typography
      variation="label"
      style={{
        color: active ? "#FFFFFF" : "rgba(59,47,47,0.7)",
        fontSize: 14,
        fontWeight: "600",
      }}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);
