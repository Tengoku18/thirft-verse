import CopyButton from '@/_components/CopyButton';
import DownloadReceipt from '@/_components/DownloadReceipt';
import ReportProductButton from '@/_components/ReportProductButton';
import { getProfileById } from '@/actions';
import { getOrderWithItems } from '@/actions/orders';
import { getProductById } from '@/actions/products';
import { getStorefrontUrl } from '@/utils/domainHelpers';
import { formatCheckoutPrice, formatProductPrice } from '@/utils/formatPrice';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Hash,
  Mail,
  MapPin,
  Package,
  Phone,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    view?: 'buyer' | 'seller';
  }>;
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
  processing: {
    icon: Package,
    label: 'Processing',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
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
  },
};

export default async function OrderDetailsPage({
  params,
  searchParams,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const { view } = await searchParams;

  // Fetch order details with items (for multi-product orders)
  const orderWithItems = await getOrderWithItems(id);

  if (!orderWithItems) {
    notFound();
  }

  const order = orderWithItems;

  // Determine if viewer is the buyer based on searchParams
  const isBuyer = view === 'buyer';

  // Check if this is a multi-product order
  const isMultiProduct = order.order_items && order.order_items.length > 0;
  const hasMultipleItems = isMultiProduct && order.order_items.length > 1;

  // Fetch full product and seller details
  const product = order.product_id
    ? await getProductById({ id: order.product_id })
    : null;
  const seller = order.seller_id
    ? await getProfileById({ id: order.seller_id })
    : null;

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const currency = seller?.currency || 'NPR';
  const shippingFee = order.shipping_fee || 0;
  const itemsSubtotal =
    order.items_subtotal ?? Math.max(order.amount - shippingFee, 0);
  const discountedItemsTotal = order.discounted_items_total ?? itemsSubtotal;
  const offerDiscountAmount =
    order.offer_discount_amount ??
    Math.max(0, itemsSubtotal - discountedItemsTotal);
  const hasOffer = Boolean(order.offer_code_text) && offerDiscountAmount > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NP', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const formatAddress = (address: typeof order.shipping_address) => {
    return `${address.street}, ${address.city}, ${address.district}, ${address.country}`;
  };

  const timelineEvents = [
    { status: 'Order Placed', added_time: order.created_at },
    ...(order.ncm_data?.status_history ?? []),
  ];

  return (
    <div className="bg-surface/30 min-h-screen px-4 py-8 sm:py-12">
      {/* Back to Home Button */}
      <div className="mx-auto mb-4 max-w-4xl">
        <Link
          href="/"
          className="text-primary/70 hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Paper Container */}
      <div className="shadow-primary/5 mx-auto max-w-4xl bg-white shadow-xl sm:rounded-sm">
        {/* Header Section */}
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="font-heading text-primary text-3xl font-bold sm:text-4xl">
                Order Confirmation
              </h1>
              {order.order_code && (
                <div className="text-primary/60 mt-3 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono text-sm font-medium">
                    {order.order_code}
                  </span>
                  <CopyButton text={order.order_code} label="Copy order code" />
                </div>
              )}
              <p className="text-primary/50 mt-2 text-sm">
                Thank you for your purchase! Here are your order details.
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`inline-flex items-center gap-2 rounded-full ${status.bgColor} px-4 py-2`}
            >
              <StatusIcon
                className={`h-5 w-5 ${status.color}`}
                strokeWidth={2}
              />
              <span className={`text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-primary/10 mx-6 h-px sm:mx-10" />

        {/* Product Section */}
        <div className="px-6 py-8 sm:px-10">
          <div className="mb-6 flex items-center gap-2">
            <Package className="text-primary/50 h-5 w-5" />
            <h2 className="font-heading text-primary text-lg font-semibold">
              {hasMultipleItems ? 'Order Items' : 'Product Information'}
            </h2>
          </div>

          {isMultiProduct ? (
            /* Multi-Product Order */
            <div className="space-y-4">
              {order.order_items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-surface/30 flex flex-col gap-4 rounded-lg p-4 sm:flex-row"
                >
                  {/* Product Image */}
                  <div className="bg-surface/50 relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                    {item.cover_image ? (
                      <Image
                        src={item.cover_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="text-primary/20 h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-primary text-lg leading-tight font-bold">
                      {item.product_name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-primary/50">Qty: </span>
                          <span className="text-primary font-semibold">
                            {item.quantity}x
                          </span>
                        </div>
                        <div>
                          <span className="text-primary/50">Price: </span>
                          <span className="text-primary font-semibold">
                            {formatProductPrice(
                              item.price,
                              seller?.currency || 'NPR',
                              false
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-lg font-bold text-[#e8b647]">
                          {formatCheckoutPrice(
                            item.price * item.quantity,
                            seller?.currency || 'NPR'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="bg-surface/30 mt-4 space-y-2 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary/50">
                    Subtotal (
                    {order.order_items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{' '}
                    items)
                  </span>
                  <span className="text-primary font-semibold">
                    {formatCheckoutPrice(itemsSubtotal, currency)}
                  </span>
                </div>
                {hasOffer && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary/50">
                        Offer ({order.offer_code_text})
                      </span>
                      <span className="font-semibold text-green-700">
                        -{formatCheckoutPrice(offerDiscountAmount, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary/50">Discounted Items</span>
                      <span className="text-primary font-semibold">
                        {formatCheckoutPrice(discountedItemsTotal, currency)}
                      </span>
                    </div>
                  </>
                )}
                {order.shipping_fee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary/50">Shipping</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-600">
                        +{formatCheckoutPrice(order.shipping_fee, currency)}
                      </span>
                      <span className="text-primary/40 text-xs">
                        (
                        {order.shipping_option === 'home'
                          ? 'Home Delivery'
                          : 'Branch Pickup'}
                        )
                      </span>
                    </div>
                  </div>
                )}
                <div className="border-primary/10 flex items-center justify-between border-t pt-2">
                  <span className="text-primary font-semibold">Total</span>
                  <span className="font-heading text-2xl font-bold text-[#e8b647]">
                    {formatCheckoutPrice(order.amount, currency)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Single Product Order (Legacy) */
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Product Image */}
              <div className="bg-surface/50 relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-40">
                {product?.cover_image ? (
                  <Image
                    src={product.cover_image}
                    alt={product?.title || 'Product'}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="text-primary/20 h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-primary text-xl leading-tight font-bold sm:text-2xl">
                  {product?.title || 'Product'}
                </h3>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-primary/50">Quantity</span>
                    <span className="text-primary font-semibold">
                      {order.quantity}x
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary/50">Items Subtotal</span>
                    <span className="text-primary font-semibold">
                      {formatCheckoutPrice(itemsSubtotal, currency)}
                    </span>
                  </div>
                  {hasOffer && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/50">Offer Code</span>
                        <span className="font-semibold text-green-700">
                          {order.offer_code_text}
                          {order.offer_discount_percent
                            ? ` (${order.offer_discount_percent}% OFF)`
                            : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/50">Offer Discount</span>
                        <span className="font-semibold text-green-700">
                          -{formatCheckoutPrice(offerDiscountAmount, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary/50">
                          Discounted Items
                        </span>
                        <span className="text-primary font-semibold">
                          {formatCheckoutPrice(discountedItemsTotal, currency)}
                        </span>
                      </div>
                    </>
                  )}
                  {order.shipping_fee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-primary/50">Shipping</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-600">
                          +{formatCheckoutPrice(order.shipping_fee, currency)}
                        </span>
                        <span className="text-primary/40 text-xs">
                          (
                          {order.shipping_option === 'home'
                            ? 'Home Delivery'
                            : 'Branch Pickup'}
                          )
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="border-primary/10 flex items-center justify-between border-t pt-2">
                    <span className="text-primary/50">Total</span>
                    <span className="font-heading text-2xl font-bold text-[#e8b647]">
                      {formatCheckoutPrice(order.amount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="bg-primary/10 mx-6 h-px sm:mx-10" />

        {/* Two Column Info Section */}
        <div className="lg:divide-primary/10 grid gap-0 lg:grid-cols-2 lg:divide-x">
          {/* Left Column - Delivery Info */}
          <div className="px-6 py-8 sm:px-10">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="text-primary/50 h-5 w-5" />
              <h2 className="font-heading text-primary text-lg font-semibold">
                Delivery Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User
                  className="text-primary/40 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-primary/50 text-xs">Recipient</p>
                  <p className="text-primary font-medium">{order.buyer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  className="text-primary/40 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-primary/50 text-xs">Email</p>
                  <p className="text-primary text-sm">{order.buyer_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  className="text-primary/40 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-primary/50 text-xs">Phone</p>
                  <p className="text-primary text-sm">
                    {order.shipping_address.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  className="text-primary/40 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={2}
                />
                <div>
                  <p className="text-primary/50 text-xs">Shipping Address</p>
                  <p className="text-primary text-sm leading-relaxed">
                    {formatAddress(order.shipping_address)}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {seller && (
              <>
                <div className="bg-primary/10 my-6 h-px lg:hidden" />
                <div className="mt-8 hidden lg:block">
                  <div className="mb-4 flex items-center gap-2">
                    <Store className="text-primary/50 h-5 w-5" />
                    <h2 className="font-heading text-primary text-lg font-semibold">
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
                      <div className="bg-surface flex h-10 w-10 items-center justify-center rounded-full">
                        <span className="font-heading text-primary text-lg font-bold">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-primary truncate font-semibold">
                        {seller.name}
                      </p>
                      {seller.store_username && (
                        <p className="text-primary/50 text-xs">
                          @{seller.store_username}
                        </p>
                      )}
                    </div>
                    {seller.store_username && (
                      <Link
                        href={getStorefrontUrl(seller.store_username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary flex items-center gap-1 text-xs font-medium hover:underline"
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
            <div className="bg-primary/10 mb-8 h-px lg:hidden" />

            <div className="mb-6 flex items-center gap-2">
              <CreditCard className="text-primary/50 h-5 w-5" />
              <h2 className="font-heading text-primary text-lg font-semibold">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Only show transaction code for non-COD payments */}
              {order.payment_method !== 'Cash on Delivery' && (
                <div>
                  <p className="text-primary/50 text-xs">Transaction Code</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-primary font-mono text-sm font-medium">
                      {order.transaction_code}
                    </p>
                    <CopyButton text={order.transaction_code} label="Copy" />
                  </div>
                </div>
              )}

              <div>
                <p className="text-primary/50 text-xs">Payment Method</p>
                <p className="text-primary mt-1 text-sm font-medium">
                  {order.payment_method}
                </p>
              </div>

              <div>
                <p className="text-primary/50 text-xs">Order Date</p>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar
                    className="text-primary/40 h-4 w-4"
                    strokeWidth={2}
                  />
                  <p className="text-primary text-sm">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-6 rounded-lg bg-[#e8b647]/5 p-4">
                <p className="text-primary/60 text-xs">
                  {order.payment_method === 'Cash on Delivery'
                    ? 'Total Amount to Pay'
                    : 'Total Amount Paid'}
                </p>
                <p className="font-heading mt-1 text-3xl font-bold text-[#e8b647]">
                  {formatCheckoutPrice(order.amount, currency)}
                </p>
                {hasOffer && (
                  <p className="mt-2 text-xs text-green-700">
                    {order.offer_code_text}
                    {order.offer_discount_percent
                      ? ` applied (${order.offer_discount_percent}% off): -${formatCheckoutPrice(offerDiscountAmount, currency)}`
                      : ` applied: -${formatCheckoutPrice(offerDiscountAmount, currency)}`}
                  </p>
                )}
                {order.shipping_fee > 0 && (
                  <p className="text-primary/50 mt-2 text-xs">
                    Includes shipping fee of{' '}
                    {formatCheckoutPrice(order.shipping_fee, currency)}
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
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    Please keep the exact amount ready when receiving your
                    order. Payment will be collected upon delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="text-primary/50 h-5 w-5" />
                <h2 className="font-heading text-primary text-lg font-semibold">
                  Timeline
                </h2>
              </div>

              <div className="relative">
                {/* Vertical line — left-[11px] centers it under the w-6 dot wrapper */}
                <div className="bg-primary/15 absolute top-3 bottom-3 left-[11px] w-px" />

                <div className="space-y-4">
                  {timelineEvents.map((event, index) => {
                    const isLast = index === timelineEvents.length - 1;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                          <div
                            className={`h-3 w-3 rounded-full ${isLast ? 'bg-green-500' : 'bg-primary/25'}`}
                          />
                        </div>
                        <div className="pt-0.5">
                          <p
                            className={`text-sm font-medium ${isLast ? 'text-green-700' : 'text-primary'}`}
                          >
                            {event.status}
                          </p>
                          <p className="text-primary/50 text-xs">
                            {formatDate(event.added_time)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Seller Info */}
            {seller && (
              <div className="mt-8 lg:hidden">
                <div className="bg-primary/10 mb-6 h-px" />
                <div className="mb-4 flex items-center gap-2">
                  <Store className="text-primary/50 h-5 w-5" />
                  <h2 className="font-heading text-primary text-lg font-semibold">
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
                    <div className="bg-surface flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="font-heading text-primary text-lg font-bold">
                        {seller.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-primary truncate font-semibold">
                      {seller.name}
                    </p>
                    {seller.store_username && (
                      <p className="text-primary/50 text-xs">
                        @{seller.store_username}
                      </p>
                    )}
                  </div>
                  {seller.store_username && (
                    <Link
                      href={getStorefrontUrl(seller.store_username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary flex items-center gap-1 text-xs font-medium hover:underline"
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
            <div className="bg-primary/10 mb-6 h-px" />
            <ReportProductButton
              orderId={order.id}
              orderDate={order.created_at}
            />
          </div>
        )}
      </div>
    </div>
  );
}
