'use client';

import { applyToFounderCircle } from '@/actions/founder-circle';
import {
    FounderCircleFormData,
    founderCircleSchema,
} from '@/lib/validations/founder-circle';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    Crown,
    Instagram,
    Link as LinkIcon,
    Sparkles,
    Star,
    Store,
    Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Role = 'creator' | 'seller';
type Step = 'role' | 'benefits' | 'form' | 'success';

const CREATOR_BENEFITS = [
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: 'Permanent Founder Badge',
    desc: 'Exclusive badge on your profile — forever.',
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: 'Rs. 50 per Sale Referral',
    desc: 'Earn Rs. 50 for every sale made by sellers you refer, for 6 months.',
  },
  {
    icon: <Crown className="h-5 w-5" />,
    title: 'Unique Referral Code',
    desc: 'Share your code with up to 6 sellers — choose your circle wisely.',
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: 'Monthly Cash Rewards',
    desc: 'Top 3 creators each month win cash or product prizes.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Featured Visibility',
    desc: 'Get showcased on the leaderboard and featured creator section.',
  },
];

const SELLER_BENEFITS = [
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: 'Permanent Founder Badge',
    desc: 'Exclusive Founder badge on your store — forever.',
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: 'Extra 2% Commission Discount',
    desc: 'Reduced platform commission for your first 12 months.',
  },
  {
    icon: <Store className="h-5 w-5" />,
    title: 'Priority Marketplace Exposure',
    desc: 'Your verified store is shown first on the marketplace.',
  },
  {
    icon: <Crown className="h-5 w-5" />,
    title: 'Early Access to Campaigns',
    desc: 'Receive news about marketing campaigns 3 days before anyone else.',
  },
];

// Shared input style handler helpers
const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all focus:outline-none';
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.05)',
  border: hasError
    ? '1px solid rgba(239,68,68,0.7)'
    : '1px solid rgba(255,255,255,0.1)',
});
const onInputFocus = (
  e: React.FocusEvent<HTMLInputElement>,
  hasError: boolean
) => {
  if (!hasError) {
    e.currentTarget.style.border = '1px solid rgba(212,163,115,0.6)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,163,115,0.12)';
  }
};
const onInputBlur = (
  e: React.FocusEvent<HTMLInputElement>,
  hasError: boolean
) => {
  if (!hasError) {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
    e.currentTarget.style.boxShadow = 'none';
  }
};

