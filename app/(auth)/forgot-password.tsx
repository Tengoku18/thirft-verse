import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

// Step 1: Enter Email
interface EmailFormData {
  email: string;
}

const emailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email address")
    .required("Email is required"),
});

// Step 3: Reset Password
interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPasswordForEmail, verifyOtpAndResetPassword } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Step 1 Form
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Step 3 Form
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Countdown timer for resend
  useEffect(() => {
    if (currentStep === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [currentStep, timer]);

  // Step 1: Request password reset
  const onRequestReset = async (data: EmailFormData) => {
    setLoading(true);
    setEmail(data.email);

    try {
      const { error } = await resetPasswordForEmail(data.email);

      if (error) {
        // Check if it's an email service error
        const isEmailError =
          error.message?.includes("Invalid API key") ||
          error.message?.includes("sending email") ||
          error.message?.includes("Error sending email");

        if (isEmailError) {
          Alert.alert(
            "Email Service Not Configured",
            'Supabase email service is not set up. This is normal for new projects.\n\nOptions:\n1. Test the OTP UI (demo mode)\n2. Configure email in Supabase Dashboard later\n\nClick "Test UI" to see the password reset flow!',
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setLoading(false),
              },
              {
                text: "Test UI",
                onPress: () => {
                  setCurrentStep(2);
                  setLoading(false);
                },
              },
            ]
          );
          return;
        }

        Alert.alert(
          "Error",
          error.message || "Failed to send reset code. Please try again."
        );
        setLoading(false);
        return;
      }

      setCurrentStep(2);
    } catch (error) {
      console.error("💥 Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP input
  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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
      Alert.alert("Invalid Code", "Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // Just verify the code exists for now - we'll reset password in step 3
      // Store the OTP code for the next step
      setCurrentStep(3);
      setLoading(false);
    } catch (error) {
      console.error("💥 Unexpected verification error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      const { error } = await resetPasswordForEmail(email);

      if (error) {
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

  // Step 3: Reset password
  const onResetPassword = async (data: PasswordFormData) => {
    const otpCode = otp.join("");
    setLoading(true);

    try {
      const { error } = await verifyOtpAndResetPassword(
        email,
        otpCode,
        data.password
      );

      if (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to reset password. Please try again."
        );
        setLoading(false);
        return;
      }

      Alert.alert(
        "Success",
        "Your password has been reset successfully. You can now sign in with your new password.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/signin"),
          },
        ]
      );
    } catch (error) {
      console.error("💥 Unexpected password reset error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-1">
            <View className="mb-12">
              <View className="w-16 h-16 bg-[#3B2F2F] rounded-2xl justify-center items-center mb-6">
                <IconSymbol name="lock.fill" size={28} color="#FFFFFF" />
              </View>
              <ThemedText
                className="text-[40px] font-[PlayfairDisplay_700Bold] leading-tight mb-3"
                style={{ color: "#3B2F2F" }}
              >
                Forgot{"\n"}Password?
              </ThemedText>
              <ThemedText
                className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed"
                style={{ color: "#6B7280" }}
              >
                Enter your email address and we'll send you a verification code
                to reset your password.
              </ThemedText>
            </View>

            <View className="flex-1">
              <Controller
                control={emailControl}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Email Address"
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.toLowerCase())}
                    error={emailErrors.email?.message}
                  />
                )}
              />

              <FormButton
                title="Send Reset Code"
                onPress={handleEmailSubmit(onRequestReset)}
                loading={loading}
                variant="primary"
                className="mt-4"
              />

              <View className="mt-6">
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText
                    className="text-center text-[14px] font-[NunitoSans_600SemiBold]"
                    style={{ color: "#3B2F2F" }}
                  >
                    Back to Sign In
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex-1">
            <View className="mb-10">
              <ThemedText
                className="text-[15px] leading-6 font-[NunitoSans_400Regular] mb-2"
                style={{ color: "#6B7280" }}
              >
                We've sent a 6-digit verification code to
              </ThemedText>
              <ThemedText
                className="text-[17px] font-semibold font-[NunitoSans_700Bold]"
                style={{ color: "#3B2F2F" }}
              >
                {email}
              </ThemedText>
            </View>

            <View className="mb-10">
              <ThemedText
                className="text-[13px] font-semibold mb-4 font-[NunitoSans_600SemiBold] tracking-wide uppercase"
                style={{ color: "#3B2F2F" }}
              >
                Enter Verification Code
              </ThemedText>

              <View className="flex-row justify-between mb-6">
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className="w-[52px] h-[58px] border-[2px] border-transparent bg-[#FAFAFA] rounded-2xl text-center text-[22px] font-[NunitoSans_700Bold] text-[#3B2F2F]"
                    style={{
                      borderColor: digit ? "#3B2F2F" : "transparent",
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

            <View className="mb-8 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
              <ThemedText
                className="text-[14px] font-[NunitoSans_400Regular] leading-6"
                style={{ color: "#6B7280" }}
              >
                Check your spam folder if you don't see the email. The code will
                expire in 60 minutes.
              </ThemedText>
            </View>

            <View className="mt-auto">
              <FormButton
                title="Verify Code"
                onPress={handleVerifyOtp}
                loading={loading}
                variant="primary"
                className="mb-4"
              />

              <FormButton
                title="Back"
                onPress={() => setCurrentStep(1)}
                variant="outline"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View className="flex-1">
            <View className="mb-12">
              <View className="w-16 h-16 bg-[#3B2F2F] rounded-2xl justify-center items-center mb-6">
                <IconSymbol name="key.fill" size={28} color="#FFFFFF" />
              </View>
              <ThemedText
                className="text-[40px] font-[PlayfairDisplay_700Bold] leading-tight mb-3"
                style={{ color: "#3B2F2F" }}
              >
                Set New{"\n"}Password
              </ThemedText>
              <ThemedText
                className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed"
                style={{ color: "#6B7280" }}
              >
                Create a strong password for your account.
              </ThemedText>
            </View>

            <View className="flex-1">
              <Controller
                control={passwordControl}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="New Password"
                    placeholder="Enter new password"
                    isPassword
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={passwordErrors.password?.message}
                  />
                )}
              />

              <Controller
                control={passwordControl}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    isPassword
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={passwordErrors.confirmPassword?.message}
                  />
                )}
              />

              <View className="mb-8 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
                <ThemedText
                  className="text-[13px] font-[NunitoSans_600SemiBold] mb-2"
                  style={{ color: "#3B2F2F" }}
                >
                  Password Requirements:
                </ThemedText>
                <ThemedText
                  className="text-[13px] font-[NunitoSans_400Regular] leading-5"
                  style={{ color: "#6B7280" }}
                >
                  • At least 8 characters long{"\n"}• Contains uppercase and
                  lowercase letters{"\n"}• Contains at least one number
                </ThemedText>
              </View>

              <FormButton
                title="Reset Password"
                onPress={handlePasswordSubmit(onResetPassword)}
                loading={loading}
                variant="primary"
                className="mt-4"
              />

              <View className="mt-6">
                <TouchableOpacity onPress={() => setCurrentStep(2)}>
                  <ThemedText
                    className="text-center text-[14px] font-[NunitoSans_600SemiBold]"
                    style={{ color: "#3B2F2F" }}
                  >
                    Back
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-12 pb-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() =>
              currentStep === 1
                ? router.back()
                : setCurrentStep(currentStep - 1)
            }
            className="w-10 h-10 justify-center mb-6"
          >
            <IconSymbol name="chevron.left" size={24} color="#3B2F2F" />
          </TouchableOpacity>

          {/* Step Header */}
          {currentStep > 1 && (
            <View className="mb-8">
              <ThemedText
                className="text-[11px] font-[NunitoSans_600SemiBold] mb-2 tracking-widest uppercase"
                style={{ color: "#6B7280" }}
              >
                Step {currentStep} of 3
              </ThemedText>
            </View>
          )}

          {/* Current Step Content */}
          {renderStep()}

          {/* Footer */}
          {currentStep === 1 && (
            <View className="mt-auto pt-8 pb-4">
              <ThemedText
                className="text-center text-xs font-[NunitoSans_400Regular]"
                style={{ color: "#9CA3AF" }}
              >
                ThriftVerse • Sustainable Fashion Marketplace
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
