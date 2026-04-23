'use client';

import { Camera, Download, Share2, Truck } from 'lucide-react';

/**
 * Four-step story. Each card is a vertical "card stack" with an icon, step number,
 * and a two-line scenario that maps to what a seller actually does.
 */
const steps = [
  {
    number: '01',
    icon: Download,
    tag: 'Day 1 · 2 min',
    title: 'Grab the seller app.',
    body: 'Download Thriftverse for iOS or Android. Pick a username — that becomes your store URL.',
  },
  {
    number: '02',
    icon: Camera,
    tag: 'Day 1 · 10 min',
    title: 'List your first drop.',
    body: 'Snap photos, write a story, set a price. Your storefront goes live the moment you publish.',
  },
  {
    number: '03',
    icon: Share2,
    tag: 'Day 1 · afternoon',
    title: 'Share the link.',
    body: 'Drop yourname.thriftverse.shop in your bio. Buyers browse, pay with eSewa, you get notified.',
  },
  {
    number: '04',
    icon: Truck,
    tag: 'Next day',
    title: 'Drop at NCM.',
    body: 'We generate the shipping label for you. Print it, tape it, hand the parcel to Nepal Can Move — we track the rest.',
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.22em] text-primary/65 uppercase backdrop-blur-sm">
          How it works
        </span>
        <h2 className="font-heading mt-5 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          From thrifter to storefront <br className="hidden sm:inline" />
          <span className="italic font-medium text-secondary">in one afternoon.</span>
        </h2>
      </div>

      {/* Card rail with dotted connector */}
      <div className="relative">
        {/* Dotted connector line — desktop only */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-24 left-0 right-0 hidden lg:block"
        >
          <svg
            className="w-full text-secondary/40"
            height="12"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 12"
          >
            <path
              d="M 0 6 L 1000 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 10"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="animate-fade-up group relative"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Step-number chip — floats above card */}
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-secondary shadow-lg shadow-secondary/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-secondary/50">
                  <span className="font-heading text-sm font-bold text-surface">
                    {step.number}
                  </span>
                </div>

                {/* Card */}
                <div className="-mt-6 flex h-full flex-col rounded-3xl border border-border/60 bg-surface p-6 pt-10 shadow-[0_10px_30px_-22px_rgba(59,47,47,0.25)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_22px_50px_-22px_rgba(59,47,47,0.35)] sm:p-7 sm:pt-12">
                  <div className="bg-secondary/10 text-secondary mb-5 inline-flex h-10 w-10 items-center justify-center self-start rounded-xl transition-transform duration-500 group-hover:-rotate-6">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>

                  <p className="font-sans text-[10px] font-bold tracking-[0.22em] text-accent-1 uppercase">
                    {step.tag}
                  </p>
                  <h3 className="font-heading mt-1.5 text-xl font-bold leading-tight text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/70">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
