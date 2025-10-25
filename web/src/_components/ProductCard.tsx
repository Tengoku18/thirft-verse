import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/dummyData';
import { Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency?: string;
}

const ProductCard = ({ product, currency = 'USD' }: ProductCardProps) => {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-secondary/5 to-accent-2/10 shadow-md ring-1 ring-border transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-secondary/40">
        {product.photo_url ? (
          <Image
            src={product.photo_url}
            alt={product.title}
            fill
            className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-95"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 300px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-border to-muted">
            <Store className="h-16 w-16 text-primary/30" strokeWidth={1.5} />
          </div>
        )}
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Product info below card */}
      <div className="mt-3 space-y-1.5">
        <h3 className="font-heading text-sm font-semibold text-primary transition-colors duration-300 group-hover:text-secondary sm:text-base">
          {product.title}
        </h3>
        <p className="font-heading text-base font-bold text-accent-1 sm:text-lg">
          {currency === 'USD' ? '$' : currency}
          {product.price}
        </p>
        {product.description && (
          <p className="line-clamp-2 text-xs text-primary/70 sm:text-sm">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
