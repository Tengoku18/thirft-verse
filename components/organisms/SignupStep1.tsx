import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { ThemedText } from "@/components/themed-text";
import { checkEmailExists, checkUsernameExists } from "@/lib/database-helpers";
import {
  UserDetailsFormData,
  userDetailsSchema,
} from "@/lib/validations/signup-step1";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";

interface SignupStep1Props {
  onNext: (data: UserDetailsFormData) => void;
  initialData?: Partial<UserDetailsFormData>;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({
  onNext,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserDetailsFormData>({
    resolver: yupResolver(userDetailsSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      password: initialData?.password || "",
      confirmPassword: initialData?.confirmPassword || "",
    },
  });

  const onSubmit = async (data: UserDetailsFormData) => {
    setLoading(true);

    try {
      console.log("🔍 Checking email and username uniqueness...");

      // Check email uniqueness
      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
        setLoading(false);
        return;
      }

      // Check username uniqueness
      const usernameExists = await checkUsernameExists(data.username);
      if (usernameExists) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
        setLoading(false);
        return;
      }

      console.log("✅ Email and username are unique");

      // All validations passed, proceed to next step with profile image
      onNext({ ...data, profileImage } as any);
    } catch (error) {
      Alert.alert("Error", "Failed to validate. Please try again.");
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Password requirement checks
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View>
        {/* Header */}
        <View className="mb-8">
          <View className="w-16 h-16 bg-[#3B2F2F] rounded-2xl justify-center items-center mb-6">
            <ThemedText className="text-[28px] font-[PlayfairDisplay_700Bold]" style={{ color: '#FFFFFF' }}>
              T
            </ThemedText>
          </View>
          <ThemedText className="text-[40px] font-[PlayfairDisplay_700Bold] leading-tight mb-3" style={{ color: '#3B2F2F' }}>
            Create{'\n'}Account
          </ThemedText>
          <ThemedText className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed" style={{ color: '#6B7280' }}>
            Join ThriftVerse and start your sustainable fashion journey
          </ThemedText>
        </View>

        {/* Profile Image Picker */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value } }) => (
            <ProfileImagePicker
              value={profileImage}
              onChange={setProfileImage}
              name={value || "User"}
            />
          )}
        />

        {/* Form - No Card, Clean */}
        <View className="mt-4">
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
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
                error={errors.email?.message}
              />
            )}
          />

          {/* Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Username"
                placeholder="Choose a unique username"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={(text) =>
                  onChange(text.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                error={errors.username?.message}
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
                placeholder="Create a strong password"
                // isPassword
                value={value}
                onBlur={() => {
                  setShowRequirements(false);
                  onBlur();
                }}
                onFocus={() => setShowRequirements(true)}
                onChangeText={(text) => {
                  setPasswordValue(text);
                  onChange(text);
                }}
                error={errors.password?.message}
              />
            )}
          />

          {/* Password Requirements - Show when typing */}
          {showRequirements && passwordValue.length > 0 && (
            <View className="mb-6 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
              <ThemedText className="text-[13px] font-semibold mb-3 font-[NunitoSans_600SemiBold] tracking-wide uppercase" style={{ color: '#3B2F2F' }}>
                Password Requirements
              </ThemedText>
              <View className="space-y-2">
                <ThemedText
                  className="text-[14px]"
                  style={{
                    color: hasMinLength ? '#3B2F2F' : '#9CA3AF',
                    fontFamily: hasMinLength ? 'NunitoSans_600SemiBold' : 'NunitoSans_400Regular',
                  }}
                >
                  {hasMinLength ? "✓" : "•"} At least 8 characters
                </ThemedText>
                <ThemedText
                  className="text-[14px]"
                  style={{
                    color: hasUppercase ? '#3B2F2F' : '#9CA3AF',
                    fontFamily: hasUppercase ? 'NunitoSans_600SemiBold' : 'NunitoSans_400Regular',
                  }}
                >
                  {hasUppercase ? "✓" : "•"} One uppercase letter
                </ThemedText>
                <ThemedText
                  className="text-[14px]"
                  style={{
                    color: hasLowercase ? '#3B2F2F' : '#9CA3AF',
                    fontFamily: hasLowercase ? 'NunitoSans_600SemiBold' : 'NunitoSans_400Regular',
                  }}
                >
                  {hasLowercase ? "✓" : "•"} One lowercase letter
                </ThemedText>
                <ThemedText
                  className="text-[14px]"
                  style={{
                    color: hasNumber ? '#3B2F2F' : '#9CA3AF',
                    fontFamily: hasNumber ? 'NunitoSans_600SemiBold' : 'NunitoSans_400Regular',
                  }}
                >
                  {hasNumber ? "✓" : "•"} One number
                </ThemedText>
              </View>
            </View>
          )}

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                // isPassword
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Submit Button */}
          <FormButton
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            variant="primary"
            className="mt-2"
          />
        </View>
      </View>
    </ScrollView>
  );
};
