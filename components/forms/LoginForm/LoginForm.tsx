import DoorInIcon from "@/components/icons/DoorInIcon";
import MailIcon from "@/components/icons/MailIcon";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormData, loginSchema } from "@/lib/validations/login";
import { useAppDispatch } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { RHFInput } from "../ReactHookForm";
import { RHFCheckbox } from "../ReactHookForm/RHFCheckbox";

const SAVED_EMAIL_KEY = "@thriftverse:saved_email";
const REMEMBER_ME_KEY = "@thriftverse:remember_me";

interface LoginFormProps {
  onLoginSuccess?: () => void | Promise<void>;
  isLoading?: boolean;
}

/**
 * LoginForm Component
 *
 * A complete, production-ready login form with:
 * - React Hook Form validation using Yup schema
 * - Email & password validation
 * - Password visibility toggle using MailIcon & EyeIcon
 * - Remember me checkbox
 * - Real-time validation feedback
 * - Loading state management
 * - Integration with AuthContext for actual authentication
 * - Forgot password link
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onLoginSuccess={() => router.push("/(tabs)/")}
 *   isLoading={false}
 * />
 * ```
 */
export function LoginForm({
  onLoginSuccess,
  isLoading = false,
}: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(isLoading);
  const [formError, setFormError] = useState<string>("");

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Load saved email and remember me preference on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [savedEmail, rememberMeEnabled] = await Promise.all([
          AsyncStorage.getItem(SAVED_EMAIL_KEY),
          AsyncStorage.getItem(REMEMBER_ME_KEY),
        ]);

        if (savedEmail) {
          setValue("email", savedEmail);
          console.log("✅ Loaded saved email:", savedEmail);
        }

        // Load remember me preference - defaults to false if not set
        if (rememberMeEnabled === "true") {
          setValue("rememberMe", true);
          console.log("✅ Remember me was previously enabled");
        } else if (rememberMeEnabled === "false") {
          setValue("rememberMe", false);
          console.log("✅ Remember me was previously disabled");
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    };

    loadSavedData();
  }, [setValue]);

  /**
   * Handle form submission with actual authentication
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      setLoading(true);
      setFormError("");

      // Call actual authentication API
      const { error } = await signIn(
        data.email,
        data.password,
        data.rememberMe,
      );

      if (error) {
        const errorMsg = error.message?.toLowerCase() || "";

        // Check if email is not confirmed
        if (
          errorMsg.includes("email not confirmed") ||
          errorMsg.includes("email_not_confirmed")
        ) {
          setFormError(
            "Please confirm your email before logging in. Check your email for the confirmation link.",
          );
          setLoading(false);
          return;
        }

        // Check if user doesn't exist
        if (
          errorMsg.includes("invalid login credentials") ||
          errorMsg.includes("invalid_credentials") ||
          errorMsg.includes("user not found")
        ) {
          setFormError(
            "Account not found. Please sign up to create an account.",
          );
          setLoading(false);
          return;
        }

        // Generic error
        setFormError(error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Success - call the callback
      setLoading(false);
      await onLoginSuccess?.();
    } catch (error: any) {
      console.error("Login form error:", error);
      setFormError(
        error.message || "An unexpected error occurred. Please try again.",
      );
      setLoading(false);
    }
  };

  const EmailIcon = (): React.ReactElement => (
    <View className="p-1">
      <MailIcon width={20} height={20} />
    </View>
  );

  return (
    <View className="gap-4">
      {/* Email Input Field - Validation via Yup schema */}
      <RHFInput
        control={control}
        name="email"
        label="Email Address"
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
        rightIcon={<EmailIcon />}
      />

      {/* Password Input Field */}
      <RHFInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        editable={!loading}
        autoCapitalize="none"
      />

      {/* Remember Me & Forgot Password Row */}
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1">
          <RHFCheckbox
            control={control}
            name="rememberMe"
            label="Remember me"
            labelClassName="text-slate-600 dark:text-slate-400 font-sans-regular text-sm"
          />
        </View>

        <Link
          label="Forgot Password?"
          href="/(auth)/forgot-password"
          variant="primary"
          typographyVariation="body-sm"
          className="text-brand-tan"
          underline={false}
        />
      </View>

      {/* Form Error Display */}
      {formError && (
        <View className="rounded-2xl border border-status-error bg-status-error-bg p-3">
          <Typography variation="body-sm" className="text-status-error">
            {formError}
          </Typography>
        </View>
      )}

      {/* Sign In Button */}
      <View className="mt-1">
        <Button
          label="Sign In"
          isLoading={loading}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
          fullWidth
          iconPosition="right"
          icon={<DoorInIcon width={20} height={20} />}
        />
      </View>
    </View>
  );
}

export default LoginForm;
