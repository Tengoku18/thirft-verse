import { ArrowRight, Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const StoreFooterExplore = () => {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="from-primary via-primary to-primary/95 relative overflow-hidden rounded-2xl bg-linear-to-br p-6 shadow-xl sm:rounded-3xl sm:p-12">
          <div
            aria-hidden
            className="from-secondary/15 absolute -top-16 -right-16 h-40 w-40 rounded-full bg-linear-to-br to-transparent blur-3xl sm:h-56 sm:w-56"
          />
          <div
            aria-hidden
            className="from-accent-2/10 absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-linear-to-tr to-transparent blur-3xl sm:h-48 sm:w-48"
          />

          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="border-secondary/40 bg-secondary/10 text-secondary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border sm:h-11 sm:w-11">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-secondary mb-1 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
                  Keep browsing
                </p>
                <h3 className="font-heading text-surface text-xl font-bold tracking-tight sm:text-3xl">
                  Discover more Thriftverse stores
                </h3>
                <p className="text-surface/70 mt-2 max-w-md font-sans text-sm sm:text-base">
                  Every store is independently curated. Find your next favourite
                  piece from creators across Nepal.
                </p>
              </div>
            </div>

            <Link
              href="/explore"
              className="bg-surface text-primary hover:bg-background group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 font-sans text-sm font-semibold tracking-wide shadow-lg transition-colors sm:w-auto sm:px-6"
            >
              Explore stores
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 text-center sm:mt-6 sm:flex-row sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
          >
            <Image
              src="/images/horizontal-logo.png"
              alt="Thriftverse"
              height={28}
              width={120}
              className="object-contain"
            />
          </Link>
          <p className="text-primary/50 font-sans text-[11px] sm:text-xs">
            Sustainable shopping. Delivered with care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooterExplore;
