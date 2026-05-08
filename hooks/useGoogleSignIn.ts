import { useAuth } from "@/contexts/AuthContext";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useState } from "react";

interface UseGoogleSignInReturn {
  handleGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Custom hook for Google sign-in logic
 * Encapsulates authentication flow, error handling, and navigation
 */
export const useGoogleSignIn = (): UseGoogleSignInReturn => {
  const navigation = useNavigation();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const { error: authError } = await signInWithGoogle();

      if (authError) {
        if (authError.message === "Sign in was cancelled") {
          setIsLoading(false);
          return;
        }
        setError(
          authError.message || "Google sign in failed. Please try again.",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "index" }] }),
      );
    } catch (error) {
      console.error("Unexpected Google sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError("");
  };

  return {
    handleGoogleSignIn,
    isLoading,
    error,
    clearError,
  };
};
