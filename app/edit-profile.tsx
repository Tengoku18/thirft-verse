import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/lib/database-helpers";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { uploadProfileImage } from "@/lib/storage-helpers";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileData {
  name: string;
  bio: string;
  address: string;
  profile_image: string | null;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    bio: "",
    address: "",
    profile_image: null,
  });
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; bio?: string; address?: string }>({});

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: fetchedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && fetchedProfile) {
        setProfileData({
          name: fetchedProfile.name || "",
          bio: fetchedProfile.bio || "",
          address: fetchedProfile.address || "",
          profile_image: fetchedProfile.profile_image || null,
        });
      } else {
        // Fallback to user metadata
        setProfileData({
          name: user.user_metadata?.name || "",
          bio: "",
          address: user.user_metadata?.address || "",
          profile_image: user.user_metadata?.profile_image || null,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; bio?: string; address?: string } = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (profileData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    if (profileData.bio && profileData.bio.length > 300) {
      newErrors.bio = "Bio must be less than 300 characters";
    }

    if (profileData.address && profileData.address.length > 255) {
      newErrors.address = "Address must be less than 255 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to upload a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your camera to take a photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewImageUri(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error("Error taking photo:", error);
      if (error?.message?.includes("Camera not available")) {
        Alert.alert(
          "Camera Not Available",
          "The camera is not available on simulator. Please use 'Choose from Library' or test on a physical device."
        );
      } else {
        Alert.alert("Error", "Failed to take photo. Please try again.");
      }
    }
  };

  const showImageOptions = () => {
    const hasImage = newImageUri || profileData.profile_image;
    Alert.alert("Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
      ...(hasImage
        ? [
            {
              text: "Remove Photo",
              onPress: () => {
                setNewImageUri(null);
                setProfileData((prev) => ({ ...prev, profile_image: null }));
              },
              style: "destructive" as const,
            },
          ]
        : []),
    ]);
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setSaving(true);

    try {
      let imageUrl = profileData.profile_image;

      // Upload new image if selected
      if (newImageUri) {
        const uploadResult = await uploadProfileImage(user.id, newImageUri);
        if (uploadResult.success && uploadResult.path) {
          imageUrl = uploadResult.path;
        } else {
          Alert.alert("Error", "Failed to upload profile image. Please try again.");
          setSaving(false);
          return;
        }
      }

      // Update profile in database
      const result = await updateUserProfile({
        userId: user.id,
        name: profileData.name.trim(),
        bio: profileData.bio.trim(),
        address: profileData.address.trim(),
        profile_image: imageUrl || undefined,
      });

      if (result.success) {
        // Refresh the profile data in the app state
        await refreshProfile();
        Alert.alert("Success", "Profile updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getDisplayImageUri = () => {
    if (newImageUri) return newImageUri;
    if (profileData.profile_image) {
      return getProfileImageUrl(profileData.profile_image);
    }
    return null;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Edit Profile" showBackButton={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Profile Image Section */}
          <View className="items-center py-8 px-6">
            <TouchableOpacity
              onPress={showImageOptions}
              activeOpacity={0.8}
              className="relative"
            >
              {getDisplayImageUri() ? (
                <Image
                  source={{ uri: getDisplayImageUri()! }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 3,
                    borderColor: "#E5E7EB",
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "#3B2F2F",
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 3,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <HeadingBoldText style={{ color: "#FFFFFF", fontSize: 36 }}>
                    {profileData.name.charAt(0).toUpperCase() || "U"}
                  </HeadingBoldText>
                </View>
              )}

              {/* Camera Icon Overlay */}
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#3B2F2F",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 3,
                  borderColor: "#FFFFFF",
                }}
              >
                <IconSymbol name="camera.fill" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <BodyRegularText
              className="mt-3"
              style={{ color: "#6B7280", fontSize: 13 }}
            >
              Tap to change profile photo
            </BodyRegularText>
          </View>

          {/* Form Fields */}
          <View className="px-6">
            {/* Name Field */}
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={profileData.name}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, name: text }))
              }
              error={errors.name}
            />

            {/* Address Field */}
            <FormInput
              label="Address"
              placeholder="Enter your address"
              autoCapitalize="words"
              value={profileData.address}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, address: text }))
              }
              error={errors.address}
            />

            {/* Bio Field */}
            <View className="mb-6">
              <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
                Bio
              </BodySemiboldText>
              <View className="relative">
                <FormInput
                  placeholder="Tell us about yourself and your thrift shop..."
                  multiline
                  numberOfLines={4}
                  value={profileData.bio}
                  onChangeText={(text) =>
                    setProfileData((prev) => ({ ...prev, bio: text }))
                  }
                  error={errors.bio}
                  style={{ height: 120, textAlignVertical: "top" }}
                  label=""
                />
              </View>
              <CaptionText
                className="mt-1"
                style={{
                  color: profileData.bio.length > 300 ? "#EF4444" : "#9CA3AF",
                }}
              >
                {profileData.bio.length}/300 characters
              </CaptionText>
            </View>

            {/* Username (Read-only) */}
            <View className="mb-6">
              <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
                Username
              </BodySemiboldText>
              <View
                className="h-[58px] px-4 rounded-2xl border-[2px] border-[#E5E7EB] bg-[#F9FAFB] justify-center"
              >
                <View className="flex-row items-center">
                  <BodyRegularText style={{ color: "#6B7280", fontSize: 15 }}>
                    @{user?.user_metadata?.username || "username"}
                  </BodyRegularText>
                  <View className="ml-2">
                    <IconSymbol name="lock.fill" size={14} color="#9CA3AF" />
                  </View>
                </View>
              </View>
              <CaptionText className="mt-2" style={{ color: "#9CA3AF" }}>
                Username cannot be changed
              </CaptionText>
            </View>

            {/* Email (Read-only) */}
            <View className="mb-6">
              <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
                Email
              </BodySemiboldText>
              <View
                className="h-[58px] px-4 rounded-2xl border-[2px] border-[#E5E7EB] bg-[#F9FAFB] justify-center"
              >
                <View className="flex-row items-center">
                  <BodyRegularText style={{ color: "#6B7280", fontSize: 15 }}>
                    {user?.email || "email@example.com"}
                  </BodyRegularText>
                  <View className="ml-2">
                    <IconSymbol name="lock.fill" size={14} color="#9CA3AF" />
                  </View>
                </View>
              </View>
              <CaptionText className="mt-2" style={{ color: "#9CA3AF" }}>
                Email cannot be changed from here
              </CaptionText>
            </View>
          </View>

          {/* Save Button */}
          <View className="px-6 mt-4">
            <FormButton
              title="Save Changes"
              onPress={handleSave}
              loading={saving}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
