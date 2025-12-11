import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import {
  BodyBoldText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { LOGO_USAGE } from "@/constants/logos";
import { useAuth } from "@/contexts/AuthContext";
import {
  persistSignupState,
  setCurrentStep,
  setFormData,
} from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

interface SignInFormData {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        const errorMsg = error.message?.toLowerCase() || "";

        // Check if the error is "Email not confirmed"
        if (
          errorMsg.includes("email not confirmed") ||
          errorMsg.includes("email_not_confirmed")
        ) {
          // User exists but email is not verified
          // Save email to Redux and redirect to verification screen
          dispatch(
            setFormData({
              email: data.email,
              password: data.password,
              name: "",
              username: "",
              address: "",
              profileImage: null,
            })
          );
          dispatch(setCurrentStep(2));
          await dispatch(
            persistSignupState({
              currentStep: 2,
              formData: {
                email: data.email,
                password: data.password,
                name: "",
                username: "",
                address: "",
                profileImage: null,
              },
              isSignupInProgress: true,
            })
          );

          setLoading(false);
          router.replace("/(auth)/signup-step2");
          return;
        }

        // Check if user doesn't exist
        if (
          errorMsg.includes("invalid login credentials") ||
          errorMsg.includes("invalid_credentials") ||
          errorMsg.includes("user not found")
        ) {
          setErrorMessage(
            "Account not found. Please sign up to create an account."
          );
          setLoading(false);
          return;
        }

        // Generic error
        setErrorMessage(error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Success - navigate to home
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20">
          <View className="mb-12">
            <View className="mb-8 items-center">
              <Image
                source={LOGO_USAGE.splash}
                className="w-48 h-48 mb-4"
                resizeMode="contain"
              />
            </View>
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

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Email Address"
                  placeholder="user@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  required
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text.toLowerCase());
                    if (errorMessage) setErrorMessage("");
                  }}
                  error={errors.email?.message}
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  required
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    if (errorMessage) setErrorMessage("");
                  }}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Forgot Password Link */}
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="items-end mb-8">
                <BodySemiboldText>Forgot Password?</BodySemiboldText>
              </TouchableOpacity>
            </Link>

            {/* Sign In Button */}
            <FormButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />

            {/* Sign Up Link */}
            <View className="mt-8">
              <View className="flex-row justify-center items-center">
                <BodyRegularText style={{ color: "#6B7280" }}>
                  Don&apos;t have an account?{" "}
                </BodyRegularText>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <BodyBoldText>Sign Up</BodyBoldText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* Policy Links */}
          <View className="mt-auto pt-8 pb-2">
            <View className="flex-row justify-center items-center flex-wrap gap-2">
              <Link href="https://www.thriftverse.shop/privacy" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Privacy Policy
                  </CaptionText>
                </TouchableOpacity>
              </Link>
              <CaptionText style={{ color: "#9CA3AF" }}>•</CaptionText>
              <Link href="https://www.thriftverse.shop/terms" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Terms & Conditions
                  </CaptionText>
                </TouchableOpacity>
              </Link>
              <CaptionText style={{ color: "#9CA3AF" }}>•</CaptionText>
              <Link href="https://www.thriftverse.shop/cookies" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Cookie Policy
                  </CaptionText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Bottom Branding - Subtle */}
          <View className="pt-4 pb-4">
            <CaptionText className="text-center" style={{ color: "#9CA3AF" }}>
              ThriftVerse • Sustainable Fashion Marketplace
            </CaptionText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
