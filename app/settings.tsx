import { ConfirmModal } from "@/components/molecules/ConfirmModal";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingsItemProps {
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingsItem({
  icon,
  iconColor = "#3B2F2F",
  iconBgColor = "#F3F4F6",
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
  danger = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-4 px-4"
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        className="w-10 h-10 rounded-xl justify-center items-center mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <IconSymbol name={icon as any} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <BodySemiboldText
          style={{ color: danger ? "#DC2626" : "#3B2F2F", fontSize: 15 }}
        >
          {title}
        </BodySemiboldText>
        {subtitle && (
          <CaptionText style={{ color: "#6B7280", marginTop: 2 }}>
            {subtitle}
          </CaptionText>
        )}
      </View>
      {rightElement}
      {showArrow && onPress && (
        <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <CaptionText
        className="px-4 mb-2"
        style={{ color: "#6B7280", fontWeight: "600", fontSize: 12 }}
      >
        {title.toUpperCase()}
      </CaptionText>
      <View className="bg-white rounded-2xl mx-4 overflow-hidden">
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return <View className="h-[1px] bg-[#F3F4F6] ml-[72px]" />;
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Use Redux store for profile - consistent with AuthContext
  const profile = useAppSelector((state) => state.profile.profile);
  const user = useAppSelector((state) => state.auth.user);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mutingNotification, setMutingNotification] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    !profile?.config?.notifications_muted
  );

  const updateNotificationSetting = async (muted: boolean) => {
    if (!profile?.id) return;

    // Optimistic update
    setNotificationsEnabled(!muted);

    const updatedConfig = {
      ...profile.config,
      notifications_muted: muted,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ config: updatedConfig })
      .eq("id", profile.id);

    if (error) {
      // Revert on failure
      setNotificationsEnabled(muted);
      console.error("Failed to update notification setting:", error);
      Alert.alert("Error", "Failed to update notification setting.");
    }
  };

  const handleToggleNotifications = (enabled: boolean) => {
    if (!enabled) {
      // Turning OFF → show confirmation
      setShowMuteModal(true);
    } else {
      // Turning ON → update immediately
      updateNotificationSetting(false);
    }
  };

  const confirmMuteNotifications = async () => {
    setMutingNotification(true);
    await updateNotificationSetting(true);
    setMutingNotification(false);
    setShowMuteModal(false);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  const handleViewStore = () => {
    if (profile?.store_username) {
      const storeUrl = `https://${profile.store_username}.thriftverse.shop/`;
      Linking.openURL(storeUrl);
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://thriftverse.shop/privacy");
  };

  const handleTermsOfService = () => {
    Linking.openURL("https://thriftverse.shop/terms");
  };

  const handleHelpSupport = () => {
    Linking.openURL("https://www.thriftverse.shop/help");
  };

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setShowSignOutModal(false);
      router.dismissAll();
      router.replace("/(auth)/signin" as any);
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    Linking.openURL("https://www.thriftverse.shop/delete-account");
  };

  if (profileLoading) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Settings" showBackButton />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Settings" showBackButton />
      <ScrollView
        className="flex-1 bg-[#FAFAFA]"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <TouchableOpacity
          onPress={handleEditProfile}
          activeOpacity={0.7}
          className="mx-4 mb-6 bg-white rounded-2xl p-4 flex-row items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {profile?.profile_image ? (
            <Image
              source={{ uri: getProfileImageUrl(profile.profile_image) }}
              className="w-16 h-16 rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-[#3B2F2F] justify-center items-center">
              <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 24 }}>
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </BodySemiboldText>
            </View>
          )}
          <View className="flex-1 ml-4">
            <HeadingBoldText style={{ fontSize: 18 }}>
              {profile?.name || "User"}
            </HeadingBoldText>
            <BodyRegularText
              style={{ color: "#6B7280", fontSize: 14, marginTop: 2 }}
            >
              @{profile?.store_username || "username"}
            </BodyRegularText>
          </View>
        </TouchableOpacity>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="person.fill"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
          />
          <Divider />
          <SettingsItem
            icon="storefront.fill"
            title="View My Store"
            subtitle="See how others view your store"
            onPress={handleViewStore}
          />
          <Divider />
          <SettingsItem
            icon="creditcard.fill"
            title="Payment Settings"
            subtitle="Manage your payment methods"
            onPress={handleEditProfile}
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="bell.fill"
            title="Push Notifications"
            subtitle="Receive order and update alerts"
            showArrow={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: "#E5E7EB", true: "#3B2F2F" }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="questionmark.circle.fill"
            title="Help & Support"
            subtitle="Get help with your account"
            onPress={handleHelpSupport}
          />
          <Divider />
          <SettingsItem
            icon="doc.text.fill"
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <Divider />
          <SettingsItem
            icon="doc.plaintext.fill"
            title="Terms of Service"
            onPress={handleTermsOfService}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection title="Account Actions">
          <SettingsItem
            icon="rectangle.portrait.and.arrow.right.fill"
            iconColor="#DC2626"
            iconBgColor="#FEE2E2"
            title="Sign Out"
            danger
            onPress={handleSignOut}
            showArrow={false}
          />
          <Divider />
          <SettingsItem
            icon="trash.fill"
            iconColor="#DC2626"
            iconBgColor="#FEE2E2"
            title="Delete Account"
            subtitle="Permanently delete your account"
            danger
            onPress={handleDeleteAccount}
            showArrow={false}
          />
        </SettingsSection>
      </ScrollView>

      {/* Mute Notifications Confirmation Modal */}
      <ConfirmModal
        visible={showMuteModal}
        title="Mute Notifications"
        message="Are you sure you want to mute push notifications? You won't receive order updates until you turn them back on."
        confirmText="Mute"
        cancelText="Cancel"
        onConfirm={confirmMuteNotifications}
        onCancel={() => setShowMuteModal(false)}
        loading={mutingNotification}
        variant="danger"
        icon="bell.slash.fill"
      />

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        visible={showSignOutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={confirmSignOut}
        onCancel={() => setShowSignOutModal(false)}
        loading={signingOut}
        variant="danger"
        icon="rectangle.portrait.and.arrow.right.fill"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        variant="danger"
        icon="trash.fill"
      />
    </View>
  );
}
