import { SellerTypeCard } from "@/components/atoms/SellerTypeCard";
import HangerIcon from "@/components/icons/ClosetIcon";
import ShopIcon from "@/components/icons/StoreIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { supabase } from "@/lib/supabase";
import { persistSignupState, setCurrentStep, setFormData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SignupStep3Screen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

  const handleBack = () => {
    // Decrement step and navigate to previous step
    router.push("/(auth)/signup-step1");
  };

  const [selectedType, setSelectedType] = useState<"store" | "closet" | "">(
    signupState.formData.sellerType || "",
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedType) {
      setErrorMessage("Please select a seller type to continue");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Save seller type to Redux
      await dispatch(
        setFormData({
          sellerType: selectedType,
        }),
      );

      // Update profile in Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMessage("User not found. Please sign in again.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ seller_type: selectedType })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save seller type:", error);
        setErrorMessage("Failed to save seller type. Please try again.");
        setLoading(false);
        return;
      }

      // Move to next step
      dispatch(setCurrentStep(4));
      await dispatch(
        persistSignupState({
          currentStep: 4,
          isSignupInProgress: true,
        }),
      );

      router.push("/(auth)/signup-step4");
    } catch (error) {
      console.error("Error in signup-step3:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  console.log("loading", loading, Boolean(!selectedType));

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Sign Up"
      showScrollView={false}
      onBack={handleBack}
    >
      <Stepper title="Seller Type" currentStep={3} totalSteps={6} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6">
            <View className="mb-8">
              <Typography variation="h1" className="text-center py-4">
                How do you want to sell?
              </Typography>
              <Typography
                variation="body"
                className="text-slate-500 text-center"
              >
                Choose the seller profile that fits your goals.
              </Typography>
            </View>

            {/* Seller Type Options */}
            <View className="mb-8 gap-1">
              <SellerTypeCard
                isSelected={selectedType === "store"}
                onPress={() => {
                  setSelectedType("store");
                  setErrorMessage(null);
                }}
                icon={<ShopIcon />}
                title="Open a Store"
                description="Best for professional vintage curators,boutique owners, and regular high-volume sellers."
              />

              <SellerTypeCard
                isSelected={selectedType === "closet"}
                onPress={() => {
                  setSelectedType("closet");
                  setErrorMessage(null);
                }}
                icon={<HangerIcon />}
                title="Sell Your Closet"
                description="Perfect for liquidating your personal wardrobe and selling individual one-level items."
              />
            </View>

            {/* Error Message */}
            {errorMessage && (
              <View className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <Typography variation="body-sm" className="text-red-600">
                  {errorMessage}
                </Typography>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Continue Button - Sticky Bottom */}
        <View className="px-6 py-6">
          <Button
            label="Continue"
            variant="primary"
            onPress={handleContinue}
            isLoading={loading}
            disabled={loading || !selectedType}
            fullWidth
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
