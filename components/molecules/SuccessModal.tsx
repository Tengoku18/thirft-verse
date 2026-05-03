import {
  ArrowUpRightIcon,
  CheckMarkCircleIcon,
  XIcon,
} from "@/components/icons";
import { Typography } from "@/components/ui/Typography";

import { BlurModal } from "@/components/ui/BlurModal";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

interface SuccessModalAction {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: "primary" | "secondary" | "text";
}

interface SuccessModalProps {
  visible: boolean;
  title: string;
  /** Action buttons. If empty, a default "Done" button is shown */
  actions?: SuccessModalAction[];
  onClose: () => void;
  /** Flexible content area — use this for custom layouts */
  children?: React.ReactNode;
  /** Simple message string (used when children is not provided) */
  message?: string;
}

// Helper to convert icon names to SVG components
function getActionIcon(iconName: string, color: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    "checkmark.circle.fill": (
      <CheckMarkCircleIcon width={18} height={18} color={color} />
    ),
    "arrow.right": <ArrowUpRightIcon width={18} height={18} color={color} />,
  };

  return iconMap[iconName] || null;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  actions,
  onClose,
  children,
  message,
}) => {
  const defaultActions: SuccessModalAction[] = [
    { label: "Done", onPress: onClose, variant: "primary" },
  ];

  const displayActions =
    actions && actions.length > 0 ? actions : defaultActions;

  return (
    <BlurModal visible={visible} onDismiss={onClose} showCloseButton={false}>
      <Pressable
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="p-6">
          {/* Header: Title left, Close right */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Typography variation="h2" style={{ fontSize: 20, flex: 1 }}>
              {title}
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginLeft: 12 }}
            >
              <XIcon width={20} height={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          {children ? (
            <View style={{ marginBottom: 24 }}>{children}</View>
          ) : message ? (
            <Typography variation="body"
              style={{ color: "#6B7280", lineHeight: 22, marginBottom: 24 }}
            >
              {message}
            </Typography>
          ) : null}

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            {displayActions.map((action, index) => {
              const variant =
                action.variant || (index === 0 ? "primary" : "secondary");

              if (variant === "text") {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={action.onPress}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 12,
                    }}
                    activeOpacity={0.7}
                  >
                    <Typography variation="body" style={{ color: "#6B7280" }}>
                      {action.label}
                    </Typography>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      variant === "primary" ? "#3B2F2F" : "#F3F4F6",
                    paddingVertical: 14,
                    borderRadius: 12,
                    gap: 8,
                  }}
                  activeOpacity={0.8}
                >
                  {action.icon &&
                    getActionIcon(
                      action.icon,
                      variant === "primary" ? "#FFFFFF" : "#3B2F2F",
                    )}
                  <Typography variation="label"
                    style={{
                      color: variant === "primary" ? "#FFFFFF" : "#3B2F2F",
                    }}
                  >
                    {action.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Pressable>
    </BlurModal>
  );
};
