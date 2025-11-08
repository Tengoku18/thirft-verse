'use client'

import { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, Shield } from 'lucide-react'
import { reportProductNotReceived } from '@/actions/orders'
import { hasDaysPassed, getDaysPassed } from '@/lib/utils/date'
import Button from '@/_components/common/Button'

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
      <div className="overflow-hidden rounded-lg border border-green-200 bg-green-50">
        <div className="flex items-center gap-3 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-bold text-green-900">
              Alert Sent Successfully
            </h3>
            <p className="text-sm leading-relaxed text-green-700">
              The seller has been notified about this issue and will respond shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <Shield className="h-5 w-5 text-primary/70" />
          <h2 className="font-heading text-xl font-bold text-primary">
            Buyer Protection
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-primary/70 leading-relaxed">
            Haven&apos;t received your product? You can report this issue after 7 days to alert the seller.
          </p>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
                <p className="text-sm font-semibold text-red-900">{error}</p>
              </div>
            </div>
          )}

          {!canReport && !isLocalEnv && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-yellow-700" strokeWidth={2} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900">
                    Available in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </p>
                  <p className="text-xs font-medium text-yellow-700 mt-0.5">
                    Sellers have 7 days to ship items before reports can be filed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isLocalEnv && !hasDaysPassed(orderDate, 7) && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2">
              <p className="text-xs font-semibold text-blue-900">
                🔧 Development Mode Active - Time restriction bypassed
              </p>
            </div>
          )}

          <Button
            onClick={handleReport}
            disabled={!canReport || isLoading}
            variant="danger"
            size="lg"
            fullWidth
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span className="text-sm sm:text-base">Sending Alert...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="text-sm sm:text-base">I Haven&apos;t Received the Product</span>
              </>
            )}
          </Button>

          {canReport && !isLoading && (
            <p className="text-xs text-center font-medium text-primary/60 px-4 leading-relaxed">
              This will send an urgent notification to the seller with your order details.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
