import { SignupFormData } from "@/store/signupSlice";
import { useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";

/**
 * Hook to restore form data from Redux when navigating back through signup steps
 *
 * Usage:
 * const { setValue } = useForm<StepFormData>(...);
 * useSignupFormRestore(setValue, signupState.formData);
 *
 * This ensures that when users navigate back, their previously entered data is restored
 */
export function useSignupFormRestore(
  setValue: UseFormSetValue<any>,
  formData: SignupFormData,
) {
  useEffect(() => {
    // Restore form data from Redux when component mounts
    // This handles the back button case where user navigates back to a previous step
    if (formData && Object.keys(formData).length > 0) {
      // Populate each field from Redux
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          setValue(key as any, value, { shouldDirty: false });
        }
      });
    }
  }, [formData, setValue]);
}
