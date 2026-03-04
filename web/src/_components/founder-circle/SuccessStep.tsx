import { ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import Link from 'next/link';

const NEXT_STEPS = [
  'Our team reviews your application',
  'We send you a confirmation email',
  'You receive your Founder access code',
  'Unlock your exclusive benefits on the app',
];

export default function SuccessStep() {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
      {/* Center glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.18), transparent 60%)' }}
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
          <CheckCircle2 className="relative h-10 w-10 text-fc-gold" />
        </div>

        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            border: '1px solid rgba(212,163,115,0.3)',
            background: 'rgba(212,163,115,0.1)',
          }}
        >
          <Crown className="h-3.5 w-3.5 text-fc-gold" />
          <span className="text-xs font-semibold tracking-wider text-fc-gold uppercase">
            Application Received
          </span>
        </div>

        <h2
          className="font-heading mb-3 text-3xl font-bold sm:text-4xl"
          style={{
            background: 'var(--fc-gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          You&apos;re on the list!
        </h2>
        <p className="mb-8 text-base text-white/40">
          Thank you for applying to the Thriftverse Founder Circle. We&apos;ll review your
          application and reach out within 48 hours.
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
            {NEXT_STEPS.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-fc-gold"
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-fc-gold/60 transition-colors hover:text-fc-gold"
        >
          Back to Thriftverse
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
