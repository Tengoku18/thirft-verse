import { CustomHeader } from "@/components/navigation/CustomHeader";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

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

  const settingsOptions = [
    {
      title: "Account",
      options: [
        {
          label: "Edit Profile",
          icon: "person.circle",
          onPress: () => Alert.alert("Edit Profile", "Coming soon!"),
        },
        {
          label: "Change Password",
          icon: "lock.shield",
          onPress: () => Alert.alert("Change Password", "Coming soon!"),
        },
        {
          label: "Privacy Settings",
          icon: "eye.slash",
          onPress: () => Alert.alert("Privacy Settings", "Coming soon!"),
        },
      ],
    },
    {
      title: "Preferences",
      options: [
        {
          label: "Notifications",
          icon: "bell",
          onPress: () => Alert.alert("Notifications", "Coming soon!"),
        },
        {
          label: "Language",
          icon: "globe",
          onPress: () => Alert.alert("Language", "Coming soon!"),
        },
        {
          label: "Currency",
          icon: "banknote",
          onPress: () => Alert.alert("Currency", "Coming soon!"),
        },
      ],
    },
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
            <View className="w-12 h-12 rounded-full bg-[#3B2F2F] justify-center items-center mr-3">
              <ThemedText
                className="text-xl font-bold font-[PlayfairDisplay_700Bold]"
                style={{ color: "#FFFFFF" }}
              >
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
              </ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText
                className="text-[16px] font-[NunitoSans_700Bold]"
                style={{ color: "#3B2F2F" }}
              >
                {user?.user_metadata?.name || "User"}
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
              className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 px-6 uppercase tracking-wider"
              style={{ color: "#9CA3AF" }}
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

        {/* Logout Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 border-2 border-red-500 h-[58px] rounded-2xl justify-center items-center"
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol name="arrow.right.square" size={20} color="#EF4444" />
              <ThemedText
                className="text-base font-[NunitoSans_700Bold]"
                style={{ color: "#EF4444" }}
              >
                Logout
              </ThemedText>
            </View>
          </TouchableOpacity>
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
