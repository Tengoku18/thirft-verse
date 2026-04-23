'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ExploreNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Animated multi-stop gradient hairline */}
      <div
        aria-hidden
        className="h-[2px] w-full bg-[linear-gradient(90deg,#D4A373_0%,#CB997E_25%,#6B705C_50%,#CB997E_75%,#D4A373_100%)] bg-[length:200%_100%]"
        style={{ animation: 'gradient-shift 8s ease-in-out infinite' }}
      />

      <nav
        className={`relative overflow-hidden transition-all duration-300 ${
          scrolled
            ? 'bg-background/85 shadow-[0_8px_24px_-16px_rgba(59,47,47,0.14)] backdrop-blur-xl'
            : 'bg-background/60 backdrop-blur-md'
        }`}
      >
        {/* Warm ambient glows — most visible before scroll */}
        <div
          aria-hidden
          className={`from-secondary/25 pointer-events-none absolute top-1/2 -left-20 h-40 w-40 -translate-y-1/2 rounded-full bg-linear-to-br to-transparent blur-3xl transition-opacity duration-500 ${
            scrolled ? 'opacity-40' : 'opacity-100'
          }`}
        />
        <div
          aria-hidden
          className={`from-accent-2/20 pointer-events-none absolute top-1/2 -right-20 h-40 w-40 -translate-y-1/2 rounded-full bg-linear-to-bl to-transparent blur-3xl transition-opacity duration-500 ${
            scrolled ? 'opacity-40' : 'opacity-100'
          }`}
        />
        <div
          aria-hidden
          className={`from-accent-1/10 pointer-events-none absolute top-1/2 left-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r via-transparent to-transparent blur-3xl transition-opacity duration-500 ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
            {/* Logo with soft glow halo */}
            <Link
              href="/"
              aria-label="Thriftverse home"
              className="group relative flex flex-shrink-0 items-center"
            >
              <span
                aria-hidden
                className="from-secondary/40 via-accent-2/30 pointer-events-none absolute -inset-3 rounded-2xl bg-linear-to-r to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <Image
                src="/images/horizontal-logo.png"
                alt="Thriftverse"
                height={28}
                width={100}
                priority
                className="relative object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:hidden"
              />
              <Image
                src="/images/horizontal-logo.png"
                alt="Thriftverse"
                height={36}
                width={140}
                priority
                className="relative hidden object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:block"
              />
            </Link>

            {/* Right: actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {process.env.NEXT_PUBLIC_ENABLE_THRIFT_BUDDY === 'true' && (
                <Link
                  href="/thrift-buddy"
                  className="group relative hidden cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border border-purple-300/50 bg-white/70 px-3 py-1.5 font-sans text-xs font-semibold text-purple-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-purple-400 hover:bg-white hover:shadow-md hover:shadow-purple-200/60 sm:inline-flex sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <Sparkles
                    className="h-3.5 w-3.5 text-purple-600 transition-transform duration-300 group-hover:rotate-12 sm:h-4 sm:w-4"
                    strokeWidth={2.4}
                  />
                  <span>Thrift Buddy</span>
                </Link>
              )}

              {/* Primary CTA — rich 3-color gradient with animated position */}
              <Link
                href="/start-selling"
                className="group relative inline-flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 font-sans text-xs font-semibold tracking-wide text-white shadow-[0_6px_20px_-8px_rgba(212,163,115,0.6)] transition-all duration-300 hover:shadow-[0_10px_28px_-8px_rgba(203,153,126,0.75)] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                style={{
                  backgroundImage:
                    'linear-gradient(110deg, #D4A373 0%, #CB997E 40%, #B8816A 70%, #D4A373 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 50%',
                  transition:
                    'background-position 700ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundPosition = '100% 50%')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundPosition = '0% 50%')
                }
              >
                {/* Sheen sweep */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
                  style={{
                    transition: 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-white/35 blur-md" />
                </span>
                {/* Top gloss */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent"
                />
                <span className="relative hidden sm:inline">Start selling</span>
                <span className="relative sm:hidden">Sell</span>
                <ArrowRight
                  className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
