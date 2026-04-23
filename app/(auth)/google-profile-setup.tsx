import { InfoBox } from "@/components/atoms/InfoBox";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { RHFCheckbox, RHFInput } from "@/components/forms/ReactHookForm";
import ForwardIcon from "@/components/icons/ForwardIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkUsernameExists,
  createUserProfile,
  verifyProfileExists,
} from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { fetchUserProfile, setFormData } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Full name is required"),
  acceptedTerms: yup
    .boolean()
    .oneOf([true], "You must accept the Terms & Conditions to continue")
    .required(),
});

type FormData = yup.InferType<typeof schema>;

export default function GoogleProfileSetupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, signOut } = useAuth();

  const googleName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const googleAvatar = user?.user_metadata?.avatar_url || null;

  const [profileImage, setProfileImage] = useState<string | null>(googleAvatar);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: googleName,
      acceptedTerms: false,
    },
  });

  if (!user) return null;

  const handleBack = async () => {
    await signOut();
    router.replace("/(auth)/signin");
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Guard: if profile already exists (e.g. user navigated back), go to tabs
      const profileExists = await verifyProfileExists(user.id);
      if (profileExists) {
        await dispatch(fetchUserProfile(user.id));
        router.replace("/(tabs)/home");
        return;
      }

      // Derive a placeholder username from email — Step 4 will let user set the real one
      const emailPrefix =
        user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`;
      let placeholderUsername = emailPrefix
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_");

      // Make sure the placeholder is unique (add suffix if taken)
      const isTaken = await checkUsernameExists(placeholderUsername);
      if (isTaken) {
        placeholderUsername = `${placeholderUsername}_${user.id.slice(0, 4)}`;
      }

      // Create the profile with confirmed name and placeholder username
      const result = await createUserProfile({
        userId: user.id,
        name: data.name.trim(),
        store_username: placeholderUsername,
        bio: "",
        profile_image: profileImage,
        currency: "NPR",
        address: "",
      });

      if (!result.success) {
        console.error("❌ Failed to create profile:", result.error);
        setErrorMessage("Failed to create your profile. Please try again.");
        setLoading(false);
        return;
      }

      dispatch(setFormData({ name: data.name.trim(), profileImage }));

      // Google users skip OTP; mark step 2 done so resume routing lands on step 3
      await supabase
        .from("profiles")
        .update({ signup_step: 2 })
        .eq("id", user.id);

      router.replace("/(auth)/signup-step3");
    } catch (error) {
      console.error("💥 Error in google-profile-setup:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Sign Up"
      showScrollView={false}
      onBack={handleBack}
    >
      <Stepper title="Your Profile" currentStep={1} totalSteps={5} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4 pb-8">
            {/* Header */}
            <View className="mb-6">
              <Typography variation="h1" className="text-center py-2">
                Welcome to ThriftVerse
              </Typography>
              <Typography
                variation="body"
                className="text-slate-500 text-center"
              >
                Confirm your details to get started.
              </Typography>
            </View>

            {/* Profile Image */}
            <View className="mb-6">
              <ProfileImagePicker
                value={profileImage}
                onChange={setProfileImage}
              />
            </View>

            {/* Error */}
            {errorMessage && (
              <InfoBox type="error" message={errorMessage} className="mb-4" />
            )}

            {/* Fields */}
            <View className="gap-4">
              <RHFInput
                control={control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                autoCapitalize="words"
                editable={!loading}
              />

              {/* Email — disabled input, same look as all other fields */}
              <Input
                label="Email Address"
                value={user.email ?? ""}
                variant="disabled"
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
            </View>
          </View>
        </ScrollView>

        {/* Sticky bottom button */}
        <View className="px-6 py-6">
          <Button
            label="Next Step"
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            disabled={loading}
            fullWidth
            iconPosition="right"
            icon={<ForwardIcon width={20} height={20} />}
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
