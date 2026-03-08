import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { checkEmailExists } from "@/lib/database-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

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

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const passwordSchema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { resetPasswordForEmail, verifyOtp, updatePassword } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
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

  // Step 3 Form (Password)
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
      const emailCheck = await checkEmailExists(data.email);

      if (!emailCheck.exists) {
        toast.error("No account found with this email. Redirecting to sign up...");
        setLoading(false);
        setTimeout(() => {
          router.replace("/(auth)/signup");
        }, 1500);
        return;
      }

      const { error } = await resetPasswordForEmail(data.email);

      if (error) {
        const isEmailError =
          error.message?.includes("Invalid API key") ||
          error.message?.includes("sending email") ||
          error.message?.includes("Error sending email");

        if (isEmailError) {
          toast.error("Email service is not configured. Please try again later.");
          setLoading(false);
          return;
        }

        toast.error(error.message || "Failed to send reset code. Please try again.");
        setLoading(false);
        return;
      }

      setCurrentStep(2);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
    setOtpError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP only
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const { error } = await verifyOtp(email, otpCode);

      if (error) {
        setOtpError(
          error.message || "Invalid verification code. Please try again."
        );
        setLoading(false);
        return;
      }

      setCurrentStep(3);
    } catch (error) {
      console.error("Unexpected OTP error:", error);
      setOtpError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (data: PasswordFormData) => {
    setLoading(true);

    try {
      const { error } = await updatePassword(data.password);

      if (error) {
        toast.error(error.message || "Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Password reset successful!");
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      const { error } = await resetPasswordForEmail(email);

      if (error) {
        toast.error(error.message || "Failed to resend code. Please try again.");
        setResendLoading(false);
        return;
      }

      toast.success("A new verification code has been sent to your email.");

      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Unexpected resend error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
    } else {
      // Step 3 — go back to OTP step
      setCurrentStep(2);
    }
  };

  const getHeaderTitle = () => {
    switch (currentStep) {
      case 1:
        return "Forgot Password";
      case 2:
        return "Verify Code";
      case 3:
        return "New Password";
      default:
        return "Forgot Password";
    }
  };

  const renderStep1 = () => (
    <View className="flex-1">
      <BodyRegularText
        className="leading-relaxed mb-8"
        style={{ color: "#6B7280", fontSize: 15 }}
      >
        Enter your email address and we&apos;ll send you a verification code to
        reset your password.
      </BodyRegularText>

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

      <View className="mt-8">
        <View className="flex-row justify-center items-center">
          <BodyRegularText style={{ color: "#6B7280" }}>
            Remember your password?{" "}
          </BodyRegularText>
          <TouchableOpacity onPress={() => router.back()}>
            <BodySemiboldText>Sign In</BodySemiboldText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <BodyRegularText
        className="leading-6 mb-8"
        style={{ color: "#6B7280", fontSize: 15 }}
      >
        We&apos;ve sent a 6-digit verification code to{" "}
        <BodySemiboldText style={{ fontSize: 15 }}>{email}</BodySemiboldText>
      </BodyRegularText>

      <View className="flex-row justify-between mb-4">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            className="w-[52px] h-[58px] border-[2px] border-transparent bg-[#FAFAFA] rounded-2xl text-center text-[22px] font-[NunitoSans_700Bold] text-[#3B2F2F]"
            style={{
              borderColor: otpError
                ? "#EF4444"
                : digit
                  ? "#3B2F2F"
                  : "transparent",
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

      {otpError ? (
        <BodyRegularText
          className="text-center mb-4"
          style={{ color: "#EF4444", fontSize: 13 }}
        >
          {otpError}
        </BodyRegularText>
      ) : null}

      <View className="flex-row justify-center items-center mt-2 mb-8">
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

      <FormButton
        title="Verify Code"
        onPress={handleVerifyOtp}
        loading={loading}
        variant="primary"
      />
    </View>
  );

  const renderStep3 = () => (
    <View className="flex-1">
      <BodyRegularText
        className="leading-relaxed mb-8"
        style={{ color: "#6B7280", fontSize: 15 }}
      >
        Create a new password for your account.
      </BodyRegularText>

      <Controller
        control={passwordControl}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="New Password"
            placeholder="Enter new password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
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
            autoCapitalize="none"
            autoCorrect={false}
            required
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={passwordErrors.confirmPassword?.message}
          />
        )}
      />

      <View className="mt-2 mb-6 p-4 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
        <BodySemiboldText className="mb-2" style={{ fontSize: 13 }}>
          Password Requirements:
        </BodySemiboldText>
        <BodyRegularText
          className="leading-5"
          style={{ color: "#6B7280", fontSize: 13 }}
        >
          • At least 6 characters long
        </BodyRegularText>
      </View>

      <FormButton
        title="Reset Password"
        onPress={handlePasswordSubmit(handleSetNewPassword)}
        loading={loading}
        variant="primary"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader title={getHeaderTitle()} onBack={handleBack} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <View className="mt-auto pt-8 pb-4">
            <CaptionText className="text-center" style={{ color: "#9CA3AF" }}>
              ThriftVerse • Sustainable Fashion Marketplace
            </CaptionText>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
