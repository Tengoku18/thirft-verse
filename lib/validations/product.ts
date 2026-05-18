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

// Product condition tiers - Thriftverse listing policy.
// `description` is surfaced inside the Select modal so sellers know
// exactly which tier to pick.
export const PRODUCT_CONDITIONS = [
  {
    value: "brand_new",
    label: "Brand New (with tags)",
    description:
      "Unworn and unused, with the original tags still attached.",
  },
  {
    value: "like_new",
    label: "Like New",
    description:
      "No tags, but shows no signs of wear — looks and feels brand new.",
  },
  {
    value: "gently_used",
    label: "Gently Used",
    description:
      "Worn a few times with only minor signs of wear. Still in great shape.",
  },
  {
    value: "thrifted_chic",
    label: "Thrifted Chic",
    description:
      "Visible character or vintage wear that adds to its unique charm.",
  },
] as const;

export const PRODUCT_CONDITION_VALUES = PRODUCT_CONDITIONS.map(
  (c) => c.value,
) as unknown as string[];

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

  condition: yup
    .string()
    .required('Please select the item condition')
    .oneOf(PRODUCT_CONDITION_VALUES, 'Invalid condition selected'),

  availability_count: yup
    .number()
    .required('Availability count is required')
    .integer('Availability must be a whole number')
    .min(1, 'Availability must be at least 1')
    .typeError('Availability must be a valid number'),

  // Cover image (required) - stores local URI before upload
  cover_image: yup
    .string()
    .required('Cover image is required'),

  // Other images (optional)
  other_images: yup
    .array()
    .of(yup.string().defined())
    .default([]),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
