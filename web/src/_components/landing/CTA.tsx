'use client';

import { ArrowRight, Compass, Store } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <div className="relative overflow-hidden py-20 lg:py-28">
      {/* Rich gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #5B4437 0%, transparent 55%), radial-gradient(circle at 85% 80%, #CB997E 0%, transparent 50%), linear-gradient(135deg, #3B2F2F 0%, #2A2220 100%)',
        }}
      />
      {/* Soft drifting glows */}
      <div
        aria-hidden
        className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-secondary/25 blur-3xl animate-drift"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-accent-2/20 blur-3xl animate-drift"
        style={{ animationDelay: '-8s' }}
      />
      <div aria-hidden className="texture-grain absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-surface/15 bg-surface/10 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.22em] text-surface/80 uppercase backdrop-blur-sm">
            Join Thriftverse
          </span>
          <h2 className="font-heading mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-surface sm:text-5xl lg:text-6xl">
            Pick a side <span className="italic font-medium text-secondary">(or both).</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-surface/70 sm:text-lg">
            Discover curators you&apos;ll actually follow — or open your own store and start earning
            from your taste this week.
          </p>
        </div>

        {/* Twin cards — Shop vs Sell */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-16 lg:gap-6">
          {/* Card A — Shop */}
          <Link
            href="/explore"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-surface/10 bg-surface/[0.06] p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-surface/25 hover:bg-surface/[0.1] sm:p-9"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-secondary/35 to-transparent blur-2xl transition-opacity duration-700 group-hover:opacity-100 opacity-70"
            />

            <div className="relative">
              <span className="bg-secondary/20 text-secondary inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-500 group-hover:-rotate-6">
                <Compass className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <p className="font-sans mt-5 text-[10px] font-bold tracking-[0.22em] text-surface/55 uppercase">
                For buyers
              </p>
              <h3 className="font-heading mt-2 text-2xl font-bold leading-tight text-surface sm:text-3xl">
                Shop one-of-a-kind.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-surface/70 sm:text-base">
                Browse 500+ curated stores, pay with eSewa, and get it delivered across Nepal.
              </p>
            </div>

            <div className="relative mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold text-surface">
              <span>Explore stores</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </div>
          </Link>

          {/* Card B — Sell */}
          <Link
            href="/start-selling"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-secondary/30 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(203,153,126,0.45)] sm:p-9"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #D4A373 0%, #CB997E 55%, #B8816A 100%)',
            }}
          >
            {/* Sheen sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
              style={{ transition: 'transform 1100ms cubic-bezier(0.22,1,0.36,1)' }}
            >
              <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md" />
            </span>
            {/* Top gloss */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"
            />

            <div className="relative">
              <span className="bg-primary/20 text-surface inline-flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6">
                <Store className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <p className="font-sans mt-5 text-[10px] font-bold tracking-[0.22em] text-surface/80 uppercase">
                For sellers
              </p>
              <h3 className="font-heading mt-2 text-2xl font-bold leading-tight text-surface sm:text-3xl">
                Open your store — free.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-surface/85 sm:text-base">
                Download the app, claim a username, and be live by the end of the day.
                We only earn when you earn.
              </p>
            </div>

            <div className="relative mt-8 inline-flex items-center gap-2 font-sans text-sm font-bold text-surface">
              <span>Start selling</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </div>
          </Link>
        </div>

        {/* Trust line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm">
          {[
            'No monthly fees',
            'Setup in under 10 min',
            'Commission only on sale',
            'NCM shipping included',
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 text-surface/60">
              <span className="bg-secondary/70 h-1.5 w-1.5 rounded-full" />
              <span className="font-sans font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
