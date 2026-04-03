import { InfoBox } from "@/components/atoms/InfoBox";
import { UploadBox } from "@/components/atoms/UploadBox";
import { RHFInput } from "@/components/forms/ReactHookForm";
import { QRCodeIcon, RightArrowIcon } from "@/components/icons";
import IIcon from "@/components/icons/IIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  completeSignup,
  persistSignupState,
  setCurrentStep,
  setPaymentData,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";
import * as yup from "yup";

// Validation schema for step 5
const step5Schema = yup.object({
  paymentUsername: yup
    .string()
    .trim()
    .min(3, "eSewa ID must be at least 3 characters")
    .max(100, "eSewa ID must be less than 100 characters")
    .required("eSewa ID/Username is required"),
});

type Step5FormData = yup.InferType<typeof step5Schema>;

export default function SignupStep5Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const handleBack = () => {
    // Decrement step and navigate to previous step
    dispatch(setCurrentStep(4));
    dispatch(persistSignupState({ currentStep: 4, isSignupInProgress: true }));
    router.push("/(auth)/signup-step4");
  };

  // QR code image state
  const [qrImage, setQrImage] = useState<string | null>(
    signupState.paymentData.paymentQRImage || null,
  );

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form setup with React Hook Form
  const { control, handleSubmit } = useForm<Step5FormData>({
    resolver: yupResolver(step5Schema as any),
    mode: "onBlur",
    defaultValues: {
      paymentUsername: signupState.paymentData.paymentUsername || "",
    },
  });

  const onSubmit = async (data: Step5FormData) => {
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

      // Upload QR image if provided
      let qrImagePath: string | null = null;
      if (qrImage) {
        const timestamp = Date.now();
        const fileName = `${user.id}-esewa-qr-${timestamp}.jpg`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("profile-images")
          .upload(fileName, {
            uri: qrImage,
            type: "image/jpeg",
            name: fileName,
          } as any);

        if (!uploadError && uploadData) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("profile-images").getPublicUrl(fileName);
          qrImagePath = publicUrl;
        }
      }

      // Update profile with payment data
      const { error } = await supabase
        .from("profiles")
        .update({
          payment_username: data.paymentUsername.trim(),
          payment_qr_image: qrImagePath,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save payment data:", error);
        setGeneralError(
          "Failed to save payment information. Please try again.",
        );
        setLoading(false);
        return;
      }

      // Save to Redux
      dispatch(
        setPaymentData({
          paymentUsername: data.paymentUsername.trim(),
          paymentQRImage: qrImagePath || qrImage,
        }),
      );

      // Move to next step (Step 6)
      dispatch(setCurrentStep(6));
      await dispatch(
        persistSignupState({
          currentStep: 6,
          isSignupInProgress: true,
        }),
      );

      router.push("/(auth)/signup-step6");
    } catch (error) {
      console.error("Error in signup-step5:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQRImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setGeneralError("Permission to access media library is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setQrImage(result.assets[0].uri);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGeneralError("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      // Complete signup without payment data
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error skipping step 5:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Payment Setup"
      onBack={handleBack}
    >
      <Stepper title="Payout Info" currentStep={5} totalSteps={6} />

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
                Get Paid Easily
              </Typography>
              <Typography
                variation="body"
                className="text-slate-500 text-center"
              >
                Link your eSewa account to receive earnings from your sales.
              </Typography>
            </View>

            {/* General Error */}
            {generalError && <InfoBox type="error" message={generalError} />}

            {/* eSewa ID / Username */}
            <View className="mb-6">
              <RHFInput
                control={control}
                name="paymentUsername"
                label="ESEWA ID / USERNAME"
                placeholder="Enter your eSewa ID"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={<UserIcon />}
              />
            </View>

            {/* eSewa QR Code */}
            <View className="mb-6">
              <Typography variation="body" className="font-sans-semibold mb-3">
                ESEWA QR CODE
              </Typography>
              <UploadBox
                icon={<QRCodeIcon size={32} />}
                title="Upload QR Image"
                subtitle="PNG, JPG up to 5MB"
                onPress={handleQRImagePick}
                image={qrImage}
              />
            </View>

            {/* Info Box */}
            <View className="p-4 bg-[#FEF3C7] rounded-2xl flex-row items-start gap-3">
              <View className="text-xl pt-0.5">
                <IIcon />
              </View>
              <Typography variation="body-sm" className="text-[#92400E] flex-1">
                Your eSewa details are used only to process your withdrawals.
                Make sure your QR code is clear and up to date.
              </Typography>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View className="px-6 py-6 flex-row gap-3">
          {/* Skip Button */}
          <Pressable onPress={handleSkip} disabled={loading} className="">
            <Typography
              variation="body"
              className="text-center text-slate-600 font-sans-bold text-xl px-10 py-4"
            >
              Skip
            </Typography>
          </Pressable>

          {/* Complete Signup Button */}
          <View className="flex-1">
            <Button
              label="Next"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
              disabled={loading}
              fullWidth
              iconPosition="right"
              icon={<RightArrowIcon width={20} height={20} color="#fff" />}
            />
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
