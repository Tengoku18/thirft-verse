import { useTour } from "@/contexts/TourContext";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "@/components/ui/Typography/Typography";

const BACKDROP = "rgba(59,47,47,0.72)";
const SPOTLIGHT_PADDING = 8;
const SPOTLIGHT_BORDER_COLOR = "#D4A373";
const CARD_BG = "#FAF7F2";
const ESPRESSO = "#3B2F2F";
const TAN = "#D4A373";

export function TourOverlay() {
  const {
    isActive,
    currentStep,
    stepIndex,
    totalSteps,
    spotlightRect,
    nextStep,
    prevStep,
    skipTour,
  } = useTour();

  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [cardHeight, setCardHeight] = useState(160);
  const cardHeightRef = useRef(160);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    if (spotlightRect) {
      opacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = 12;
    }
  }, [spotlightRect]); // eslint-disable-line react-hooks/exhaustive-deps

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!isActive) return null;

  // Compute spotlight rect with padding
  const sp = spotlightRect
    ? {
        x: spotlightRect.x - SPOTLIGHT_PADDING,
        y: spotlightRect.y - SPOTLIGHT_PADDING,
        w: spotlightRect.width + SPOTLIGHT_PADDING * 2,
        h: spotlightRect.height + SPOTLIGHT_PADDING * 2,
      }
    : null;

  // Backdrop strips
  const topH = sp ? Math.max(0, sp.y) : screenH;
  const bottomY = sp ? sp.y + sp.h : 0;
  const bottomH = sp ? Math.max(0, screenH - bottomY) : 0;
  const leftW = sp ? Math.max(0, sp.x) : 0;
  const rightX = sp ? sp.x + sp.w : 0;
  const rightW = sp ? Math.max(0, screenW - rightX) : 0;

  // Tooltip vertical position
  let tooltipTop = 0;
  if (sp && currentStep) {
    if (currentStep.tooltipPlacement === "above") {
      tooltipTop = sp.y - cardHeightRef.current - 16;
    } else {
      tooltipTop = sp.y + sp.h + 16;
    }
    // Clamp so it never bleeds off screen
    tooltipTop = Math.max(
      insets.top + 8,
      Math.min(tooltipTop, screenH - cardHeightRef.current - insets.bottom - 8),
    );
  }

  return (
    <Modal
      visible={isActive}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      {/* Backdrop strips */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top strip */}
        <View
          style={[
            styles.strip,
            { top: 0, left: 0, width: screenW, height: topH },
          ]}
        />
        {/* Bottom strip */}
        {sp && (
          <View
            style={[
              styles.strip,
              { top: bottomY, left: 0, width: screenW, height: bottomH },
            ]}
          />
        )}
        {/* Left strip */}
        {sp && (
          <View
            style={[
              styles.strip,
              { top: sp.y, left: 0, width: leftW, height: sp.h },
            ]}
          />
        )}
        {/* Right strip */}
        {sp && (
          <View
            style={[
              styles.strip,
              { top: sp.y, left: rightX, width: rightW, height: sp.h },
            ]}
          />
        )}
        {/* Spotlight border ring */}
        {sp && (
          <View
            style={{
              position: "absolute",
              top: sp.y,
              left: sp.x,
              width: sp.w,
              height: sp.h,
              borderWidth: 2,
              borderColor: SPOTLIGHT_BORDER_COLOR,
              borderRadius: 16,
            }}
            pointerEvents="none"
          />
        )}
      </View>

      {/* Tooltip card */}
      {sp && currentStep && (
        <Animated.View
          style={[
            styles.card,
            { top: tooltipTop },
            cardAnimatedStyle,
          ]}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            cardHeightRef.current = h;
            setCardHeight(h);
          }}
        >
          {/* Step badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Typography style={styles.badgeText}>
                STEP {stepIndex + 1} / {totalSteps}
              </Typography>
            </View>
          </View>

          {/* Step dots */}
          <View style={styles.dotsRow}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < stepIndex && styles.dotDone,
                  i === stepIndex && styles.dotActive,
                  i > stepIndex && styles.dotPending,
                ]}
              />
            ))}
          </View>

          {/* Title */}
          <Typography style={styles.title}>{currentStep.title}</Typography>

          {/* Description */}
          <Typography style={styles.description}>
            {currentStep.description}
          </Typography>

          {/* Actions */}
          <View style={styles.actions}>
            {stepIndex === 0 ? (
              <TouchableOpacity
                onPress={skipTour}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Typography style={styles.skipText}>Skip Tour</Typography>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={prevStep}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Typography style={styles.skipText}>← Back</Typography>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={nextStep}
              activeOpacity={0.82}
              style={styles.nextButton}
            >
              <Typography style={styles.nextText}>
                {stepIndex === totalSteps - 1 ? "Done" : "Next →"}
              </Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: "absolute",
    backgroundColor: BACKDROP,
  },
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    shadowColor: ESPRESSO,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "rgba(212,163,115,0.15)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: "NunitoSans_600SemiBold",
    fontSize: 11,
    color: TAN,
    letterSpacing: 0.8,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotDone: {
    backgroundColor: TAN,
    opacity: 0.5,
  },
  dotActive: {
    backgroundColor: TAN,
    width: 18,
    borderRadius: 3,
  },
  dotPending: {
    backgroundColor: "rgba(59,47,47,0.2)",
  },
  title: {
    fontFamily: "Folito_700Bold",
    fontSize: 20,
    color: ESPRESSO,
    marginBottom: 6,
  },
  description: {
    fontFamily: "NunitoSans_400Regular",
    fontSize: 14,
    color: "rgba(59,47,47,0.65)",
    lineHeight: 21,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipText: {
    fontFamily: "NunitoSans_600SemiBold",
    fontSize: 13,
    color: "rgba(59,47,47,0.4)",
  },
  nextButton: {
    backgroundColor: ESPRESSO,
    borderRadius: 24,
    paddingVertical: 11,
    paddingHorizontal: 24,
  },
  nextText: {
    fontFamily: "NunitoSans_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
