'use client';

import { applyToFounderCircle } from '@/actions/founder-circle';
import {
  FounderCircleFormData,
  founderCircleSchema,
} from '@/lib/validations/founder-circle';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowLeft,
  Crown,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ApplicationFormStepProps {
  role: 'creator' | 'seller';
  onBack: () => void;
  onSuccess: () => void;
}

const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all focus:outline-none';

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.05)',
  border: hasError
    ? '1px solid rgba(239,68,68,0.7)'
    : '1px solid rgba(255,255,255,0.1)',
});

const onInputFocus = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
  if (!hasError) {
    e.currentTarget.style.border = '1px solid rgba(212,163,115,0.6)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,163,115,0.12)';
  }
};

const onInputBlur = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
  if (!hasError) {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
    e.currentTarget.style.boxShadow = 'none';
  }
};

export default function ApplicationFormStep({ role, onBack, onSuccess }: ApplicationFormStepProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FounderCircleFormData>({
    resolver: yupResolver(founderCircleSchema),
    defaultValues: {
      full_name: '',
      email: '',
      instagram_link: '',
      tiktok_link: '',
      other_link: '',
    },
  });

  const [instagram_link, tiktok_link, other_link] = watch([
    'instagram_link',
    'tiktok_link',
    'other_link',
  ]);
  const hasSocial = !!(instagram_link || tiktok_link || other_link);
  const showSocialError = isSubmitted && !hasSocial;

  const onSubmit = async (data: FounderCircleFormData) => {
    if (!hasSocial) return;
    const result = await applyToFounderCircle({
      ...data,
      is_creator: role === 'creator',
      is_seller: role === 'seller',
    });

    if (result.success) {
      reset();
      onSuccess();
    } else {
      toast.error(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-64px)] px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to benefits
        </button>

        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          {/* Inner top glow */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'rgba(212,163,115,0.1)' }}
            aria-hidden="true"
          />

          <div className="relative mb-8">
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                border: '1px solid rgba(212,163,115,0.3)',
                background: 'rgba(212,163,115,0.1)',
              }}
            >
              <Crown className="h-3.5 w-3.5 text-fc-gold" />
              <span className="text-xs font-semibold tracking-wider text-fc-gold uppercase">
                Founding {role === 'creator' ? 'Creator' : 'Seller'} Application
              </span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Complete your application
            </h2>
            <p className="mt-1.5 text-sm text-white/40">
              We review every application and reach out within 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                {...register('full_name')}
                placeholder="Your full name"
                className={inputBase}
                style={inputStyle(!!errors.full_name)}
                onFocus={(e) => onInputFocus(e, !!errors.full_name)}
                onBlur={(e) => onInputBlur(e, !!errors.full_name)}
              />
              {errors.full_name && (
                <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className={inputBase}
                style={inputStyle(!!errors.email)}
                onFocus={(e) => onInputFocus(e, !!errors.email)}
                onBlur={(e) => onInputBlur(e, !!errors.email)}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div
                className="h-px flex-1"
                style={{ background: 'linear-gradient(to right, transparent, rgba(212,163,115,0.25), transparent)' }}
              />
              <span className="text-xs text-white/25">Social Profiles</span>
              <div
                className="h-px flex-1"
                style={{ background: 'linear-gradient(to left, transparent, rgba(212,163,115,0.25), transparent)' }}
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
                <Instagram className="h-4 w-4 text-white/35" />
                Instagram
                <span className="font-normal text-white/25">(Optional)</span>
              </label>
              <input
                {...register('instagram_link')}
                type="url"
                placeholder="https://instagram.com/yourhandle"
                className={inputBase}
                style={inputStyle(!!errors.instagram_link)}
                onFocus={(e) => onInputFocus(e, !!errors.instagram_link)}
                onBlur={(e) => onInputBlur(e, !!errors.instagram_link)}
              />
              {errors.instagram_link && (
                <p className="mt-1.5 text-xs text-red-400">{errors.instagram_link.message}</p>
              )}
            </div>

            {/* TikTok */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-white/35"
                  aria-label="TikTok"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.69a8.17 8.17 0 0 0 4.78 1.52V4.7a4.85 4.85 0 0 1-1-.01z" />
                </svg>
                TikTok
                <span className="font-normal text-white/25">(Optional)</span>
              </label>
              <input
                {...register('tiktok_link')}
                type="url"
                placeholder="https://tiktok.com/@yourhandle"
                className={inputBase}
                style={inputStyle(!!errors.tiktok_link)}
                onFocus={(e) => onInputFocus(e, !!errors.tiktok_link)}
                onBlur={(e) => onInputBlur(e, !!errors.tiktok_link)}
              />
              {errors.tiktok_link && (
                <p className="mt-1.5 text-xs text-red-400">{errors.tiktok_link.message}</p>
              )}
            </div>

            {/* Other Link */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
                <LinkIcon className="h-4 w-4 text-white/35" />
                Other Link
                <span className="font-normal text-white/25">(Optional)</span>
              </label>
              <input
                {...register('other_link')}
                type="url"
                placeholder="YouTube, Facebook, website…"
                className={inputBase}
                style={inputStyle(!!errors.other_link)}
                onFocus={(e) => onInputFocus(e, !!errors.other_link)}
                onBlur={(e) => onInputBlur(e, !!errors.other_link)}
              />
              {errors.other_link && (
                <p className="mt-1.5 text-xs text-red-400">{errors.other_link.message}</p>
              )}
            </div>

            {/* At-least-one-social error */}
            {showSocialError && (
              <p className="text-xs text-red-400">Please provide at least one social profile link.</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-fc-bg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: 'var(--fc-button-gradient)',
                boxShadow: 'var(--fc-gold-glow)',
              }}
            >
              <span className="relative z-10">
                {isSubmitting ? 'Submitting…' : 'Submit Application'}
              </span>
              {!isSubmitting && (
                <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              )}
            </button>

            <p className="text-center text-xs text-white/20">
              We&apos;ll review your application and contact you within 48 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
