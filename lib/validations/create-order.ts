import * as yup from 'yup';
import { districtsOfNepal } from '@/lib/constants/districts';

// ============================================================================
// NEPALI PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Nepali mobile phone number patterns:
 * - NTC (Nepal Telecom): 984, 985, 986, 974, 975, 976
 * - Ncell: 980, 981, 982
 * - Smart Cell: 961, 962, 988
 * - UTL: 972
 * Format: 10 digits starting with 97, 98, or 96
 */
const NEPALI_PHONE_REGEX = /^(97|98|96)\d{8}$/;

/**
 * Validates if a phone number is a valid Nepali mobile number
 * Accepts: 9841234567, 9801234567, 9761234567, etc.
 * Also handles: +977-9841234567, 977 9841234567 (will be cleaned)
 */
export const isValidNepaliPhone = (phone: string): boolean => {
  // Clean the phone number - remove spaces, dashes, +977, country code
  const cleaned = cleanNepaliPhone(phone);
  return NEPALI_PHONE_REGEX.test(cleaned);
};

/**
 * Cleans a phone number to standard 10-digit Nepali format
 * Removes: +977, 977, spaces, dashes, parentheses
 */
export const cleanNepaliPhone = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Remove country code if present (977)
  if (cleaned.startsWith('977') && cleaned.length === 13) {
    cleaned = cleaned.slice(3);
  }

  return cleaned;
};

/**
 * Formats a phone number for display
 * Input: 9841234567 → Output: 984-123-4567
 */
export const formatNepaliPhone = (phone: string): string => {
  const cleaned = cleanNepaliPhone(phone);
  if (cleaned.length !== 10) return phone;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

// Custom yup validation for Nepali phone
const nepaliPhoneValidation = yup
  .string()
  .required('Phone number is required')
  .test('nepali-phone', 'Please enter a valid 10-digit Nepali phone number (e.g., 98XXXXXXXX)', (value) => {
    if (!value) return false;
    return isValidNepaliPhone(value);
  })
  .trim();

// ============================================================================
// CREATE ORDER SCHEMA
// ============================================================================

export const createOrderSchema = yup.object().shape({
  // Product
  product_id: yup.string().required('Please select a product'),

  quantity: yup
    .number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .typeError('Quantity must be a valid number'),

  // Buyer Information
  buyer_name: yup
    .string()
    .required('Buyer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  buyer_email: yup
    .string()
    .required('Buyer email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),

  buyer_phone: nepaliPhoneValidation,

  // Shipping Address
  street: yup
    .string()
    .required('Street address is required')
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must not exceed 200 characters')
    .trim(),

  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),

  district: yup
    .string()
    .required('District is required')
    .oneOf(
      districtsOfNepal as unknown as string[],
      'Please select a valid district'
    ),

  country: yup.string().default('Nepal'),

  // Order Details
  shipping_fee: yup
    .number()
    .required('Shipping fee is required')
    .min(0, 'Shipping fee cannot be negative')
    .typeError('Shipping fee must be a valid number'),

  shipping_option: yup
    .string()
    .required('Shipping option is required')
    .oneOf(
      ['home', 'branch'],
      'Invalid shipping option'
    ),

  payment_method: yup
    .string()
    .required('Payment method is required')
    .oneOf(
      ['COD', 'Online', 'Manual/Cash Received'],
      'Invalid payment method'
    ),

  buyer_notes: yup
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .default(''),
});

export type CreateOrderFormData = yup.InferType<typeof createOrderSchema>;

// ============================================================================
// EDIT ORDER SCHEMA (for pending orders not yet sent to NCM)
// ============================================================================

export const editOrderSchema = yup.object().shape({
  // Buyer Information
  buyer_name: yup
    .string()
    .required('Buyer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  buyer_email: yup
    .string()
    .required('Buyer email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),

  buyer_phone: nepaliPhoneValidation,

  // Shipping Address
  street: yup
    .string()
    .required('Street address is required')
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must not exceed 200 characters')
    .trim(),

  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),

  district: yup
    .string()
    .required('District is required')
    .oneOf(
      districtsOfNepal as unknown as string[],
      'Please select a valid district'
    ),

  // Optional notes
  buyer_notes: yup
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .default(''),
});

export type EditOrderFormData = yup.InferType<typeof editOrderSchema>;
