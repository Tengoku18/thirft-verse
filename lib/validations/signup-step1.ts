import * as yup from "yup";

/**
 * Validation schema for Step 1: User Details
 * Fields: name, email, username, address, password, confirmPassword
 */
export const userDetailsSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),

  username: yup
    .string()
    .trim()
    .lowercase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    )
    .required("Username is required"),

  address: yup
    .string()
    .trim()
    .min(10, "Please enter a complete address (at least 10 characters)")
    .max(200, "Address must be less than 200 characters")
    .matches(
      /^[a-zA-Z0-9\s,.\-/()#']+$/,
      "Address can only contain letters, numbers, and common punctuation (,./-#')"
    )
    .test(
      "has-letters",
      "Address must contain at least some letters",
      (value) => !!value && /[a-zA-Z]/.test(value)
    )
    .test(
      "has-location",
      "Please include area/street name and city (e.g., Thamel, Kathmandu)",
      (value) => {
        if (!value) return false;
        // Check if address has at least 2 words (area + city)
        const words = value.trim().split(/\s+/);
        return words.length >= 2;
      }
    )
    .required("Address is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  acceptedTerms: yup
    .boolean()
    .oneOf([true], "You must accept the Terms & Conditions")
    .required("You must accept the Terms & Conditions"),
});

// TypeScript type from schema
export type UserDetailsFormData = yup.InferType<typeof userDetailsSchema>;
