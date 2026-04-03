import { InfoBox } from "@/components/atoms/InfoBox";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import AtSignIcon from "@/components/icons/AtSignIcon";
import IIcon from "@/components/icons/IIcon";
import LocationIcon from "@/components/icons/locationIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button/Button";
import { SelectOption } from "@/components/ui/Select/Select";
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
  SignupStep4FormData,
  signupStep4Schema,
} from "@/lib/validations/signup-step4";
import {
  fetchUserProfile,
  persistSignupState,
  setCurrentStep,
  setFormData,
} from "@/store";
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

  // Store avatar state (separate from personal profile image from step 1)
  const [storeAvatar, setStoreAvatar] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form setup with React Hook Form
  const { control, handleSubmit, setError } = useForm<SignupStep4FormData>({
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

      // Check username uniqueness
      const usernameExists = await checkUsernameExists(data.username.trim());
      if (usernameExists) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
        setLoading(false);
        return;
      }

      // Ensure profile exists
      const profileResult = await createMissingProfile();
      if (!profileResult.success) {
        setGeneralError("Failed to set up your profile. Please try again.");
        setLoading(false);
        return;
      }

      // Upload profile image if provided
      let profileImagePath: string | null = null;
      if (storeAvatar) {
        const uploadResult = await uploadProfileImage(user.id, storeAvatar);
        if (uploadResult.success && uploadResult.url) {
          profileImagePath = uploadResult.url;
        }
      }

      // Update profile in Supabase
      const sellerData: Record<string, any> = {
        district: data.district,
        address: data.address.trim(),
      };

      if (data.storeName) {
        sellerData.store_name = data.storeName.trim();
      }

      if (data.instagramHandle) {
        sellerData.instagram_handle = data.instagramHandle.trim();
      }

      if (profileImagePath) {
        sellerData.store_image = profileImagePath;
      }

      const updateData: {
        userId: string;
        store_username: string;
        bio: string;
        address: string;
        profile_image?: string;
        seller_data?: Record<string, any>;
      } = {
        userId: user.id,
        store_username: data.username.trim().toLowerCase(),
        bio: data.bio.trim(),
        address: data.district,
        seller_data: sellerData,
      };

      const result = await updateUserProfile(updateData);

      if (!result.success) {
        setGeneralError("Failed to save your profile. Please try again.");
        setLoading(false);
        return;
      }

      // Save to Redux
      dispatch(
        setFormData({
          username: data.username.trim(),
          bio: data.bio.trim(),
          district: data.district,
          address: data.address.trim(),
          instagramHandle: data.instagramHandle?.trim() || "",
          storeName: data.storeName?.trim() || "",
          profileImage: profileImagePath || null,
        }),
      );

      // Refetch profile
      await dispatch(fetchUserProfile(user.id));

      // Move to next step (Step 5)
      dispatch(setCurrentStep(5));
      await dispatch(
        persistSignupState({
          currentStep: 5,
          isSignupInProgress: true,
        }),
      );

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

          {/* Store Avatar */}
          <View className="mb-6">
            <ProfileImagePicker
              value={storeAvatar}
              onChange={setStoreAvatar}
              label={isStore ? "Store Avatar" : "Profile Avatar"}
            />
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
              leftIcon={<AtSignIcon />}
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

          {/* Bio Hint - only for store type */}
          {content.bioHint && (
            <View className="mb-6 mt-3 p-4 bg-[#FEF3C7] rounded-2xl flex-row items-center gap-3">
              <View className="text-xl">
                <IIcon />
              </View>
              <Typography variation="body-sm" className="text-[#92400E] flex-1">
                {content.bioHint}
              </Typography>
            </View>
          )}

          {/* Instagram Handle - only for closet type */}
          {!isStore && (
            <View className="mb-4">
              <RHFInput
                control={control}
                name="instagramHandle"
                label="INSTAGRAM USERNAME"
                placeholder="@username"
                autoCapitalize="none"
                autoCorrect={false}
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
              leftIcon={<LocationIcon />}
              searchPlaceholder="Search districts..."
            />
          </View>

          {isStore && (
            <Typography
              variation="caption"
              className="text-slate-400 mt-2 mb-4"
            >
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
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
