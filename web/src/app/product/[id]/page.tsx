import { getProductById, getProductsByStoreId } from '@/actions'
import BuyNowButton from '@/_components/BuyNowButton'
import ImageGallery from '@/_components/ImageGallery'
import ProductCard from '@/_components/ProductCard'
import { ArrowLeft, Store } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border/50 bg-linear-to-b from-secondary/10 via-accent-2/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <ImageGallery images={allImages} productTitle={product.title} />

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Store Badge */}
            {product.store && (
              <Link
                href={`/`}
                className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary/20"
              >
                <Store className="h-4 w-4" />
                {product.store.name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="font-heading mb-4 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <p className="font-heading text-4xl font-bold text-[#e8b647] sm:text-5xl">
                <span className="text-xl sm:text-2xl">{currency === 'USD' ? '$' : currency}</span>
                {product.price}
              </p>
              {product.status === 'available' && (
                <span className="rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-primary">
                  In Stock
                </span>
              )}
              {product.status === 'out_of_stock' && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary/70">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="font-heading mb-2 text-lg font-semibold text-primary">
                  Description
                </h2>
                <p className="leading-relaxed text-primary/80">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-linear-to-br from-secondary/5 to-accent-2/5 p-6">
              <div>
                <p className="mb-1 text-sm text-primary/60">Category</p>
                <p className="font-semibold text-primary">{product.category}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-primary/60">Availability</p>
                <p className="font-semibold text-primary">
                  {product.availability_count} {product.availability_count === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <BuyNowButton
                productId={product.id}
                productName={product.title}
                price={product.price}
                currency={currency}
                isOutOfStock={product.status === 'out_of_stock'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* More from this store */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border/50 bg-linear-to-b from-secondary/10 via-accent-2/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                More from {product.store?.name}
              </h2>
              <Link
                href="/"
                className="text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
