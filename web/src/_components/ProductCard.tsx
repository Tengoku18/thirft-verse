'use client'

import { Product, ProductWithStore } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';
import { formatProductPrice } from '@/utils/formatPrice';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product | ProductWithStore;
  currency?: string;
}

const ProductCard = ({ product, currency = 'USD' }: ProductCardProps) => {
  const store = 'store' in product ? product.store : null;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <Link href={`/product/${product.id}`} className="block relative aspect-[5/4] overflow-hidden bg-neutral-100">
          {product.cover_image ? (
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-neutral-400">No image</span>
            </div>
          )}

          {/* Sold Badge */}
          {product.availability_count === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
              <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="p-4 space-y-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-[#D4A373] transition-colors">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#D4A373]">
              {formatProductPrice(product.price, currency)}
            </p>

            {/* Quick View Button */}
            <Link href={`/product/${product.id}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-neutral-900">
                <ArrowUpRight className="h-5 w-5 text-neutral-900 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
