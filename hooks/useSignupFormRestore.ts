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
  formData: SignupFormData | any,
  stepName?: string,
) {
  useEffect(() => {
    if (!formData) {
      console.log(
        `[useSignupFormRestore${stepName ? ` - ${stepName}` : ""}] No data object provided`,
      );
      return;
    }

    // Build object of values that exist and should be restored
    const valuesToRestore: Record<string, any> = {};
    let hasAnyValue = false;

    Object.entries(formData).forEach(([key, value]) => {
      // Include any non-empty value
      if (value !== undefined && value !== null && value !== "") {
        valuesToRestore[key] = value;
        hasAnyValue = true;
      }
    });

    if (!hasAnyValue) {
      console.log(
        `[useSignupFormRestore${stepName ? ` - ${stepName}` : ""}] No non-empty values found`,
      );
      return;
    }

    console.log(
      `[useSignupFormRestore${stepName ? ` - ${stepName}` : ""}] ✅ Restoring ${Object.keys(valuesToRestore).length} fields`,
    );

    // Restore each value
    Object.entries(valuesToRestore).forEach(([key, value]) => {
      const displayValue =
        String(value).substring(0, 50) +
        (String(value).length > 50 ? "..." : "");
      console.log(
        `[useSignupFormRestore${stepName ? ` - ${stepName}` : ""}]   └─ "${key}" = "${displayValue}"`,
      );
      try {
        setValue(key as any, value, {
          shouldDirty: false,
          shouldValidate: false,
        });
      } catch (err) {
        console.error(
          `[useSignupFormRestore${stepName ? ` - ${stepName}` : ""}] ❌ Error setting "${key}":`,
          err,
        );
      }
    });
  }, [formData, setValue, stepName]);
}
