import * as yup from "yup";

/**
 * Password validation schema
 * Requirements:
 * - Minimum 8 characters
 * - At least one number
 * - At least one special character (@, $, !, %, *, ?, &)
 */
const passwordValidation = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .matches(/[0-9]/, "Password must include at least one number (0-9)")
  .matches(
    /[@$!%*?&]/,
    "Password must include at least one special character (@, $, !, %, *, ?, &)",
  )
  .required("New password is required");

/**
 * Change Password Validation Schema
 *
 * @example
 * ```tsx
 * const { control, handleSubmit } = useForm({
 *   resolver: yupResolver(changePasswordSchema),
 *   defaultValues: {
 *     currentPassword: "",
 *     newPassword: "",
 *     confirmPassword: "",
 *   }
 * });
 * ```
 */
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .trim()
    .min(1, "Current password is required")
    .required("Current password is required"),

  newPassword: passwordValidation.test(
    "different-from-current",
    "New password must be different from current password",
    function (value) {
      const { currentPassword } = this.parent;
      if (!value || !currentPassword) return true;
      return value !== currentPassword;
    },
  ),

  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;

/**
 * Password strength requirements validator
 * Returns an object with validation status for each requirement
 */
export function validatePasswordRequirements(password: string) {
  return {
    hasMinLength: password.length >= 8,
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };
}

/**
 * Check if all password requirements are met
 */
export function isPasswordStrong(password: string): boolean {
  const requirements = validatePasswordRequirements(password);
  return Object.values(requirements).every(Boolean);
}
