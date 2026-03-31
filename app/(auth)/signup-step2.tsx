import { InfoBox } from "@/components/atoms/InfoBox";
import { OTPInput } from "@/components/atoms/OTPInput";
import { ResendCodeSection } from "@/components/atoms/ResendCodeSection";
import ForwardIcon from "@/components/icons/ForwardIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { useToast } from "@/contexts/ToastContext";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  persistSignupState,
  setCurrentStep,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

export default function SignupStep2Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);
  const profile = useAppSelector((state) => state.profile.profile);

  const toast = useToast();
  const email = signupState.formData.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // If no email in state, redirect back
    if (!email) {
      router.replace("/(auth)/signin");
    }
  }, [email, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      setErrorMessage("Email not found. Please try signing up again.");
      router.push("/(auth)/signin");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });

      if (error) {
        console.error("Verification error:", error);
        const isExpiredError =
          error.message?.toLowerCase().includes("expired") ||
          error.message?.toLowerCase().includes("invalid");
        setErrorMessage(
          isExpiredError
            ? "Your verification code has expired or is invalid. Please tap 'Resend Code' to get a new one."
            : error.message || "Invalid or expired code. Please try again.",
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if user has completed step 3 (payment setup)
        // If payment_username exists in profile, they've completed step 3
        const hasCompletedPaymentStep = profile?.payment_username;

        if (hasCompletedPaymentStep) {
          // User already completed signup before, go to home
          await dispatch(clearPersistedSignupState());
          router.push("/(tabs)");
        } else {
          // User needs to complete step 3
          dispatch(setCurrentStep(3));
          await dispatch(
            persistSignupState({
              currentStep: 3,
              isSignupInProgress: true,
            }),
          );
          router.push("/(auth)/signup-step3");
        }
      } else {
        setErrorMessage("Verification failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Unexpected verification error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setErrorMessage("Email not found. Please try signing up again.");
      return;
    }

    setResendLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        console.error("Resend error:", error);
        setErrorMessage(
          error.message || "Failed to resend code. Please try again.",
        );
        setResendLoading(false);
        return;
      }

      toast.success("A new verification code has been sent to your email.");

      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Unexpected resend error:", error);
      setErrorMessage("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Email Verification"
      showScrollView={false}
    >
      <Stepper title="Verify Email" currentStep={2} totalSteps={4} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4">
            {/* Header Section */}
            <View className="mb-8">
              <Typography
                variation="h1"
                className="mb-1 font-sans-bold text-slate-900"
              >
                Verify Email
              </Typography>
              <Typography variation="body-sm" className="text-slate-600">
                We&apos;ve sent a 6-digit code to your email. Please enter it
                below to continue.
              </Typography>
              {/* Email Display */}
              <Typography variation="body-sm" className="text-slate-600">
                Code sent to{" "}
                <Typography
                  variation="body-sm"
                  className="font-sans-semibold text-slate-900"
                >
                  {email}
                </Typography>
              </Typography>
            </View>

            {/* Error Message */}
            {errorMessage && (
              <InfoBox message={errorMessage} type="error" className="mb-6" />
            )}

            {/* OTP Input Section */}
            <View className="mb-10">
              <View className="flex-row justify-center gap-3 mb-8">
                {otp.map((digit, index) => (
                  <View key={index} className="w-14 h-16">
                    <OTPInput
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      forwardedRef={(ref) => {
                        inputRefs.current[index] = ref;
                      }}
                      hasError={!!errorMessage}
                      isFilled={!!digit}
                      editable={!loading}
                    />
                  </View>
                ))}
              </View>

              {/* Resend Code Section */}
              <View className="items-center">
                <ResendCodeSection
                  canResend={canResend}
                  timer={timer}
                  isLoading={resendLoading}
                  onResendPress={handleResendCode}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Verify Button - Sticky Bottom */}
        <View className="px-6 py-6">
          <Button
            label="Verify"
            variant="primary"
            onPress={handleVerifyOtp}
            isLoading={loading}
            disabled={loading}
            fullWidth
            icon={<ForwardIcon width={20} height={20} />}
            iconPosition="right"
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
