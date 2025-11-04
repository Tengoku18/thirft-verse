import { getOrderById } from '@/actions/orders'
import { getProductById } from '@/actions/products'
import { getProfileById } from '@/actions'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle,
  Clock,
  XCircle,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Hash,
  Store,
  ExternalLink
} from 'lucide-react'
import { notFound } from 'next/navigation'
import DownloadReceipt from '@/_components/DownloadReceipt'
import CopyButton from '@/_components/CopyButton'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { formatProductPrice, formatCheckoutPrice } from '@/utils/formatPrice'

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  refunded: {
    icon: XCircle,
    label: 'Refunded',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params

  // Fetch order details
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  // Fetch full product and seller details
  const product = order.product_id ? await getProductById({ id: order.product_id }) : null
  const seller = order.seller_id ? await getProfileById({ id: order.seller_id }) : null

  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NP', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const formatAddress = (address: typeof order.shipping_address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading mb-2 text-3xl font-bold text-primary sm:text-4xl">
                Order Details
              </h1>
              {order.order_code && (
                <div className="flex items-center gap-2 text-primary/60">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono text-sm sm:text-base">{order.order_code}</span>
                  <CopyButton text={order.order_code} label="Copy order code" />
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 rounded-lg ${status.bgColor} ${status.borderColor} border px-4 py-2`}>
              <StatusIcon className={`h-4 w-4 ${status.color}`} strokeWidth={2} />
              <span className={`text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Product & Seller Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Product Card */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <div className="border-b border-border/30 bg-surface/30 px-6 py-4">
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
                  <Package className="h-5 w-5" />
                  Product Information
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  {/* Product Image */}
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg border border-border/30 bg-background sm:h-40 sm:w-40">
                    {product?.cover_image ? (
                      <Image
                        src={product.cover_image}
                        alt={order.product?.title || 'Product'}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface/50">
                        <Package className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading mb-3 text-xl font-bold text-primary sm:text-2xl">
                      {order.product?.title || 'Product'}
                    </h3>

                    <div className="space-y-2 text-sm text-primary/70">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">Quantity:</span>
                        <span className="rounded-full border border-border/30 bg-surface/50 px-3 py-0.5 font-mono font-medium text-primary">
                          {order.quantity}x
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">Unit Price:</span>
                        <span className="font-heading text-base font-bold text-[#e8b647] sm:text-lg">
                          {formatProductPrice(order.product?.price || 0, seller?.currency || 'USD', false)}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/30 pt-3">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-heading text-xl font-bold text-[#e8b647] sm:text-2xl">
                          {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            {seller && (
              <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
                <div className="border-b border-border/30 bg-surface/30 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
                    <Store className="h-5 w-5" />
                    Seller Information
                  </h2>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {seller.profile_image ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-secondary/20">
                        <Image
                          src={seller.profile_image}
                          alt={seller.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                        <span className="font-heading text-2xl font-bold text-primary">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-primary">
                        {seller.name}
                      </h3>
                      {seller.store_username && (
                        <p className="text-sm text-primary/60">@{seller.store_username}</p>
                      )}
                    </div>
                  </div>

                  {seller.store_username && (
                    <Link
                      href={getStorefrontUrl(seller.store_username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-surface/30 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Storefront
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Buyer & Shipping Information */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <div className="border-b border-border/30 bg-surface/30 px-6 py-4">
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Buyer Name */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary/60">Recipient Name</p>
                      <p className="font-heading text-lg font-bold text-primary">
                        {order.buyer_name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary/60">Email Address</p>
                      <p className="text-base text-primary">{order.buyer_email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary/60">Phone Number</p>
                      <p className="text-base text-primary">
                        {order.shipping_address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary/60">Shipping Address</p>
                      <p className="text-base leading-relaxed text-primary">
                        {formatAddress(order.shipping_address)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Order Info */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <div className="border-b border-border/30 bg-surface/30 px-6 py-4">
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Transaction Code */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-primary/60">
                      Transaction Code
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-medium text-primary">
                        {order.transaction_code}
                      </p>
                      <CopyButton text={order.transaction_code} label="Copy transaction code" />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-primary/60">
                      Payment Method
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-surface/50 px-3 py-1">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-primary/60">Order Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      <p className="text-sm text-primary">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Total Amount Highlight */}
                  <div className="mt-6 rounded-lg border border-border/30 bg-surface/50 p-4">
                    <p className="mb-1 text-sm font-semibold text-primary/60">
                      Total Amount Paid
                    </p>
                    <p className="font-heading text-3xl font-bold text-[#e8b647]">
                      {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                    </p>
                  </div>

                  {/* Download Receipt Button */}
                  <div className="mt-6">
                    <DownloadReceipt
                      transactionCode={order.transaction_code}
                      amount={order.amount.toString()}
                      transactionUuid={order.transaction_uuid}
                      currency={seller?.currency || 'NPR'}
                      quantity={order.quantity}
                      paymentDate={formatDate(order.created_at)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <div className="border-b border-border/30 bg-surface/30 px-6 py-4">
                <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <div className="h-3 w-3 rounded-full bg-green-600"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Order Placed</p>
                      <p className="text-xs text-primary/60">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {order.status === 'completed' && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">Payment Confirmed</p>
                        <p className="text-xs text-primary/60">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
