import { ScreenLayout } from "@/components/layouts";
import {
  FounderCard,
  OfferCodeCard,
  ReferralCodeBadge,
  SettingsCard,
  SettingsDivider,
  SettingsRow,
  SettingsSectionHeader,
  SettingsToggleRow,
} from "@/components/settings";
import { ActionModal } from "@/components/ui/ActionModal";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { clearAuth, signOutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearProfile } from "@/store/profileSlice";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { DoorInIcon } from "@/components/icons";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { hasPasswordAuth, getAuthProvider } = useAuth();
  const profile = useAppSelector((s) => s.profile.profile);
  const authLoading = useAppSelector((s) => s.auth.loading);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const canChangePassword = hasPasswordAuth();
  const authProvider = getAuthProvider();

  async function handleSignOut() {
    await dispatch(signOutUser());
    dispatch(clearAuth());
    dispatch(clearProfile());
    router.replace("/(auth)/signin" as any);
  }

  const referralCode = profile?.store_username
    ? profile.store_username.toUpperCase().slice(0, 6) + "24"
    : "THRIFT24";

  return (
    <ScreenLayout title="Settings" contentBackgroundColor="#F5F5F5">
      {/* Account */}
      <View className="gap-2 my-6">
        <SettingsSectionHeader title="Account" />
        <SettingsCard>
          <SettingsRow
            icon="person.crop.circle"
            label="Edit Profile"
            onPress={() => router.push("/settings/edit-profile" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="creditcard"
            label="Payment Method"
            onPress={() => router.push("/settings/payment-method" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="qrcode"
            label="Referral Code"
            onPress={() => router.push("/settings/referral-code" as any)}
            showChevron={false}
            rightContent={<ReferralCodeBadge code={referralCode} />}
          />
        </SettingsCard>
      </View>

      {/* Founder Dashboard */}
      <FounderCard
        onViewBenefits={() => router.push("/settings/founder-circle" as any)}
      />

      {/* Sales */}
      <View className="gap-2 mt-6">
        <SettingsSectionHeader title="Sales" />
        <OfferCodeCard
          code={profile?.offer_code_object?.code ?? "No code set"}
          subtitle={
            profile?.offer_code_object
              ? `${profile.offer_code_object.discountPercent}% off is live`
              : "Tap to create an offer code"
          }
          onPress={() => router.push("/settings/offer-code" as any)}
        />
      </View>

      {/* Preferences */}
      <View className="gap-2 mt-6">
        <SettingsSectionHeader title="Preferences" />
        <SettingsCard>
          <SettingsToggleRow
            icon="bell"
            label="Push Notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </SettingsCard>
      </View>

      {/* Privacy & Security */}
      <View className="gap-2 mt-6">
        <SettingsSectionHeader title="Privacy & Security" />
        <SettingsCard>
          {/* Change Password - Show differently for OAuth users */}
          {canChangePassword ? (
            <>
              <SettingsRow
                icon="lock"
                label="Change Password"
                onPress={() => router.push("/settings/change-password" as any)}
              />
              <SettingsDivider />
            </>
          ) : (
            <>
              <SettingsRow
                icon="lock"
                label="Change Password"
                showChevron={false}
                onPress={() => router.push("/settings/change-password" as any)}
                rightContent={
                  <Typography variation="caption" className="text-slate-400">
                    {authProvider === "google"
                      ? "Via Google"
                      : authProvider === "apple"
                        ? "Via Apple"
                        : "Via provider"}
                  </Typography>
                }
              />
              <SettingsDivider />
            </>
          )}
          <SettingsRow
            icon="eye.slash"
            label="Data & Privacy"
            onPress={() => {}}
          />
        </SettingsCard>
      </View>

      {/* Support & Legal */}
      <View className="gap-2 mt-6">
        <SettingsSectionHeader title="Support & Legal" />
        <SettingsCard>
          <SettingsRow
            icon="questionmark.circle"
            label="Help & Support"
            onPress={() => router.push("/settings/help-support" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="flag"
            label="Report a Problem"
            onPress={() => router.push("/settings/report-issue" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="doc.text"
            label="Privacy Policy"
            onPress={() => router.navigate("/policies/privacy" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="hammer"
            label="Terms of Service"
            onPress={() => router.navigate("/policies/terms" as any)}
          />
          <SettingsDivider />
          <SettingsRow
            icon="rectangle.portrait.and.arrow.right"
            label="Sign Out"
            onPress={() => setShowSignOutModal(true)}
            showChevron={false}
          />
        </SettingsCard>
      </View>

      {/* Footer */}
      <View className="items-center gap-1 pt-8">
        <Typography
          variation="caption"
          className="text-ui-secondary/50 font-sans-bold uppercase tracking-widest"
        >
          Thriftverse | Archive Edition
        </Typography>
        <Typography variation="body-xs" className="text-ui-secondary/40">
          Version 1.0.3 | Build 22
        </Typography>
      </View>

      {/* Sign Out Modal */}
      <ActionModal
        visible={showSignOutModal}
        icon={
          <DoorInIcon width={24} height={24} color="#3B3030" />
        }
        title="Sign Out?"
        description="Are you sure you want to sign out of Thriftverse? You'll need to log back in to access your saved items. You can always log back in later."
        primaryLabel={authLoading ? "Signing out…" : "Sign Out"}
        secondaryLabel="Stay Logged In"
        onPrimary={handleSignOut}
        onSecondary={() => setShowSignOutModal(false)}
        primaryLoading={authLoading}
      />
    </ScreenLayout>
  );
}
