import { SocialAuthButton } from "@/components/forms/SocialAuthButton";
import Typography from "@/components/ui/Typography";
import React, { useState } from "react";
import { Alert, View } from "react-native";

/**
 * SocialAuthButton Example/Usage Guide
 *
 * This demonstrates how to use the SocialAuthButton component
 * in different parts of your application.
 */

export function SocialAuthButtonExample() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Your Google sign-in logic here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Google Sign In", "Successfully signed in with Google!");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      // Your Apple sign-in logic here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Apple Sign In", "Successfully signed in with Apple!");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <View className="gap-6 p-6">
      <Typography variation="h3" className="font-bold">
        Social Auth Button Examples
      </Typography>

      {/* Google Sign In Button */}
      <View>
        <Typography variation="body" className="mb-2 font-semibold text-sm">
          Google Sign In
        </Typography>
        <SocialAuthButton
          onPress={handleGoogleSignIn}
          label="Continue with Google"
          icon={require("@/assets/auth/signin/google.png")}
          isLoading={googleLoading}
          disabled={appleLoading}
        />
      </View>

      {/* Apple Sign In Button */}
      <View>
        <Typography variation="body" className="mb-2 font-semibold text-sm">
          Apple Sign In
        </Typography>
        <SocialAuthButton
          onPress={handleAppleSignIn}
          label="Continue with Apple"
          icon={require("@/assets/auth/signin/apple.png")}
          isLoading={appleLoading}
          disabled={googleLoading}
        />
      </View>

      {/* Custom Example */}
      <View>
        <Typography variation="body" className="mb-2 font-semibold text-sm">
          Custom Provider
        </Typography>
        <SocialAuthButton
          onPress={() => Alert.alert("Custom", "Custom auth handler")}
          label="Continue with Custom"
          icon={require("@/assets/auth/signin/google.png")}
        />
      </View>
    </View>
  );
}

export default SocialAuthButtonExample;
