'use client'

import Link from 'next/link'
import { Home, TrendingUp, Sparkles } from 'lucide-react'

export default function ExploreNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-primary/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A373] to-[#e8b647]">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[#D4A373] bg-clip-text text-transparent">
                Explore
              </h1>
              <p className="text-xs text-primary/60">Discover unique finds</p>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary/5 to-[#D4A373]/5 px-4 py-2 text-sm font-semibold text-primary transition-all hover:from-primary/10 hover:to-[#D4A373]/10 hover:shadow-md"
            >
              <Home className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2">
              <TrendingUp className="h-4 w-4 text-green-600" strokeWidth={2.5} />
              <span className="text-sm font-bold text-green-700">Trending</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
