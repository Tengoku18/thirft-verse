import * as yup from 'yup';

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
      ['Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Home & Decor', 'Electronics', 'Books', 'Other'],
      'Invalid category selected'
    ),

  availability_count: yup
    .number()
    .required('Availability count is required')
    .integer('Availability must be a whole number')
    .min(1, 'Availability must be at least 1')
    .typeError('Availability must be a valid number'),

  images: yup
    .array()
    .of(
      yup.object().shape({
        uri: yup.string().required(),
        id: yup.string().required(),
      })
    )
    .min(1, 'At least one product image is required')
    .max(5, 'Maximum 5 images allowed')
    .required('Product images are required'),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
