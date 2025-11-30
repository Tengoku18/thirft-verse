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
  ExternalLink,
  ArrowLeft
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
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  refunded: {
    icon: XCircle,
    label: 'Refunded',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
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
    <div className="min-h-screen bg-surface/30 py-8 px-4 sm:py-12">
      {/* Back to Home Button */}
      <div className="mx-auto max-w-4xl mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Paper Container */}
      <div className="mx-auto max-w-4xl bg-white shadow-xl shadow-primary/5 sm:rounded-sm">
        {/* Header Section */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
                Order Confirmation
              </h1>
              {order.order_code && (
                <div className="mt-3 flex items-center gap-2 text-primary/60">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono text-sm font-medium">{order.order_code}</span>
                  <CopyButton text={order.order_code} label="Copy order code" />
                </div>
              )}
              <p className="mt-2 text-sm text-primary/50">
                Thank you for your purchase! Here are your order details.
              </p>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 rounded-full ${status.bgColor} px-4 py-2`}>
              <StatusIcon className={`h-5 w-5 ${status.color}`} strokeWidth={2} />
              <span className={`text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 sm:mx-10 h-px bg-primary/10" />

        {/* Product Section */}
        <div className="px-6 py-8 sm:px-10">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-primary/50" />
            <h2 className="font-heading text-lg font-semibold text-primary">
              Product Information
            </h2>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Product Image */}
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-surface/50 sm:h-40 sm:w-40">
              {product?.cover_image ? (
                <Image
                  src={product.cover_image}
                  alt={order.product?.title || 'Product'}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-12 w-12 text-primary/20" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-xl font-bold text-primary sm:text-2xl leading-tight">
                {order.product?.title || 'Product'}
              </h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-primary/50">Quantity</span>
                  <span className="font-semibold text-primary">{order.quantity}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary/50">Unit Price</span>
                  <span className="font-semibold text-primary">
                    {formatProductPrice(order.product?.price || 0, seller?.currency || 'USD', false)}
                  </span>
                </div>
                {order.shipping_fee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-primary/50">Shipping</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-600">
                        +{formatCheckoutPrice(order.shipping_fee, seller?.currency || 'NPR')}
                      </span>
                      <span className="text-xs text-primary/40">
                        ({order.shipping_option === 'home' ? 'Home Delivery' : 'Branch Pickup'})
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <span className="text-primary/50">Total</span>
                  <span className="font-heading text-2xl font-bold text-[#e8b647]">
                    {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 sm:mx-10 h-px bg-primary/10" />

        {/* Two Column Info Section */}
        <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-primary/10">
          {/* Left Column - Delivery Info */}
          <div className="px-6 py-8 sm:px-10">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary/50" />
              <h2 className="font-heading text-lg font-semibold text-primary">
                Delivery Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 shrink-0 text-primary/40 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs text-primary/50">Recipient</p>
                  <p className="font-medium text-primary">{order.buyer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary/40 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs text-primary/50">Email</p>
                  <p className="text-sm text-primary">{order.buyer_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary/40 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs text-primary/50">Phone</p>
                  <p className="text-sm text-primary">{order.shipping_address.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary/40 mt-0.5" strokeWidth={2} />
                <div>
                  <p className="text-xs text-primary/50">Shipping Address</p>
                  <p className="text-sm text-primary leading-relaxed">
                    {formatAddress(order.shipping_address)}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {seller && (
              <>
                <div className="my-6 h-px bg-primary/10 lg:hidden" />
                <div className="mt-8 hidden lg:block">
                  <div className="flex items-center gap-2 mb-4">
                    <Store className="h-5 w-5 text-primary/50" />
                    <h2 className="font-heading text-lg font-semibold text-primary">
                      Seller
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {seller.profile_image ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={seller.profile_image}
                          alt={seller.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                        <span className="font-heading text-lg font-bold text-primary">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">{seller.name}</p>
                      {seller.store_username && (
                        <p className="text-xs text-primary/50">@{seller.store_username}</p>
                      )}
                    </div>
                    {seller.store_username && (
                      <Link
                        href={getStorefrontUrl(seller.store_username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit Store
                      </Link>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Payment Info */}
          <div className="px-6 py-8 sm:px-10">
            {/* Mobile Divider */}
            <div className="mb-8 h-px bg-primary/10 lg:hidden" />

            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-primary/50" />
              <h2 className="font-heading text-lg font-semibold text-primary">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Only show transaction code for non-COD payments */}
              {order.payment_method !== 'Cash on Delivery' && (
                <div>
                  <p className="text-xs text-primary/50">Transaction Code</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-mono text-sm font-medium text-primary">
                      {order.transaction_code}
                    </p>
                    <CopyButton text={order.transaction_code} label="Copy" />
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-primary/50">Payment Method</p>
                <p className="mt-1 text-sm font-medium text-primary">{order.payment_method}</p>
              </div>

              <div>
                <p className="text-xs text-primary/50">Order Date</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary/40" strokeWidth={2} />
                  <p className="text-sm text-primary">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-6 rounded-lg bg-[#e8b647]/5 p-4">
                <p className="text-xs text-primary/60">
                  {order.payment_method === 'Cash on Delivery' ? 'Total Amount to Pay' : 'Total Amount Paid'}
                </p>
                <p className="font-heading text-3xl font-bold text-[#e8b647] mt-1">
                  {formatCheckoutPrice(order.amount, seller?.currency || 'NPR')}
                </p>
                {order.shipping_fee > 0 && (
                  <p className="text-xs text-primary/50 mt-2">
                    Includes shipping fee of {formatCheckoutPrice(order.shipping_fee, seller?.currency || 'NPR')}
                  </p>
                )}
              </div>

              {/* Download Receipt Button - Only for buyers and non-COD */}
              {isBuyer && order.payment_method !== 'Cash on Delivery' && (
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

              {/* COD Information */}
              {order.payment_method === 'Cash on Delivery' && (
                <div className="mt-4 rounded-lg bg-amber-50 p-4 border border-amber-200">
                  <p className="text-sm font-medium text-amber-900">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Please keep the exact amount ready when receiving your order. Payment will be collected upon delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary/50" />
                <h2 className="font-heading text-lg font-semibold text-primary">
                  Timeline
                </h2>
              </div>

              <div className="relative space-y-3 pl-5">
                {/* Vertical line */}
                <div className="absolute left-[3px] top-1 bottom-1 w-px bg-green-300" />

                <div className="relative flex items-start gap-3">
                  <div className="absolute -left-5 flex h-4 w-4 items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Order Placed</p>
                    <p className="text-xs text-primary/50">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {order.status === 'completed' && (
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-5 flex h-4 w-4 items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">Payment Confirmed</p>
                      <p className="text-xs text-primary/50">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Seller Info */}
            {seller && (
              <div className="mt-8 lg:hidden">
                <div className="mb-6 h-px bg-primary/10" />
                <div className="flex items-center gap-2 mb-4">
                  <Store className="h-5 w-5 text-primary/50" />
                  <h2 className="font-heading text-lg font-semibold text-primary">
                    Seller
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {seller.profile_image ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={seller.profile_image}
                        alt={seller.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                      <span className="font-heading text-lg font-bold text-primary">
                        {seller.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate">{seller.name}</p>
                    {seller.store_username && (
                      <p className="text-xs text-primary/50">@{seller.store_username}</p>
                    )}
                  </div>
                  {seller.store_username && (
                    <Link
                      href={getStorefrontUrl(seller.store_username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit Store
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Button Section - Only for buyers */}
        {isBuyer && (
          <div className="px-6 pb-8 sm:px-10">
            <div className="h-px bg-primary/10 mb-6" />
            <ReportProductButton orderId={order.id} orderDate={order.created_at} />
          </div>
        )}
      </div>
    </div>
  )
}
