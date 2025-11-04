'use client'

import { Product, ProductWithStore } from '@/types/database';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatProductPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  product: Product | ProductWithStore;
  currency?: string;
}

const ProductCard = ({ product, currency = 'USD' }: ProductCardProps) => {
  return (
    <div className="group relative">
      <Link
        href={`/product/${product.id}`}
        className="block"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="mx-auto mb-2 h-20 w-20 rounded-full bg-gray-300/50" />
                <p className="text-sm text-gray-400">No Image</p>
              </div>
            </div>
          )}

          {/* Sold Out Badge */}
          {product.availability_count === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="rounded-full bg-red-500 px-6 py-2 font-bold text-white shadow-lg">
                SOLD OUT
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 flex items-start justify-between gap-3 px-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading mb-1.5 line-clamp-2 text-lg font-bold text-primary transition-colors group-hover:text-secondary sm:text-xl">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-sm font-semibold text-[#e8b647] sm:text-base">
                {currency === 'USD' ? '$' : currency}
              </span>
              <span className="font-heading text-xl font-bold text-[#e8b647] sm:text-2xl">
                {formatProductPrice(product.price, currency, false).replace(/^[^\d,]+\s*/, '')}
              </span>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 sm:h-12 sm:w-12">
            <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-6 sm:w-6" strokeWidth={2.5} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
