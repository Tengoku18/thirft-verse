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

          return;
        }

        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("[SignIn] Error checking signup status:", error);
      // On error, redirect to home anyway
      router.replace("/(tabs)/home");
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

      {/* ============================================
          ERROR MESSAGE DISPLAY
          ============================================ */}
      {displayError && (
        <View className="mx-6 mb-4 p-4 bg-status-error-bg rounded-2xl border border-status-error">
          <Typography variation="body-sm" className="text-status-error">
            {displayError}
          </Typography>
        </View>
      )}

      {/* ============================================
          SOCIAL AUTH DIVIDER
          ============================================ */}
      <View className="flex-row items-center mx-6 my-8 gap-3">
        <View className="flex-1 h-px bg-slate-300" />
        <Typography
          variation="body-xs"
          className="font-sans-semibold uppercase text-black"
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
