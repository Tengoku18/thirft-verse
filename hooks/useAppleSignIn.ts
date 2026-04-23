import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";

interface UseAppleSignInReturn {
  handleAppleSignIn: () => Promise<void>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
}

/**
 * Custom hook for Apple sign-in logic
 * Encapsulates authentication flow, error handling, and navigation
 */
export const useAppleSignIn = (): UseAppleSignInReturn => {
  const router = useRouter();
  const { signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAppleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const { error: authError } = await signInWithApple();

      if (authError) {
        if (authError.message === "Sign in was cancelled") {
          setIsLoading(false);
          return;
        }
        setError(
          authError.message || "Apple sign in failed. Please try again.",
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.replace("/");
    } catch (error) {
      console.error("Unexpected Apple sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError("");
  };

  return {
    handleAppleSignIn,
    isLoading,
    error,
    clearError,
  };
};
