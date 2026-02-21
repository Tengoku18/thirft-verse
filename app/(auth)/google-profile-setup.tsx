import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { ProfileImagePicker } from "@/components/atoms/ProfileImagePicker";
import { AuthHeader } from "@/components/navigation/AuthHeader";
import {
  BodyRegularText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  checkUsernameExists,
  createUserProfile,
  verifyProfileExists,
} from "@/lib/database-helpers";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserProfile } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

type UsernameStatus = "idle" | "checking" | "available" | "taken";

export default function GoogleProfileSetupScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, signOut } = useAuth();

  const googleName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const googleAvatar = user?.user_metadata?.avatar_url || null;

  const [name, setName] = useState(googleName);
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(googleAvatar);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/signin");
    }
  }, [user, router]);

  // Username availability check with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");

    debounceTimer.current = setTimeout(async () => {
      try {
        const exists = await checkUsernameExists(username);
        setUsernameStatus(exists ? "taken" : "available");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [username]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }
    if (!username.trim()) {
      setErrorMessage("Please choose a username");
      return;
    }
    if (username.length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setErrorMessage(
        "Username can only contain lowercase letters, numbers, and underscores"
      );
      return;
    }
    if (usernameStatus === "taken") {
      setErrorMessage("This username is already taken");
      return;
    }
    if (!address.trim()) {
      setErrorMessage("Please enter your address");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (!user?.id) {
        setErrorMessage("Session expired. Please sign in again.");
        setLoading(false);
        return;
      }

      // Check if profile already exists (e.g., same email used for email signup before)
      const profileExists = await verifyProfileExists(user.id);
      if (profileExists) {
        await dispatch(fetchUserProfile(user.id));
        router.replace("/(tabs)");
        return;
      }

      // Final uniqueness check to guard against race conditions
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setErrorMessage("This username was just taken. Please choose another.");
        setUsernameStatus("taken");
        setLoading(false);
        return;
      }

      const result = await createUserProfile({
        userId: user.id,
        name: name.trim(),
        store_username: username.trim(),
        bio: "",
        profile_image: profileImage,
        currency: "NPR",
        address: address.trim(),
      });

      if (!result.success) {
        console.error("Failed to create profile:", result.error);
        setErrorMessage("Failed to create your profile. Please try again.");
        setLoading(false);
        return;
      }

      // Refresh profile in Redux so route guard sees it
      await dispatch(fetchUserProfile(user.id));

      // Redirect to payment setup (same as signup step 3)
      router.replace("/(auth)/signup-step3");
    } catch (error) {
      console.error("Error creating profile:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 px-6 pt-12 pb-8">
        <AuthHeader
          title="Complete Profile"
          onBack={async () => {
            await signOut();
            router.replace("/(auth)/signin");
          }}
        />

        <View className="mb-8">
          <HeadingBoldText
            className="leading-tight mb-2"
            style={{ fontSize: 28 }}
          >
            Welcome to ThriftVerse
          </HeadingBoldText>
          <BodyRegularText
            className="leading-relaxed"
            style={{ color: "#6B7280", fontSize: 15 }}
          >
            Set up your store profile to start buying and selling
          </BodyRegularText>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Image */}
          <ProfileImagePicker
            value={profileImage}
            onChange={setProfileImage}
            name={name || "User"}
          />

          <View className="mt-4">
            {/* Name Field */}
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              autoCapitalize="words"
              required
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorMessage) setErrorMessage(null);
              }}
            />

            {/* Email Field (read-only) */}
            <FormInput
              label="Email"
              value={user?.email || ""}
              editable={false}
            />

            {/* Username Field */}
            <View>
              <FormInput
                label="Username"
                placeholder="Choose a unique store username"
                autoCapitalize="none"
                autoCorrect={false}
                required
                value={username}
                onChangeText={(text) => {
                  setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                  if (errorMessage) setErrorMessage(null);
                }}
              />
              {username && username.length >= 3 && (
                <View className="flex-row items-center -mt-4 mb-4 ml-1">
                  {usernameStatus === "checking" && (
                    <>
                      <ActivityIndicator size="small" color="#6B7280" />
                      <CaptionText
                        className="ml-2"
                        style={{ color: "#6B7280" }}
                      >
                        Checking availability...
                      </CaptionText>
                    </>
                  )}
                  {usernameStatus === "available" && (
                    <>
                      <IconSymbol
                        name="checkmark.circle.fill"
                        size={16}
                        color="#22C55E"
                      />
                      <CaptionText
                        className="ml-2"
                        style={{ color: "#22C55E" }}
                      >
                        Username is available
                      </CaptionText>
                    </>
                  )}
                  {usernameStatus === "taken" && (
                    <>
                      <IconSymbol
                        name="xmark.circle.fill"
                        size={16}
                        color="#EF4444"
                      />
                      <CaptionText
                        className="ml-2"
                        style={{ color: "#EF4444" }}
                      >
                        Username is already taken
                      </CaptionText>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* Address Field */}
            <FormInput
              label="Address"
              placeholder="Enter your address"
              autoCapitalize="words"
              required
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (errorMessage) setErrorMessage(null);
              }}
            />

            {/* Error message */}
            {errorMessage && (
              <View className="my-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <BodyRegularText style={{ color: "#EF4444", fontSize: 14 }}>
                  {errorMessage}
                </BodyRegularText>
              </View>
            )}

            <FormButton
              title="Complete Setup"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
