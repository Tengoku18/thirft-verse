import { getProductById, getProductsByStoreId } from '@/actions'
import ProductPurchaseSection from '@/_components/ProductPurchaseSection'
import ImageGallery from '@/_components/ImageGallery'
import ProductCard from '@/_components/ProductCard'
import ExpandableDescription from '@/_components/ExpandableDescription'
import CartButton from '@/_components/cart/CartButton'
import SectionDivider from '@/_components/store/SectionDivider'
import StoreMinimalFooter from '@/_components/store/StoreMinimalFooter'
import { formatProductPrice, getCurrencySymbol } from '@/utils/formatPrice'
import BackButton from '@/_components/BackButton'
import { ArrowUpRight, Compass, Mail, ShieldCheck, Store, Truck } from 'lucide-react'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

/**
 * ISR Configuration
 * Revalidate product pages every 30 seconds to ensure accurate
 * availability and pricing information.
 * @see /src/lib/constants/cache.ts for documentation
 */
export const revalidate = 30

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById({ id })

  if (!product) {
    return {
      title: 'Product Not Found | Thriftverse',
      description: 'This product does not exist.',
    }
  }

  // Get current host to build the URL
  const headersList = await headers()
  const host = headersList.get('host') || 'thriftverse.shop'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const productUrl = `${protocol}://${host}/product/${id}`

  const currency = product.store?.currency || 'NPR'
  const formattedPrice = formatProductPrice(product.price, currency)
  const title = `${product.title} - ${formattedPrice} | ${product.store?.name || 'Thriftverse'}`
  const description =
    product.description?.slice(0, 160) ||
    `${product.title} available for ${formattedPrice} at ${product.store?.name || 'Thriftverse'}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'Thriftverse',
      images: product.cover_image
        ? [
            {
              url: product.cover_image,
              width: 800,
              height: 800,
              alt: product.title,
            },
          ]
        : [
            {
              url: 'https://www.thriftverse.shop/images/horizontal-logo.png',
              width: 1200,
              height: 630,
              alt: 'Thriftverse',
            },
          ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.cover_image
        ? [product.cover_image]
        : ['https://www.thriftverse.shop/images/horizontal-logo.png'],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById({ id })

  if (!product) {
    notFound()
  }

  const allImages = [product.cover_image, ...(product.other_images || [])].filter(Boolean)
  const currency = product.store?.currency || 'USD'

  // Fetch more products from the same store
  const { data: moreProducts } = await getProductsByStoreId(product.store_id, {
    status: 'available',
    limit: 4,
  })

  // Filter out the current product and limit to 3 items
  const relatedProducts = moreProducts.filter((p) => p.id !== product.id).slice(0, 3)

  const isOutOfStock = product.status === 'out_of_stock' || product.availability_count === 0
  const isLowStock = !isOutOfStock && product.availability_count > 0 && product.availability_count <= 3
  const currencySymbol = getCurrencySymbol(currency)
  const priceAmount = formatProductPrice(product.price, currency, false).replace(
    new RegExp(`^${currencySymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`),
    ''
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar: back action + Thriftverse brand */}
      <div className="border-border/60 bg-surface border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <BackButton />

          <Link
            href="/explore"
            aria-label="Explore more Thriftverse stores"
            className="group border-border/70 bg-surface text-primary/85 hover:border-primary/40 hover:text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-colors sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <Compass className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Explore more</span>
            <ArrowUpRight
              className="text-primary/40 group-hover:text-primary hidden h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:inline-block"
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image Gallery */}
          <ImageGallery images={allImages} productTitle={product.title} />

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Eyebrow: Visit Store */}
            {product.store && (
              <Link
                href="/"
                className="group border-border/70 bg-surface text-primary/80 hover:border-primary/40 hover:text-primary mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-xs font-semibold tracking-wide transition-colors sm:text-sm"
              >
                <Store className="h-3.5 w-3.5" strokeWidth={2} />
                <span>{product.store.name}</span>
                <ArrowUpRight
                  className="text-primary/40 group-hover:text-primary h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>
            )}

            {/* Category eyebrow */}
            <p className="text-primary/60 mb-2 font-sans text-[11px] font-semibold tracking-[0.22em] uppercase">
              {product.category}
            </p>

            {/* Product Title */}
            <h1 className="font-heading text-primary mb-5 text-2xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-[44px]">
              {product.title}
            </h1>

            {/* Price + availability */}
            <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-secondary font-heading text-base font-semibold sm:text-xl">
                  {currencySymbol}
                </span>
                <span className="text-secondary font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                  {priceAmount}
                </span>
              </div>

              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold tracking-wide text-red-700 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  Sold out
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-800 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Only {product.availability_count} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold tracking-wide text-emerald-800 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <ExpandableDescription description={product.description} />
              </div>
            )}

            {/* Meta key/value row */}
            <dl className="border-border/60 mb-8 grid grid-cols-2 divide-x divide-border/60 overflow-hidden rounded-2xl border bg-surface">
              <div className="p-4 sm:p-5">
                <dt className="text-primary/60 mb-1 font-sans text-[10px] font-semibold tracking-[0.18em] uppercase">
                  Category
                </dt>
                <dd className="text-primary font-sans text-sm font-semibold capitalize sm:text-base">
                  {product.category}
                </dd>
              </div>
              <div className="p-4 sm:p-5">
                <dt className="text-primary/60 mb-1 font-sans text-[10px] font-semibold tracking-[0.18em] uppercase">
                  Availability
                </dt>
                <dd className="text-primary font-sans text-sm font-semibold sm:text-base">
                  {product.availability_count}{' '}
                  {product.availability_count === 1 ? 'item' : 'items'}
                </dd>
              </div>
            </dl>

            {/* Purchase actions */}
            <div className="mt-auto">
              <ProductPurchaseSection
                productId={product.id}
                productName={product.title}
                price={product.price}
                currency={currency}
                availabilityCount={product.availability_count}
                isOutOfStock={isOutOfStock}
                storeId={product.store_id}
                storeName={product.store?.name || product.store?.store_username || 'Store'}
                coverImage={product.cover_image}
              />

              {/* Trust row */}
              <ul className="text-primary/65 mt-6 grid grid-cols-3 gap-2 border-t border-border/60 pt-5 text-center">
                <li className="flex flex-col items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-medium leading-tight">
                    Secure checkout
                  </span>
                </li>
                <li className="flex flex-col items-center gap-1.5">
                  <Truck className="h-4 w-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-medium leading-tight">
                    Shipped via NCM
                  </span>
                </li>
                <li className="flex flex-col items-center gap-1.5">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-medium leading-tight">
                    Email tracking
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* More from this store */}
      {relatedProducts.length > 0 && (
        <>
          <SectionDivider />
          <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8">
              <div className="min-w-0">
                <p className="text-primary/60 mb-1 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
                  Keep exploring
                </p>
                <h2 className="font-heading text-primary truncate text-xl font-bold tracking-tight sm:text-3xl">
                  More from {product.store?.name}
                </h2>
              </div>
              <Link
                href="/"
                className="text-primary/70 hover:text-primary inline-flex shrink-0 items-center gap-1 font-sans text-xs font-semibold tracking-wide transition-colors sm:text-sm"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  currency={currency}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Minimal brand footer */}
      <SectionDivider spacing="sm" />
      <footer className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <StoreMinimalFooter />
      </footer>

      {/* Floating Cart Button */}
      <CartButton storeId={product.store_id} />
    </div>
  )
}
