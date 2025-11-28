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
import ReportProductButton from '@/_components/ReportProductButton'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { formatProductPrice, formatCheckoutPrice } from '@/utils/formatPrice'

interface OrderDetailsPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    view?: 'buyer' | 'seller'
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

export default async function OrderDetailsPage({ params, searchParams }: OrderDetailsPageProps) {
  const { id } = await params
  const { view } = await searchParams

  // Fetch order details
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  // Determine if viewer is the buyer based on searchParams
  const isBuyer = view === 'buyer'

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface/20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-surface/30 p-6 sm:p-8 border border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
                Order Confirmation
              </h1>
              {order.order_code && (
                <div className="flex items-center gap-2 text-primary/70">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono text-sm sm:text-base font-medium">{order.order_code}</span>
                  <CopyButton text={order.order_code} label="Copy order code" />
                </div>
              )}
              <p className="mt-2 text-sm text-primary/60">
                Thank you for your purchase! Here are your order details.
              </p>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 rounded-lg ${status.bgColor} ${status.borderColor} border px-4 py-2`}>
              <StatusIcon className={`h-5 w-5 ${status.color}`} strokeWidth={2} />
              <span className={`text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Product Card - Full Width */}
        <div className="overflow-hidden rounded-lg border border-border bg-background mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <Package className="h-5 w-5 text-primary/70" />
              <h2 className="font-heading text-xl font-bold text-primary">
                Product Information
              </h2>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Product Image */}
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-background sm:h-48 sm:w-48">
                {product?.cover_image ? (
                  <Image
                    src={product.cover_image}
                    alt={order.product?.title || 'Product'}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface/50">
                    <Package className="h-16 w-16 text-primary/30" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading mb-4 text-2xl font-bold text-primary sm:text-3xl leading-tight">
                  {order.product?.title || 'Product'}
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-primary/70">Quantity:</span>
                    <span className="rounded-full border border-border bg-surface/50 px-4 py-1 font-mono font-semibold text-primary">
                      {order.quantity}x
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-primary/70">Unit Price:</span>
                    <span className="font-heading text-lg font-bold text-[#e8b647] sm:text-xl">
                      {formatProductPrice(order.product?.price || 0, seller?.currency || 'USD', false)}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface/30 px-4 py-3">
                    <span className="font-bold text-primary/80">Total Amount:</span>
                    <span className="font-heading text-2xl font-bold text-[#e8b647] sm:text-3xl">
                      {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Seller & Order Info */}
          <div className="space-y-6">
            {/* Seller Information */}
            {seller && (
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <Store className="h-5 w-5 text-primary/70" />
                    <h2 className="font-heading text-xl font-bold text-primary">
                      Seller Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface/30 p-4">
                      {seller.profile_image ? (
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
                          <Image
                            src={seller.profile_image}
                            alt={seller.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/50 border border-border">
                          <span className="font-heading text-2xl font-bold text-primary">
                            {seller.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-bold text-primary truncate">
                          {seller.name}
                        </h3>
                        {seller.store_username && (
                          <p className="text-sm font-medium text-primary/60 truncate">@{seller.store_username}</p>
                        )}
                      </div>
                    </div>

                    {seller.store_username && (
                      <Link
                        href={getStorefrontUrl(seller.store_username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-surface/30 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface/50"
                      >
                        <ExternalLink className="h-4 w-4" strokeWidth={2} />
                        Visit Storefront
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buyer & Shipping Information */}
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <MapPin className="h-5 w-5 text-primary/70" />
                  <h2 className="font-heading text-xl font-bold text-primary">
                    Delivery Information
                  </h2>
                </div>
                <div className="space-y-3">
                  {/* Buyer Name */}
                  <div className="flex items-center gap-3 py-2">
                    <User className="h-4 w-4 shrink-0 text-primary/60" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary/60">Recipient Name</p>
                      <p className="font-semibold text-primary truncate">
                        {order.buyer_name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 py-2">
                    <Mail className="h-4 w-4 shrink-0 text-primary/60" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary/60">Email Address</p>
                      <p className="text-sm font-medium text-primary truncate">{order.buyer_email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 py-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary/60" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary/60">Phone Number</p>
                      <p className="text-sm font-medium text-primary">
                        {order.shipping_address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 py-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary/60 mt-0.5" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary/60 mb-1">Shipping Address</p>
                      <p className="text-sm leading-relaxed font-medium text-primary">
                        {formatAddress(order.shipping_address)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Timeline */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <CreditCard className="h-5 w-5 text-primary/70" />
                  <h2 className="font-heading text-xl font-bold text-primary">
                    Payment Details
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Transaction Code */}
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-primary/60">
                      Transaction Code
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-semibold text-primary">
                        {order.transaction_code}
                      </p>
                      <CopyButton text={order.transaction_code} label="Copy transaction code" />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-primary/60">
                      Payment Method
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/30 px-3 py-1">
                      <CreditCard className="h-4 w-4 text-primary" strokeWidth={2} />
                      <span className="text-sm font-semibold text-primary">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-primary/60">Order Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/60" strokeWidth={2} />
                      <p className="text-sm font-medium text-primary">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Total Amount Highlight */}
                  <div className="mt-5 rounded-lg border border-[#e8b647]/30 bg-[#e8b647]/5 p-4">
                    <p className="mb-1.5 text-xs font-medium text-primary/70">
                      Total Amount Paid
                    </p>
                    <p className="font-heading text-3xl font-bold text-[#e8b647]">
                      {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                    </p>
                  </div>

                  {/* Download Receipt Button - Only for buyers */}
                  {isBuyer && (
                    <div className="mt-4">
                      <DownloadReceipt
                        transactionCode={order.transaction_code}
                        amount={order.amount.toString()}
                        transactionUuid={order.transaction_uuid}
                        currency={seller?.currency || 'NPR'}
                        quantity={order.quantity}
                        paymentDate={formatDate(order.created_at)}
                        paymentMethod={order.payment_method}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="overflow-hidden rounded-lg border border-border bg-background">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <Clock className="h-5 w-5 text-primary/70" />
                  <h2 className="font-heading text-xl font-bold text-primary">
                    Order Timeline
                  </h2>
                </div>
                <div className="relative space-y-3 pl-6">
                  {/* Vertical line */}
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-green-600/30"></div>

                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-6 flex h-4 w-4 items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    </div>
                    <div className="flex-1 py-1">
                      <p className="text-sm font-semibold text-green-900">Order Placed</p>
                      <p className="text-xs font-medium text-green-700 mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {order.status === 'completed' && (
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-6 flex h-4 w-4 items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <div className="flex-1 py-1">
                        <p className="text-sm font-semibold text-green-900">Payment Confirmed</p>
                        <p className="text-xs font-medium text-green-700 mt-0.5">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Product Not Received Button - Full Width, Only for buyers */}
        {isBuyer && (
          <div className="mt-6">
            <ReportProductButton orderId={order.id} orderDate={order.created_at} />
          </div>
        )}
      </div>
    </div>
  )
}
