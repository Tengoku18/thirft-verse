import * as yup from "yup";

/**
 * Validation schema for Step 4: Store/Creator Profile Details
 * Fields: username, bio, district, instagramHandle (optional username only), storeName, address
 */
export const signupStep4Schema = yup.object({
  username: yup
    .string()
    .trim()
    .lowercase()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .matches(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, dots, and underscores",
    )
    .required("Username is required"),

  bio: yup
    .string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters")
    .required("Bio is required"),

  district: yup.string().trim().required("Please select your district"),

  instagramHandle: yup
    .string()
    .trim()
    .lowercase()
    .matches(
      /^[a-zA-Z0-9._-]*$/,
      "Instagram handle can only contain letters, numbers, dots, underscores, and hyphens",
    )
    .optional()
    .nullable(),

  storeName: yup
    .string()
    .trim()
    .max(100, "Store name must be less than 100 characters")
    .optional()
    .nullable(),

  address: yup
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address must be less than 255 characters")
    .required("Please enter your address"),
});

// TypeScript type from schema
export type SignupStep4FormData = yup.InferType<typeof signupStep4Schema>;
