'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function ExploreNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/horizontal-logo.png"
              alt="ThriftVerse Logo"
              height={40}
              width={150}
              className="object-contain"
            />
          </Link>

          {/* Right: CTA */}
          <Link
            href="/start-selling"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary to-accent-2 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105 cursor-pointer group"
          >
            <span>Start Selling</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
