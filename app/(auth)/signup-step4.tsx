import { FormInput } from "@/components/atoms/FormInput";
import { Select, SelectOption } from "@/components/ui/Select/Select";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { InfoBox } from "@/components/atoms/InfoBox";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { districtsOfNepal } from "@/lib/constants/districts";
import {
  checkUsernameExists,
  createMissingProfile,
  updateUserProfile,
} from "@/lib/database-helpers";
import { uploadProfileImage } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  completeSignup,
  fetchUserProfile,
  setFormData,
  persistSignupState,
  setCurrentStep,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

const BIO_MAX_LENGTH = 500;

// Content config based on seller type
const CONTENT = {
  store: {
    stepTitle: "Store Details",
    heading: "Tell us about your store",
    subheading:
      "Let the community know who you are and what you sell.",
    bioLabel: "STORE BIO",
    bioPlaceholder:
      "Share your thrift story, style aesthetic, and shipping info...",
    bioHint:
      "Your bio is the first thing buyers see. Share your thrift story!",
    usernameLabel: "STORE NAME",
    usernamePlaceholder: "eco_warrior_99",
    buttonLabel: "Next Step",
  },
  closet: {
    stepTitle: "Creator Profile",
    heading: "Create Your Creator Profile",
    subheading: "Tell us about yourself to start selling.",
    bioLabel: "BIO",
    bioPlaceholder:
      "Tell your story, your aesthetic, and what you're selling...",
    bioHint: null,
    usernameLabel: "USERNAME",
    usernamePlaceholder: "yourstorename",
    buttonLabel: "Continue",
  },
};

export default function SignupStep4Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);
  const sellerType = signupState.formData.sellerType || "closet";
  const content = CONTENT[sellerType as "store" | "closet"] || CONTENT.closet;
  const isStore = sellerType === "store";

  // Form state
  const [username, setUsername] = useState(
    signupState.formData.username || "",
  );
  const [bio, setBio] = useState(signupState.formData.bio || "");
  const [instagramHandle, setInstagramHandle] = useState(
    signupState.formData.instagramHandle || "",
  );
  const [district, setDistrict] = useState(
    signupState.formData.district || "",
  );
  const [profileImage, setProfileImage] = useState<string | null>(
    signupState.formData.profileImage || null,
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // District options for Select
  const districtOptions: SelectOption[] = useMemo(
    () => districtsOfNepal.map((d) => ({ label: d, value: d })),
    [],
  );

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9._]+$/.test(username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, dots, and underscores";
    }

    if (!district) {
      newErrors.district = "Please select your district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrors({ general: "User not found. Please sign in again." });
        setLoading(false);
        return;
      }

      // Check username uniqueness
      const usernameExists = await checkUsernameExists(username.trim());
      if (usernameExists) {
        setErrors({ username: "This username is already taken" });
        setLoading(false);
        return;
      }

      // Ensure profile exists
      const profileResult = await createMissingProfile();
      if (!profileResult.success) {
        setErrors({
          general: "Failed to set up your profile. Please try again.",
        });
        setLoading(false);
        return;
      }

      // Upload profile image if provided
      let profileImagePath: string | null = null;
      if (profileImage) {
        const uploadResult = await uploadProfileImage(user.id, profileImage);
        if (uploadResult.success && uploadResult.url) {
          profileImagePath = uploadResult.url;
        }
      }

      // Update profile in Supabase
      const updateData: {
        userId: string;
        store_username: string;
        bio: string;
        address: string;
        profile_image?: string;
      } = {
        userId: user.id,
        store_username: username.trim().toLowerCase(),
        bio: bio.trim(),
        address: district,
      };

      if (profileImagePath) {
        updateData.profile_image = profileImagePath;
      }

      const result = await updateUserProfile(updateData);

      if (!result.success) {
        setErrors({
          general: "Failed to save your profile. Please try again.",
        });
        setLoading(false);
        return;
      }

      // Save to Redux
      dispatch(
        setFormData({
          username: username.trim(),
          bio: bio.trim(),
          district,
          instagramHandle: instagramHandle.trim(),
          profileImage: profileImagePath || profileImage,
        }),
      );

      // Refetch profile
      await dispatch(fetchUserProfile(user.id));

      // Complete signup
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error in signup-step4:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout showHeader headerTitle="Sign Up" showScrollView={false}>
      <Stepper title={content.stepTitle} currentStep={4} totalSteps={4} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            {/* Header */}
            <View className="mb-6">
              <Typography variation="h1" className="text-center py-2">
                {content.heading}
              </Typography>
              <Typography
                variation="body"
                className="text-slate-500 text-center"
              >
                {content.subheading}
              </Typography>
            </View>

            {/* Profile Image */}
            <ProfileImagePicker
              value={profileImage}
              onChange={setProfileImage}
            />

            {/* General Error */}
            {errors.general && (
              <InfoBox type="error" message={errors.general} />
            )}

            {/* Username / Store Name */}
            <FormInput
              label={content.usernameLabel}
              placeholder={content.usernamePlaceholder}
              value={username}
              onChangeText={(text) => {
                // Remove spaces and special chars except . and _
                const cleaned = text.replace(/[^a-zA-Z0-9._]/g, "");
                setUsername(cleaned);
                clearError("username");
              }}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Bio */}
            <FormTextarea
              label={content.bioLabel}
              placeholder={content.bioPlaceholder}
              value={bio}
              onChangeText={(text) => {
                setBio(text);
              }}
              maxLength={BIO_MAX_LENGTH}
            />

            {/* Bio Hint - only for store type */}
            {content.bioHint && (
              <View className="-mt-3 mb-6 p-4 bg-[#FEF3C7] rounded-2xl flex-row items-start">
                <Typography variation="body-sm" className="text-[#92400E]">
                  {content.bioHint}
                </Typography>
              </View>
            )}

            {/* Instagram Handle - only for closet type */}
            {!isStore && (
              <FormInput
                label="INSTAGRAM HANDLE"
                placeholder="instagram.com/username"
                value={instagramHandle}
                onChangeText={(text) => {
                  setInstagramHandle(text);
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}

            {/* District Picker */}
            <Select
              label="DISTRICT"
              placeholder={
                isStore
                  ? "Search districts..."
                  : "Select your district"
              }
              value={district}
              onChange={(value) => {
                setDistrict(value);
                clearError("district");
              }}
              options={districtOptions}
              errorMessage={errors.district}
              searchPlaceholder="Search districts..."
            />

            {isStore && (
              <Typography
                variation="caption"
                className="text-slate-400 -mt-3 mb-4"
              >
                Select the creative neighborhood where your items ship from.
              </Typography>
            )}
          </View>
        </ScrollView>

        {/* Continue Button - Sticky Bottom */}
        <View className="px-6 py-6 border-t border-slate-200">
          <Button
            label={content.buttonLabel}
            variant="primary"
            onPress={handleContinue}
            isLoading={loading}
            disabled={loading}
            fullWidth
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
