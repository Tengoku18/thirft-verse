import { loadSignupState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      await dispatch(loadSignupState());
      setIsLoading(false);
    };
    loadState();
  }, [dispatch]);

  if (isLoading || signupState.loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3B2F2F" />
      </View>
    );
  }

  // Redirect based on current step
  // if (signupState.isSignupInProgress) {
  //   switch (signupState.currentStep) {
  //     // case 2:
  //     //   return <Redirect href="/(auth)/signup-step2" />;
  //     // case 3:
  //     //   return <Redirect href="/(auth)/signup-step3" />;
  //     // case 4:
  //     //   // Signup completed, go to home
  //     //   return <Redirect href="/(tabs)" />;
  //     default:
  //       return <Redirect href="/(auth)/signup-step1" />;
  //   }
  // }

  // Default: start from step 1
  return <Redirect href="/(auth)/signup-step1" />;
}
