import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function OrderNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border border-red-200 bg-red-50">
          <SearchX className="h-12 w-12 text-red-600" strokeWidth={2} />
        </div>

        <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
          Order Not Found
        </h1>

        <p className="mb-8 text-base text-primary/70 sm:text-lg">
          We couldn't find the order you're looking for. It may have been deleted or the link is incorrect.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl border border-primary/20 bg-primary px-6 py-3 font-semibold text-surface transition-colors hover:bg-primary/90"
        >
          Back to Store
        </Link>
      </div>
    </div>
  )
}
