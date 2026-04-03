import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { RHFCheckbox, RHFInput } from "@/components/forms/ReactHookForm";
import EyeCloseIcon from "@/components/icons/EyeCloseIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import ForwardIcon from "@/components/icons/ForwardIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link/Link";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { supabase } from "@/lib/supabase";
import {
  UserDetailsFormData,
  userDetailsSchema,
} from "@/lib/validations/signup-step1";
import { persistSignupState, setCurrentStep, setFormData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { SignupFormData } from "@/store/signupSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";

// Use the full schema from validations
type SignupStep1FormData = UserDetailsFormData;

// Password strength checker
const getPasswordStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score === 0) return { score: 0, label: "", color: "" };
  if (score === 1) return { score: 1, label: "Weak", color: "#EF4444" };
  if (score === 2) return { score: 2, label: "Fair", color: "#F59E0B" };
  if (score === 3) return { score: 3, label: "Good", color: "#84CC16" };
  return { score: 4, label: "Strong", color: "#22C55E" };
};

export default function SignupStep1Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const handleBack = () => {
    // Go back to signin
    router.back();
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    signupState.formData.profileImage || null,
  );

  const { control, handleSubmit, setError, clearErrors, watch } =
    useForm<SignupStep1FormData>({
      resolver: yupResolver(userDetailsSchema as any),
      mode: "onBlur",
      defaultValues: {
        name: signupState.formData.name || "",
        email: signupState.formData.email || "",
        password: signupState.formData.password || "",
        confirmPassword: "",
        acceptedTerms: false,
      },
    });

  const password = watch("password");
  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (password) {
      clearErrors("password");
    }
  }, [clearErrors, password]);

  const onSubmit = async (data: SignupStep1FormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      // Check for existing email
      if (authData?.user && authData?.user?.identities?.length === 0) {
        setErrorMessage("This email is already registered. Please sign in.");
        return;
      }

      if (authError) {
        console.error("Auth error:", authError);
        const message = authError.message || "Failed to create account";

        if (message.toLowerCase().includes("password")) {
          setError("password", {
            type: "server",
            message,
          });
          setErrorMessage(null);
        } else {
          setErrorMessage(message);
        }
        return;
      }

      if (authData.user) {
        const formData: SignupFormData = {
          name: data.name,
          email: data.email,
          password: data.password,
          username: "",
          address: "",
          profileImage: profileImage,
          sellerType: "",
          bio: "",
          district: "",
          instagramHandle: "",
          storeName: "",
          referralCode: "",
        };

        dispatch(setFormData(formData));
        dispatch(setCurrentStep(2));
        await dispatch(
          persistSignupState({
            currentStep: 2,
            formData,
            isSignupInProgress: true,
          }),
        );

        router.push("/(auth)/signup-step2");
      } else {
        setErrorMessage(
          "We could not create your account right now. Please try again.",
        );
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Basic Info"
      headerAlignment="center"
      showScrollView={false}
      onBack={handleBack}
    >
      <Stepper title="User Details" currentStep={1} totalSteps={6} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-4 pb-8">
          {/* Profile Image */}
          <View className="mb-6">
            <ProfileImagePicker
              value={profileImage}
              onChange={setProfileImage}
            />
          </View>

          {/* Form Fields */}
          <View className="gap-4">
            {/* Full Name */}
            <RHFInput
              control={control}
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
            />

            {/* Email */}
            <RHFInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="example@thriftverse.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password */}
            <View>
              <RHFInput
                control={control}
                name="password"
                label="Password"
                placeholder="Create a strong password"
                secureTextEntry={!showPassword}
                rightIcon={
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    {showPassword ? (
                      <EyeIcon width={20} height={20} />
                    ) : (
                      <EyeCloseIcon width={20} height={20} />
                    )}
                  </Pressable>
                }
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Password Strength Indicator */}
              {watch("password") && (
                <View className="mt-2">
                  <Typography
                    variation="caption"
                    className="text-slate-600 mb-1"
                  >
                    Password strength:{" "}
                    <Typography
                      variation="caption"
                      className="font-bold"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </Typography>
                  </Typography>
                  <View className="flex-row gap-1 h-1">
                    {[0, 1, 2, 3].map((index) => (
                      <View
                        key={index}
                        className="flex-1 bg-slate-300 rounded-full"
                        style={{
                          backgroundColor:
                            index < passwordStrength.score
                              ? passwordStrength.color
                              : "#D1D5DB",
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <RHFInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1"
                >
                  {showConfirmPassword ? (
                    <EyeIcon width={20} height={20} />
                  ) : (
                    <EyeCloseIcon width={20} height={20} />
                  )}
                </Pressable>
              }
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Terms & Conditions */}
            <RHFCheckbox
              control={control}
              name="acceptedTerms"
              label={
                <View className="flex-row flex-wrap gap-1">
                  <Typography variation="body" className="text-slate-600">
                    I accept the
                  </Typography>
                  <Link
                    label="Terms & Conditions"
                    href="/policies/terms"
                    type="internal"
                    underline
                    variant="primary"
                    typographyVariation="body-sm"
                  />
                  <Typography variation="body" className="text-slate-600">
                    and
                  </Typography>
                  <Link
                    label="Privacy Policy"
                    href="/policies/privacy"
                    type="internal"
                    underline
                    variant="primary"
                    typographyVariation="body-sm"
                  />
                </View>
              }
            />

            {/* Error Message */}
            {errorMessage && (
              <View className="p-3 bg-red-50 rounded-lg border border-red-200">
                <Typography variation="body-sm" className="text-red-600">
                  {errorMessage}
                </Typography>
              </View>
            )}

            {/* Next Step Button */}
            <View className="mt-10">
              <Button
                label="Next Step"
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                isLoading={loading}
                fullWidth
                iconPosition="right"
                icon={<ForwardIcon width={20} height={20} />}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-center px-6 py-8 gap-1">
            <Typography
              variation="body"
              className="text-slate-600 dark:text-slate-400"
            >
              Already have an account?
            </Typography>
            <Link
              label="Log In"
              href="/(auth)/signin"
              variant="primary"
              underline={false}
              className="font-sans-bold text-brand-tan"
            />
          </View>
        </View>
      </ScrollView>
    </AuthScreenLayout>
  );
}
