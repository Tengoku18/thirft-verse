import {
  BodyRegularText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

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

  const displayActions = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6"
        onPress={onClose}
      >
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
              <HeadingBoldText style={{ fontSize: 20, flex: 1 }}>
                {title}
              </HeadingBoldText>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 12 }}
              >
                <IconSymbol name="xmark" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            {children ? (
              <View style={{ marginBottom: 24 }}>{children}</View>
            ) : message ? (
              <BodyRegularText
                style={{ color: "#6B7280", lineHeight: 22, marginBottom: 24 }}
              >
                {message}
              </BodyRegularText>
            ) : null}

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {displayActions.map((action, index) => {
                const variant = action.variant || (index === 0 ? "primary" : "secondary");

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
                      <BodyRegularText style={{ color: "#6B7280" }}>
                        {action.label}
                      </BodyRegularText>
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
                      backgroundColor: variant === "primary" ? "#3B2F2F" : "#F3F4F6",
                      paddingVertical: 14,
                      borderRadius: 12,
                      gap: 8,
                    }}
                    activeOpacity={0.8}
                  >
                    {action.icon && (
                      <IconSymbol
                        name={action.icon as any}
                        size={18}
                        color={variant === "primary" ? "#FFFFFF" : "#3B2F2F"}
                      />
                    )}
                    <BodySemiboldText
                      style={{ color: variant === "primary" ? "#FFFFFF" : "#3B2F2F" }}
                    >
                      {action.label}
                    </BodySemiboldText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
