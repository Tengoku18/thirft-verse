import * as yup from "yup";

/**
 * Validation schema for Founder Circle verification
 */
export const founderCircleSchema = yup.object({
  verificationCode: yup
    .string()
    .required("Verification code is required")
    .matches(/^[A-Z]{2}-[A-Z0-9]{7}$/, "Enter a valid code (e.g. FC-4DFANQC)")
    .defined(),
});

export type FounderCircleFormData = yup.InferType<typeof founderCircleSchema>;
