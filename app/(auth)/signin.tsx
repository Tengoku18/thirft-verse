<<<<<<< HEAD
import { OnboardingCard } from "@/components/_atomic/OnboardingCard";
import { LoginForm } from "@/components/forms/LoginForm";
import { SocialAuthButton } from "@/components/forms/SocialAuthButton";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { CompleteYourProfileModal } from "@/components/modals/CompleteYourProfileModal";
import { Link } from "@/components/ui/Link";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAppleSignIn } from "@/hooks/useAppleSignIn";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
=======
import { AppleSignInButton } from "@/components/atoms/AppleSignInButton";
import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import {
  BodyBoldText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { LOGO_USAGE } from "@/constants/logos";
import { useAuth } from "@/contexts/AuthContext";
import { persistSignupState, setCurrentStep, setFormData } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useRouter } from "expo-router";
>>>>>>> 253640e330315f4769e701bd44e1cbce5cedcaff
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { ImageSourcePropType, Platform, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

/**
 * Carousel slide data for onboarding
 */
interface CarouselSlide {
  id: string;
  image: ImageSourcePropType;
  tag: string;
  title: string;
  subtitle: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "1",
    image: require("@/assets/auth/signin/Image1.png"),
    tag: "VINTAGE AESTHETIC",
    title: "Find Your Unique Style",
    subtitle: "Browse curated vintage collections",
  },
  {
    id: "2",
    image: require("@/assets/auth/signin/Image1.png"),
    tag: "SUSTAINABLE FASHION",
    title: "Shop Responsibly",
    subtitle: "Support eco-friendly thrifting",
  },
  {
    id: "3",
    image: require("@/assets/auth/signin/Image1.png"),
    tag: "COMMUNITY DRIVEN",
    title: "Join Our Community",
    subtitle: "Discover and share unique finds",
  },
];

