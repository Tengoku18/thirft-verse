import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createMissingProfile, updateUserProfile } from "@/lib/database-helpers";
import { showImagePickerOptions } from "@/lib/image-picker-helpers";
import { uploadPaymentQRImage } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import {
  clearPersistedSignupState,
  completeSignup,
  setPaymentData,
} from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupStep3Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const [paymentUsername, setPaymentUsername] = useState(
    signupState.paymentData.paymentUsername || ""
  );
  const [paymentQRImage, setPaymentQRImage] = useState<string | null>(
    signupState.paymentData.paymentQRImage || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = () => {
    showImagePickerOptions(
      { aspectRatio: [1, 1], quality: 0.8 },
      (result) => {
        if (result.success && result.uri) {
          setPaymentQRImage(result.uri);
        }
      },
      !!paymentQRImage,
      () => setPaymentQRImage(null)
    );
  };

  const handleComplete = async () => {
    if (!paymentUsername.trim()) {
      setError("Please enter your payment account name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not found. Please try again.");
        setLoading(false);
        return;
      }

      // Ensure profile exists (safety net if database trigger failed)
      const profileResult = await createMissingProfile();
      if (!profileResult.success) {
        console.error("Failed to ensure profile exists:", profileResult.error);
        setError("Failed to set up your profile. Please try again.");
        setLoading(false);
        return;
      }

      let paymentQRPath: string | null = null;

      // Upload QR image if provided
      if (paymentQRImage) {
        const uploadResult = await uploadPaymentQRImage(
          user.id,
          paymentQRImage
        );
        if (uploadResult.success && uploadResult.path) {
          paymentQRPath = uploadResult.path;
        } else {
          console.error("Failed to upload QR image:", uploadResult.error);
        }
      }

      // Update profile with payment info
      const result = await updateUserProfile({
        userId: user.id,
        payment_username: paymentUsername.trim(),
        payment_qr_image: paymentQRPath,
      });

      if (!result.success) {
        console.error("Failed to save payment info:", result.error);
      }

      // Save to Redux
      dispatch(
        setPaymentData({
          paymentUsername: paymentUsername.trim(),
          paymentQRImage: paymentQRPath,
        })
      );

      // Complete signup and clear persisted state
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      // Navigate to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving payment info:", error);
      setError("Failed to save payment info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);

    try {
      // Complete signup without payment info
      dispatch(completeSignup());
      await dispatch(clearPersistedSignupState());

      // Navigate to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error skipping:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader title="Payment Setup" onBack={() => router.back()} />

        <View className="mb-8">
          <CaptionText
            className="mb-2 tracking-widest uppercase"
            style={{ color: "#6B7280", fontWeight: "600", fontSize: 11 }}
          >
            Step 3 of 3
          </CaptionText>
          <HeadingBoldText
            className="leading-tight mb-2"
            style={{ fontSize: 32 }}
          >
            Payment Details
          </HeadingBoldText>
          <BodyRegularText
            className="leading-relaxed"
            style={{ color: "#6B7280", fontSize: 15 }}
          >
            Add your payment info so buyers can pay you
          </BodyRegularText>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View className="mb-6 p-4 bg-[#FEF3C7] rounded-2xl border-[2px] border-[#FCD34D]">
            <View className="flex-row items-start">
              <IconSymbol name="info.circle.fill" size={20} color="#D97706" />
              <BodyRegularText
                className="ml-3 flex-1 leading-5"
                style={{ color: "#92400E", fontSize: 13 }}
              >
                Add your payment details so buyers can pay you directly. This
                will be shown when someone wants to purchase your items.
              </BodyRegularText>
            </View>
          </View>

          {/* Payment Username Field */}
          <FormInput
            label="Payment Account Name"
            placeholder="e.g., eSewa: 9812345678 or Bank: John Doe"
            value={paymentUsername}
            onChangeText={(text) => {
              setPaymentUsername(text);
              if (error) setError("");
            }}
            error={error}
            autoCapitalize="none"
          />

          <CaptionText className="mb-6 -mt-2" style={{ color: "#6B7280" }}>
            Enter your eSewa number, bank account name, or any payment
            identifier
          </CaptionText>

          {/* QR Code Upload */}
          <View className="mb-6">
            <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
              Payment QR Code{" "}
              <CaptionText style={{ color: "#9CA3AF" }}>(Optional)</CaptionText>
            </BodySemiboldText>

            <TouchableOpacity
              onPress={handleImageSelect}
              activeOpacity={0.8}
              className="border-2 border-dashed border-[#E5E7EB] rounded-2xl overflow-hidden"
              style={{ height: 200 }}
            >
              {paymentQRImage ? (
                <View className="flex-1 relative">
                  <Image
                    source={{ uri: paymentQRImage }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                  <View
                    className="absolute top-2 right-2 bg-white rounded-full p-2"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <IconSymbol name="square.and.pencil" size={16} color="#3B2F2F" />
                  </View>
                </View>
              ) : (
                <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                  <View className="w-16 h-16 rounded-full bg-[#F3F4F6] justify-center items-center mb-3">
                    <IconSymbol name="qrcode" size={28} color="#9CA3AF" />
                  </View>
                  <BodySemiboldText style={{ color: "#6B7280", fontSize: 14 }}>
                    Upload QR Code
                  </BodySemiboldText>
                  <CaptionText style={{ color: "#9CA3AF" }} className="mt-1">
                    Tap to add your payment QR
                  </CaptionText>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View className="mt-auto pt-4">
            <FormButton
              title="Complete Setup"
              onPress={handleComplete}
              loading={loading}
              variant="primary"
              className="mb-4"
            />

            <FormButton
              title="Skip for Now"
              onPress={handleSkip}
              variant="outline"
              disabled={loading}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
