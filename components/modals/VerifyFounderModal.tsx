import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { verifyFounderAccess } from "@/lib/database-helpers";
import { fetchUserProfile } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

interface VerifyFounderModalProps {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function VerifyFounderModal({
  visible,
  onClose,
  onVerified,
}: VerifyFounderModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setAccessCode("");
    setEmail(user?.email ?? "");
    setError("");
    setSuccess(false);
  };

  useEffect(() => {
    if (!visible) return;
    setEmail(user?.email ?? "");
  }, [visible, user?.email]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleVerify = async () => {
    if (!accessCode.trim()) {
      setError("Please enter your founder access code.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter the email you applied with.");
      return;
    }

    if (
      user?.email &&
      email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      setError("Use the same email as your signed-in account.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await verifyFounderAccess(accessCode, email);

    if (!result.success) {
      setError(result.error ?? "Verification failed. Please try again.");
      setLoading(false);
      return;
    }

    // Refresh profile in Redux so badge shows immediately
    if (user?.id) {
      await dispatch(fetchUserProfile(user.id));
    }

    setSuccess(true);
    setLoading(false);

    // Auto-dismiss after a short delay
    setTimeout(() => {
      reset();
      onVerified();
    }, 1800);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
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
          onPress={handleClose}
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
              {/* Handle bar */}
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

              {success ? (
                /* ── Success state ── */
                <View style={{ alignItems: "center", paddingVertical: 16 }}>
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: "#D1FAE5",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <IconSymbol
                      name="checkmark.seal.fill"
                      size={32}
                      color="#059669"
                    />
                  </View>
                  <HeadingBoldText
                    style={{
                      fontSize: 22,
                      textAlign: "center",
                      marginBottom: 8,
                    }}
                  >
                    Welcome, Founder!
                  </HeadingBoldText>
                  <BodyRegularText
                    style={{
                      color: "#6B7280",
                      textAlign: "center",
                      fontSize: 15,
                    }}
                  >
                    Your Founder Circle status has been activated. Enjoy your
                    exclusive benefits.
                  </BodyRegularText>
                </View>
              ) : (
                /* ── Input state ── */
                <>
                  {/* Header */}
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
                        backgroundColor: "#FEF3C7",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <IconSymbol name="crown.fill" size={22} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <HeadingBoldText style={{ fontSize: 20 }}>
                        Verify Founder Access
                      </HeadingBoldText>
                      <CaptionText style={{ color: "#6B7280", marginTop: 2 }}>
                        Enter the code from your approval email
                      </CaptionText>
                    </View>
                    <Pressable onPress={handleClose} hitSlop={12}>
                      <IconSymbol name="xmark" size={18} color="#9CA3AF" />
                    </Pressable>
                  </View>

                  {/* Info banner */}
                  <View
                    style={{
                      backgroundColor: "#F0FDF4",
                      borderWidth: 1,
                      borderColor: "#86EFAC",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 20,
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <IconSymbol
                      name="info.circle.fill"
                      size={16}
                      color="#16A34A"
                    />
                    <BodyRegularText
                      style={{
                        color: "#15803D",
                        fontSize: 13,
                        flex: 1,
                        lineHeight: 18,
                      }}
                    >
                      Use the{" "}
                      <BodySemiboldText
                        style={{ color: "#15803D", fontSize: 13 }}
                      >
                        email you submitted your application with
                      </BodySemiboldText>{" "}
                      and the access code from your approval notification.
                    </BodyRegularText>
                  </View>

                  <FormInput
                    label="Application Email"
                    placeholder="email@example.com"
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!user?.email}
                  />

                  {/* Inputs */}
                  <FormInput
                    label="Founder Access Code"
                    placeholder="e.g. FC-A3X9K2"
                    value={accessCode}
                    onChangeText={(v) => {
                      setAccessCode(v.toUpperCase());
                      setError("");
                    }}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />

                  {/* Error */}
                  {!!error && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 4,
                        marginBottom: 8,
                      }}
                    >
                      <IconSymbol
                        name="exclamationmark.circle.fill"
                        size={14}
                        color="#DC2626"
                      />
                      <CaptionText style={{ color: "#DC2626", flex: 1 }}>
                        {error}
                      </CaptionText>
                    </View>
                  )}

                  {/* CTA */}
                  {loading ? (
                    <View style={{ alignItems: "center", paddingVertical: 16 }}>
                      <ActivityIndicator color="#3B2F2F" />
                    </View>
                  ) : (
                    <FormButton
                      title="Verify & Activate"
                      onPress={handleVerify}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
