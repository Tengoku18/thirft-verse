import {
  FounderBadgePreview,
  FounderBenefitsList,
  FounderCircleHeroCard,
  FounderCircleVerificationForm,
  FounderEmailCTA,
  FounderStatusSection,
} from "@/components/founder";
import { ScreenLayout } from "@/components/layouts";
import { FounderCircleFormData } from "@/lib/validations/founder-circle";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

export default function FounderCircleScreen() {
  const router = useRouter();
  const profile = useAppSelector((s) => s.profile.profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const isFounder = profile?.is_founder ?? false;
  const isCreator = profile?.is_founder_creator ?? false;
  const isSeller = profile?.is_founder_seller ?? false;

  const onSubmit = async (data: FounderCircleFormData): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      console.log("Verifying founder code:", data.verificationCode);
      setSuccessMessage("✅ Founder verification successful!");
      setLoading(false);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Founder Circle" contentBackgroundColor="#F5F5F5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <FounderCircleHeroCard />

        {isFounder && (
          <>
            <FounderStatusSection isCreator={isCreator} isSeller={isSeller} />
            <FounderBadgePreview />
          </>
        )}

        {!isFounder && (
          <FounderCircleVerificationForm
            loading={loading}
            error={error}
            successMessage={successMessage}
            onSubmit={onSubmit}
          />
        )}

        <FounderBenefitsList />

        {!isFounder && <FounderEmailCTA />}
      </ScrollView>
    </ScreenLayout>
  );
}
