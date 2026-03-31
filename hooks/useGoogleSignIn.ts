import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
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
  const router = useRouter();
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
      router.replace("/");
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
