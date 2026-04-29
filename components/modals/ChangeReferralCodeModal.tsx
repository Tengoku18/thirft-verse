import { FormButton } from "@/components/atoms/FormButton";
import { Typography } from "@/components/ui/Typography";

import React from "react";
import { IIcon, RefreshIcon, SquarePencilIcon, XIcon } from "@/components/icons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChangeReferralCodeModalProps {
  visible: boolean;
  value: string;
  error?: string;
  loading?: boolean;
  onChangeText: (value: string) => void;
  onGenerateSuggestion: () => void;
  onSave: () => void;
  onClose: () => void;
}

export function ChangeReferralCodeModal({
  visible,
  value,
  error,
  loading = false,
  onChangeText,
  onGenerateSuggestion,
  onSave,
  onClose,
}: ChangeReferralCodeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
          onPress={onClose}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: 40,
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 24 }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 2,
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <SquarePencilIcon width={22} height={22} color="#3B2F2F" />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variation="h2" style={{ fontSize: 20 }}>
                    Change Referral Code
                  </Typography>
                  <Typography variation="caption" style={{ color: "#6B7280", marginTop: 2 }}>
                    Update your code without leaving this screen
                  </Typography>
                </View>
                <Pressable onPress={onClose} hitSlop={12}>
                  <XIcon width={18} height={18} color="#9CA3AF" />
                </Pressable>
              </View>

              <View
                style={{
                  backgroundColor: "#F9FAFB",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 20,
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <IIcon width={16} height={16} color="#6B7280" />
                <Typography variation="body"
                  style={{
                    color: "#4B5563",
                    fontSize: 13,
                    flex: 1,
                    lineHeight: 18,
                  }}
                >
                  Tap the refresh icon to suggest a new code, then save when you
                  are ready.
                </Typography>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Typography variation="label" className="mb-3" style={{ fontSize: 13 }}>
                  New Referral Code
                </Typography>
                <View>
                  <TextInput
                    placeholder="Example: NIKHIL"
                    value={value}
                    onChangeText={(text) => onChangeText(text.toUpperCase())}
                    autoCapitalize="characters"
                    editable={!loading}
                    className={`h-[58px] px-4 pr-14 rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
                      error
                        ? "border-[#EF4444] bg-[#FEF2F2]"
                        : loading
                          ? "border-[#E5E7EB] bg-[#F9FAFB]"
                          : "border-[#E5E7EB] bg-white"
                    }`}
                    style={{ color: loading ? "#6B7280" : "#3B2F2F" }}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={onGenerateSuggestion}
                    disabled={loading}
                    activeOpacity={0.7}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <RefreshIcon width={20} height={20} color={loading ? "#D1D5DB" : "#6B7280"} />
                  </TouchableOpacity>
                </View>
                {!!error && (
                  <Typography variation="caption"
                    className="mt-2"
                    style={{ color: "#EF4444", fontSize: 13 }}
                  >
                    {error}
                  </Typography>
                )}
              </View>

              <FormButton
                title="Save New Code"
                onPress={onSave}
                loading={loading}
                variant="primary"
              />
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
