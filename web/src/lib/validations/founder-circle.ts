import * as yup from 'yup';

export const founderCircleSchema = yup.object({
  full_name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .trim()
    .defined(),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address')
    .trim()
    .defined(),
  instagram_link: yup
    .string()
    .url('Enter a valid URL (e.g. https://instagram.com/yourhandle)')
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .default(null),
  tiktok_link: yup
    .string()
    .url('Enter a valid URL (e.g. https://tiktok.com/@yourhandle)')
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .default(null),
  other_link: yup
    .string()
    .url('Enter a valid URL')
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .default(null),
});

export type FounderCircleFormData = yup.InferType<typeof founderCircleSchema>;
