import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { ThemedText } from "@/components/themed-text";
import { LOGO_USAGE } from "@/constants/logos";
import { checkEmailExists, checkUsernameExists } from "@/lib/database-helpers";
import {
  UserDetailsFormData,
  userDetailsSchema,
} from "@/lib/validations/signup-step1";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, View } from "react-native";

interface SignupStep1Props {
  onNext: (data: UserDetailsFormData) => void;
  initialData?: Partial<UserDetailsFormData>;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({
  onNext,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
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
      address: initialData?.address || "",
      password: initialData?.password || "",
      confirmPassword: initialData?.confirmPassword || "",
    },
  });

  const onSubmit = async (data: UserDetailsFormData) => {
    setLoading(true);

    try {
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

      // All validations passed, proceed to next step with profile image
      onNext({ ...data, profileImage } as any);
    } catch (error) {
      Alert.alert("Error", "Failed to validate. Please try again.");
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View>
        {/* Header */}
        <View className="mb-8 items-center">
          <Image
            source={LOGO_USAGE.splash}
            className="w-48 h-48 mb-4"
            resizeMode="contain"
          />
          <ThemedText
            className="text-[40px] font-[PlayfairDisplay_700Bold] leading-tight mb-3"
            style={{ color: "#3B2F2F" }}
          >
            Create Account
          </ThemedText>
          <ThemedText
            className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed"
            style={{ color: "#6B7280" }}
          >
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

          {/* Address */}
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Address"
                placeholder="Enter your address"
                autoCapitalize="words"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.address?.message}
                multiline
                numberOfLines={2}
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
                placeholder="Create a password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
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
