'use client';

import { Leaf, Recycle, Sprout } from 'lucide-react';
import Image from 'next/image';

/**
 * PLACEHOLDER IMAGERY — editorial "why thrift" image.
 * Replace with: warm, documentary-style photo of clothing being sorted,
 * folded, or tagged. Natural light. Hands in frame > faces.
 */
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&auto=format&fit=crop&q=70';

const stats = [
  {
    icon: Recycle,
    value: '10,000+',
    label: 'pieces rehomed',
    sub: 'not sent to landfill',
  },
  {
    icon: Sprout,
    value: '~2,700L',
    label: 'water saved per garment',
    sub: 'vs. buying new',
  },
  {
    icon: Leaf,
    value: '500+',
    label: 'independent curators',
    sub: 'earning on their terms',
  },
];

export default function SustainabilityStory() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Image column */}
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2.5rem] border border-border/60 bg-surface shadow-[0_30px_60px_-30px_rgba(59,47,47,0.35)]">
            <Image
              src={STORY_IMAGE}
              alt="A curator sorting and folding thrifted clothing in warm natural light (replace with editorial documentary-style photo)"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* warm tint overlay */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent"
            />
          </div>

          {/* Floating olive-tag */}
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/95 px-4 py-3 shadow-xl backdrop-blur-md sm:-bottom-6 sm:left-8">
            <span className="bg-accent-1/15 text-accent-1 flex h-10 w-10 items-center justify-center rounded-xl">
              <Leaf className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div>
              <div className="font-heading text-lg font-bold text-primary">
                Re-worn, not retired
              </div>
              <div className="font-sans text-[11px] font-medium tracking-wider uppercase text-primary/60">
                Every purchase = one less new garment
              </div>
            </div>
          </div>
        </div>

        {/* Copy column */}
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.22em] text-primary/65 uppercase backdrop-blur-sm">
            The why
          </span>
          <h2 className="font-heading mt-5 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Every piece has a <span className="italic font-medium text-secondary">second chapter.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary/70">
            Fashion is the second-most polluting industry on earth. We think the antidote
            isn&apos;t guilt — it&apos;s better storefronts for the people who already rescue, style,
            and resell the pieces others overlook.
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-primary/65">
            Thriftverse is the infrastructure: the URL, the checkout, the shipping.
            You bring the taste.
          </p>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="animate-fade-up group rounded-2xl border border-border/60 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-md"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Icon
                    className="text-accent-1 h-5 w-5 transition-transform duration-500 group-hover:-rotate-6"
                    strokeWidth={2.2}
                  />
                  <div className="font-heading mt-3 text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-sans text-xs font-semibold text-primary/75">
                    {stat.label}
                  </div>
                  <div className="font-sans text-[11px] text-primary/55">{stat.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
