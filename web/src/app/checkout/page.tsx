'use client'

import { createCodOrder, initiateEsewaPayment, initiateFonepayPayment } from '@/actions/payment'
import { getProductById } from '@/actions/products'
import Button from '@/_components/common/Button'
import CheckoutStepper, { Step } from '@/_components/CheckoutStepper'
import { FormInput, FormSelect } from '@/_components/forms'
import PaymentMethodSelector, { PaymentMethod } from '@/_components/PaymentMethodSelector'
import ShippingOptionSelector, { ShippingOption, getShippingFee } from '@/_components/ShippingOptionSelector'
import { CheckoutFormData, checkoutSchema } from '@/lib/validations/checkout'
import { Product, ShippingAddress } from '@/types/database'
import { formatCheckoutPrice, formatProductPrice } from '@/utils/formatPrice'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowLeft, ArrowRight, Check, Package, MapPin, CreditCard, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const CHECKOUT_STEPS: Step[] = [
  { id: 1, name: 'Delivery Method', shortName: 'Delivery' },
  { id: 2, name: 'Shipping Details', shortName: 'Details' },
  { id: 3, name: 'Payment Method', shortName: 'Payment' },
  { id: 4, name: 'Review & Pay', shortName: 'Review' },
]

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
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

  // Form setup
  const {
    register,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      buyer_name: '',
      buyer_email: '',
      phone: '',
      street: '',
      city: '',
      state: 'Bagmati',
      postal_code: '',
      country: 'Nepal',
    },
  })

  // Fetch product details
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
  const shippingFee = getShippingFee(shippingOption)
  const totalAmount = baseAmount + shippingFee

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!shippingOption) {
        toast.error('Please select a delivery method')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Validate form fields
      const isValid = await trigger(['buyer_name', 'buyer_email', 'phone', 'street', 'city', 'state', 'postal_code'])
      if (!isValid) {
        toast.error('Please fill in all required fields')
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    }
  }

  const handleCheckoutSubmit = async () => {
    const data = getValues()

    if (!shippingOption) {
      toast.error('Please select a delivery method')
      setCurrentStep(1)
      return
    }

    setIsProcessing(true)

    const shippingAddress: ShippingAddress = {
      street: data.street,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      phone: data.phone,
    }

    try {
      let result

      if (paymentMethod === 'esewa') {
        result = await initiateEsewaPayment({
          amount: baseAmount,
          productId,
          productName,
          quantity: parsedQuantity,
          taxAmount: 0,
          deliveryCharge: shippingFee,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
          shippingOption: shippingOption,
        })

        if (result.success && result.formHtml) {
          const paymentWindow = window.open('', '_self')
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml)
            paymentWindow.document.close()
          }
        } else {
          toast.error(`Payment initiation failed: ${result.error || 'Unknown error'}`)
          setIsProcessing(false)
        }
      } else if (paymentMethod === 'fonepay') {
        result = await initiateFonepayPayment({
          amount: baseAmount,
          productId,
          productName,
          quantity: parsedQuantity,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
          shippingFee: shippingFee,
          shippingOption: shippingOption,
        })

        if (result.success && result.formHtml) {
          const paymentWindow = window.open('', '_self')
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml)
            paymentWindow.document.close()
          }
        } else {
          toast.error(`Payment initiation failed: ${result.error || 'Unknown error'}`)
          setIsProcessing(false)
        }
      } else if (paymentMethod === 'cod') {
        result = await createCodOrder({
          productId,
          productName,
          quantity: parsedQuantity,
          amount: baseAmount,
          shippingFee,
          shippingOption: shippingOption,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
        })

        if (result.success && result.orderId) {
          toast.success('Order placed successfully!')
          router.push(`/order/${result.orderId}?view=buyer`)
        } else {
          toast.error(result.error || 'Failed to place order')
          setIsProcessing(false)
        }
      }
    } catch (error) {
      console.error('Error processing order:', error)
      toast.error('Failed to process order. Please try again.')
      setIsProcessing(false)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <Package className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  Choose Delivery Method
                </h2>
                <p className="text-sm text-primary/60">
                  How would you like to receive your order?
                </p>
              </div>
            </div>
            <ShippingOptionSelector
              selectedOption={shippingOption}
              onOptionChange={setShippingOption}
              currency={currency}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <MapPin className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  Shipping Details
                </h2>
                <p className="text-sm text-primary/60">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-primary">
                Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  {...register('buyer_name')}
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.buyer_name?.message}
                  required
                />
                <FormInput
                  {...register('buyer_email')}
                  type="email"
                  label="Email"
                  placeholder="john@example.com"
                  error={errors.buyer_email?.message}
                  required
                />
                <div className="sm:col-span-2">
                  <FormInput
                    {...register('phone')}
                    type="tel"
                    label="Phone Number"
                    placeholder="9876543210"
                    error={errors.phone?.message}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-primary">
                Shipping Address
              </h3>
              <div className="grid gap-4">
                <FormInput
                  {...register('street')}
                  label="Street Address"
                  placeholder="street | tole | path"
                  error={errors.street?.message}
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    {...register('city')}
                    label="City"
                    placeholder="Kathmandu"
                    error={errors.city?.message}
                    required
                  />
                  <FormSelect
                    {...register('state')}
                    label="Province"
                    error={errors.state?.message}
                    required
                    options={[
                      { value: 'Bagmati', label: 'Bagmati' },
                      { value: 'Gandaki', label: 'Gandaki' },
                      { value: 'Karnali', label: 'Karnali' },
                      { value: 'Koshi', label: 'Koshi' },
                      { value: 'Lumbini', label: 'Lumbini' },
                      { value: 'Madhesh', label: 'Madhesh' },
                      { value: 'Sudurpaschim', label: 'Sudurpaschim' },
                    ]}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    {...register('postal_code')}
                    label="Postal Code"
                    placeholder="44600"
                    error={errors.postal_code?.message}
                    required
                  />
                  <FormInput
                    {...register('country')}
                    label="Country"
                    error={errors.country?.message}
                    required
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <CreditCard className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  Payment Method
                </h2>
                <p className="text-sm text-primary/60">
                  How would you like to pay?
                </p>
              </div>
            </div>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                <ShoppingBag className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  Review Your Order
                </h2>
                <p className="text-sm text-primary/60">
                  Please confirm your order details
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Product */}
              <div className="rounded-2xl border border-border/30 bg-surface/50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-primary/60 uppercase tracking-wide">
                  Product
                </h4>
                <div className="flex gap-4">
                  {product?.cover_image && (
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
                      <Image
                        src={product.cover_image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-primary">{product?.title || productName}</p>
                    <p className="text-sm text-primary/60">Qty: {parsedQuantity}</p>
                    <p className="mt-1 font-semibold text-secondary">
                      {formatProductPrice(unitPrice, currency, false)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="rounded-2xl border border-border/30 bg-surface/50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-primary/60 uppercase tracking-wide">
                  Shipping To
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-primary">{getValues('buyer_name')}</p>
                  <p className="text-primary/70">{getValues('buyer_email')}</p>
                  <p className="text-primary/70">{getValues('phone')}</p>
                  <p className="text-primary/70">
                    {getValues('street')}, {getValues('city')}, {getValues('state')} {getValues('postal_code')}
                  </p>
                </div>
              </div>

              {/* Delivery & Payment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/30 bg-surface/50 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-primary/60 uppercase tracking-wide">
                    Delivery
                  </h4>
                  <p className="font-semibold text-primary">
                    {shippingOption === 'home' ? 'Home Delivery' : 'Branch Pickup'}
                  </p>
                  <p className="text-sm text-amber-600">
                    +{formatCheckoutPrice(shippingFee, currency)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/30 bg-surface/50 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-primary/60 uppercase tracking-wide">
                    Payment
                  </h4>
                  <p className="font-semibold text-primary">
                    {paymentMethod === 'esewa' ? 'eSewa' : paymentMethod === 'fonepay' ? 'FonePay' : 'Cash on Delivery'}
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-2xl bg-primary/5 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">Subtotal</span>
                    <span className="font-medium text-primary">{formatCheckoutPrice(baseAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">Shipping</span>
                    <span className="font-medium text-amber-600">+{formatCheckoutPrice(shippingFee, currency)}</span>
                  </div>
                  <div className="border-t border-primary/10 pt-2 flex justify-between">
                    <span className="font-semibold text-primary">Total</span>
                    <span className="font-heading text-2xl font-bold text-secondary">
                      {formatCheckoutPrice(totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface py-6 sm:py-12">
      <div className="mx-auto max-w-3xl px-4">
        {/* Back Button */}
        {!isProcessing && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-primary/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">
              {currentStep === 1 ? 'Back to product' : 'Back'}
            </span>
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
            {/* Product Summary - Always visible */}
            <div className="rounded-2xl bg-background p-4 shadow-lg border border-border/20">
              <div className="flex items-center gap-4">
                {isLoadingProduct ? (
                  <div className="h-16 w-16 animate-pulse rounded-xl bg-primary/10" />
                ) : product?.cover_image ? (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border/50">
                    <Image
                      src={product.cover_image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary truncate">
                    {product?.title || productName}
                  </p>
                  <p className="text-sm text-primary/60">Qty: {parsedQuantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl font-bold text-secondary">
                    {formatCheckoutPrice(totalAmount, currency)}
                  </p>
                  {shippingFee > 0 && (
                    <p className="text-xs text-primary/50">incl. shipping</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="rounded-2xl bg-background p-4 sm:p-6 shadow-lg border border-border/20">
              <CheckoutStepper
                steps={CHECKOUT_STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Step Content */}
            <div className="rounded-2xl bg-background p-4 sm:p-6 shadow-lg border border-border/20">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={handleBack}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="w-full sm:flex-1"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleCheckoutSubmit}
                    className="w-full sm:flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {paymentMethod === 'cod'
                      ? `Place Order - ${formatCheckoutPrice(totalAmount, currency)}`
                      : `Pay ${formatCheckoutPrice(totalAmount, currency)}`}
                  </Button>
                )}
              </div>
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
