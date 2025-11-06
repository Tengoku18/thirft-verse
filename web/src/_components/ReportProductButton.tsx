'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, Shield } from 'lucide-react'
import { reportProductNotReceived } from '@/actions/orders'
import { hasDaysPassed, getDaysPassed } from '@/lib/utils/date'

interface ReportProductButtonProps {
  orderId: string
  orderDate: string
}

export default function ReportProductButton({
  orderId,
  orderDate,
}: ReportProductButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isReported, setIsReported] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bypass time limitation in local/development environment
  const isLocalEnv = process.env.NODE_ENV === 'development' ||
                     typeof window !== 'undefined' &&
                     (window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1')

  const canReport = isLocalEnv || hasDaysPassed(orderDate, 7)
  const daysPassed = getDaysPassed(orderDate)
  const daysRemaining = Math.max(0, 7 - daysPassed)

  const handleReport = async () => {
    if (!canReport || isLoading || isReported) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await reportProductNotReceived(orderId)

      if (result.success) {
        setIsReported(true)
      } else {
        setError(result.error || 'Failed to send alert. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Error reporting product not received:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isReported) {
    return (
      <div className="overflow-hidden rounded-xl border border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
        <div className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50">
            <CheckCircle className="h-7 w-7 text-green-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-bold text-green-900">
              Alert Sent Successfully
            </h3>
            <p className="text-sm leading-relaxed text-green-700">
              The seller has been notified about this issue and will respond shortly. You may also receive a follow-up email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/30">
          <Shield className="h-5 w-5 text-primary/70" />
          <h2 className="font-heading text-xl font-bold text-primary">
            Buyer Protection
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-primary/70">
            Haven&apos;t received your product? You can report this issue after 7 days to alert the seller.
          </p>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!canReport && !isLocalEnv && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-4 w-4 text-yellow-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900">
                    Available in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    Sellers have 7 days to ship items before reports can be filed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLocalEnv && !hasDaysPassed(orderDate, 7) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
              <p className="text-xs font-medium text-blue-800">
                🔧 Development Mode Active - Time restriction bypassed
              </p>
            </div>
          )}

          <button
            onClick={handleReport}
            disabled={!canReport || isLoading}
            className={`w-full rounded-lg px-6 py-3.5 font-semibold transition-all ${
              canReport && !isLoading
                ? 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg active:scale-[0.98]'
                : 'cursor-not-allowed bg-primary/5 text-primary/30 border border-border/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Sending Alert...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
                  <span>I Haven&apos;t Received the Product</span>
                </>
              )}
            </div>
          </button>

          {canReport && !isLoading && (
            <p className="text-xs text-center text-primary/60 px-4">
              This will send an urgent notification to the seller with your order details.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
