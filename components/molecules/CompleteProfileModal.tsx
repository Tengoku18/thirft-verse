import {
  BodyRegularText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

interface CompleteProfileModalProps {
  visible: boolean;
  onGoToProfile: () => void;
  onCancel: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  visible,
  onGoToProfile,
  onCancel,
}) => {
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
                  backgroundColor: "#FEF3C7",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  name="person.crop.circle.badge.exclamationmark"
                  size={28}
                  color="#D97706"
                />
              </View>
            </View>

            {/* Title */}
            <HeadingBoldText
              className="text-center mb-2"
              style={{ fontSize: 20 }}
            >
              Complete Your Profile
            </HeadingBoldText>

            {/* Message */}
            <BodyRegularText
              className="text-center mb-4"
              style={{ color: "#6B7280", lineHeight: 22 }}
            >
              To list products, you need to add your payment details so buyers
              can pay you.
            </BodyRegularText>

            {/* Requirements List */}
            <View
              className="mb-6 p-4 rounded-2xl"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <BodySemiboldText
                className="mb-3"
                style={{ color: "#374151", fontSize: 13 }}
              >
                Please add:
              </BodySemiboldText>
              <View className="flex-row items-center mb-2">
                <IconSymbol name="person.fill" size={16} color="#9CA3AF" />
                <BodyRegularText
                  className="ml-2"
                  style={{ color: "#6B7280", fontSize: 14 }}
                >
                  Payment Account Holder Name
                </BodyRegularText>
              </View>
              <View className="flex-row items-center">
                <IconSymbol name="qrcode" size={16} color="#9CA3AF" />
                <BodyRegularText
                  className="ml-2"
                  style={{ color: "#6B7280", fontSize: 14 }}
                >
                  Payment QR Code Image
                </BodyRegularText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Go to Profile Button */}
              <TouchableOpacity
                onPress={onGoToProfile}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#3B2F2F",
                  paddingVertical: 14,
                  borderRadius: 12,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol
                  name="arrow.right"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <BodySemiboldText style={{ color: "#FFFFFF" }}>
                  Go to Edit Profile
                </BodySemiboldText>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={onCancel}
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
                  Cancel
                </BodySemiboldText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
