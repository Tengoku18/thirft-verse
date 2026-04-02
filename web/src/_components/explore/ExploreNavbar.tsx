'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ExploreNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-18">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex flex-shrink-0 items-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/horizontal-logo.png"
              alt="Thriftverse Logo"
              height={28}
              width={100}
              className="object-contain sm:hidden"
            />
            <Image
              src="/images/horizontal-logo.png"
              alt="Thriftverse Logo"
              height={50}
              width={180}
              className="hidden object-contain sm:block"
            />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Thrift Buddy Button */}
            {process.env.NEXT_PUBLIC_ENABLE_THRIFT_BUDDY === 'true' && (
              <Link
                href="/thrift-buddy"
                className="group flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:scale-105 hover:shadow-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Thrift Buddy</span>
                <span className="sm:hidden">Buddy</span>
              </Link>
            )}

            {/* Start Selling Button */}
            <Link
              href="/start-selling"
              className="from-secondary to-accent-2 group flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r px-3 py-1.5 text-xs font-medium text-white transition-all hover:scale-105 hover:shadow-lg sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span className="hidden sm:inline">Start Selling</span>
              <span className="sm:hidden">Sell</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
