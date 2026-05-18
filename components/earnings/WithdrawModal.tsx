import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/atoms/InfoBox";
import { RHFInput } from "@/components/forms/ReactHookForm/RHFInput";
import { RHFTextarea } from "@/components/forms/ReactHookForm/RHFTextarea";
import { CashIcon, XIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { createWithdrawSchema, WithdrawFormData } from "@/lib/validations/withdraw";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WithdrawModalProps {
  visible: boolean;
  availableBalance: number;
  paymentUsername: string;
  onClose: () => void;
  onSubmit: (amount: number, note: string) => Promise<void>;
}

const MIN_WITHDRAWAL = 100;
const MAX_WITHDRAWAL = 50000;

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
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<WithdrawFormData>({
    resolver: yupResolver(createWithdrawSchema(availableBalance)),
    mode: "onBlur",
    defaultValues: { amount: undefined, note: "" },
  });

  const handleClose = () => {
    if (submitting) return;
    reset();
    setApiError(null);
    onClose();
  };

  const onFormSubmit = async (data: WithdrawFormData) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit(data.amount, data.note?.trim() ?? "");
      reset();
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {/* Header — outside KAV so it never moves */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#D1FAE5",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <CashIcon width={20} height={20} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Typography variation="h3">Request Withdrawal</Typography>
            <Typography variation="caption" style={{ color: "#6B7280", marginTop: 2 }}>
              Funds will be sent to your eSewa wallet
            </Typography>
          </View>
          <TouchableOpacity onPress={handleClose} hitSlop={12}>
            <XIcon width={22} height={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* KAV wraps scroll + footer so both move up together when keyboard opens */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 24, paddingBottom: 16 }}
          >
            {/* Balance + payout cards */}
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#F0FDF4",
                  borderWidth: 1,
                  borderColor: "#86EFAC",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Typography variation="caption" style={{ color: "#6B7280", marginBottom: 4 }}>
                  Available
                </Typography>
                <Typography variation="label" style={{ color: "#059669", fontSize: 16 }}>
                  {formatAmount(availableBalance)}
                </Typography>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#F9FAFB",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Typography variation="caption" style={{ color: "#6B7280", marginBottom: 4 }}>
                  Payout to
                </Typography>
                <Typography
                  variation="label"
                  style={{ color: "#3B2F2F", fontSize: 13 }}
                  numberOfLines={1}
                >
                  @{paymentUsername}
                </Typography>
              </View>
            </View>

            {/* Info banner */}
            <InfoBox
              message={`Min ${formatAmount(MIN_WITHDRAWAL)} · Max ${formatAmount(MAX_WITHDRAWAL)} per request. Admin reviews within 1–2 business days.`}
              type="info"
              style={{ marginBottom: 20 }}
            />

            {/* Amount input */}
            <RHFInput
              control={control}
              name="amount"
              label="Withdraw Amount"
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            {/* Note */}
            <View style={{ marginTop: 20 }}>
              <RHFTextarea
                control={control}
                name="note"
                label="Additional Note"
                placeholder="Add a note for the admin..."
                maxLength={300}
              />
            </View>

            {/* API error */}
            {apiError && (
              <InfoBox message={apiError} type="error" style={{ marginTop: 12 }} />
            )}
          </ScrollView>

          {/* Footer in normal flow — rises with KAV when keyboard opens */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 12,
              paddingBottom: insets.bottom + 16,
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Button
              label="Submit Request"
              onPress={handleSubmit(onFormSubmit)}
              isLoading={submitting}
              disabled={submitting}
              variant="primary"
              fullWidth
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
