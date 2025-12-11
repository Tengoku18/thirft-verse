import * as yup from 'yup';

export const accountDeletionSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),

  reason: yup
    .string()
    .required('Please tell us why you want to delete your account')
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason must not exceed 1000 characters')
    .trim(),
});

export type AccountDeletionFormData = yup.InferType<typeof accountDeletionSchema>;
