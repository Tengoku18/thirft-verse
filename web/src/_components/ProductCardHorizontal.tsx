'use client'

import { Product, ProductWithStore } from '@/types/database'
import { ShoppingCart, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatProductPrice } from '@/utils/formatPrice'

interface ProductCardHorizontalProps {
  product: Product | ProductWithStore
  currency?: string
}

const ProductCardHorizontal = ({ product, currency = 'USD' }: ProductCardHorizontalProps) => {
  const store = 'store' in product ? product.store : null
  const isNew = product.created_at
    ? new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false

  return (
    <div className="group relative flex gap-4 rounded-2xl bg-white p-4 transition-all hover:shadow-md">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="relative h-40 w-40 shrink-0">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-50">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="160px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-1 h-12 w-12 rounded-full bg-gray-200" />
                <p className="text-xs text-gray-400">No Image</p>
              </div>
            </div>
          )}

          {/* New Badge */}
          {isNew && (
            <div className="absolute left-2 top-2">
              <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                New
              </span>
            </div>
          )}

          {/* Sold Out Overlay */}
          {product.availability_count === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-bold text-white">
                SOLD OUT
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600">
              {formatProductPrice(product.price, currency)}
            </span>
          </div>

          {/* Seller Info */}
          {store && (
            <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Seller: {store.name || store.store_username || 'Unknown'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 justify-center">
        <Link
          href={`/product/${product.id}`}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to cart</span>
        </Link>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
          <Heart className="h-4 w-4" />
          <span>Add to wishlist</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCardHorizontal
