import * as yup from "yup";

/**
 * Validation schema for Login Form
 * Fields: email, password, rememberMe
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email address is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  rememberMe: yup.boolean().default(false),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
