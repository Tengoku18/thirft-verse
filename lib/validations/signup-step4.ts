import * as yup from "yup";

// Reserved subdomains that cannot be used as store usernames.
// These are claimed by infra, DNS, or common web services.
const RESERVED_USERNAMES = new Set([
  "www", "api", "admin", "app", "mail", "smtp", "imap", "ftp",
  "shop", "store", "help", "support", "blog", "dev", "staging",
  "test", "dashboard", "cdn", "static", "assets", "auth", "login",
  "signup", "thriftverse",
]);

// DNS label rules (RFC 1035):
// - Lowercase alphanumerics and hyphens only
// - Must start and end with alphanumeric (no leading/trailing hyphen)
// - Max 63 characters
const DNS_LABEL_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

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
    .max(63, "Username must be 63 characters or less")
    .matches(
      DNS_LABEL_REGEX,
      "Username can only contain lowercase letters, numbers, and hyphens — no underscores, dots, or special characters. It cannot start or end with a hyphen.",
    )
    .test(
      "not-reserved",
      "This username is reserved and cannot be used",
      (value) => !RESERVED_USERNAMES.has(value ?? ""),
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
