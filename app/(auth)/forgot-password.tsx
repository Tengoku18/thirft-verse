import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { checkEmailExists } from "@/lib/database-helpers";
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

// Step 2: Reset Password (combined with OTP verification)
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

  // Step 2 Form (Password)
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
      // First check if email exists in the database
      const emailCheck = await checkEmailExists(data.email);

      if (!emailCheck.exists) {
        Alert.alert(
          "Email Not Found",
          "No account found with this email address. Please check and try again, or create a new account."
        );
        setLoading(false);
        return;
      }

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

  // Combined step 2: Enter OTP and new password together
  const handleResetPassword = async (data: PasswordFormData) => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit code");
      return;
    }

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
          error.message ||
            "Failed to reset password. Please check your code and try again."
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-1">
            <View className="mb-12">
              <View className="w-16 h-16 bg-[#3B2F2F] rounded-2xl justify-center items-center mb-6">
                <IconSymbol name="lock.fill" size={28} color="#FFFFFF" />
              </View>
              <HeadingBoldText
                className="leading-tight mb-3"
                style={{ fontSize: 40 }}
              >
                Forgot{"\n"}Password?
              </HeadingBoldText>
              <BodyRegularText
                className="leading-relaxed"
                style={{ color: "#6B7280", fontSize: 15 }}
              >
                Enter your email address and we&apos;ll send you a verification
                code to reset your password.
              </BodyRegularText>
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
                    required
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
                  <BodySemiboldText className="text-center">
                    Back to Sign In
                  </BodySemiboldText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex-1">
            <View className="mb-8">
              <BodyRegularText
                className="leading-6 mb-2"
                style={{ color: "#6B7280", fontSize: 15 }}
              >
                We&apos;ve sent a 6-digit verification code to {email}
              </BodyRegularText>
            </View>

            <View className="mb-6">
              <BodySemiboldText
                className="mb-4 tracking-wide uppercase"
                style={{ fontSize: 13 }}
              >
                Enter Verification Code
              </BodySemiboldText>

              <View className="flex-row justify-between mb-4">
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

            <View className="mb-6">
              <BodySemiboldText
                className="mb-4 tracking-wide uppercase"
                style={{ fontSize: 13 }}
              >
                Set New Password
              </BodySemiboldText>

              <Controller
                control={passwordControl}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="New Password"
                    placeholder="Enter new password"
                    secureTextEntry
                    required
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
                    secureTextEntry
                    required
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={passwordErrors.confirmPassword?.message}
                  />
                )}
              />
            </View>

            <View className="mb-6 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
              <BodySemiboldText className="mb-2" style={{ fontSize: 13 }}>
                Password Requirements:
              </BodySemiboldText>
              <BodyRegularText
                className="leading-5"
                style={{ color: "#6B7280", fontSize: 13 }}
              >
                • At least 8 characters long{"\n"}• Contains uppercase and
                lowercase letters{"\n"}• Contains at least one number
              </BodyRegularText>
            </View>

            <View className="mt-auto">
              <FormButton
                title="Reset Password"
                onPress={handlePasswordSubmit(handleResetPassword)}
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
              <CaptionText
                className="mb-2 tracking-widest uppercase"
                style={{ color: "#6B7280", fontWeight: "600", fontSize: 11 }}
              >
                Step {currentStep} of 2
              </CaptionText>
            </View>
          )}

          {/* Current Step Content */}
          {renderStep()}

          {/* Footer */}
          {currentStep === 1 && (
            <View className="mt-auto pt-8 pb-4">
              <CaptionText className="text-center" style={{ color: "#9CA3AF" }}>
                ThriftVerse • Sustainable Fashion Marketplace
              </CaptionText>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
