'use client';

import { ArrowUpRight, Compass, Menu, Search, ShoppingBag, Store, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Explore', href: '/explore' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Stories', href: '/success-stories' },
  { label: 'Journal', href: '/blogs' },
  { label: 'Track order', href: '/track-order' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Warm animated hairline — draws the eye to the top of the page */}
      <div
        aria-hidden
        className="fixed top-0 right-0 left-0 z-[60] h-[2px] bg-[linear-gradient(90deg,transparent,#D4A373_20%,#CB997E_50%,#6B705C_70%,#D4A373_90%,transparent)] bg-[length:200%_100%]"
        style={{ animation: 'gradient-shift 9s ease-in-out infinite' }}
      />

      <header
        className={`fixed top-[2px] right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/85 border-b border-border/50 shadow-[0_10px_30px_-20px_rgba(59,47,47,0.25)] backdrop-blur-xl'
            : 'bg-transparent border-b border-transparent lg:backdrop-blur-0'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo with soft glow halo */}
            <Link
              href="/"
              aria-label="Thriftverse home"
              className="group relative flex flex-shrink-0 items-center"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-3 rounded-2xl bg-[radial-gradient(circle,rgba(212,163,115,0.35)_0%,transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <Image
                src="/images/horizontal-logo.png"
                alt="Thriftverse"
                height={48}
                width={170}
                priority
                className="relative object-contain p-1 transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* Tiny localized pill — "Made in Nepal" adds warmth + specificity */}
              <span
                aria-hidden
                className="ml-2 hidden items-center gap-1 rounded-full border border-border/60 bg-surface/70 px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-primary/70 uppercase backdrop-blur-sm md:inline-flex"
              >
                <span className="bg-accent-1 h-1.5 w-1.5 rounded-full animate-soft-pulse" />
                Nepal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 font-sans text-sm font-medium text-primary/75 transition-colors duration-200 hover:text-primary"
                >
                  {/* Soft pill background on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-secondary/0 transition-colors duration-300 group-hover:bg-secondary/15"
                  />
                  <span className="relative">{link.label}</span>
                  {/* Animated underline dot on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-secondary opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/explore"
                aria-label="Search products and stores"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/60 text-primary/80 backdrop-blur-sm transition-all duration-300 hover:border-secondary/50 hover:bg-surface hover:text-primary hover:shadow-[0_8px_20px_-10px_rgba(212,163,115,0.55)]"
              >
                <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.2} />
              </Link>

              <Link
                href="/cart"
                aria-label="Cart"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/60 text-primary/80 backdrop-blur-sm transition-all duration-300 hover:border-secondary/50 hover:bg-surface hover:text-primary hover:shadow-[0_8px_20px_-10px_rgba(212,163,115,0.55)]"
              >
                <ShoppingBag className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2.2} />
              </Link>

              {/* Primary CTA — warm gradient with animated sheen sweep */}
              <Link
                href="/start-selling"
                className="group relative ml-1 inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-sans text-sm font-semibold tracking-wide text-surface shadow-[0_10px_28px_-12px_rgba(59,47,47,0.45)] transition-all duration-300 hover:shadow-[0_14px_36px_-12px_rgba(203,153,126,0.6)]"
                style={{
                  backgroundImage:
                    'linear-gradient(110deg, #3B2F2F 0%, #5B4437 35%, #CB997E 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% 50%',
                  transition:
                    'background-position 700ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = '100% 50%')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = '0% 50%')}
              >
                {/* Sheen sweep on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full"
                  style={{ transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md" />
                </span>
                {/* Top gloss */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"
                />
                <span className="relative">Start selling</span>
                <ArrowUpRight
                  className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.4}
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group relative rounded-full border border-border/60 bg-surface/60 p-2.5 backdrop-blur-sm transition-colors hover:bg-secondary/15 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="text-primary h-5 w-5" strokeWidth={2.2} />
              ) : (
                <Menu className="text-primary h-5 w-5" strokeWidth={2.2} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 top-16 transition-all duration-300 md:top-20 lg:hidden ${
            isMobileMenuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
        >
          <div
            className="bg-primary/25 absolute inset-0 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className={`bg-background border-border relative border-b shadow-2xl transition-transform duration-500 ${
              isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
          >
            <div className="space-y-1 px-4 py-6">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="animate-fade-up group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 font-sans text-base font-semibold text-primary/85 transition-all duration-200 hover:border-border hover:bg-surface"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-primary/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-secondary"
                    strokeWidth={2.2}
                  />
                </Link>
              ))}

              <div className="border-border mt-4 grid grid-cols-2 gap-2 border-t pt-4">
                <Link
                  href="/explore"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-surface border-border text-primary flex items-center justify-center gap-2 rounded-full border px-4 py-3 font-sans text-sm font-semibold transition-colors hover:bg-secondary/15"
                >
                  <Compass className="h-4 w-4" strokeWidth={2.2} />
                  Explore
                </Link>
                <Link
                  href="/start-selling"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-3 font-sans text-sm font-semibold text-surface shadow-md"
                  style={{
                    backgroundImage:
                      'linear-gradient(110deg, #3B2F2F 0%, #5B4437 50%, #CB997E 100%)',
                  }}
                >
                  <Store className="h-4 w-4" strokeWidth={2.2} />
                  Sell
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
