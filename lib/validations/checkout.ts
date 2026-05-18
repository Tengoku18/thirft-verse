import * as yup from "yup";
import { cleanNepaliPhone, isValidNepaliPhone } from "./create-order";

export const SHIPPING_FEES = { home: 170, branch: 120 } as const;

export type ShippingOption = keyof typeof SHIPPING_FEES;
export type PaymentMethod = "cod" | "esewa" | "fonepay";

export const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const checkoutSchema = yup.object({
  buyerName: yup
    .string()
    .trim()
    .min(2, "At least 2 characters")
    .required("Name is required"),
  buyerEmail: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  buyerPhone: yup
    .string()
    .required("Phone is required")
    .test(
      "nepali-phone",
      "Enter a valid Nepali number (98XXXXXXXX)",
      (v) => !!v && isValidNepaliPhone(cleanNepaliPhone(v)),
    ),
  street: yup
    .string()
    .trim()
    .min(3, "Street is required")
    .required("Street is required"),
  city: yup.string().trim().required("City is required"),
  district: yup.string().required("District is required"),
  shipping: yup
    .string()
    .oneOf(["home", "branch"], "Please select a delivery method")
    .required("Please select a delivery method"),
  payment: yup
    .string()
    .oneOf(["cod", "esewa", "fonepay"], "Please select a payment method")
    .required("Please select a payment method"),
  buyerNotes: yup.string().optional().default(""),
});

export type CheckoutForm = yup.InferType<typeof checkoutSchema>;

export const STEP_FIELDS: Record<StepId, (keyof CheckoutForm)[]> = {
  1: ["buyerName", "buyerEmail", "buyerPhone", "street", "city", "district"],
  2: ["shipping", "payment"],
  3: [],
};

export const formatPrice = (n: number) => `NPR ${n.toLocaleString()}`;