export default function FounderCirclePage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const benefits = role === 'creator' ? CREATOR_BENEFITS : SELLER_BENEFITS;

  const handleRoleSelect = (selected: Role) => {
    setRole(selected);
    setStep('benefits');
  };

  const onSubmit = async (data: FounderCircleFormData) => {
    if (!role) return;
    const result = await applyToFounderCircle({
      ...data,
      is_creator: role === 'creator',
      is_seller: role === 'seller',
    });
    if (result.success) {
      setStep('success');
      reset();
    } else {
      toast.error(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: '#140E09' }}
    >
      {/* ── Background glow layers ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(212,163,115,0.28), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-20 -left-32 h-[420px] w-[420px] rounded-full blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(203,153,126,0.18), transparent 70%)',
          }}
        />
        <div
          className="absolute -top-16 -right-24 h-[320px] w-[320px] rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(circle, rgba(212,163,115,0.12), transparent 70%)',
          }}
        />
      </div>

      {/* ── Minimal Navbar ── */}
      <header className="relative z-50 flex h-16 items-center justify-center px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span
            className="font-heading text-2xl font-bold tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #D4A373 0%, #F5E5C8 50%, #CB997E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Thriftverse
          </span>
          <div className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="hidden items-center gap-1.5 rounded-full border border-[#D4A373]/30 bg-[#D4A373]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#D4A373] sm:inline-flex">
            <Crown className="h-3 w-3" />
            FOUNDER CIRCLE
          </span>
        </div>
      </header>

      {/* ═══════════════════════════
          STEP 1 — Role Selection
      ═══════════════════════════ */}
      {step === 'role' && (
        <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
          <div className="mb-14 text-center">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                border: '1px solid rgba(212,163,115,0.25)',
                background: 'rgba(212,163,115,0.08)',
              }}
            >
              <Crown className="h-3.5 w-3.5 text-[#D4A373]" />
              <span className="text-xs font-semibold tracking-[0.15em] text-[#D4A373] uppercase">
                Limited Spots Available
              </span>
            </div>

            <h1
              className="font-heading mb-5 text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl"
              style={{
                background:
                  'linear-gradient(135deg, #D4A373 0%, #F5E5C8 45%, #CB997E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Founder Circle
            </h1>

            <p className="mx-auto max-w-md text-base leading-relaxed text-white/40 sm:text-lg">
              Be among the first to shape Thriftverse. Founding members receive
              exclusive benefits, permanent recognition, and lifetime perks.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            {[
              {
                role: 'creator' as Role,
                icon: <Sparkles className="h-5 w-5 text-[#D4A373]" />,
                title: 'Founding Creator',
                desc: "You're a creator or influencer who refers thrift sellers and earns referral rewards every sale.",
                cta: "I'm a Creator",
              },
              {
                role: 'seller' as Role,
                icon: <Store className="h-5 w-5 text-[#D4A373]" />,
                title: 'Founding Seller',
                desc: 'You own or run a thrift store and want to open early with long-term operational benefits.',
                cta: "I'm a Seller",
              },
            ].map((card) => (
              <button
                key={card.role}
                onClick={() => handleRoleSelect(card.role)}
                className="group relative flex flex-col items-start overflow-hidden rounded-2xl p-7 text-left transition-all duration-300 focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = '1px solid rgba(212,163,115,0.45)';
                  el.style.background = 'rgba(212,163,115,0.06)';
                  el.style.boxShadow =
                    '0 0 50px rgba(212,163,115,0.1), inset 0 0 30px rgba(212,163,115,0.04)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = '1px solid rgba(255,255,255,0.08)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Corner glow */}
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(212,163,115,0.35), transparent)',
                  }}
                />
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: 'rgba(212,163,115,0.12)',
                    border: '1px solid rgba(212,163,115,0.22)',
                  }}
                >
                  {card.icon}
                </div>
                <h2 className="font-heading mb-2 text-xl font-bold text-white">
                  {card.title}
                </h2>
                <p className="mb-7 text-sm leading-relaxed text-white/40">
                  {card.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-[#D4A373]">
                  <span>{card.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-white/20">
            By applying you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      )}

      {/* ═══════════════════════════
          STEP 2 — Benefits
      ═══════════════════════════ */}
      {step === 'benefits' && role && (
        <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
          <div className="w-full max-w-lg">
            <button
              onClick={() => setStep('role')}
              className="mb-8 flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Change role
            </button>

            <div
              className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                border: '1px solid rgba(212,163,115,0.3)',
                background: 'rgba(212,163,115,0.1)',
              }}
            >
              {role === 'creator' ? (
                <Sparkles className="h-3.5 w-3.5 text-[#D4A373]" />
              ) : (
                <Store className="h-3.5 w-3.5 text-[#D4A373]" />
              )}
              <span className="text-xs font-semibold tracking-wider text-[#D4A373] uppercase">
                Founding {role === 'creator' ? 'Creator' : 'Seller'}
              </span>
            </div>

            <h2
              className="font-heading mb-2 text-3xl font-bold sm:text-4xl"
              style={{
                background:
                  'linear-gradient(135deg, #D4A373 0%, #F5E5C8 50%, #CB997E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your exclusive benefits
            </h2>
            <p className="mb-8 text-sm text-white/40">
              As a founding member, these perks are permanently yours.
            </p>

            <ul className="mb-10 space-y-3">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#D4A373]"
                    style={{
                      background: 'rgba(212,163,115,0.12)',
                      border: '1px solid rgba(212,163,115,0.2)',
                    }}
                  >
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white/90">
                      {benefit.title}
                    </p>
                    <p className="mt-0.5 text-sm text-white/40">
                      {benefit.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setStep('form')}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-[#140E09] transition-all duration-300"
              style={{
                background:
                  'linear-gradient(135deg, #D4A373 0%, #F0D4A8 50%, #CB997E 100%)',
                boxShadow: '0 0 32px rgba(212,163,115,0.35)',
              }}
            >
              <span className="relative z-10">Claim My Founding Spot</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════
          STEP 3 — Form
      ═══════════════════════════ */}
      {step === 'form' && role && (
        <div className="relative z-10 min-h-[calc(100vh-64px)] px-5 py-10 sm:py-16">
          <div className="mx-auto w-full max-w-lg">
            <button
              onClick={() => setStep('benefits')}
              className="mb-8 flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
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
                  <Crown className="h-3.5 w-3.5 text-[#D4A373]" />
                  <span className="text-xs font-semibold tracking-wider text-[#D4A373] uppercase">
                    Founding {role === 'creator' ? 'Creator' : 'Seller'}{' '}
                    Application
                  </span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  Complete your application
                </h2>
                <p className="mt-1.5 text-sm text-white/40">
                  We review every application and reach out within 48 hours.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-5"
              >
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
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.full_name.message}
                    </p>
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
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="h-px flex-1"
                    style={{
                      background:
                        'linear-gradient(to right, transparent, rgba(212,163,115,0.25), transparent)',
                    }}
                  />
                  <span className="text-xs text-white/25">Social Profiles</span>
                  <div
                    className="h-px flex-1"
                    style={{
                      background:
                        'linear-gradient(to left, transparent, rgba(212,163,115,0.25), transparent)',
                    }}
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
                    <Instagram className="h-4 w-4 text-white/35" />
                    Instagram
                    <span className="font-normal text-white/25">
                      (Optional)
                    </span>
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
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.instagram_link.message}
                    </p>
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
                    <span className="font-normal text-white/25">
                      (Optional)
                    </span>
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
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.tiktok_link.message}
                    </p>
                  )}
                </div>

                {/* Other link */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60">
                    <LinkIcon className="h-4 w-4 text-white/35" />
                    Other Link
                    <span className="font-normal text-white/25">
                      (Optional)
                    </span>
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
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.other_link.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-[#140E09] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4A373 0%, #F0D4A8 50%, #CB997E 100%)',
                    boxShadow: '0 0 32px rgba(212,163,115,0.3)',
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
                  We&apos;ll review your application and contact you within 48
                  hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════
          STEP 4 — Success
      ═══════════════════════════ */}
      {step === 'success' && (
        <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
            style={{
              background:
                'radial-gradient(circle, rgba(212,163,115,0.18), transparent 60%)',
            }}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md text-center">
            {/* Icon rings */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(212,163,115,0.25)' }}
              />
              <div
                className="absolute inset-3 rounded-full"
                style={{ background: 'rgba(212,163,115,0.1)' }}
              />
              <CheckCircle2 className="relative h-10 w-10 text-[#D4A373]" />
            </div>

            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                border: '1px solid rgba(212,163,115,0.3)',
                background: 'rgba(212,163,115,0.1)',
              }}
            >
              <Crown className="h-3.5 w-3.5 text-[#D4A373]" />
              <span className="text-xs font-semibold tracking-wider text-[#D4A373] uppercase">
                Application Received
              </span>
            </div>

            <h2
              className="font-heading mb-3 text-3xl font-bold sm:text-4xl"
              style={{
                background:
                  'linear-gradient(135deg, #D4A373 0%, #F5E5C8 50%, #CB997E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              You&apos;re on the list!
            </h2>
            <p className="mb-8 text-base text-white/40">
              Thank you for applying to the Thriftverse Founder Circle.
              We&apos;ll review your application and reach out within 48 hours.
            </p>

            <div
              className="mb-8 rounded-2xl p-5 text-left"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="mb-4 text-xs font-semibold tracking-wider text-white/25 uppercase">
                What happens next
              </p>
              <ol className="space-y-3.5">
                {[
                  'Our team reviews your application',
                  'We send you a confirmation email',
                  'You receive your Founder access code',
                  'Unlock your exclusive benefits on the app',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#D4A373]"
                      style={{
                        background: 'rgba(212,163,115,0.15)',
                        border: '1px solid rgba(212,163,115,0.3)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/50">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4A373]/60 transition-colors hover:text-[#D4A373]"
            >
              Back to Thriftverse
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
