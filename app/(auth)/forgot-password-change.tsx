import { InfoBox } from "@/components/atoms/InfoBox";
import CheckMarkCircleIcon from "@/components/icons/CheckMarkCircleIcon";
import ForwardIcon from "@/components/icons/ForwardIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/Input";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import * as yup from "yup";

const passwordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/\d/, "Password must include at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character",
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export type PasswordChangeFormData = yup.InferType<typeof passwordSchema>;

export default function ForgotPasswordChangeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { updatePassword } = useAuth();
  useLocalSearchParams<{ email: string }>();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordChangeFormData>({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const handleUpdatePassword = async (data: PasswordChangeFormData) => {
    setLoading(true);

    try {
      const { error } = await updatePassword(data.newPassword);

      if (error) {
        toast.error(error.message || "Failed to update password");
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Change Password"
      showScrollView={false}
      onBack={handleBack}
    >
      <Stepper title="Create New Password" currentStep={3} totalSteps={3} />

      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-4">
            {/* Header Section */}
            <View className="mb-8">
              <Typography
                variation="h1"
                className="mb-1 font-sans-bold text-slate-900"
              >
                Secure Your Account
              </Typography>
              <Typography variation="body-sm" className="text-slate-600">
                Update your password to keep your ThriftVerse profile safe.
              </Typography>
            </View>

            {/* Error Message */}
            {(errors.newPassword || errors.confirmPassword) && (
              <InfoBox
                message={
                  errors.newPassword?.message ||
                  errors.confirmPassword?.message ||
                  "Please fix errors below"
                }
                type="error"
                className="mb-6"
              />
            )}

            {/* New Password */}
            <View className="mb-6">
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="NEW PASSWORD"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Min. 8 characters with number & special char"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    errorMessage={errors.newPassword?.message}
                    variant={errors.newPassword ? "error" : "default"}
                  />
                )}
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="CONFIRM NEW PASSWORD"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Repeat your new password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    errorMessage={errors.confirmPassword?.message}
                    variant={errors.confirmPassword ? "error" : "default"}
                  />
                )}
              />
            </View>

            {/* Requirements */}
            <View className="bg-slate-50 p-4 rounded-xl gap-3">
              <Typography
                variation="body-sm"
                className="font-sans-semibold text-slate-700"
              >
                PASSWORD REQUIREMENTS
              </Typography>

              <View className="gap-3">
                <RequirementItem
                  met={newPassword.length >= 8}
                  text="At least 8 characters long"
                />
                <RequirementItem
                  met={/\d/.test(newPassword)}
                  text="Includes at least one number"
                />
                <RequirementItem
                  met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)}
                  text="Includes a special character (@ $ ! % ^ & * ...)"
                />
                <RequirementItem
                  met={
                    newPassword === watch("confirmPassword") &&
                    newPassword.length > 0
                  }
                  text="Passwords match"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Update Button - Sticky Bottom */}
        <View className="px-6 py-6">
          <Button
            label="Update Password"
            variant="primary"
            onPress={handleSubmit(handleUpdatePassword)}
            isLoading={loading}
            disabled={loading || !isValid}
            fullWidth
            icon={<ForwardIcon width={20} height={20} />}
            iconPosition="right"
          />
        </View>
      </View>
    </AuthScreenLayout>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      {met ? (
        <View className="w-5 h-5">
          <CheckMarkCircleIcon size={20} color="#22C55E" />
        </View>
      ) : (
        <View className="w-5 h-5 rounded-full bg-slate-300" />
      )}
      <Typography
        variation="body-sm"
        className={met ? "text-slate-700 font-sans-semibold" : "text-slate-500"}
      >
        {text}
      </Typography>
    </View>
  );
}
