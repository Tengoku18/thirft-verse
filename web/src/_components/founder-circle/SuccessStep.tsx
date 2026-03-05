import { ArrowRight, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

const NEXT_STEPS = [
  { label: 'Our team personally reviews your application', sublabel: 'Usually within 24 hours' },
  { label: 'You receive a confirmation email', sublabel: 'Check your inbox & spam' },
  { label: 'Your exclusive Founder access code arrives', sublabel: 'Your key to unlock everything' },
  { label: 'Benefits activate the moment you join', sublabel: 'Badge, perks & more — instantly' },
];

export default function SuccessStep() {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
      {/* Stronger center glow for success */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.22), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md text-center">

        {/* ── Premium seal icon ── */}
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          {/* Outermost pulse ring */}
          <div
            className="absolute inset-0 animate-ping rounded-full opacity-20"
            style={{ background: 'rgba(212,163,115,0.35)', animationDuration: '2.4s' }}
          />
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(212,163,115,0.2)' }}
          />
          {/* Mid ring */}
          <div
            className="absolute inset-4 rounded-full"
            style={{ border: '1px solid rgba(212,163,115,0.35)' }}
          />
          {/* Inner filled circle */}
          <div
            className="absolute inset-8 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(212,163,115,0.25), rgba(203,153,126,0.15))',
              border: '1px solid rgba(212,163,115,0.5)',
              boxShadow: '0 0 24px rgba(212,163,115,0.3), inset 0 0 16px rgba(212,163,115,0.1)',
            }}
          />
          {/* Crown icon */}
          <Crown
            className="relative h-9 w-9"
            style={{
              color: '#D4A373',
              filter: 'drop-shadow(0 0 8px rgba(212,163,115,0.7))',
            }}
          />
        </div>

        {/* Status pill */}
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            border: '1px solid rgba(212,163,115,0.4)',
            background: 'rgba(212,163,115,0.12)',
            boxShadow: '0 0 16px rgba(212,163,115,0.12)',
          }}
        >
          <Sparkles className="h-3.5 w-3.5 text-fc-gold" />
          <span className="text-xs font-semibold tracking-wider text-fc-gold uppercase">
            Application Submitted
          </span>
        </div>

        <h2
          className="font-heading mb-4 text-4xl font-bold leading-tight sm:text-5xl"
          style={{
            background: 'var(--fc-gold-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          You&apos;re in<br />the running!
        </h2>
        <p className="mb-8 text-base leading-relaxed text-white/50">
          Your application is with our team. Spots are extremely limited —
          the fact you applied early puts you right at the front of the line.
        </p>

        {/* What happens next */}
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
          <ol className="space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-fc-gold"
                  style={{
                    background: 'rgba(212,163,115,0.15)',
                    border: '1px solid rgba(212,163,115,0.35)',
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white/75">{step.label}</p>
                  <p className="mt-0.5 text-xs text-white/30">{step.sublabel}</p>
                </div>
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
