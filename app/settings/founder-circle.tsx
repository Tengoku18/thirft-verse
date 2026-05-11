import {
  FounderBadgePreview,
  FounderBenefitsList,
  FounderCircleHeroCard,
  FounderCircleVerificationForm,
  FounderEmailCTA,
  FounderStatusSection,
} from "@/components/founder";
import { ScreenLayout } from "@/components/layouts";
import { verifyFounderAccess } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { FounderCircleFormData } from "@/lib/validations/founder-circle";
import { fetchUserProfile } from "@/store/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";

export default function FounderCircleScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        setError("Could not retrieve your account email. Please sign out and back in.");
        setLoading(false);
        return;
      }

      const result = await verifyFounderAccess(data.verificationCode, user.email);

      if (!result.success) {
        setError(result.error ?? "Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      await dispatch(fetchUserProfile(user.id));
      setSuccessMessage("✅ Founder verification successful! Welcome to the circle.");
      setLoading(false);
      setTimeout(() => {
        router.back();
      }, 1800);
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

        <FounderBenefitsList
          type={isCreator && isSeller ? "both" : isCreator ? "creator" : isSeller ? "seller" : "both"}
        />

        {!isFounder && <FounderEmailCTA />}
      </ScrollView>
    </ScreenLayout>
  );
}
