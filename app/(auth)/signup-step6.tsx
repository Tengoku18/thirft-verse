import { InfoBox } from "@/components/atoms/InfoBox";
import { ReferralCodeInput } from "@/components/atoms/ReferralCodeInput";
import { CheckmarkIcon, GiftIcon, RightArrowIcon } from "@/components/icons";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  completeSignup,
  fetchUserProfile,
  persistSignupState,
  setCurrentStep,
  setFormData,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";
import * as yup from "yup";

// Validation schema for step 6
const step6Schema = yup.object({
  referralCode: yup
    .string()
    .trim()
    .max(50, "Referral code must be less than 50 characters")
    .optional()
    .nullable(),
});

type Step6FormData = yup.InferType<typeof step6Schema>;

const REFERRAL_BENEFITS = [
  "Instant $10 credit applied to your first curated purchase.",
  "Exclusive early access to our boutique thrift catalogs.",
  "Double rewards points for the first 30 days of membership.",
];

export default function SignupStep6Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const handleBack = () => {
    // Decrement step and navigate to previous step
    dispatch(setCurrentStep(5));
    dispatch(persistSignupState({ currentStep: 5, isSignupInProgress: true }));
    router.push("/(auth)/signup-step5");
  };

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null,
  );

  // Form setup with React Hook Form
  const { handleSubmit, watch, setValue } = useForm<Step6FormData>({
    resolver: yupResolver(step6Schema as any),
    mode: "onBlur",
    defaultValues: {
      referralCode: signupState.formData.referralCode || "",
    },
  });

  const referralCode = watch("referralCode");

  const handleVerifyCode = async () => {
    if (!referralCode?.trim()) {
      setVerificationMessage(null);
      return;
    }

    setVerifyLoading(true);
    setVerificationMessage(null);

    try {
      // Verify referral code exists in Supabase
      const { data, error } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("code", referralCode.trim().toUpperCase())
        .single();

      if (error || !data) {
        setVerificationMessage(
          "Invalid referral code. Please check and try again.",
        );
        setVerifyLoading(false);
        return;
      }

      setVerificationMessage(
        `✓ Code "${referralCode}" verified! You'll receive the bonus benefits.`,
      );
    } catch (error) {
      console.error("Error verifying code:", error);
      setVerificationMessage("Failed to verify code. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setGeneralError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGeneralError("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      // Update referral code if provided
      if (referralCode?.trim()) {
        const { error } = await supabase
          .from("profiles")
          .update({
            referral_code_used: referralCode.trim().toUpperCase(),
          })
          .eq("id", user.id);

        if (error) {
          console.error("Failed to save referral code:", error);
          setGeneralError("Failed to save referral code. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Save to Redux
      dispatch(
        setFormData({
          referralCode: referralCode?.trim() || "",
        }),
      );

      // Refetch profile
      await dispatch(fetchUserProfile(user.id));

      // Complete signup
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      router.replace("/(auth)/signup-success");
    } catch (error) {
      console.error("Error in signup-step6:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGeneralError("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      // Complete signup without referral code
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      router.replace("/(auth)/signup-success");
    } catch (error) {
      console.error("Error skipping step 6:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout showHeader headerTitle="Sign Up" onBack={handleBack}>
      <Stepper title="Referral Bonus" currentStep={6} totalSteps={6} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 pb-8">
            {/* Header */}
            <View className="mb-8">
              <Typography variation="h1" className="text-center py-2">
                Have a Referral Code?
              </Typography>
              <Typography
                variation="body"
                className="text-slate-500 text-center"
              >
                Enter your referral code to unlock your welcome bonus! If you
                don&apos;t have one, you can proceed to the next step.
              </Typography>
            </View>

            {/* General Error */}
            {generalError && <InfoBox type="error" message={generalError} />}

            {/* Referral Code Input with Verify Button */}
            <ReferralCodeInput
              value={referralCode || ""}
              onChangeText={(text) => setValue("referralCode", text)}
              onVerify={handleVerifyCode}
              isVerifying={verifyLoading}
              isDisabled={!referralCode?.trim()}
              placeholder="Enter code here"
            />

            {/* Verification Message */}
            {verificationMessage && (
              <View
                className={`mb-6 p-3 rounded-lg ${
                  verificationMessage.includes("✓")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <Typography
                  variation="body-sm"
                  className={
                    verificationMessage.includes("✓")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {verificationMessage}
                </Typography>
              </View>
            )}

            {/* Benefits Box */}
            <View className="p-6 bg-white rounded-2xl border border-slate-200">
              {/* Benefits Header */}
              <View className="flex-row items-center gap-4 mb-8">
                <View className="w-16 h-16 bg-[#F5EDE3] rounded-full items-center justify-center">
                  <GiftIcon size={28} color="#D4A373" />
                </View>
                <Typography
                  variation="h3"
                  className="font-sans-bold text-slate-800 flex-1"
                >
                  Referral Program Benefits
                </Typography>
              </View>

              {/* Benefits List */}
              <View className="gap-3 pr-4">
                {REFERRAL_BENEFITS.map((benefit, index) => (
                  <View key={index} className="flex-row gap-3">
                    <View className="pt-1">
                      <CheckmarkIcon size={24} color="#D4A373" />
                    </View>
                    <Typography
                      variation="body"
                      className="text-slate-600 flex-1"
                    >
                      {benefit}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 py-6 flex-row gap-3">
          {/* Skip Button */}
          <Pressable onPress={handleSkip} disabled={loading} className="">
            <Typography
              variation="body"
              className="text-center text-slate-600 font-sans-bold text-xl px-10 py-4"
            >
              Skip
            </Typography>
          </Pressable>

          {/* Complete Signup Button */}
          <View className="flex-1">
            <Button
              label="Complete Signup"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
              disabled={loading}
              fullWidth
              iconPosition="right"
              icon={<RightArrowIcon width={20} height={20} color="#fff" />}
            />
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
