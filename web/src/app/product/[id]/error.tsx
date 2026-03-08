'use client'

import * as Sentry from '@sentry/nextjs'
import { ArrowLeft, PackageX } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
          <PackageX className="h-10 w-10 text-secondary" />
        </div>

        <h1 className="font-heading mb-2 text-2xl font-bold text-primary">
          Something went wrong
        </h1>
        <p className="mb-8 text-sm text-primary/60">
          We couldn&apos;t load this product. Please try again or go back to the store.
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-secondary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
