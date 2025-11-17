import { SignupStep1 } from "@/components/organisms/SignupStep1";
import { SignupStep2 } from "@/components/organisms/SignupStep2";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { supabase } from "@/lib/supabase";
import { UserDetailsFormData } from "@/lib/validations/signup-step1";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserDetailsFormData>>({});
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleStep1Complete = async (data: UserDetailsFormData) => {
    setFormData(data);
    setCreatingAccount(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            username: data.username,
            address: data.address,
            profile_image: (data as any).profileImage || null,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        if (error.message?.includes("User already registered")) {
          Alert.alert(
            "Account Exists",
            "An account with this email already exists. Please sign in instead."
          );
          setCreatingAccount(false);
          return;
        }

        // Check if it's an email service error
        const isEmailError =
          error.message?.includes("Invalid API key") ||
          error.message?.includes("sending confirmation email") ||
          error.message?.includes("Error sending email") ||
          error.status === 429;

        if (isEmailError) {
          Alert.alert(
            "Email Configuration Required",
            'Email verification is required for signup.\n\n⚠️ Email service is not configured in Supabase.\n\nPlease enable email confirmation:\n1. Go to Supabase Dashboard\n2. Authentication → Providers → Email\n3. Enable "Confirm email"\n4. Configure email settings',
            [{ text: "OK", onPress: () => setCreatingAccount(false) }]
          );
          return;
        }

        Alert.alert(
          "Signup Failed",
          error.message || "Failed to create account. Please try again."
        );
        setCreatingAccount(false);
        return;
      }

      if (authData.user) {
        if (authData.session && authData.user.email_confirmed_at) {
          Alert.alert(
            "Email Verification Required",
            'For security, email verification must be enabled.\n\n⚠️ Email confirmation is currently DISABLED in Supabase.\n\nPlease enable it:\n1. Go to Supabase Dashboard\n2. Authentication → Providers → Email\n3. Enable "Confirm email"',
            [{ text: "OK", onPress: () => setCreatingAccount(false) }]
          );
          return;
        }

        setCurrentStep(2);
      }
    } catch (error) {
      console.error("💥 Unexpected signup error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setCreatingAccount(false);
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleStep2Complete = () => {
    setCurrentStep(3);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const renderCurrentStep = () => {
    if (creatingAccount) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#D4A373" />
          <ThemedText className="text-base text-[#6B705C] mt-4 font-[NunitoSans_400Regular]">
            Creating your account...
          </ThemedText>
        </View>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <SignupStep1 onNext={handleStep1Complete} initialData={formData} />
        );
      case 2:
        return (
          <SignupStep2
            email={formData.email || ""}
            name={formData.name || ""}
            username={formData.username || ""}
            address={formData.address || ""}
            profileImage={(formData as any).profileImage || null}
            onNext={handleStep2Complete}
            onBack={handleBackToStep1}
          />
        );
      case 3:
        return (
          <View className="flex-1 justify-center items-center px-4">
            <View className="w-24 h-24 bg-[#3B2F2F] rounded-3xl justify-center items-center mb-8">
              <ThemedText className="text-5xl" style={{ color: "#FFFFFF" }}>
                ✓
              </ThemedText>
            </View>
            <ThemedText
              className="text-[36px] font-[PlayfairDisplay_700Bold] mb-4 text-center leading-tight"
              style={{ color: "#3B2F2F" }}
            >
              Welcome to{"\n"}ThriftVerse!
            </ThemedText>
            <ThemedText
              className="text-[15px] text-center mb-12 font-[NunitoSans_400Regular] px-4 leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              Your account has been created successfully.{"\n"}Let&apos;s start
              your thrifting journey!
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="bg-[#3B2F2F] px-12 h-[58px] rounded-2xl justify-center items-center shadow-lg w-full"
            >
              <ThemedText
                className="text-base font-[NunitoSans_700Bold]"
                style={{ color: "#FFFFFF", letterSpacing: 0.5 }}
              >
                Get Started
              </ThemedText>
            </TouchableOpacity>
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
      <View className="flex-1 px-6 pt-12 pb-8">
        {currentStep <= 2 && (
          <TouchableOpacity
            onPress={() =>
              currentStep === 1 ? router.back() : setCurrentStep(1)
            }
            className="w-10 h-10 justify-center mb-6"
          >
            <IconSymbol name="chevron.left" size={24} color="#3B2F2F" />
          </TouchableOpacity>
        )}

        {currentStep === 2 && (
          <View className="mb-8">
            <ThemedText
              className="text-[11px] font-[NunitoSans_600SemiBold] mb-2 tracking-widest uppercase"
              style={{ color: "#6B7280" }}
            >
              Step {currentStep} of 3
            </ThemedText>
            <ThemedText
              className="text-[32px] font-[PlayfairDisplay_700Bold] leading-tight mb-2"
              style={{ color: "#3B2F2F" }}
            >
              Email Verification
            </ThemedText>
            <ThemedText
              className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              We&apos;ve sent a code to verify your email
            </ThemedText>
          </View>
        )}

        <View className="flex-1">{renderCurrentStep()}</View>

        {currentStep === 1 && (
          <View className="mt-6 pb-4">
            <View className="flex-row justify-center items-center">
              <ThemedText
                className="text-[14px] font-[NunitoSans_400Regular]"
                style={{ color: "#6B7280" }}
              >
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => router.back()}>
                <ThemedText
                  className="text-[14px] font-[NunitoSans_700Bold]"
                  style={{ color: "#3B2F2F" }}
                >
                  Sign In
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
