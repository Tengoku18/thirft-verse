import { verifyEsewaPayment } from '@/actions/payment'
import DownloadReceipt from '@/_components/DownloadReceipt'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    data?: string
  }>
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams
  const data = params.data

  // If no data, redirect to failed page
  if (!data) {
    redirect('/payment/failed?reason=missing_data')
  }

  // Decode the data to extract signature
  let signature: string
  try {
    const decodedData = Buffer.from(data, 'base64').toString('utf-8')
    const paymentData = JSON.parse(decodedData)
    signature = paymentData.signature

    if (!signature) {
      redirect('/payment/failed?reason=missing_signature')
    }
  } catch (error) {
    console.error('Error decoding payment data:', error)
    redirect('/payment/failed?reason=invalid_data')
  }

  // Verify the payment using server action
  const result = await verifyEsewaPayment(data, signature)

  // If verification failed, redirect to failed page
  if (!result.success || !result.data) {
    redirect('/payment/failed?reason=verification_failed')
  }

  const { transactionCode, amount, transactionUuid } = result.data

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-green-400/20 to-green-600/20">
          <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={2} />
        </div>

        <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
          Payment Successful!
        </h1>

        <p className="mb-6 text-base text-primary/70 sm:text-lg">
          Your payment has been processed successfully. Thank you for your purchase!
        </p>

        {transactionCode && (
          <div className="mb-6 rounded-2xl bg-linear-to-br from-secondary/5 to-accent-2/5 p-6">
            <div className="mb-3">
              <p className="text-sm text-primary/60">Transaction Code</p>
              <p className="font-mono text-lg font-semibold text-primary">
                {transactionCode}
              </p>
            </div>
            {amount && (
              <div>
                <p className="text-sm text-primary/60">Amount Paid</p>
                <p className="font-heading text-2xl font-bold text-[#e8b647]">
                  NPR {amount}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <DownloadReceipt
            transactionCode={transactionCode}
            amount={amount}
            transactionUuid={transactionUuid}
          />
          <Link
            href="/"
            className="block w-full rounded-2xl bg-primary px-6 py-3 font-semibold text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
