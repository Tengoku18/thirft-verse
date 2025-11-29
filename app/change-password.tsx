import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});

  const validateForm = (): boolean => {
    const newErrors: PasswordErrors = {};

    // Current password validation
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one number";
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    // Confirm password validation
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm() || !user?.email) return;

    setSaving(true);

    try {
      // First, verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: "Current password is incorrect" });
        setSaving(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        Alert.alert("Error", "Failed to update password. Please try again.");
        setSaving(false);
        return;
      }

      // Success
      Alert.alert(
        "Success",
        "Your password has been changed successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Change Password" showBackButton={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 pt-8">
            {/* Current Password */}
            <FormInput
              label="Current Password"
              placeholder="Enter your current password"
              secureTextEntry
              value={passwordData.currentPassword}
              onChangeText={(text) =>
                setPasswordData((prev) => ({ ...prev, currentPassword: text }))
              }
              error={errors.currentPassword}
            />

            {/* New Password */}
            <FormInput
              label="New Password"
              placeholder="Enter your new password"
              secureTextEntry
              value={passwordData.newPassword}
              onChangeText={(text) =>
                setPasswordData((prev) => ({ ...prev, newPassword: text }))
              }
              error={errors.newPassword}
            />

            {/* Confirm New Password */}
            <FormInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              secureTextEntry
              value={passwordData.confirmPassword}
              onChangeText={(text) =>
                setPasswordData((prev) => ({ ...prev, confirmPassword: text }))
              }
              error={errors.confirmPassword}
            />
          </View>

          {/* Save Button */}
          <View className="px-6 mt-8">
            <FormButton
              title="Change Password"
              onPress={handleChangePassword}
              loading={saving}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
