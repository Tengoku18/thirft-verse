import { AuthHeader } from "@/components/navigation/AuthHeader";
import { SignupStep1 } from "@/components/organisms/SignupStep1";
import { SignupStep2 } from "@/components/organisms/SignupStep2";
import {
  BodyBoldText,
  BodyRegularText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
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
          <BodyRegularText style={{ color: "#6B705C" }} className="mt-4">
            Creating your account...
          </BodyRegularText>
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
              <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 48 }}>
                ✓
              </HeadingBoldText>
            </View>
            <HeadingBoldText
              className="mb-4 text-center leading-tight"
              style={{ fontSize: 36 }}
            >
              Welcome to{"\n"}ThriftVerse!
            </HeadingBoldText>
            <BodyRegularText
              className="text-center mb-12 px-4 leading-relaxed"
              style={{ color: "#6B7280", fontSize: 15 }}
            >
              Your account has been created successfully.{"\n"}Let&apos;s start
              your thrifting journey!
            </BodyRegularText>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="bg-[#3B2F2F] px-12 h-[58px] rounded-2xl justify-center items-center shadow-lg w-full"
            >
              <BodyBoldText style={{ color: "#FFFFFF", letterSpacing: 0.5 }}>
                Get Started
              </BodyBoldText>
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
          <AuthHeader
            title={currentStep === 1 ? "Create Account" : "Verification"}
            onBack={() =>
              currentStep === 1 ? router.back() : setCurrentStep(1)
            }
          />
        )}

        {currentStep === 2 && (
          <View className="mb-8">
            <CaptionText
              className="mb-2 tracking-widest uppercase"
              style={{ color: "#6B7280", fontWeight: "600", fontSize: 11 }}
            >
              Step {currentStep} of 3
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
              We&apos;ve sent a code to verify your email
            </BodyRegularText>
          </View>
        )}

        <View className="flex-1">{renderCurrentStep()}</View>
      </View>
    </KeyboardAvoidingView>
  );
}
