import { InfoBox } from "@/components/atoms/InfoBox";
import { RightArrowIcon } from "@/components/icons";
import IIcon from "@/components/icons/IIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { EsewaPaymentFields } from "@/components/payment/EsewaPaymentFields";
import { Button } from "@/components/ui/Button/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { useSignupFormRestore } from "@/hooks/useSignupFormRestore";
import { uploadPaymentQRImage } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { setPaymentData } from "@/store";
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
  paymentQRImage: yup.string().optional(), // Optional - user might already have one stored
});

type Step5FormData = {
  paymentUsername: string;
  paymentQRImage?: string;
};

export default function SignupStep5Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const handleBack = () => {
    router.push("/(auth)/signup-step4");
  };

  // QR code image state
  const [qrImage, setQrImage] = useState<string | null>(
    signupState.paymentData.paymentQRImage || null,
  );

  const [loading, setLoading] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form setup with React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step5FormData>({
    resolver: yupResolver(step5Schema as any),
    mode: "onBlur",
    defaultValues: {
      paymentUsername: signupState.paymentData.paymentUsername || "",
      paymentQRImage: signupState.paymentData.paymentQRImage || "",
    },
  });

  // Restore form data from Redux when navigating back
  useSignupFormRestore(setValue, signupState.paymentData as any, "Step 5");

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

      // Check if QR image is new (file URI) vs stored URL
      const isNewQRImage = qrImage && !qrImage.startsWith("http");

      // Upload QR image ONLY if it's a new file (not a stored URL)
      let qrImagePath: string | null = null;
      if (isNewQRImage) {
        const {
          success,
          url,
          error: uploadError,
        } = await uploadPaymentQRImage(user.id, qrImage);
        if (success && url) {
          qrImagePath = url;
        } else {
          console.error("Failed to upload QR image:", uploadError);
          setGeneralError("Failed to upload QR code image. Please try again.");
          setLoading(false);
          return;
        }
      } else if (!qrImage) {
        // No QR image at all
        setGeneralError("Please upload an eSewa QR code image");
        setLoading(false);
        return;
      }

      // Update profile with payment data only if changed
      const updatePayload: Record<string, any> = { signup_step: 5 };

      const newPaymentUsername = data.paymentUsername.trim();
      const oldPaymentUsername = signupState.paymentData.paymentUsername;
      if (newPaymentUsername !== oldPaymentUsername) {
        updatePayload.payment_username = newPaymentUsername;
      }

      // Only update QR image if a new one was uploaded
      if (qrImagePath) {
        updatePayload.payment_qr_image = qrImagePath;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save payment data:", error);
        setGeneralError(
          "Failed to save payment information. Please try again.",
        );
        setLoading(false);
        return;
      }

      dispatch(
        setPaymentData({
          paymentUsername: data.paymentUsername.trim(),
          paymentQRImage: qrImagePath || qrImage,
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
      const imageUri = result.assets[0].uri;
      setQrImage(imageUri);
      // Update form field to clear validation error
      setValue("paymentQRImage", imageUri);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGeneralError("User not found. Please sign in again.");
        setIsSkipping(false);
        return;
      }

      await supabase
        .from("profiles")
        .update({ signup_step: 5 })
        .eq("id", user.id);

      router.push("/(auth)/signup-step6");
    } catch (error) {
      console.error("Error skipping step 5:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSkipping(false);
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

            {/* eSewa Fields */}
            <View className="mb-6">
              <EsewaPaymentFields
                control={control}
                esewaIdFieldName="paymentUsername"
                qrImage={qrImage}
                onPickQRImage={handleQRImagePick}
                qrError={errors.paymentQRImage?.message}
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
          <Pressable
            onPress={handleSkip}
            disabled={loading || isSkipping}
            className=""
          >
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
              disabled={loading || isSkipping}
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
