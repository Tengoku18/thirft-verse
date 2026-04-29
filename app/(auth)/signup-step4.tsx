import { InfoBox } from "@/components/atoms/InfoBox";
import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import AtSignIcon from "@/components/icons/AtSignIcon";
import ForwardIcon from "@/components/icons/ForwardIcon";
import LocationIcon from "@/components/icons/locationIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button/Button";
import { SelectOption } from "@/components/ui/Select/Select";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { INPUT_COLORS } from "@/constants/theme";
import { useSignupFormRestore } from "@/hooks/useSignupFormRestore";
import { districtsOfNepal } from "@/lib/constants/districts";
import {
  checkUsernameExists,
  createMissingProfile,
  updateUserProfile,
} from "@/lib/database-helpers";

import { supabase } from "@/lib/supabase";
import {
  SignupStep4FormData,
  signupStep4Schema,
} from "@/lib/validations/signup-step4";
import { fetchUserProfile, setFormData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

const BIO_MAX_LENGTH = 500;

// Content config based on seller type
const CONTENT = {
  store: {
    stepTitle: "Store Details",
    heading: "Tell us about your store",
    subheading: "Let the community know who you are and what you sell.",
    bioLabel: "STORE BIO",
    bioPlaceholder:
      "Share your thrift story, style aesthetic, and shipping info...",
    bioHint: "Your bio is the first thing buyers see. Share your thrift story!",
    usernameLabel: "STORE USERNAME",
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

  const handleBack = () => {
    // Decrement step and navigate to previous step
    router.push("/(auth)/signup-step3");
  };
  const sellerType = signupState.formData.sellerType || "closet";
  const content = CONTENT[sellerType as "store" | "closet"] || CONTENT.closet;
  const isStore = sellerType === "store";

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form setup with React Hook Form
  const { control, handleSubmit, setError, setValue } =
    useForm<SignupStep4FormData>({
      resolver: yupResolver(signupStep4Schema as any),
      mode: "onBlur",
      defaultValues: {
        username: signupState.formData.username || "",
        bio: signupState.formData.bio || "",
        district: signupState.formData.district || "",
        instagramHandle: signupState.formData.instagramHandle || "",
        storeName: signupState.formData.storeName || "",
        address: signupState.formData.address || "",
      },
    });

  // Restore form data from Redux when navigating back
  useSignupFormRestore(setValue, signupState.formData, "Step 4");

  // District options for Select
  const districtOptions: SelectOption[] = useMemo(
    () => districtsOfNepal.map((d) => ({ label: d, value: d })),
    [],
  );

  const onSubmit = async (data: SignupStep4FormData) => {
    setLoading(true);
    setGeneralError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGeneralError("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      // Check username uniqueness ONLY if username was changed
      const newUsername = data.username.trim().toLowerCase();
      const oldUsername = signupState.formData.username?.toLowerCase();

      if (newUsername !== oldUsername) {
        const usernameExists = await checkUsernameExists(newUsername);
        if (usernameExists) {
          setError("username", {
            type: "manual",
            message: "This username is already taken",
          });
          setLoading(false);
          return;
        }
      }

      // Ensure profile exists
      const profileResult = await createMissingProfile();
      if (!profileResult.success) {
        setGeneralError("Failed to set up your profile. Please try again.");
        setLoading(false);
        return;
      }

      // Update profile in Supabase - only changed fields
      const updateData: Record<string, any> = {
        userId: user.id,
      };

      // Only include username if it changed (already checked above)
      if (newUsername !== oldUsername) {
        updateData.store_username = newUsername;
      }

      const newBio = data.bio.trim();
      const oldBio = signupState.formData.bio;
      if (newBio !== oldBio) {
        updateData.bio = newBio;
      }

      // Address field - direct profile table field (NOT in seller_data)
      const newAddress = data.address.trim();
      const oldAddress = signupState.formData.address;
      if (newAddress !== oldAddress) {
        updateData.address = newAddress;
      }

      // Build seller_data with changed fields only
      const sellerData: Record<string, any> = {};
      let hasSellerDataChanges = false;

      // District field
      if (data.district !== signupState.formData.district) {
        sellerData.district = data.district;
        hasSellerDataChanges = true;
      }

      // Store Name field
      const newStoreName = data.storeName?.trim() || "";
      const oldStoreName = signupState.formData.storeName || "";
      if (newStoreName !== oldStoreName) {
        sellerData.store_name = newStoreName;
        hasSellerDataChanges = true;
      }

      // Instagram Handle field
      const newInstagram = data.instagramHandle?.trim() || "";
      const oldInstagram = signupState.formData.instagramHandle || "";
      if (newInstagram !== oldInstagram) {
        sellerData.instagram_handle = newInstagram;
        hasSellerDataChanges = true;
      }

      if (hasSellerDataChanges) {
        updateData.seller_data = sellerData;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 1) {
        // More than just userId
        const result = await updateUserProfile(updateData as any);

        if (!result.success) {
          setGeneralError("Failed to save your profile. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Advance signup progress in DB
      await supabase
        .from("profiles")
        .update({ signup_step: 4 })
        .eq("id", user.id);

      // Save to Redux
      dispatch(
        setFormData({
          username: data.username.trim(),
          bio: data.bio.trim(),
          district: data.district,
          address: data.address.trim(),
          instagramHandle: data.instagramHandle?.trim() || "",
          storeName: data.storeName?.trim() || "",
        }),
      );

      await dispatch(fetchUserProfile(user.id));

      router.push("/(auth)/signup-step5");
    } catch (error) {
      console.error("Error in signup-step4:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Store Details"
      onBack={handleBack}
    >
      <Stepper title={content.stepTitle} currentStep={4} totalSteps={6} />

      <View className="flex-1">
        <View className="px-6">
          {/* Header */}
          <View className="mb-6">
            <Typography variation="h1" className="text-center py-2">
              {content.heading}
            </Typography>
            <Typography variation="body" className="text-slate-500 text-center">
              {content.subheading}
            </Typography>
          </View>

          {/* General Error */}
          {generalError && <InfoBox type="error" message={generalError} />}

          {/* Store Name - only for store type */}
          {isStore && (
            <View className="mb-4">
              <RHFInput
                control={control}
                name="storeName"
                label="STORE NAME"
                placeholder="e.g. The Vintage Archive, Thrifted Treasures"
              />
            </View>
          )}

          {/* Username / Store Name */}
          <View className="mb-4">
            <RHFInput
              control={control}
              name="username"
              label={content.usernameLabel}
              placeholder={content.usernamePlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<AtSignIcon color={INPUT_COLORS.icon} />}
              // rightIcon={<LockIcon />}
            />
          </View>

          {/* Bio */}
          <View className="mb-4">
            <RHFTextarea
              control={control}
              name="bio"
              label={content.bioLabel}
              placeholder={content.bioPlaceholder}
              maxLength={BIO_MAX_LENGTH}
              numberOfLines={4}
              className="min-h-[100px] mb-2"
            />
          </View>

          {content.bioHint && (
            <InfoBox
              type="warning"
              message={content.bioHint}
              className="mb-4"
            />
          )}

          {/* Instagram Handle - only for closet type */}
          {!isStore && (
            <View className="mb-4">
              <RHFInput
                control={control}
                name="instagramHandle"
                label="INSTAGRAM USERNAME"
                placeholder="username"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<AtSignIcon color={INPUT_COLORS.icon} />}
              />
            </View>
          )}

          {/* District Picker */}
          <View className="mb-4">
            <RHFSelect
              control={control}
              name="district"
              label="DISTRICT"
              placeholder={
                isStore ? "Search districts..." : "Select your district"
              }
              options={districtOptions}
              searchable
              leftIcon={<LocationIcon color={INPUT_COLORS.icon} />}
              searchPlaceholder="Search districts..."
            />
          </View>

          {isStore && (
            <Typography variation="caption" className="text-slate-400 mb-4">
              Select the creative neighborhood where your items ship from.
            </Typography>
          )}

          {/* Address */}
          <RHFInput
            control={control}
            name="address"
            label="ADDRESS"
            placeholder="E.g. Tilottama-3, Drivertole"
            autoCapitalize="words"
          />
        </View>
        <View className="px-6 py-10">
          <Button
            label={content.buttonLabel}
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            disabled={loading}
            fullWidth
            icon={<ForwardIcon width={20} height={20} color={"#FFFFFF"} />}
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
