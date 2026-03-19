import { BodyRegularText } from "@/components/Typography";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import { Platform, View } from "react-native";

interface AppleSignInButtonProps {
  onPress: () => void;
}

export function AppleSignInButton({ onPress }: AppleSignInButtonProps) {
  // Only show on iOS - Apple authentication is not natively available on Android
  if (Platform.OS !== "ios") {
    return null;
  }

  // Check if running in Expo Go (development)
  const isExpoGo = Constants.appOwnership === "expo";

  // In Expo Go, Apple Sign-In may fail due to audience mismatch
  // Show a note to guide users
  if (isExpoGo) {
    return (
      <View>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{
            width: "100%",
            height: 52,
            opacity: 0.6,
          }}
          onPress={onPress}
        />
        <BodyRegularText
          style={{
            color: "#9CA3AF",
            fontSize: 12,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Note: Apple Sign-In works best after building with EAS. For testing in
          Expo Go, use Google Sign-In instead.
        </BodyRegularText>
      </View>
    );
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{
        width: "100%",
        height: 52,
      }}
      onPress={onPress}
    />
  );
}
