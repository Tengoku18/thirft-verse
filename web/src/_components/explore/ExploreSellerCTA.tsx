import { ArrowRight, Percent, Smartphone, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';
import StoreMinimalFooter from '../store/StoreMinimalFooter';

const perks = [
  { Icon: Percent, label: 'Free to join', sub: 'No setup fees' },
  { Icon: Truck, label: 'NCM shipping', sub: 'Handled end-to-end' },
  { Icon: Smartphone, label: 'Mobile-first', sub: 'Run it from your phone' },
];

const ExploreSellerCTA = () => (
  <footer className="bg-background">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="from-primary via-primary to-primary/90 relative overflow-hidden rounded-3xl bg-linear-to-br p-6 shadow-2xl sm:p-12">
        {/* Ambient floating orbs */}
        <div
          aria-hidden
          className="animate-float-slow from-secondary/25 absolute -top-20 -right-20 h-48 w-48 rounded-full bg-linear-to-br to-transparent blur-3xl sm:h-64 sm:w-64"
        />
        <div
          aria-hidden
          className="animate-float-slow from-accent-2/20 absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-linear-to-tr to-transparent blur-3xl sm:h-56 sm:w-56"
          style={{ animationDelay: '-3s' }}
        />

        {/* Dot grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]"
        />

        {/* Hairline top accent */}
        <div
          aria-hidden
          className="via-secondary/80 absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent to-transparent"
        />

        <div className="relative grid gap-8 sm:grid-cols-[1.4fr_1fr] sm:items-center sm:gap-10">
          {/* Left: messaging */}
          <div>
            <span className="border-secondary/40 bg-secondary/10 text-secondary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
              <Sparkles className="h-3 w-3" strokeWidth={2.4} />
              For sellers
            </span>
            <h3 className="font-heading text-surface mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-4xl">
              Your storefront,{' '}
              <span className="from-secondary via-accent-2 to-secondary inline-block bg-linear-to-r bg-clip-text pr-2 italic text-transparent">
                shared with Nepal
              </span>
            </h3>
            <p className="text-surface/75 mt-4 max-w-lg font-sans text-sm leading-relaxed sm:text-base">
              Sign up on the Thriftverse app and your handle becomes your
              subdomain — drop it in your bio, start selling in minutes. We handle
              eSewa payouts, NCM shipping, and order notifications so you can focus
              on curating.
            </p>

            {/* Perks row */}
            <ul className="mt-6 grid grid-cols-3 gap-2.5 sm:mt-7 sm:max-w-md sm:gap-3">
              {perks.map(({ Icon, label, sub }) => (
                <li
                  key={label}
                  className="border-surface/15 bg-surface/5 hover:border-secondary/50 group flex flex-col items-start gap-1.5 rounded-2xl border px-3 py-3 backdrop-blur-sm transition-colors duration-300 sm:px-4"
                >
                  <span className="bg-secondary/15 text-secondary inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                  </span>
                  <div>
                    <p className="text-surface font-sans text-[11px] leading-tight font-semibold sm:text-xs">
                      {label}
                    </p>
                    <p className="text-surface/55 font-sans text-[10px] leading-tight tracking-wide">
                      {sub}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/start-selling"
                className="group bg-surface text-primary hover:bg-background relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 font-sans text-sm font-semibold tracking-wide shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
                  style={{ transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <span className="via-secondary/35 absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent to-transparent blur-sm" />
                </span>
                <span className="relative">Start selling</span>
                <ArrowRight
                  className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>

              <Link
                href="/founder-circle"
                className="group text-surface/80 hover:text-surface inline-flex items-center gap-1.5 font-sans text-sm font-semibold tracking-wide transition-colors"
              >
                <span className="relative">
                  Or join the Founder Circle
                  <span
                    aria-hidden
                    className="via-secondary absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-linear-to-r from-transparent to-transparent transition-transform duration-300 group-hover:scale-x-100"
                  />
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </Link>
            </div>
          </div>

          {/* Right: phone / subdomain mock card */}
          <div className="relative hidden sm:block">
            <div className="border-surface/15 bg-surface/[0.04] relative rounded-3xl border p-5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="bg-secondary/30 h-2 w-2 rounded-full" />
                <span className="bg-secondary/20 h-2 w-2 rounded-full" />
                <span className="bg-secondary/10 h-2 w-2 rounded-full" />
                <span className="text-surface/50 ml-2 font-sans text-[10px] tracking-wide uppercase">
                  your-handle.thriftverse.shop
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="from-secondary/20 via-accent-2/15 aspect-square rounded-xl bg-linear-to-br to-transparent"
                    style={{ animationDelay: `${n * 120}ms` }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-surface font-sans text-xs font-semibold">
                    Rupa&apos;s Vintage
                  </p>
                  <p className="text-surface/50 font-sans text-[10px]">
                    Ships from Kathmandu
                  </p>
                </div>
                <span className="border-secondary/40 bg-secondary/15 text-secondary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-sans text-[10px] font-semibold">
                  <span className="bg-secondary h-1.5 w-1.5 animate-soft-pulse rounded-full" />
                  Live
                </span>
              </div>
            </div>

            {/* Floating tag */}
            <div className="border-secondary/40 bg-surface text-primary animate-float-slow absolute -top-3 -right-3 rounded-full border px-3 py-1.5 font-sans text-[10px] font-bold tracking-wider uppercase shadow-lg">
              No setup fees
            </div>
          </div>
        </div>
      </div>

      <StoreMinimalFooter className="mt-6 sm:mt-8" />
    </div>
  </footer>
);

export default ExploreSellerCTA;
