import * as yup from 'yup';
import { districtsOfNepal } from '@/lib/constants/districts';

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

  buyer_phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please enter a valid phone number'
    )
    .trim(),

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
