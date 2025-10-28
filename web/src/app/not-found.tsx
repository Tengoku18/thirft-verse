'use client';

import Link from 'next/link';
import Button from '@/_components/common/Button';
import { Home, Search, ArrowLeft, PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-surface to-secondary/10 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent-2/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-secondary to-accent-2 rounded-full blur-xl sm:blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-surface rounded-full p-6 sm:p-8 shadow-2xl border-2 sm:border-4 border-secondary/20">
              <PackageX className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-secondary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-6 sm:mb-8 px-2">
          <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl font-bold bg-linear-to-r from-secondary via-accent-2 to-secondary bg-clip-text text-transparent mb-3 sm:mb-4 animate-gradient leading-none">
            404
          </h1>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary/70 max-w-lg mx-auto leading-relaxed px-4">
            Oops! Looks like this treasure has been sold out. The page you're
            looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Helpful suggestions */}
        <div className="mb-8 sm:mb-10 mx-2 sm:mx-0 p-4 sm:p-6 bg-surface/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border shadow-lg">
          <p className="text-xs sm:text-sm font-semibold text-primary/80 mb-3 sm:mb-4">
            Here's what you can do:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-primary/60">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-secondary"></div>
              <span>Check the URL for typos</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-secondary"></div>
              <span>Return to the homepage</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-secondary"></div>
              <span>Browse our features</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-secondary"></div>
              <span>Contact support</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="md" className="group w-full sm:w-auto sm:px-8">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/#features" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="group w-full sm:w-auto sm:px-8">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Go back link */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-primary/60 hover:text-primary transition-colors group px-4"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            Go back to previous page
          </button>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
