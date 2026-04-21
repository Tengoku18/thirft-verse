import { BlurModal } from "@/components/ui/BlurModal";
import { Typography } from "@/components/ui/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

interface WorkInProgressModalProps {
  visible: boolean;
  onClose: () => void;
  /** Feature name shown in the message. Defaults to "This feature". */
  featureName?: string;
}

export function WorkInProgressModal({
  visible,
  onClose,
  featureName = "This feature",
}: WorkInProgressModalProps) {
  return (
    <BlurModal visible={visible} onDismiss={onClose} showCloseButton={false}>
      <Pressable
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="p-6 items-center">
          {/* Icon */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-5"
            style={{ backgroundColor: "rgba(212, 163, 115, 0.15)" }}
          >
            <Ionicons name="construct-outline" size={32} color="#D4A373" />
          </View>

          {/* Title */}
          <Typography
            variation="h4"
            className="text-brand-espresso font-folito-bold text-center mb-2"
          >
            Coming Soon
          </Typography>

          {/* Message */}
          <Typography
            variation="body-sm"
            className="text-ui-secondary text-center mb-6"
            style={{ lineHeight: 22 }}
          >
            {featureName} is currently under development. We're working hard to
            bring it to you soon. Stay tuned!
          </Typography>

          {/* Got it button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            className="w-full items-center justify-center rounded-2xl py-4"
            style={{ backgroundColor: "#3B3030" }}
          >
            <Typography variation="button" className="text-white font-sans-bold">
              Got it
            </Typography>
          </TouchableOpacity>
        </View>
      </Pressable>
    </BlurModal>
  );
}
