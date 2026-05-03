import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import { CameraIcon, LockIcon } from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { updateUserProfile } from "@/lib/database-helpers";
import { uploadProfileImage } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    bio: "",
    address: "",
    profile_image: null,
  });
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    bio?: string;
    address?: string;
  }>({});

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
    const newErrors: {
      name?: string;
      bio?: string;
      address?: string;
    } = {};

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

    // Address is optional, but if provided, validate it
    if (profileData.address?.trim()) {
      if (profileData.address.length < 10) {
        newErrors.address =
          "Address must be at least 10 characters if provided";
      } else if (profileData.address.length > 255) {
        newErrors.address = "Address must be less than 255 characters";
      }
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
          "Please allow access to your photos to upload a profile picture.",
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

  const showImageOptions = () => {
    pickImage();
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    setSaving(true);

    try {
      let imageUrl = profileData.profile_image;

      // Upload new profile image if selected
      if (newImageUri) {
        const uploadResult = await uploadProfileImage(user.id, newImageUri);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          Alert.alert(
            "Error",
            "Failed to upload profile image. Please try again.",
          );
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
        toast.success("Profile updated successfully");
        router.back();
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
      return profileData.profile_image;
    }
    return null;
  };

  if (loading) {
    return <FullScreenLoader backgroundColor="#FFFFFF" />;
  }

  return (
    <ScreenLayout
      title="Edit Profile"
      backgroundColor={Colors.light.background}
      contentBackgroundColor={Colors.light.background}
      scrollable={false}
    >
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
                  <Typography
                    variation="h1"
                    style={{
                      color: "#FFFFFF",
                      fontSize: 36,
                      fontWeight: "700",
                    }}
                  >
                    {profileData.name.charAt(0).toUpperCase() || "U"}
                  </Typography>
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
                <CameraIcon width={16} height={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <Typography
              variation="body-sm"
              className="mt-3"
              style={{ color: "#6B7280", fontSize: 13 }}
            >
              Tap to change profile photo
            </Typography>
          </View>

          {/* Form Fields */}
          <View className="px-6">
            {/* Name Field */}
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              required
              value={profileData.name}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, name: text }))
              }
              error={errors.name}
            />

            {/* Address Field */}
            <FormInput
              label="Address (Optional)"
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
              <Typography
                variation="label"
                className="mb-3"
                style={{ fontSize: 13, fontWeight: "600" }}
              >
                Bio
              </Typography>
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
              <Typography
                variation="caption"
                className="mt-1"
                style={{
                  color: profileData.bio.length > 300 ? "#EF4444" : "#9CA3AF",
                }}
              >
                {profileData.bio.length}/300 characters
              </Typography>
            </View>

            {/* Username (Read-only) */}
            <View className="mb-6">
              <Typography
                variation="label"
                className="mb-3"
                style={{ fontSize: 13, fontWeight: "600" }}
              >
                Username
              </Typography>
              <View className="h-[58px] px-4 rounded-2xl border-[2px] border-[#E5E7EB] bg-[#F9FAFB] justify-center">
                <View className="flex-row items-center">
                  <Typography
                    variation="body-sm"
                    style={{ color: "#6B7280", fontSize: 15 }}
                  >
                    @{user?.user_metadata?.username || "username"}
                  </Typography>
                  <View className="ml-2">
                    <LockIcon width={14} height={14} color="#9CA3AF" />
                  </View>
                </View>
              </View>
              <Typography
                variation="caption"
                className="mt-2"
                style={{ color: "#9CA3AF" }}
              >
                Username cannot be changed
              </Typography>
            </View>

            {/* Email (Read-only) */}
            <View className="mb-6">
              <Typography
                variation="label"
                className="mb-3"
                style={{ fontSize: 13, fontWeight: "600" }}
              >
                Email
              </Typography>
              <View className="h-[58px] px-4 rounded-2xl border-[2px] border-[#E5E7EB] bg-[#F9FAFB] justify-center">
                <View className="flex-row items-center">
                  <Typography
                    variation="body-sm"
                    style={{ color: "#6B7280", fontSize: 15 }}
                  >
                    {user?.email || "email@example.com"}
                  </Typography>
                  <View className="ml-2">
                    <LockIcon width={14} height={14} color="#9CA3AF" />
                  </View>
                </View>
              </View>
              <Typography
                variation="caption"
                className="mt-2"
                style={{ color: "#9CA3AF" }}
              >
                Email cannot be changed from here
              </Typography>
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
    </ScreenLayout>
  );
}
