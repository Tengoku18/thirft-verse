'use client';

import Button from '@/_components/common/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent-1 py-20 lg:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-secondary blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent-2 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Content */}
        <h2 className="font-heading mb-6 text-4xl font-bold text-surface sm:text-5xl lg:text-6xl">
          Ready to Start Your
          <br />
          Thrift Journey?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-surface/80 sm:text-xl leading-relaxed">
          Join hundreds of sellers who are building sustainable businesses and
          making a difference. Your unique storefront awaits.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/start-selling">
            <Button
              variant="secondary"
              size="lg"
              className="group shadow-2xl hover:shadow-secondary/50"
            >
              Create Your Store - It's Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-surface/60">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Free to start
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Setup in minutes
          </div>
        </div>
      </div>
    </div>
  );
}
