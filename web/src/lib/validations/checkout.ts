import * as yup from 'yup'

export const checkoutSchema = yup.object().shape({
  // Contact Information
  buyer_name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  buyer_email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),

  phone: yup
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

  state: yup
    .string()
    .required('Province is required')
    .oneOf(
      ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpaschim'],
      'Please select a valid province'
    ),

  postal_code: yup
    .string()
    .required('Postal code is required')
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must not exceed 20 characters')
    .trim(),

  country: yup.string().required('Country is required').default('Nepal'),

  // Optional buyer notes for shopkeeper
  buyer_notes: yup
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .default(''),
})

export type CheckoutFormData = yup.InferType<typeof checkoutSchema>
