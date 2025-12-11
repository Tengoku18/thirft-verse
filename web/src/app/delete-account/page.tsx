'use client';

import { requestAccountDeletion } from '@/actions/account-deletion';
import Button from '@/_components/common/Button';
import Header from '@/_components/common/Header';
import Footer from '@/_components/landing/Footer';
import { FormInput, FormTextarea } from '@/_components/forms';
import {
  AccountDeletionFormData,
  accountDeletionSchema,
} from '@/lib/validations/account-deletion';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function DeleteAccountPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountDeletionFormData>({
    resolver: yupResolver(accountDeletionSchema),
    defaultValues: {
      email: '',
      reason: '',
    },
  });

  const onSubmit = async (data: AccountDeletionFormData) => {
    try {
      const result = await requestAccountDeletion({
        email: data.email,
        reason: data.reason,
      });

      if (result.success) {
        setIsSubmitted(true);
        reset();
        toast.success(result.message, { duration: 5000 });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 pt-20">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="font-heading mb-4 text-2xl font-bold text-primary">
              Request Submitted Successfully
            </h2>
            <p className="mb-6 text-primary/70">
              Your account deletion request has been submitted. We will process
              your request within 30 days. You will receive an email
              confirmation once your account has been deleted.
            </p>
            <p className="mb-8 text-sm text-primary/50">
              If you change your mind, please contact us at{' '}
              <a
                href="mailto:thriftverse.shop@gmail.com"
                className="text-secondary hover:underline"
              >
                thriftverse.shop@gmail.com
              </a>
            </p>
            <Link href="/">
              <Button variant="secondary" size="lg">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="border-b border-border bg-linear-to-br from-surface to-secondary/5 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-heading mb-4 text-4xl font-bold text-primary sm:text-5xl">
            Delete Account
          </h1>
          <p className="max-w-3xl text-lg text-primary/70">
            Request to permanently delete your ThriftVerse account.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Warning Banner */}
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-heading mb-2 text-lg font-bold text-red-800">
                  Warning: This action is irreversible
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>
                    - All your profile data and store information will be
                    permanently deleted
                  </li>
                  <li>- All your product listings will be removed</li>
                  <li>
                    - Your order history will be anonymized but retained for
                    legal purposes
                  </li>
                  <li>- You will not be able to recover your account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deletion Form */}
          <div className="rounded-xl border border-border bg-surface p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Trash2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary">
                Request Account Deletion
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                {...register('email')}
                type="email"
                label="Your Email Address"
                placeholder="Enter the email associated with your account"
                error={errors.email?.message}
                required
              />

              <FormTextarea
                {...register('reason')}
                label="Reason for Deletion"
                placeholder="Please tell us why you want to delete your account. This helps us improve our service..."
                rows={4}
                error={errors.reason?.message}
                required
              />

              <div className="rounded-lg bg-primary/5 p-4">
                <p className="text-sm text-primary/70">
                  By submitting this request, you confirm that you understand
                  the consequences of account deletion and wish to proceed. Your
                  request will be processed within 30 days.
                </p>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Deletion Request'}
              </Button>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-primary/60">
              Having issues with your account?{' '}
              <a href="/contact" className="text-secondary hover:underline">
                Contact our support team
              </a>{' '}
              - we might be able to help without deleting your account.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
