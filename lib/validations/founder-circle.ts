import * as yup from "yup";

/**
 * Validation schema for Founder Circle verification
 */
export const founderCircleSchema = yup.object({
  verificationCode: yup
    .string()
    .required("Verification code is required")
    .matches(/^\d{8}$/, "Please enter a valid 8-digit code")
    .defined(),
});

export type FounderCircleFormData = yup.InferType<typeof founderCircleSchema>;