export default function SignInScreen() {
  const router = useRouter();
<<<<<<< HEAD
=======
  const dispatch = useAppDispatch();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

>>>>>>> 253640e330315f4769e701bd44e1cbce5cedcaff
  const {
    handleGoogleSignIn,
    isLoading: googleLoading,
    error: googleError,
  } = useGoogleSignIn();
  const {
    handleAppleSignIn,
    isLoading: appleLoading,
    error: appleError,
  } = useAppleSignIn();
  const [loginError, setLoginError] = useState("");
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [nextSignupStep, setNextSignupStep] = useState(2);

  const displayError = loginError || googleError || appleError;

  const handleLoginSuccess = async (): Promise<void> => {
    setLoginError("");

    try {
      // Check user's signup status
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch user's profile to check signup progress
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("signup_step, auth_completed")
          .eq("id", user.id)
          .single();

<<<<<<< HEAD
        if (profileError || !profile) {
          console.error("Failed to fetch profile:", profileError);
          // If we can't check status, redirect to home
          router.replace("/(tabs)/home");
          return;
        }

        // Check if signup is complete
        const isSignupComplete =
          (profile.signup_step ?? 0) >= 6 && profile.auth_completed === true;

        if (!isSignupComplete) {
          // Show "Complete Your Profile" modal
          const nextStep = Math.min(
            6,
            Math.max(2, (profile.signup_step ?? 1) + 1),
          );
          setNextSignupStep(nextStep);
          setShowCompleteProfileModal(true);
          console.log(
            "[SignIn] Signup incomplete, showing modal. Next step:",
            nextStep,
=======
        // Check if the error is "Email not confirmed"
        if (
          errorMsg.includes("email not confirmed") ||
          errorMsg.includes("email_not_confirmed")
        ) {
          // User exists but email is not verified
          // Save email to Redux and redirect to verification screen
          dispatch(
            setFormData({
              email: data.email,
              password: data.password,
              name: "",
              username: "",
              address: "",
              profileImage: null,
            }),
          );
          dispatch(setCurrentStep(2));
          await dispatch(
            persistSignupState({
              currentStep: 2,
              formData: {
                email: data.email,
                password: data.password,
                name: "",
                username: "",
                address: "",
                profileImage: null,
              },
              isSignupInProgress: true,
            }),
          );

          setLoading(false);
          router.replace("/(auth)/signup-step2");
          return;
        }

        // Check if user doesn't exist
        if (
          errorMsg.includes("invalid login credentials") ||
          errorMsg.includes("invalid_credentials") ||
          errorMsg.includes("user not found")
        ) {
          setErrorMessage(
            "Account not found. Please sign up to create an account.",
>>>>>>> 253640e330315f4769e701bd44e1cbce5cedcaff
          );
          return;
        }

        // Signup is complete, navigate to home
        console.log("[SignIn] Signup complete, navigating to home");
        router.replace("/(tabs)/home");
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("[SignIn] Error checking signup status:", error);
      // On error, redirect to home anyway
      router.replace("/(tabs)/home");
=======
      console.error("Unexpected sign in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        if (error.message === "Sign in was cancelled") {
          setGoogleLoading(false);
          return;
        }
        setErrorMessage(
          error.message || "Google sign in failed. Please try again.",
        );
        setGoogleLoading(false);
        return;
      }

      // Success - route guard in app/index.tsx handles navigation
      setGoogleLoading(false);
      router.replace("/");
    } catch (error) {
      console.error("Unexpected Google sign in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setGoogleLoading(false);
>>>>>>> 253640e330315f4769e701bd44e1cbce5cedcaff
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signInWithApple();

      if (error) {
        if (error.message === "Sign in was cancelled") {
          setAppleLoading(false);
          return;
        }
        setErrorMessage(
          error.message || "Apple sign in failed. Please try again.",
        );
        setAppleLoading(false);
        return;
      }

      // Success - route guard in app/index.tsx handles navigation
      setAppleLoading(false);
      router.replace("/");
    } catch (error) {
      console.error("Unexpected Apple sign in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setAppleLoading(false);
    }
  };

  return (
    <AuthScreenLayout statusBarStyle="dark-content">
      {/* ============================================
          ONBOARDING CARD SECTION
          ============================================ */}
      <View className="px-6 pt-8 pb-2">
        <OnboardingCard
          image={CAROUSEL_SLIDES[0].image}
          tag={CAROUSEL_SLIDES[0].tag}
          title={CAROUSEL_SLIDES[0].title}
          subtitle={CAROUSEL_SLIDES[0].subtitle}
        />
      </View>

      {/* ============================================
          WELCOME SECTION
          ============================================ */}
      <View className="px-6 mt-8 mb-8 items-center gap-2">
        <Typography variation="h1" className="text-brand-espresso text-center">
          Welcome Back
        </Typography>
        <Typography
          variation="body-sm"
          className="text-slate-500 dark:text-slate-400 text-center"
        >
          Sign in to explore curated thrift finds
        </Typography>
      </View>

      {/* ============================================
          LOGIN FORM SECTION - Uses LoginForm Component
          ============================================ */}
      <View className="px-6 flex-1 gap-4">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </View>

<<<<<<< HEAD
      {/* ============================================
          ERROR MESSAGE DISPLAY
          ============================================ */}
      {displayError && (
        <View className="mx-6 mb-4 p-4 bg-status-error-bg rounded-2xl border border-status-error">
          <Typography variation="body-sm" className="text-status-error">
            {displayError}
          </Typography>
=======
            {/* Forgot Password Link */}
            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="items-end mb-8">
                <BodySemiboldText>Forgot Password?</BodySemiboldText>
              </TouchableOpacity>
            </Link>

            {/* Error message */}
            {errorMessage && (
              <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <BodyRegularText style={{ color: "#EF4444", fontSize: 14 }}>
                  {errorMessage}
                </BodyRegularText>
              </View>
            )}

            {/* Sign In Button */}
            <FormButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={googleLoading || appleLoading}
              variant="primary"
            />

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
              <BodyRegularText
                style={{ color: "#9CA3AF", marginHorizontal: 16, fontSize: 14 }}
              >
                or
              </BodyRegularText>
              <View className="flex-1 h-[1px] bg-[#E5E7EB]" />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              className="h-[58px] rounded-2xl justify-center items-center px-6 w-full flex-row border-[2px] border-[#E5E7EB] bg-white mb-3"
              onPress={handleGoogleSignIn}
              disabled={loading || googleLoading || appleLoading}
              activeOpacity={0.85}
              style={googleLoading ? { opacity: 0.7 } : undefined}
            >
              {googleLoading ? (
                <ActivityIndicator color="#3B2F2F" size="small" />
              ) : (
                <>
                  <Image
                    source={require("@/assets/images/google-icon.png")}
                    style={{ width: 20, height: 20, marginRight: 12 }}
                    resizeMode="contain"
                  />
                  <BodyBoldText
                    style={{
                      color: "#3B2F2F",
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    Continue with Google
                  </BodyBoldText>
                </>
              )}
            </TouchableOpacity>

            {/* Continue with Apple (iOS only) */}
            {Platform.OS === "ios" && (
              <View style={{ marginBottom: 16 }}>
                <AppleSignInButton onPress={handleAppleSignIn} />
              </View>
            )}

            {/* Sign Up Link */}
            <View className="mt-8">
              <View className="flex-row justify-center items-center">
                <BodyRegularText style={{ color: "#6B7280" }}>
                  Don&apos;t have an account?{" "}
                </BodyRegularText>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <BodyBoldText>Sign Up</BodyBoldText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* Policy Links */}
          <View className="mt-auto pt-8 pb-2">
            <View className="flex-row justify-center items-center flex-wrap gap-2">
              <Link href="https://www.thriftverse.shop/privacy" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Privacy Policy
                  </CaptionText>
                </TouchableOpacity>
              </Link>
              <CaptionText style={{ color: "#9CA3AF" }}>•</CaptionText>
              <Link href="https://www.thriftverse.shop/terms" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Terms & Conditions
                  </CaptionText>
                </TouchableOpacity>
              </Link>
              <CaptionText style={{ color: "#9CA3AF" }}>•</CaptionText>
              <Link href="https://www.thriftverse.shop/cookies" asChild>
                <TouchableOpacity>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Cookie Policy
                  </CaptionText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Bottom Branding - Subtle */}
          <View className="pt-4 pb-4">
            <CaptionText className="text-center" style={{ color: "#9CA3AF" }}>
              ThriftVerse • Sustainable Fashion Marketplace
            </CaptionText>
          </View>
>>>>>>> 253640e330315f4769e701bd44e1cbce5cedcaff
        </View>
      )}

      {/* ============================================
          SOCIAL AUTH DIVIDER
          ============================================ */}
      <View className="flex-row items-center mx-6 my-8 gap-3">
        <View className="flex-1 h-px bg-slate-300" />
        <Typography
          variation="body-xs"
          className="text-slate-400  font-sans-semibold uppercase"
        >
          Or Continue With
        </Typography>
        <View className="flex-1 h-px bg-slate-300" />
      </View>

      {/* ============================================
          SOCIAL AUTHENTICATION BUTTONS
          ============================================ */}
      <View className="px-6 gap-3 mb-4">
        {/* Google Sign In Button */}
        <SocialAuthButton
          onPress={handleGoogleSignIn}
          label="Continue with Google"
          icon={require("@/assets/auth/signin/google.png")}
          disabled={googleLoading || appleLoading}
          isLoading={googleLoading}
        />

        {/* Apple Sign In Button (iOS only) */}
        {Platform.OS === "ios" && (
          <SocialAuthButton
            onPress={handleAppleSignIn}
            label="Continue with Apple"
            icon={require("@/assets/auth/signin/apple.png")}
            disabled={googleLoading || appleLoading}
            isLoading={appleLoading}
          />
        )}
      </View>

      {/* ============================================
          SIGN UP LINK
          ============================================ */}
      <View className="flex-row items-center justify-center px-6 py-8 gap-1">
        <Typography
          variation="body"
          className="text-slate-600 dark:text-slate-400"
        >
          Don&apos;t have an account?
        </Typography>
        <Link
          label="Sign Up"
          href="/(auth)/signup"
          variant="primary"
          underline={false}
          className="font-sans-bold text-brand-tan"
        />
      </View>

      {/* ============================================
          FOOTER POLICY LINKS
          ============================================ */}
      <View className="pt-2 pb-2 px-6">
        <View className="flex-row justify-center items-center flex-wrap gap-2">
          <Link
            label="Privacy Policy"
            href="https://www.thriftverse.shop/privacy"
            type="external"
            variant="secondary"
            underline={false}
            className="text-slate-500 dark:text-slate-400"
          />
          <Typography
            variation="caption"
            className="text-slate-300 dark:text-slate-700"
          >
            •
          </Typography>
          <Link
            label="Terms & Conditions"
            href="https://www.thriftverse.shop/terms"
            type="external"
            variant="secondary"
            underline={false}
            className="text-slate-500 dark:text-slate-400"
          />
          <Typography
            variation="caption"
            className="text-slate-300 dark:text-slate-700"
          >
            •
          </Typography>
          <Link
            label="Cookie Policy"
            href="https://www.thriftverse.shop/cookies"
            type="external"
            variant="secondary"
            underline={false}
            className="text-slate-500 dark:text-slate-400"
          />
        </View>
      </View>

      {/* ============================================
          BRANDING FOOTER
          ============================================ */}
      <View className="py-2 pb-4">
        <Typography
          variation="caption"
          className="text-center text-slate-500 dark:text-slate-400"
        >
          ThriftVerse • Sustainable Fashion Marketplace
        </Typography>
      </View>

      {/* ============================================
          COMPLETE YOUR PROFILE MODAL
          ============================================ */}
      <CompleteYourProfileModal
        visible={showCompleteProfileModal}
        nextStep={nextSignupStep}
        onClose={() => setShowCompleteProfileModal(false)}
      />
    </AuthScreenLayout>
  );
}
