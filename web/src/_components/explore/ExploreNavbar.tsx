'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function ExploreNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/images/horizontal-logo.png"
              alt="ThriftVerse Logo"
              height={28}
              width={100}
              className="object-contain sm:hidden"
            />
            <Image
              src="/images/horizontal-logo.png"
              alt="ThriftVerse Logo"
              height={40}
              width={150}
              className="object-contain hidden sm:block"
            />
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Thrift Buddy Button */}
            <Link
              href="/thrift-buddy"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg hover:scale-105 cursor-pointer group"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
              <span className="hidden sm:inline">Thrift Buddy</span>
              <span className="sm:hidden">Buddy</span>
            </Link>

            {/* Start Selling Button */}
            <Link
              href="/start-selling"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-secondary to-accent-2 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg hover:scale-105 cursor-pointer group"
            >
              <span className="hidden sm:inline">Start Selling</span>
              <span className="sm:hidden">Sell</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
