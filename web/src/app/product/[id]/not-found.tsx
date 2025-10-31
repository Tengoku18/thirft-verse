import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-secondary/20 to-accent-2/20">
          <Package className="h-12 w-12 text-primary/40" strokeWidth={1.5} />
        </div>

        <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
          Product Not Found
        </h1>

        <p className="mb-8 text-base text-primary/70 sm:text-lg">
          Sorry, we couldn't find the product you're looking for.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Store
        </Link>
      </div>
    </div>
  )
}
