import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const signupState = useAppSelector((state) => state.signup);

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
