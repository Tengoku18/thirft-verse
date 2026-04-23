'use client';

import { CreditCard, Leaf, Printer, ShieldCheck, Smartphone, Truck } from 'lucide-react';

const items = [
  { icon: Truck, label: 'Shipping by NCM' },
  { icon: CreditCard, label: 'eSewa checkout' },
  { icon: Smartphone, label: 'Mobile-first seller app' },
  { icon: Printer, label: 'One-tap shipping label' },
  { icon: Leaf, label: 'Sustainable by design' },
  { icon: ShieldCheck, label: 'Buyer protection' },
];

export default function TrustStrip() {
  return (
    <div className="border-y border-border/50 bg-surface/60 py-5 backdrop-blur-sm">
      <p className="text-center font-sans text-[11px] font-semibold tracking-[0.25em] text-primary/55 uppercase">
        Built for Nepali thrifters · trusted by makers across Kathmandu
      </p>

      <div className="relative mt-4 overflow-hidden pause-on-hover">
        {/* Fade masks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24"
        />

        <div className="flex w-max items-center gap-12 animate-marquee sm:gap-16">
          {[...items, ...items].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex shrink-0 items-center gap-2.5 text-primary/70 transition-colors hover:text-primary"
              >
                <span className="border-border/70 bg-surface text-secondary flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="whitespace-nowrap font-sans text-sm font-semibold tracking-wide">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
