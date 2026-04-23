'use client';

import { ArrowRight, Heart, Leaf, Star, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * PLACEHOLDER IMAGERY — replace with production photography.
 * Directional brief for each slot is in the `alt` text; Unsplash URLs are
 * stand-ins that share the warm, natural-light, boutique-thrift mood.
 *   a) tall portrait — a person holding a curated vintage piece, soft window light
 *   b) square product detail — flat-lay of thrifted denim / knitwear on linen
 *   c) square interior — an influencer's bedroom shelf / rack of curated items
 *   d) wide lifestyle — pair of hands folding or tagging a garment
 */
const HERO_IMAGES = {
  tall: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&auto=format&fit=crop&q=70',
  square1: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=70',
  square2: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=70',
  wide: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=70',
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      {/* Ambient background glows — warm tan + olive drift */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-secondary/25 blur-3xl animate-drift" />
        <div
          className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-accent-2/20 blur-3xl animate-drift"
          style={{ animationDelay: '-6s' }}
        />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-1/15 blur-3xl" />
      </div>

      {/* Warm paper grain */}
      <div aria-hidden className="texture-grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        {/* ── Left: copy ── */}
        <div className="lg:col-span-6">
          {/* Warm welcome eyebrow */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="relative inline-flex h-2 w-2">
              <span className="bg-accent-1 absolute inset-0 rounded-full animate-soft-pulse" />
              <span className="bg-accent-1 absolute inset-0 rounded-full" />
            </span>
            <span className="font-sans text-[11px] font-bold tracking-[0.22em] text-primary/75 uppercase">
              Thriftverse · est. Kathmandu
            </span>
          </div>

          <h1
            className="animate-fade-up font-heading mt-6 text-[2.75rem] leading-[1.02] font-bold tracking-tight text-primary sm:text-6xl lg:text-[4.5rem]"
            style={{ animationDelay: '80ms' }}
          >
            A kinder way to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 italic font-medium">shop</span>
              {/* hand-drawn underline */}
              <svg
                aria-hidden
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 z-0 h-3 w-full text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="M4 9 C 60 2, 130 13, 216 6" />
              </svg>
            </span>
            , <br className="hidden sm:inline" />
            a warmer way to{' '}
            <span className="bg-gradient-to-r from-accent-2 via-secondary to-accent-2 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_5s_ease-in-out_infinite]">
              sell
            </span>
            .
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-primary/70 sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            Discover curated thrift stores from Nepal&apos;s most thoughtful sellers — one-of-a-kind
            pieces, a smooth eSewa checkout, and delivery handled end-to-end by NCM. No fees to
            start selling. You earn, we only take a small commission.
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/explore"
              className="group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-sans text-base font-semibold text-surface shadow-[0_14px_34px_-14px_rgba(59,47,47,0.55)] transition-all duration-300 hover:shadow-[0_20px_40px_-14px_rgba(203,153,126,0.6)]"
              style={{
                backgroundImage:
                  'linear-gradient(110deg, #3B2F2F 0%, #5B4437 40%, #CB997E 100%)',
                backgroundSize: '200% 100%',
                backgroundPosition: '0% 50%',
                transition:
                  'background-position 800ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = '100% 50%')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = '0% 50%')}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
                style={{ transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)' }}
              >
                <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md" />
              </span>
              <span className="relative">Browse stores</span>
              <ArrowRight
                className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>

            <Link
              href="/start-selling"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-6 py-3.5 font-sans text-base font-semibold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:shadow-md"
            >
              <Store
                className="text-secondary h-4 w-4 transition-transform duration-300 group-hover:-rotate-3"
                strokeWidth={2.2}
              />
              Open your store
            </Link>
          </div>

          {/* Signals row — trust, not marketing */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs sm:text-sm"
            style={{ animationDelay: '320ms' }}
          >
            <div className="flex items-center gap-2 text-primary/75">
              <span className="bg-accent-1/15 text-accent-1 flex h-7 w-7 items-center justify-center rounded-full">
                <Leaf className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
              <span className="font-medium">One planet, re-worn</span>
            </div>
            <div className="flex items-center gap-2 text-primary/75">
              <span className="bg-secondary/15 text-secondary flex h-7 w-7 items-center justify-center rounded-full">
                <Heart className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
              </span>
              <span className="font-medium">Free to start · small % on sale</span>
            </div>
            <div className="flex items-center gap-2 text-primary/75">
              <span className="bg-accent-2/15 text-accent-2 flex h-7 w-7 items-center justify-center rounded-full">
                <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
              </span>
              <span className="font-medium">Loved by 500+ sellers</span>
            </div>
          </div>
        </div>

        {/* ── Right: editorial image collage ── */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto grid max-w-md grid-cols-12 grid-rows-6 gap-3 sm:max-w-lg sm:gap-4 lg:max-w-none">
            {/* Tall portrait — hero focal */}
            <div
              className="animate-fade-up relative col-span-7 row-span-6 overflow-hidden rounded-[2rem] border border-border/60 bg-surface shadow-[0_30px_60px_-30px_rgba(59,47,47,0.35)] animate-float-soft"
              style={{ animationDelay: '200ms' }}
            >
              <Image
                src={HERO_IMAGES.tall}
                alt="A seller holding a vintage jacket in soft window light (replace with authentic seller photo)"
                width={700}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
              {/* Floating price tag */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-border/60 bg-surface/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                <span className="bg-accent-1 h-1.5 w-1.5 rounded-full animate-blink-dot" />
                <span className="font-sans text-[11px] font-bold tracking-wider uppercase text-primary/80">
                  Just listed
                </span>
              </div>
            </div>

            {/* Top-right square */}
            <div
              className="animate-fade-up relative col-span-5 row-span-3 overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-[0_20px_40px_-22px_rgba(59,47,47,0.3)]"
              style={{ animationDelay: '320ms' }}
            >
              <Image
                src={HERO_IMAGES.square1}
                alt="Flat-lay of thrifted denim and knitwear on natural linen (replace with real product shot)"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Bottom-right square */}
            <div
              className="animate-fade-up relative col-span-5 row-span-3 overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-[0_20px_40px_-22px_rgba(59,47,47,0.3)] animate-float-soft"
              style={{ animationDelay: '440ms', animationDuration: '9s' }}
            >
              <Image
                src={HERO_IMAGES.square2}
                alt="A curator's rack of handpicked vintage pieces (replace with seller-curated rack)"
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Floating review card */}
          <div
            className="animate-fade-up absolute -bottom-6 -left-4 z-10 flex max-w-[240px] items-start gap-3 rounded-2xl border border-border/60 bg-surface/95 p-3.5 shadow-[0_20px_40px_-18px_rgba(59,47,47,0.35)] backdrop-blur-md sm:-bottom-4 sm:-left-8"
            style={{ animationDelay: '560ms' }}
          >
            <span className="from-secondary to-accent-2 relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-surface shadow-inner">
              <span className="font-heading text-sm font-bold">A</span>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-0.5 truncate font-sans text-xs font-semibold text-primary">
                aastha.thrifts
              </p>
              <p className="mt-0.5 font-sans text-[11px] leading-snug text-primary/65">
                Sold 42 pieces last month — NCM handled it all.
              </p>
            </div>
          </div>

          {/* Floating "subdomain" chip — key platform value */}
          <div
            className="animate-fade-up absolute -top-3 -right-2 z-10 hidden items-center gap-2 rounded-full border border-border/60 bg-surface/95 px-3.5 py-2 font-mono text-xs shadow-md backdrop-blur-md sm:inline-flex"
            style={{ animationDelay: '640ms' }}
          >
            <span className="bg-accent-1 h-1.5 w-1.5 rounded-full animate-soft-pulse" />
            <span className="text-primary/60">yourname</span>
            <span className="text-primary/30">.</span>
            <span className="text-primary font-semibold">thriftverse.shop</span>
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div className="relative mx-auto mt-20 max-w-5xl px-4 sm:mt-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 rounded-3xl border border-border/60 bg-surface/80 px-4 py-6 backdrop-blur-sm sm:gap-10 sm:px-10 sm:py-8">
          {[
            { value: '500+', label: 'Curated stores' },
            { value: '10K+', label: 'Pieces rehomed' },
            { value: '0%', label: 'Monthly fee' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-up text-center sm:text-left"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 font-sans text-xs font-medium text-primary/60 sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
