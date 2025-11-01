'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface PaymentSuccessToastProps {
  orderError: boolean
}

export default function PaymentSuccessToast({ orderError }: PaymentSuccessToastProps) {
  useEffect(() => {
    if (orderError) {
      toast.error(
        'Payment was successful, but there was an issue creating your order. Our team has been notified and will process your order manually.',
        {
          duration: 6000,
        }
      )
    }
  }, [orderError])

  return null
}
