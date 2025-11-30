'use client'

import { createCodOrder, initiateEsewaPayment, initiateFonepayPayment } from '@/actions/payment'
import { getProductById } from '@/actions/products'
import CheckoutForm from '@/_components/CheckoutForm'
import PaymentMethodSelector, { PaymentMethod } from '@/_components/PaymentMethodSelector'
import ShippingOptionSelector, { ShippingOption, getShippingFee } from '@/_components/ShippingOptionSelector'
import { Product } from '@/types/database'
import { ShippingAddress } from '@/types/database'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa')
  const [shippingOption, setShippingOption] = useState<ShippingOption>(null)

  // Get product details from URL params
  const productId = searchParams.get('productId')
  const productName = searchParams.get('productName')
  const price = searchParams.get('price')
  const currency = searchParams.get('currency')
  const quantity = searchParams.get('quantity')

  // Fetch product details independently
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return

      try {
        setIsLoadingProduct(true)
        const productData = await getProductById({ id: productId })
        if (productData) {
          setProduct(productData)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [productId])

  // Validate required params
  if (!productId || !productName || !price || !currency || !quantity) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 font-heading text-2xl font-bold text-primary">
            Invalid Checkout Link
          </h1>
          <p className="mb-6 text-primary/60">
            Missing product information. Please try again.
          </p>
          <button
            onClick={() => router.back()}
            className="rounded-2xl bg-primary px-6 py-3 font-semibold text-surface transition-all hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const parsedQuantity = parseInt(quantity, 10)
  const unitPrice = parseFloat(price)
  const baseAmount = unitPrice * parsedQuantity

  // Get shipping fee based on selected shipping option
  const shippingFee = getShippingFee(shippingOption)
  const totalAmount = baseAmount + shippingFee

  const handleCheckoutSubmit = async (data: {
    buyer_name: string
    buyer_email: string
    shipping_address: ShippingAddress
  }) => {
    // Validate shipping option is selected
    if (!shippingOption) {
      toast.error('Please select a delivery method', {
        duration: 3000,
      })
      return
    }

    setIsProcessing(true)

    try {
      let result

      if (paymentMethod === 'esewa') {
        // Initiate eSewa payment
        result = await initiateEsewaPayment({
          amount: baseAmount,
          productId,
          productName,
          quantity: parsedQuantity,
          taxAmount: 0,
          deliveryCharge: shippingFee,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: data.shipping_address,
          shippingOption: shippingOption,
        })

        if (result.success && result.formHtml) {
          // Open the payment form in a new window or current window
          const paymentWindow = window.open('', '_self')
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml)
            paymentWindow.document.close()
          }
        } else {
          toast.error(`Payment initiation failed: ${result.error || 'Unknown error'}`, {
            duration: 5000,
          })
          setIsProcessing(false)
        }
      } else if (paymentMethod === 'fonepay') {
        // Initiate FonePay payment
        result = await initiateFonepayPayment({
          amount: baseAmount,
          productId,
          productName,
          quantity: parsedQuantity,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: data.shipping_address,
          shippingFee: shippingFee,
          shippingOption: shippingOption,
        })

        if (result.success && result.formHtml) {
          // Open the payment form in a new window or current window
          const paymentWindow = window.open('', '_self')
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml)
            paymentWindow.document.close()
          }
        } else {
          toast.error(`Payment initiation failed: ${result.error || 'Unknown error'}`, {
            duration: 5000,
          })
          setIsProcessing(false)
        }
      } else if (paymentMethod === 'cod') {
        // Create COD order directly
        result = await createCodOrder({
          productId,
          productName,
          quantity: parsedQuantity,
          amount: baseAmount,
          shippingFee,
          shippingOption: shippingOption,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: data.shipping_address,
        })

        if (result.success && result.orderId) {
          toast.success('Order placed successfully!', {
            duration: 3000,
          })
          // Redirect to order confirmation page
          router.push(`/order/${result.orderId}?view=buyer`)
        } else {
          toast.error(result.error || 'Failed to place order', {
            duration: 5000,
          })
          setIsProcessing(false)
        }
      }
    } catch (error) {
      console.error('Error processing order:', error)
      toast.error('Failed to process order. Please try again.', {
        duration: 5000,
      })
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back Button */}
        {!isProcessing && (
          <button
            onClick={handleClose}
            className="mb-6 flex items-center gap-2 text-primary/60 transition-colors hover:text-primary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium">Back to product</span>
          </button>
        )}

        {isProcessing ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-2xl bg-background p-12 text-center shadow-xl">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <p className="font-heading text-xl font-semibold text-primary">
                Processing...
              </p>
              <p className="mt-2 text-sm text-primary/60">
                {paymentMethod === 'cod' ? 'Creating your order...' : 'Redirecting to payment gateway...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Shipping Option Selection */}
            <div className="rounded-2xl bg-background p-6 shadow-xl">
              <ShippingOptionSelector
                selectedOption={shippingOption}
                onOptionChange={setShippingOption}
                currency={currency}
              />
            </div>

            {/* Payment Method Selection */}
            <div className="rounded-2xl bg-background p-6 shadow-xl">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />
            </div>

            {/* Checkout Form */}
            <div className="rounded-2xl bg-background shadow-xl">
              <CheckoutForm
                productName={productName}
                price={unitPrice}
                currency={currency}
                quantity={parsedQuantity}
                totalAmount={totalAmount}
                product={product}
                isLoadingProduct={isLoadingProduct}
                onSubmit={handleCheckoutSubmit}
                shippingFee={shippingFee}
                shippingOption={shippingOption}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
            <p className="font-heading text-xl font-semibold text-primary">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
