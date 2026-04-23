import * as yup from "yup";

export const ISSUE_CATEGORIES = [
  { label: "App Bug / Technical Issue", value: "bug" },
  { label: "Order Problem", value: "order" },
  { label: "Payment Issue", value: "payment" },
  { label: "Account Access", value: "account" },
  { label: "Listing / Product Issue", value: "listing" },
  { label: "Shipping Problem", value: "shipping" },
  { label: "Other", value: "other" },
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]["value"];

export const reportIssueSchema = yup.object({
  category: yup
    .string()
    .required("Please select an issue category"),

  description: yup
    .string()
    .required("Please describe the issue")
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
});

export interface ReportIssueFormData {
  category: string;
  description: string;
}
