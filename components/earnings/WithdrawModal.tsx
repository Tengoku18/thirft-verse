import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BodySemiboldText,
  BodyMediumText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";

interface WithdrawModalProps {
  visible: boolean;
  availableBalance: number;
  paymentUsername: string;
  onClose: () => void;
  onSubmit: (amount: number, note: string) => Promise<void>;
}

const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function WithdrawModal({
  visible,
  availableBalance,
  paymentUsername,
  onClose,
  onSubmit,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setAmount("");
    setNote("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);

    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parsedAmount > availableBalance) {
      setError(
        `Amount exceeds available balance (${formatAmount(availableBalance)})`
      );
      return;
    }

    if (parsedAmount < 100) {
      setError("Minimum withdrawal amount is रु 100");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(parsedAmount, note.trim());
      setAmount("");
      setNote("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || !amount.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: Platform.OS === "ios" ? 40 : 24,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "rgba(59,48,48,0.15)",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <HeadingBoldText style={{ fontSize: 20, color: "#3B2F2F" }}>
                Request Withdrawal
              </HeadingBoldText>
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#F3F4F6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
              >
                <IconSymbol name="xmark" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Available balance info */}
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 14,
                padding: 16,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <IconSymbol name="banknote.fill" size={22} color="#22C55E" />
              <View>
                <CaptionText style={{ color: "#6B7280", marginBottom: 2 }}>
                  Available Balance
                </CaptionText>
                <BodySemiboldText style={{ color: "#059669", fontSize: 18 }}>
                  {formatAmount(availableBalance)}
                </BodySemiboldText>
              </View>
            </View>

            {/* Payout to label */}
            <View
              style={{
                backgroundColor: "#FAF7F2",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#4CAF50",
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 9 }}>
                  e
                </BodySemiboldText>
              </View>
              <CaptionText style={{ color: "rgba(59,48,48,0.6)", fontSize: 12 }}>
                Payout to:{" "}
                <BodySemiboldText style={{ color: "#3B2F2F", fontSize: 12 }}>
                  @{paymentUsername}
                </BodySemiboldText>
              </CaptionText>
            </View>

            {/* Amount input */}
            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <BodySemiboldText style={{ fontSize: 14, color: "#374151" }}>
                  Withdraw Amount
                </BodySemiboldText>
                <BodySemiboldText style={{ color: "#EF4444", fontSize: 14 }}>
                  {" "}*
                </BodySemiboldText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F3F4F6",
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  borderWidth: error ? 1.5 : 0,
                  borderColor: error ? "#EF4444" : "transparent",
                }}
              >
                <BodySemiboldText style={{ color: "#6B7280", fontSize: 16 }}>
                  रु
                </BodySemiboldText>
                <TextInput
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text.replace(/[^0-9.]/g, ""));
                    if (error) setError(null);
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    fontSize: 18,
                    color: "#1F2937",
                    fontWeight: "600",
                  }}
                />
              </View>
              {error && (
                <CaptionText style={{ color: "#EF4444", marginTop: 6 }}>
                  {error}
                </CaptionText>
              )}
            </View>

            {/* Note input */}
            <View style={{ marginBottom: 24 }}>
              <BodySemiboldText
                style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}
              >
                Note{" "}
                <CaptionText style={{ color: "#9CA3AF", fontSize: 13 }}>
                  (Optional)
                </CaptionText>
              </BodySemiboldText>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note for the admin..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: "#1F2937",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>

            {/* Submit button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isDisabled}
              activeOpacity={0.85}
              style={{
                backgroundColor: "#3B2F2F",
                borderRadius: 14,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              {submitting ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 16 }}>
                    Submitting...
                  </BodySemiboldText>
                </>
              ) : (
                <>
                  <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
                  <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 16 }}>
                    Submit Request
                  </BodySemiboldText>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={handleClose}
              disabled={submitting}
              activeOpacity={0.7}
              style={{ paddingVertical: 14, alignItems: "center", marginTop: 4 }}
            >
              <BodyMediumText style={{ color: "#9CA3AF", fontSize: 15 }}>
                Cancel
              </BodyMediumText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
