import {
  BodyRegularText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";

type ConfirmModalVariant = "default" | "danger" | "success" | "warning";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: ConfirmModalVariant;
  loading?: boolean;
  icon?: string;
}

const variantConfig = {
  default: {
    iconBg: "#3B2F2F",
    iconColor: "#FFFFFF",
    confirmBg: "#3B2F2F",
    confirmText: "#FFFFFF",
    defaultIcon: "questionmark.circle",
  },
  danger: {
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    confirmBg: "#DC2626",
    confirmText: "#FFFFFF",
    defaultIcon: "exclamationmark.triangle",
  },
  success: {
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    confirmBg: "#059669",
    confirmText: "#FFFFFF",
    defaultIcon: "checkmark.circle",
  },
  warning: {
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    confirmBg: "#D97706",
    confirmText: "#FFFFFF",
    defaultIcon: "exclamationmark.circle",
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
  icon,
}) => {
  const config = variantConfig[variant];
  const displayIcon = icon || config.defaultIcon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="p-6">
            {/* Icon */}
            <View className="items-center mb-4">
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: config.iconBg,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  name={displayIcon as any}
                  size={28}
                  color={config.iconColor}
                />
              </View>
            </View>

            {/* Title */}
            <HeadingBoldText className="text-center mb-2" style={{ fontSize: 20 }}>
              {title}
            </HeadingBoldText>

            {/* Message */}
            <BodyRegularText
              className="text-center mb-6"
              style={{ color: "#6B7280", lineHeight: 22 }}
            >
              {message}
            </BodyRegularText>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Confirm Button */}
              <TouchableOpacity
                onPress={onConfirm}
                disabled={loading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: config.confirmBg,
                  paddingVertical: 14,
                  borderRadius: 12,
                  opacity: loading ? 0.7 : 1,
                }}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={config.confirmText} />
                ) : (
                  <BodySemiboldText style={{ color: config.confirmText }}>
                    {confirmText}
                  </BodySemiboldText>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={onCancel}
                disabled={loading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F3F4F6",
                  paddingVertical: 14,
                  borderRadius: 12,
                }}
                activeOpacity={0.8}
              >
                <BodySemiboldText style={{ color: "#3B2F2F" }}>
                  {cancelText}
                </BodySemiboldText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
