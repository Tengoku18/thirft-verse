import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyBoldText,
  BodyRegularText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { checkUsernameExists } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import {
  UserDetailsFormData,
  userDetailsSchema,
} from "@/lib/validations/signup-step1";
import {
  persistSignupState,
  setCurrentStep,
  setFormData,
  startSignup,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

export default function SignupStep1Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    signupState.formData.profileImage,
  );
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      name: signupState.formData.name || "",
      email: signupState.formData.email || "",
      username: signupState.formData.username || "",
      address: signupState.formData.address || "",
      password: signupState.formData.password || "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });

  const username = watch("username");

  useEffect(() => {
    dispatch(startSignup());
  }, [dispatch]);

  // Check username availability with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    debounceTimer.current = setTimeout(async () => {
      try {
        const exists = await checkUsernameExists(username);
        setUsernameStatus(exists ? "taken" : "available");
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [username]);

  const onSubmit = async (data: UserDetailsFormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
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

      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            username: data.username,
            address: data.address,
            profile_image: profileImage || null,
          },
          emailRedirectTo: undefined,
        },
      });

      // Check for existing email
      if (authData?.user && authData?.user?.identities?.length === 0) {
        // Email already exists!
        setErrorMessage("This email is already registered. Please sign in.");
        setLoading(false);
        return;
      }

      if (authError) {
        console.error("Auth error:", authError);
        setErrorMessage(authError.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Profile is automatically created by database trigger (on_auth_user_created)
        // using the metadata passed in signUp options above

        // Save form data to Redux and persist
        const formData = {
          name: data.name,
          email: data.email,
          username: data.username,
          address: data.address,
          password: data.password,
          profileImage: profileImage,
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

        // Navigate to step 2
        router.push("/(auth)/signup-step2");
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader title="Create Account" onBack={() => router.back()} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                    required
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Email Address"
                    placeholder="john@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    required
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
                    required
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.address?.message}
                  />
                )}
              />

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
                      required
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text) =>
                        onChange(text.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                      }
                      error={errors.username?.message}
                    />
                    {value && value.length >= 3 && !errors.username && (
                      <View className="flex-row items-center -mt-4 mb-4 ml-1">
                        {usernameStatus === "checking" && (
                          <>
                            <ActivityIndicator size="small" color="#6B7280" />
                            <CaptionText
                              className="ml-2"
                              style={{ color: "#6B7280" }}
                            >
                              Checking availability...
                            </CaptionText>
                          </>
                        )}
                        {usernameStatus === "available" && (
                          <>
                            <IconSymbol
                              name="checkmark.circle.fill"
                              size={16}
                              color="#22C55E"
                            />
                            <CaptionText
                              className="ml-2"
                              style={{ color: "#22C55E" }}
                            >
                              Username is available
                            </CaptionText>
                          </>
                        )}
                        {usernameStatus === "taken" && (
                          <>
                            <IconSymbol
                              name="xmark.circle.fill"
                              size={16}
                              color="#EF4444"
                            />
                            <CaptionText
                              className="ml-2"
                              style={{ color: "#EF4444" }}
                            >
                              Username is already taken
                            </CaptionText>
                          </>
                        )}
                      </View>
                    )}
                  </View>
                )}
              />

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
                    required
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.password?.message}
                  />
                )}
              />

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
                    required
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

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
                          <IconSymbol
                            name="checkmark"
                            size={12}
                            color="#FFFFFF"
                          />
                        )}
                      </View>
                      <View className="flex-1">
                        <BodyRegularText
                          className="leading-5"
                          style={{ color: "#6B7280", fontSize: 13 }}
                        >
                          I agree to the{" "}
                          <BodyBoldText
                            style={{ fontSize: 13 }}
                            onPress={() =>
                              Linking.openURL(
                                "https://www.thriftverse.shop/terms",
                              )
                            }
                          >
                            Terms & Conditions
                          </BodyBoldText>{" "}
                          and{" "}
                          <BodyBoldText
                            style={{ fontSize: 13 }}
                            onPress={() =>
                              Linking.openURL(
                                "https://www.thriftverse.shop/privacy",
                              )
                            }
                          >
                            Privacy Policy
                          </BodyBoldText>
                        </BodyRegularText>
                      </View>
                    </TouchableOpacity>
                    {errors.acceptedTerms && (
                      <CaptionText
                        className="mt-2 ml-8"
                        style={{ color: "#EF4444", fontSize: 13 }}
                      >
                        {errors.acceptedTerms.message}
                      </CaptionText>
                    )}
                  </View>
                )}
              />

              {/* Error message */}
              {errorMessage && (
                <View className="my-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <BodyRegularText style={{ color: "#EF4444", fontSize: 14 }}>
                    {errorMessage}
                  </BodyRegularText>
                </View>
              )}

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
              <BodyRegularText style={{ color: "#6B7280" }}>
                Already have an account?{" "}
              </BodyRegularText>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/signin")}
              >
                <BodyBoldText>Sign In</BodyBoldText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
