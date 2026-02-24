'use client';

import { Product, ProductWithStore } from '@/types/database';
import { formatProductPrice } from '@/utils/formatPrice';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product | ProductWithStore;
  currency?: string;
}

const ProductCard = ({ product, currency = 'USD' }: ProductCardProps) => {
  const store = 'store' in product ? product.store : null;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-2xl">
        {/* Image */}
        <Link
          href={`/product/${product.id}`}
          className="relative block aspect-square overflow-hidden bg-neutral-100 sm:aspect-[5/4]"
        >
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-neutral-400 sm:text-sm">
                No image
              </span>
            </div>
          )}

          {/* Sold Badge */}
          {product.availability_count === 0 && (
            <div className="absolute top-2 right-2">
              <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold text-white shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="space-y-1.5 p-2.5 sm:space-y-2 sm:p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-neutral-900 transition-colors group-hover:text-[#D4A373] sm:text-base">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-[#D4A373] sm:text-lg">
              {formatProductPrice(product.price, currency)}
            </p>

            {/* Quick View Button */}
            <Link href={`/product/${product.id}`} className="shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-neutral-900 sm:h-10 sm:w-10">
                <ArrowUpRight className="h-4 w-4 text-neutral-900 transition-colors group-hover:text-white sm:h-5 sm:w-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
