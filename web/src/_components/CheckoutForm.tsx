'use client'

import Button from '@/_components/common/Button'
import { FormInput, FormSelect } from '@/_components/forms'
import { CheckoutFormData, checkoutSchema } from '@/lib/validations/checkout'
import { Product, ShippingAddress } from '@/types/database'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

interface CheckoutFormProps {
  productName: string
  price: number
  currency: string
  product: Product | null
  isLoadingProduct: boolean
  onSubmit: (data: {
    buyer_name: string
    buyer_email: string
    shipping_address: ShippingAddress
  }) => void
}

export default function CheckoutForm({
  productName,
  price,
  currency,
  product,
  isLoadingProduct,
  onSubmit,
}: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const onSubmitHandler = (data: CheckoutFormData) => {
    onSubmit({
      buyer_name: data.buyer_name,
      buyer_email: data.buyer_email,
      shipping_address: {
        street: data.street,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone: data.phone,
      },
    })
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="border-b border-border/50 bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">
              Checkout
            </h2>
            <p className="mt-1 text-sm text-primary/60">
              Complete your purchase
            </p>
          </div>
        </div>
      </div>

      {/* Product Info & Order Summary */}
      <div className="border-b border-border/50 bg-gradient-to-r from-secondary/5 to-accent-2/5 px-6 py-6">
        {isLoadingProduct ? (
          /* Loading Skeleton */
          <div className="flex gap-4">
            <div className="h-24 w-24 animate-pulse rounded-xl bg-primary/10"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10"></div>
              <div className="h-6 w-1/2 animate-pulse rounded bg-primary/10"></div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Product Image */}
            {product?.cover_image && (
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border/50 bg-surface">
                <Image
                  src={product.cover_image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            )}

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-primary/60">Product</p>
                <p className="mt-1 font-heading text-lg font-semibold text-primary">
                  {product?.title || productName}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-primary/60">
                  Total Amount:
                </span>
                <span className="font-heading text-2xl font-bold text-secondary">
                  {currency} {product?.price || price}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-6 px-3 py-5 lg:p-6"
      >
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

        {/* Buttons */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' : `Pay ${currency} ${price}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
