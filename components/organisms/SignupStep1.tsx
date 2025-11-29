import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { checkEmailExists, checkUsernameExists } from "@/lib/database-helpers";
import {
  UserDetailsFormData,
  userDetailsSchema,
} from "@/lib/validations/signup-step1";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

interface SignupStep1Props {
  onNext: (data: UserDetailsFormData) => void;
  initialData?: Partial<UserDetailsFormData>;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({
  onNext,
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    watch,
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
      acceptedTerms: initialData?.acceptedTerms || false,
    },
  });

  const username = watch("username");

  // Check username availability with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset status if username is empty or too short
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    // Set checking status
    setUsernameStatus("checking");

    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      try {
        const exists = await checkUsernameExists(username);
        setUsernameStatus(exists ? "taken" : "available");
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus("idle");
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [username]);

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

        <View className="mt-4">
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
              />
            )}
          />

          {/* Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
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
                {/* Username availability indicator */}
                {value && value.length >= 3 && !errors.username && (
                  <View className="flex-row items-center -mt-4 mb-4 ml-1">
                    {usernameStatus === "checking" && (
                      <>
                        <ActivityIndicator size="small" color="#6B7280" />
                        <ThemedText
                          className="text-[12px] font-[NunitoSans_500Medium] ml-2"
                          style={{ color: "#6B7280" }}
                        >
                          Checking availability...
                        </ThemedText>
                      </>
                    )}
                    {usernameStatus === "available" && (
                      <>
                        <IconSymbol
                          name="checkmark.circle.fill"
                          size={16}
                          color="#22C55E"
                        />
                        <ThemedText
                          className="text-[12px] font-[NunitoSans_600SemiBold] ml-2"
                          style={{ color: "#22C55E" }}
                        >
                          Username is available
                        </ThemedText>
                      </>
                    )}
                    {usernameStatus === "taken" && (
                      <>
                        <IconSymbol
                          name="xmark.circle.fill"
                          size={16}
                          color="#EF4444"
                        />
                        <ThemedText
                          className="text-[12px] font-[NunitoSans_600SemiBold] ml-2"
                          style={{ color: "#EF4444" }}
                        >
                          Username is already taken
                        </ThemedText>
                      </>
                    )}
                  </View>
                )}
              </View>
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

          {/* Terms and Conditions */}
          <Controller
            control={control}
            name="acceptedTerms"
            render={({ field: { onChange, value } }) => (
              <View className="mt-4 mb-2">
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className="flex-row items-start"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
                      value
                        ? "bg-[#3B2F2F] border-[#3B2F2F]"
                        : "border-[#D1D5DB]"
                    }`}
                  >
                    {value && (
                      <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <View className="flex-1">
                    <ThemedText
                      className="text-[13px] font-[NunitoSans_400Regular] leading-5"
                      style={{ color: "#6B7280" }}
                    >
                      I agree to the{" "}
                      <ThemedText
                        className="text-[13px] font-[NunitoSans_700Bold]"
                        style={{ color: "#3B2F2F" }}
                        onPress={() =>
                          Linking.openURL("https://thriftverse.com/terms")
                        }
                      >
                        Terms & Conditions
                      </ThemedText>{" "}
                      and{" "}
                      <ThemedText
                        className="text-[13px] font-[NunitoSans_700Bold]"
                        style={{ color: "#3B2F2F" }}
                        onPress={() =>
                          Linking.openURL("https://thriftverse.com/privacy")
                        }
                      >
                        Privacy Policy
                      </ThemedText>
                    </ThemedText>
                  </View>
                </TouchableOpacity>
                {errors.acceptedTerms && (
                  <ThemedText
                    className="text-[13px] font-[NunitoSans_500Medium] mt-2 ml-8"
                    style={{ color: "#EF4444" }}
                  >
                    {errors.acceptedTerms.message}
                  </ThemedText>
                )}
              </View>
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
    </ScrollView>
  );
};
