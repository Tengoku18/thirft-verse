import { FormButton } from "@/components/atoms/FormButton";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  persistSignupState,
  setCurrentStep,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupStep2Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);
  const profile = useAppSelector((state) => state.profile.profile);

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

      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
      );

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

  const handleBack = () => {
    dispatch(clearPersistedSignupState());
    router.back();
  };

  if (!email) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader title="Verification" onBack={handleBack} />

        <View className="mb-8">
          <CaptionText
            className="mb-2 tracking-widest uppercase"
            style={{ color: "#6B7280", fontWeight: "600", fontSize: 11 }}
          >
            Step 2 of 3
          </CaptionText>
          <HeadingBoldText
            className="leading-tight mb-2"
            style={{ fontSize: 32 }}
          >
            Email Verification
          </HeadingBoldText>
          <BodyRegularText
            className="leading-relaxed"
            style={{ color: "#6B7280", fontSize: 15 }}
          >
            We&apos;ve sent a verification code to {email}
          </BodyRegularText>
        </View>

        <View className="flex-1">
          {/* Error message */}
          {errorMessage && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <BodyRegularText style={{ color: "#EF4444", fontSize: 14 }}>
                {errorMessage}
              </BodyRegularText>
            </View>
          )}

          {/* OTP Input */}
          <View className="mb-10">
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="w-[52px] h-[58px] border-[2px] border-transparent bg-[#FAFAFA] rounded-2xl text-center text-[22px] font-[NunitoSans_700Bold] text-[#3B2F2F]"
                  style={{
                    borderColor: errorMessage ? "#EF4444" : "#3B2F2F",
                    backgroundColor: digit ? "#FFFFFF" : "#FAFAFA",
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                />
              ))}
            </View>

            <View className="flex-row justify-center items-center mt-2">
              {canResend ? (
                <TouchableOpacity
                  onPress={handleResendCode}
                  disabled={resendLoading}
                >
                  <BodySemiboldText>
                    {resendLoading ? "Sending..." : "Resend Code"}
                  </BodySemiboldText>
                </TouchableOpacity>
              ) : (
                <BodyRegularText style={{ color: "#9CA3AF" }}>
                  Resend code in {timer}s
                </BodyRegularText>
              )}
            </View>
          </View>

          {/* Info */}
          <View className="mb-8 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
            <BodyRegularText className="leading-6" style={{ color: "#6B7280" }}>
              Check your spam folder if you don&apos;t see the email. The code
              will expire in 60 minutes.
            </BodyRegularText>
          </View>

          {/* Button */}
          <View className="mt-auto">
            <FormButton
              title="Verify & Continue"
              onPress={handleVerifyOtp}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
