import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
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
  const { user, signOut } = useAuth();
  const router = useRouter();
  // Use Redux store for profile - consistent with AuthContext
  const profile = useAppSelector((state) => state.profile.profile);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  const handleViewStore = () => {
    if (profile?.store_username) {
      router.push(`/store/${profile.store_username}` as any);
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://thriftverse.com/privacy");
  };

  const handleTermsOfService = () => {
    Linking.openURL("https://thriftverse.com/terms");
  };

  const handleHelpSupport = () => {
    Linking.openURL("mailto:support@thriftverse.com");
  };

  const handleRateApp = () => {
    Alert.alert("Rate App", "This will open the app store for rating.");
  };

  const handleShareApp = () => {
    Alert.alert("Share App", "Share functionality coming soon!");
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/signin" as any);
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Contact Support",
              "To delete your account, please contact support@thriftverse.com"
            );
          },
        },
      ]
    );
  };

  if (profileLoading) {
    return (
      <TabScreenLayout title="Settings">
        <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </TabScreenLayout>
    );
  }

  return (
    <TabScreenLayout title="Settings">
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
                onValueChange={setNotificationsEnabled}
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
    </TabScreenLayout>
  );
}
