import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyRegularText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { applyReferralCode } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { persistSignupState, setCurrentStep } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function SignupStep3Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralError, setReferralError] = useState("");

  const handleContinue = async () => {
    setLoading(true);
    setReferralError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setReferralError("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      if (referralCode.trim()) {
        const referralResult = await applyReferralCode(
          referralCode.trim(),
          user.id,
          user.email ?? "",
        );

        if (!referralResult.success) {
          setReferralError(
            referralResult.error || "Failed to apply referral code.",
          );
          setLoading(false);
          return;
        }
      }

      dispatch(setCurrentStep(4));
      await dispatch(
        persistSignupState({
          currentStep: 4,
          isSignupInProgress: true,
        }),
      );
      router.push("/(auth)/signup-step4");
    } catch (error) {
      console.error("Error applying referral code:", error);
      setReferralError("Failed to apply referral code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setReferralError("");

    try {
      dispatch(setCurrentStep(4));
      await dispatch(
        persistSignupState({
          currentStep: 4,
          isSignupInProgress: true,
        }),
      );
      router.push("/(auth)/signup-step4");
    } catch (error) {
      console.error("Error moving to payment step:", error);
      setReferralError("Failed to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader title="Referral Code" onBack={() => router.back()} />

        <View className="mb-8">
          <CaptionText
            className="mb-2 tracking-widest uppercase"
            style={{ color: "#6B7280", fontWeight: "600", fontSize: 11 }}
          >
            Step 3 of 4
          </CaptionText>
          <HeadingBoldText
            className="leading-tight mb-2"
            style={{ fontSize: 32 }}
          >
            Got a Referral Code?
          </HeadingBoldText>
          <BodyRegularText
            className="leading-relaxed"
            style={{ color: "#6B7280", fontSize: 15 }}
          >
            Enter it now to connect your signup with the person who referred you
          </BodyRegularText>
        </View>

        <View className="flex-1">
          <View className="mb-6 p-4 bg-[#ECFDF5] rounded-2xl border-[2px] border-[#A7F3D0]">
            <View className="flex-row items-start">
              <IconSymbol name="gift.fill" size={20} color="#059669" />
              <BodyRegularText
                className="ml-3 flex-1 leading-5"
                style={{ color: "#065F46", fontSize: 13 }}
              >
                If a friend invited you, enter their code here so they get
                referral credit.
              </BodyRegularText>
            </View>
          </View>

          <FormInput
            label="Referral Code (Optional)"
            placeholder="Enter referral code"
            value={referralCode}
            onChangeText={(text) => {
              setReferralCode(text.toUpperCase());
              if (referralError) setReferralError("");
            }}
            autoCapitalize="characters"
          />

          {!!referralError && (
            <CaptionText className="mb-4 -mt-2" style={{ color: "#DC2626" }}>
              {referralError}
            </CaptionText>
          )}

          <View className="mt-auto pt-4">
            <FormButton
              title="Continue to Payment"
              onPress={handleContinue}
              loading={loading}
              variant="primary"
              className="mb-4"
            />

            <FormButton
              title="I Don't Have a Code"
              onPress={handleSkip}
              variant="outline"
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
