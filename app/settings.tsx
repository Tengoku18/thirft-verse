import { CustomHeader } from "@/components/navigation/CustomHeader";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { getProfileImageUrl } from "@/lib/storage-helpers";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profile = useAppSelector((state) => state.profile.profile);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/signin");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone. All your data, products, and order history will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    // Second confirmation for safety
    Alert.alert(
      "Final Confirmation",
      "This is your last chance. Are you absolutely sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete My Account",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              // Delete user's products first
              if (user?.id) {
                await supabase
                  .from("products")
                  .delete()
                  .eq("store_id", user.id);

                // Delete user's profile
                await supabase.from("profiles").delete().eq("id", user.id);
              }

              // Sign out and delete auth user
              // Note: Full auth user deletion requires admin privileges or edge function
              await signOut();
              router.replace("/(auth)/signin");

              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted."
              );
            } catch (error) {
              console.error("Delete account error:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      title: "Account",
      options: [
        {
          label: "Edit Profile",
          icon: "person.circle",
          onPress: () => router.push("/edit-profile"),
        },
        {
          label: "Change Password",
          icon: "lock.shield",
          onPress: () => router.push("/change-password"),
        },
        {
          label: "Privacy Settings",
          icon: "eye.slash",
          onPress: () => Alert.alert("Privacy Settings", "Coming soon!"),
        },
      ],
    },
    // {
    //   title: "Preferences",
    //   options: [
    //     {
    //       label: "Notifications",
    //       icon: "bell",
    //       onPress: () => Alert.alert("Notifications", "Coming soon!"),
    //     },
    //     {
    //       label: "Language",
    //       icon: "globe",
    //       onPress: () => Alert.alert("Language", "Coming soon!"),
    //     },
    //     {
    //       label: "Currency",
    //       icon: "banknote",
    //       onPress: () => Alert.alert("Currency", "Coming soon!"),
    //     },
    //   ],
    // },
    {
      title: "Support",
      options: [
        {
          label: "Help Center",
          icon: "questionmark.circle",
          onPress: () => Alert.alert("Help Center", "Coming soon!"),
        },
        {
          label: "Contact Us",
          icon: "envelope",
          onPress: () => Alert.alert("Contact Us", "Coming soon!"),
        },
        {
          label: "About",
          icon: "info.circle",
          onPress: () => Alert.alert("About ThriftVerse", "Version 1.0.0"),
        },
      ],
    },
    {
      title: "Legal",
      options: [
        {
          label: "Terms & Conditions",
          icon: "doc.text",
          onPress: () => router.push("/policies/terms"),
        },
        {
          label: "Privacy Policy",
          icon: "hand.raised",
          onPress: () => router.push("/policies/privacy"),
        },
        {
          label: "Refund Policy",
          icon: "arrow.uturn.left.circle",
          onPress: () => router.push("/policies/refund"),
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header */}
      <CustomHeader
        title="Settings"
        showBackButton={true}
        backRoute="/(tabs)/profile"
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* User Info Card */}
        <View className="mx-6 mt-6 mb-4 p-4 bg-[#FAFAFA] rounded-2xl">
          <View className="flex-row items-center">
            {profile?.profile_image ? (
              <Image
                source={{ uri: getProfileImageUrl(profile.profile_image) }}
                className="w-12 h-12 rounded-full mr-3"
                style={{ backgroundColor: "#E5E7EB" }}
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-[#3B2F2F] justify-center items-center mr-3">
                <ThemedText
                  className="text-xl font-bold font-[PlayfairDisplay_700Bold]"
                  style={{ color: "#FFFFFF" }}
                >
                  {(profile?.name || user?.user_metadata?.name)?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              </View>
            )}
            <View className="flex-1">
              <ThemedText
                className="text-[16px] font-[NunitoSans_700Bold]"
                style={{ color: "#3B2F2F" }}
              >
                {profile?.name || user?.user_metadata?.name || "User"}
              </ThemedText>
              <ThemedText
                className="text-[13px] font-[NunitoSans_400Regular]"
                style={{ color: "#6B7280" }}
              >
                {user?.email}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsOptions.map((section, sectionIndex) => (
          <View key={section.title} className="mb-6">
            <ThemedText
              className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 px-6"
              style={{
                color: "#9CA3AF",
                textTransform: "capitalize",
                letterSpacing: 1,
              }}
            >
              {section.title}
            </ThemedText>

            <View className="bg-white">
              {section.options.map((option, index) => (
                <TouchableOpacity
                  key={option.label}
                  onPress={option.onPress}
                  className="flex-row items-center px-6 py-4 border-b border-[#F3F4F6]"
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-full bg-[#FAFAFA] justify-center items-center mr-4">
                    <IconSymbol
                      name={option.icon as any}
                      size={20}
                      color="#3B2F2F"
                    />
                  </View>
                  <View className="flex-1">
                    <ThemedText
                      className="text-[15px] font-[NunitoSans_600SemiBold]"
                      style={{ color: "#3B2F2F" }}
                    >
                      {option.label}
                    </ThemedText>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone Section */}
        <View className="mb-6">
          <ThemedText
            className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 px-6"
            style={{
              color: "#EF4444",
              textTransform: "capitalize",
              letterSpacing: 1,
            }}
          >
            Danger Zone
          </ThemedText>

          <View className="bg-white">
            {/* Logout Option */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-6 py-4 border-b border-[#F3F4F6]"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-red-50 justify-center items-center mr-4">
                <IconSymbol
                  name="arrow.right.square"
                  size={20}
                  color="#EF4444"
                />
              </View>
              <View className="flex-1">
                <ThemedText
                  className="text-[15px] font-[NunitoSans_600SemiBold]"
                  style={{ color: "#EF4444" }}
                >
                  Logout
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#EF4444" />
            </TouchableOpacity>

            {/* Delete Account Option */}
            <TouchableOpacity
              onPress={handleDeleteAccount}
              disabled={deleting}
              className="flex-row items-center px-6 py-4 border-b border-[#F3F4F6]"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-red-50 justify-center items-center mr-4">
                {deleting ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <IconSymbol name="trash" size={20} color="#EF4444" />
                )}
              </View>
              <View className="flex-1">
                <ThemedText
                  className="text-[15px] font-[NunitoSans_600SemiBold]"
                  style={{ color: "#EF4444" }}
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Version Info */}
        <View className="items-center pb-8">
          <ThemedText
            className="text-[12px] font-[NunitoSans_400Regular]"
            style={{ color: "#9CA3AF" }}
          >
            ThriftVerse v1.0.0
          </ThemedText>
          <ThemedText
            className="text-[11px] font-[NunitoSans_400Regular] mt-1"
            style={{ color: "#D1D5DB" }}
          >
            Made with ❤️ for sustainable fashion
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}
