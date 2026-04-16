import XIcon from "@/components/icons/XIcon";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface BlurModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  /** Show close button in top-right corner. Defaults to true. */
  showCloseButton?: boolean;
}

export function BlurModal({
  visible,
  onDismiss,
  children,
  showCloseButton = true,
}: BlurModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.7)"
        translucent
      />
      <Pressable
        className="flex-1"
        style={{ backgroundColor: "transparent" }}
        onPress={onDismiss}
      >
        <BlurView intensity={20} tint="dark" className="flex-1">
          {/* Semi-transparent colour overlay */}
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0,0,0,0.6)" },
            ]}
            onPress={onDismiss}
          />

          <SafeAreaView className="flex-1" edges={["left", "right"]}>
            {/* Top bar with close button */}
            <View
              className="flex-row justify-end px-5 pt-2"
              style={{ paddingTop: Math.max(insets.top, 8) }}
            >
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onDismiss}
                  activeOpacity={0.8}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityLabel="Close modal"
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <XIcon width={20} height={20} />
                </TouchableOpacity>
              )}
            </View>

            {/* Content area */}
            <Pressable
              className="flex-1 items-center justify-center px-6"
              onPress={(e) => e.stopPropagation()}
              pointerEvents="box-none"
            >
              {children}
            </Pressable>
          </SafeAreaView>
        </BlurView>
      </Pressable>
    </Modal>
  );
}
