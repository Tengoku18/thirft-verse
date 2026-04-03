import BackIcon from "@/components/icons/BackIcon";
import ForgotIcon from "@/components/icons/ForgotIcon";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input/Input";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { checkEmailExists, getUserAuthMethod } from "@/lib/database-helpers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { resetPasswordForEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const onSubmit = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const emailCheck = await checkEmailExists(email);

      if (!emailCheck.exists) {
        setEmailError("No account found with this email");
        setLoading(false);
        return;
      }

      const authMethod = await getUserAuthMethod(email);

      if (authMethod === "google") {
        setIsGoogleUser(true);
        setLoading(false);
        return;
      }

      const { error } = await resetPasswordForEmail(email);

      if (error) {
        toast.error(error.message || "Failed to send code");
        setLoading(false);
        return;
      }

      toast.success("Code sent to your email!");
      router.push({
        pathname: "/(auth)/forgot-password-verification",
        params: { email },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || "Google sign in failed");
      } else {
        router.replace("/(tabs)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Forgot Password"
      onBack={() => router.back()}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-8">
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-brand-badge rounded-full items-center justify-center">
                <ForgotIcon />
              </View>
            </View>

            <View className="mb-8">
              <Typography
                variation="h1"
                className="text-center font-sans-bold text-3xl mb-4"
              >
                Reset Your Password
              </Typography>
              <Typography
                variation="body"
                className="text-center text-slate-600"
              >
                Enter your email address and we&apos;ll send you a verification
                code.
              </Typography>
            </View>

            <View className="mb-8">
              <Input
                label="EMAIL ADDRESS"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="hello@thriftverse.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                errorMessage={emailError}
                variant={emailError ? "error" : "default"}
              />
            </View>
          </View>

          <View className="px-6 py-6 gap-4">
            <Button
              label="Send Code"
              variant="primary"
              onPress={onSubmit}
              isLoading={loading}
              disabled={loading || !email.trim()}
              fullWidth
            />
            <Pressable
              onPress={() => router.back()}
              className="items-center py-3 gap-2 flex-row justify-center"
            >
              <BackIcon width={16} height={16} color={"#475569"} />
              <Typography variation="body" className="text-slate-600">
                Back to Sign In
              </Typography>
            </Pressable>
          </View>
        </ScrollView>

        <Modal
          visible={isGoogleUser}
          transparent
          animationType="fade"
          onRequestClose={() => setIsGoogleUser(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl mx-6 p-6 gap-6">
              <View className="items-center">
                <View className="w-16 h-16 bg-brand-badge rounded-full items-center justify-center">
                  <Typography variation="h1" className="text-2xl">
                    🔒
                  </Typography>
                </View>
              </View>

              <View className="gap-3">
                <Typography
                  variation="h1"
                  className="text-center font-sans-bold text-2xl"
                >
                  Google Account Detected
                </Typography>
                <Typography
                  variation="body"
                  className="text-center text-slate-600"
                >
                  This email is connected to a Google account. Please sign in
                  with Google to reset your password.
                </Typography>
              </View>

              <View className="gap-3">
                <Button
                  label="Sign In with Google"
                  variant="primary"
                  onPress={handleGoogleSignIn}
                  isLoading={loading}
                  disabled={loading}
                  fullWidth
                />
                <Pressable
                  onPress={() => {
                    setIsGoogleUser(false);
                    setEmail("");
                    setEmailError("");
                  }}
                  className="py-3 items-center"
                >
                  <Typography variation="body-sm" className="text-slate-600">
                    Try Different Email
                  </Typography>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </AuthScreenLayout>
  );
}
