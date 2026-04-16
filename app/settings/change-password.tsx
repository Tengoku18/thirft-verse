import { RHFInput } from "@/components/forms/ReactHookForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  ChangePasswordFormData,
  changePasswordSchema,
  isPasswordStrong,
  validatePasswordRequirements,
} from "@/lib/validations/change-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BG = "#FAF7F2";

/**
 * Change Password Screen
 *
 * Features:
 * - ✅ Current password verification
 * - ✅ Real-time password strength validation
 * - ✅ Security requirements checklist
 * - ✅ Visual feedback (icons & colors)
 * - ✅ Password visibility toggle
 * - ✅ Loading & error states
 * - ✅ Toast notifications
 * - ✅ Production-level security
 * - ✅ Errors only show after submission
 */
export default function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { changePassword, hasPasswordAuth, getAuthProvider } = useAuth();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user can change password
  const canChangePassword = hasPasswordAuth();
  const authProvider = getAuthProvider();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch new password for real-time requirements validation
  const newPassword = useWatch({
    control,
    name: "newPassword",
  });

  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  const passwordRequirements = validatePasswordRequirements(newPassword || "");
  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const onSubmit = useCallback(
    async (data: ChangePasswordFormData) => {
      if (!isPasswordStrong(data.newPassword)) {
        Alert.alert(
          "Weak Password",
          "Please ensure your password meets all security requirements.",
        );
        return;
      }

      Keyboard.dismiss();
      setLoading(true);
      setApiError(null); // Clear previous errors

      try {
        const result = await changePassword(
          data.currentPassword,
          data.newPassword,
        );

        if (result.error) {
          const errorMessage =
            typeof result.error === "string"
              ? result.error
              : result.error.message || "Failed to change password";
          setApiError(errorMessage);
          setLoading(false);
          return;
        }

        toast.success("Password changed successfully!");
        reset();
        setApiError(null);

        // Navigate back after brief delay
        setTimeout(() => {
          router.back();
        }, 1500);
      } catch (error: any) {
        console.error("Change password error:", error);
        const errorMessage =
          error?.message || "An error occurred. Please try again.";
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [changePassword, reset, router, toast],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // ============================================
  // REQUIREMENT ITEM COMPONENT
  // ============================================
  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => {
    const textColor = met
      ? "text-accent font-semibold"
      : "text-ui-secondary/40";
    const iconColor = met ? "#D4A373" : "#9CA3AF";

    return (
      <View className="flex-row items-center gap-3">
        <IconSymbol
          name={met ? "checkmark.circle.fill" : "circle"}
          size={18}
          color={iconColor}
        />
        <Typography variation="body-sm" className={textColor}>
          {label}
        </Typography>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(59,48,48,0.08)",
          backgroundColor: `${BG}CC`,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable
          onPress={handleCancel}
          className="w-10 h-10 items-center justify-center rounded-full hover:bg-primary/5"
        >
          <IconSymbol name="chevron.left" size={24} color="#3B3030" />
        </Pressable>
        <Typography
          variation="h3"
          style={{ color: "#0f172a", fontWeight: "700", flex: 1 }}
        >
          Change Password
        </Typography>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* OAuth-Only User Message */}
          {!canChangePassword && (
            <View className="px-6 py-8">
              <View className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <View className="flex-row gap-3 mb-4">
                  <IconSymbol
                    name="info.circle.fill"
                    size={24}
                    color="#3B82F6"
                  />
                  <Typography
                    variation="h3"
                    className="font-semibold text-blue-900 flex-1"
                  >
                    Password Management
                  </Typography>
                </View>
                <Typography variation="body-sm" className="text-blue-800 mb-4">
                  Your account is secured with{" "}
                  <Typography variation="body-sm" className="font-semibold">
                    {authProvider === "google"
                      ? "Google Sign-In"
                      : authProvider === "apple"
                        ? "Apple Sign-In"
                        : "Social Login"}
                  </Typography>
                  . Your password is managed by{" "}
                  {authProvider === "google"
                    ? "Google"
                    : authProvider === "apple"
                      ? "Apple"
                      : "your provider"}{" "}
                  to keep your account secure.
                </Typography>
                <Typography variation="body-sm" className="text-blue-800 mb-6">
                  To change your password or security settings, please visit
                  your{" "}
                  {authProvider === "google"
                    ? "Google Account"
                    : authProvider === "apple"
                      ? "Apple Account"
                      : "account provider"}{" "}
                  settings.
                </Typography>

                <Button
                  label="Go Back"
                  variant="primary"
                  fullWidth
                  onPress={() => router.back()}
                />
              </View>
            </View>
          )}

          {/* Change Password Form (Only for email users) */}
          {canChangePassword && (
            <>
              {/* Content */}
              <View className="px-6 py-8">
                {/* Title Section */}
                <View className="mb-8">
                  <Typography
                    variation="h2"
                    className="font-heading-bold text-2xl mb-2"
                  >
                    Secure your account
                  </Typography>
                  <Typography variation="body" className="text-slate-500">
                    Update your password to keep your ThriftVerse profile safe.
                  </Typography>
                </View>

                {/* Form Fields */}
                <View className="gap-6">
                  {/* Current Password */}
                  <View>
                    <RHFInput
                      control={control}
                      name="currentPassword"
                      label="Current Password"
                      placeholder="Enter current password"
                      secureTextEntry={!showCurrentPassword}
                      rightIcon={
                        <Pressable
                          onPress={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="p-2"
                        >
                          <IconSymbol
                            name={
                              showCurrentPassword
                                ? "eye.fill"
                                : "eye.slash.fill"
                            }
                            size={20}
                            color="#9CA3AF"
                          />
                        </Pressable>
                      }
                    />
                  </View>

                  {/* New Password */}
                  <View>
                    <RHFInput
                      control={control}
                      name="newPassword"
                      label="New Password"
                      placeholder="Min. 8 characters"
                      secureTextEntry={!showNewPassword}
                      rightIcon={
                        <Pressable
                          onPress={() => setShowNewPassword(!showNewPassword)}
                          className="p-2"
                        >
                          <IconSymbol
                            name={
                              showNewPassword ? "eye.fill" : "eye.slash.fill"
                            }
                            size={20}
                            color="#9CA3AF"
                          />
                        </Pressable>
                      }
                    />
                  </View>

                  {/* Confirm Password */}
                  <View>
                    <RHFInput
                      control={control}
                      name="confirmPassword"
                      label="Confirm New Password"
                      placeholder="Repeat your new password"
                      secureTextEntry={!showConfirmPassword}
                      rightIcon={
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="p-2"
                        >
                          <IconSymbol
                            name={
                              showConfirmPassword
                                ? "eye.fill"
                                : "eye.slash.fill"
                            }
                            size={20}
                            color="#9CA3AF"
                          />
                        </Pressable>
                      }
                    />
                  </View>

                  {/* Security Requirements Checklist */}
                  <View className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                    <Typography
                      variation="caption"
                      className="uppercase font-bold tracking-widest text-primary/40 mb-4"
                    >
                      Security Requirements
                    </Typography>

                    <View className="gap-3">
                      <RequirementItem
                        met={passwordRequirements.hasMinLength}
                        label="At least 8 characters long"
                      />
                      <RequirementItem
                        met={passwordRequirements.hasNumber}
                        label="Includes at least one number"
                      />
                      <RequirementItem
                        met={passwordRequirements.hasSpecialChar}
                        label="Includes a special character (@, $, !)"
                      />
                      <RequirementItem
                        met={passwordsMatch}
                        label="Passwords match"
                      />
                    </View>
                  </View>

                  {/* Error Message - Show only after submission */}
                  {(errors.currentPassword ||
                    errors.newPassword ||
                    errors.confirmPassword) && (
                    <View className="bg-status-error/10 rounded-xl p-4 border border-status-error/20">
                      <Typography
                        variation="body-sm"
                        className="text-status-error"
                      >
                        {errors.currentPassword?.message ||
                          errors.newPassword?.message ||
                          errors.confirmPassword?.message}
                      </Typography>
                    </View>
                  )}
                </View>

                {/* API Error Message - Show above buttons */}
                {apiError && (
                  <View className="bg-red-50 rounded-xl p-4 border border-red-200 mt-6">
                    <View className="flex-row items-start gap-3">
                      <IconSymbol
                        name="exclamationmark.circle.fill"
                        size={20}
                        color="#DC2626"
                      />
                      <Typography
                        variation="body-sm"
                        className="text-red-700 flex-1"
                      >
                        {apiError}
                      </Typography>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="gap-3 mt-8">
                  <Button
                    label={loading ? "Updating password..." : "Update Password"}
                    variant="primary"
                    fullWidth
                    onPress={handleSubmit(onSubmit)}
                    isLoading={loading}
                    disabled={!isValid || loading}
                  />

                  <Button
                    label="Cancel"
                    variant="secondary"
                    fullWidth
                    onPress={handleCancel}
                    disabled={loading}
                  />
                </View>

                {/* Footer Text */}
                <Typography
                  variation="caption"
                  className="text-slate-500 text-center mt-6"
                >
                  Your password will be updated securely.
                </Typography>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
