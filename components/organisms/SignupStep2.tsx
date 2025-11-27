import { FormButton } from "@/components/atoms/FormButton";
import { ThemedText } from "@/components/themed-text";
import { createUserProfile } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useRef, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

interface SignupStep2Props {
  email: string;
  name: string;
  username: string;
  address: string;
  profileImage: string | null;
  onNext: () => void;
  onBack: () => void;
}

export const SignupStep2: React.FC<SignupStep2Props> = ({
  email,
  name,
  username,
  address,
  profileImage,
  onNext,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
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
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // Use 'signup' type for email confirmation OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });

      if (error) {
        console.error("❌ Verification error:", error);
        const isExpiredError =
          error.message?.toLowerCase().includes("expired") ||
          error.message?.toLowerCase().includes("invalid");
        Alert.alert(
          "Verification Failed",
          isExpiredError
            ? "Your verification code has expired or is invalid. Please tap 'Resend Code' to get a new one."
            : error.message || "Invalid or expired code. Please try again."
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        const profile_image = profileImage || null;

        // Create user profile in database
        const profileResult = await createUserProfile({
          userId: data.user.id,
          name,
          store_username: username,
          bio: "",
          profile_image: profile_image,
          currency: "NPR",
          address: address,
        });

        if (!profileResult.success) {
          const error = profileResult.error as any;
          const errorMessage = error?.message || error?.toString() || "";
          if (
            errorMessage.toLowerCase().includes("duplicate") ||
            errorMessage.toLowerCase().includes("already exists") ||
            errorMessage.toLowerCase().includes("unique constraint")
          ) {
          } else if (
            (profileResult as any).tableNotFound ||
            error?.code === "PGRST205"
          ) {
            console.error("❌ Failed to create profile:", profileResult.error);
            console.error("⚠️  Profiles table not found!");
            console.error(
              "📝 ACTION REQUIRED: Run the SQL migration in Supabase Dashboard → SQL Editor"
            );
            Alert.alert(
              "Database Setup Required",
              "Profile table not found. Please run the SQL migration in Supabase Dashboard.\n\nCannot complete signup without database setup.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    setLoading(false);
                  },
                },
              ]
            );
            return;
          } else {
            console.error(
              "❌ CRITICAL: Failed to create profile:",
              profileResult.error
            );
            Alert.alert(
              "Profile Creation Failed",
              `Failed to create your profile. This is required to use the app.\n\nError: ${errorMessage}\n\nPlease try again or contact support.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    setLoading(false);
                  },
                },
              ]
            );
            return; // STOP - Don't proceed without profile
          }
        } else {
          console.log(
            "✅ Profile created successfully for user:",
            data.user.id
          );
        }

        // All done! Proceed to next step
        setLoading(false);
        onNext();
      } else {
        console.warn("⚠️  No user in response");
        Alert.alert("Verification Failed", "No user found. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("💥 Unexpected verification error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      // Resend OTP by calling resend API
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        console.error("❌ Resend error:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to resend code. Please try again."
        );
        setResendLoading(false);
        return;
      }

      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email."
      );

      // Reset timer and clear inputs
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("💥 Unexpected resend error:", error);
      Alert.alert("Error", "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View className="flex-1">
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
                borderColor: "#3B2F2F",
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

        {/* Resend Code */}
        <View className="flex-row justify-center items-center mt-2">
          {canResend ? (
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resendLoading}
            >
              <ThemedText
                className="text-[14px] font-[NunitoSans_600SemiBold]"
                style={{ color: "#3B2F2F" }}
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText
              className="text-[14px] font-[NunitoSans_400Regular]"
              style={{ color: "#9CA3AF" }}
            >
              Resend code in {timer}s
            </ThemedText>
          )}
        </View>
      </View>

      {/* Info */}
      <View className="mb-8 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
        <ThemedText
          className="text-[14px] font-[NunitoSans_400Regular] leading-6"
          style={{ color: "#6B7280" }}
        >
          Check your spam folder if you don&apos;t see the email. The code will
          expire in 60 minutes.
        </ThemedText>
      </View>

      {/* Buttons */}
      <View className="mt-auto">
        <FormButton
          title="Verify & Continue"
          onPress={handleVerifyOtp}
          loading={loading}
          variant="primary"
          className="mb-4"
        />

        <FormButton title="Back" onPress={onBack} variant="outline" />
      </View>
    </View>
  );
};
