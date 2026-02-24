'use client';

import { ProductWithStore } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';
import { formatProductPrice } from '@/utils/formatPrice';
import { ArrowRight } from 'lucide-react';

interface ProductResultCardProps {
  product: ProductWithStore;
}

export default function ProductResultCard({ product }: ProductResultCardProps) {
  const currency = product.store?.currency || 'NPR';

  return (
    <Link
      href={`/product/${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 rounded-xl bg-white p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 hover:border-[#D4A373]/30"
    >
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
        {product.cover_image ? (
          <Image
            src={product.cover_image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-neutral-400">No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm sm:text-base text-neutral-900 line-clamp-2 mb-1">
          {product.title}
        </h4>

        {product.description && (
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-1 mb-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-[#D4A373]">
            {formatProductPrice(product.price, currency)}
          </span>

          {product.store && (
            <span className="text-xs text-neutral-500">
              by {product.store.name}
            </span>
          )}
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="flex items-center">
        <ArrowRight className="w-5 h-5 text-neutral-400" />
      </div>
    </Link>
  );
}
