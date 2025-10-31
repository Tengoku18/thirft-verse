import { handlePaymentFailure } from '@/actions/payment'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

interface PaymentFailedPageProps {
  searchParams: Promise<{
    transaction_uuid?: string
    reason?: string
  }>
}

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const params = await searchParams
  const reason = params.reason || 'unknown_error'
  const transactionUuid = params.transaction_uuid

  // Handle the failure using server action
  await handlePaymentFailure(transactionUuid)

  const reasonMessages: Record<string, string> = {
    user_cancelled: 'You cancelled the payment process.',
    invalid_signature: 'Payment verification failed for security reasons.',
    missing_data: 'Payment data is incomplete or missing.',
    missing_signature: 'Payment signature is missing from the response.',
    invalid_data: 'Payment data could not be decoded.',
    processing_error: 'An error occurred while processing your payment.',
    verification_failed: 'Payment could not be verified.',
    unknown_error: 'An unexpected error occurred.',
  }

  const message = reasonMessages[reason] || reasonMessages.unknown_error

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-red-400/20 to-red-600/20">
          <XCircle className="h-12 w-12 text-red-600" strokeWidth={2} />
        </div>

        <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
          Payment Failed
        </h1>

        <p className="mb-8 text-base text-primary/70 sm:text-lg">{message}</p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block w-full rounded-2xl border-2 border-primary/20 bg-white px-6 py-3 font-semibold text-primary shadow-md transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
