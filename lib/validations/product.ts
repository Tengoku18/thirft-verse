import * as yup from 'yup';

// Product categories - matching admin
export const PRODUCT_CATEGORIES = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
  'Home & Decor',
  'Electronics',
  'Books',
  'Other',
] as const;

// Product form schema - matches admin structure
export const productSchema = yup.object().shape({
  title: yup
    .string()
    .required('Product title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),

  description: yup
    .string()
    .required('Product description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),

  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .typeError('Price must be a valid number'),

  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      PRODUCT_CATEGORIES as unknown as string[],
      'Invalid category selected'
    ),

  availability_count: yup
    .number()
    .required('Availability count is required')
    .integer('Availability must be a whole number')
    .min(1, 'Availability must be at least 1')
    .typeError('Availability must be a valid number'),

  // Cover image (required) - matches admin
  cover_image: yup
    .string()
    .required('Cover image is required')
    .url('Cover image must be a valid URL'),

  // Other images (optional array) - matches admin
  other_images: yup
    .array()
    .of(yup.string().url('Each image must be a valid URL'))
    .max(4, 'Maximum 4 additional images allowed')
    .default([]),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
