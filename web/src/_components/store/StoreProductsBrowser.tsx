'use client';

import ProductCard from '@/_components/ProductCard';
import type { Product } from '@/types/database';
import { getUniqueCategories } from '@/utils/storeHelpers';
import { pluralize } from '@/utils/textHelpers';
import { PackageOpen } from 'lucide-react';
import { useMemo, useState } from 'react';

interface StoreProductsBrowserProps {
  products: Product[];
  currency?: string;
}

const ALL = '__all__';

const StoreProductsBrowser = ({
  products,
  currency,
}: StoreProductsBrowserProps) => {
  const categories = useMemo(() => getUniqueCategories(products), [products]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading count={0} />
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
      <SectionHeading count={products.length} />

      {categories.length > 1 && (
        <div
          role="tablist"
          aria-label="Filter products by category"
          className="hide-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:mb-8 sm:flex-wrap sm:px-0"
        >
          <CategoryChip
            label="All"
            active={activeCategory === ALL}
            count={products.length}
            onClick={() => setActiveCategory(ALL)}
          />
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            return (
              <CategoryChip
                key={category}
                label={category}
                active={activeCategory === category}
                count={count}
                onClick={() => setActiveCategory(category)}
              />
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          message={`No items in "${activeCategory}" right now.`}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default StoreProductsBrowser;

interface SectionHeadingProps {
  count: number;
}

const SectionHeading = ({ count }: SectionHeadingProps) => (
  <div className="mb-5 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
    <div className="min-w-0">
      <p className="text-primary/60 mb-1 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
        The Collection
      </p>
      <h2 className="font-heading text-primary text-xl font-bold tracking-tight sm:text-3xl">
        Curated Finds
      </h2>
    </div>
    <span className="text-primary/60 shrink-0 font-sans text-[11px] font-medium tracking-wide sm:text-sm">
      {count} {pluralize(count, 'piece')}
    </span>
  </div>
);

interface CategoryChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

const CategoryChip = ({ label, count, active, onClick }: CategoryChipProps) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={[
      'inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide transition-colors sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs',
      active
        ? 'border-primary bg-primary text-surface'
        : 'border-border/70 bg-surface text-primary/75 hover:border-primary/50 hover:text-primary',
    ].join(' ')}
  >
    <span className="capitalize">{label}</span>
    <span
      className={[
        'rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:text-[10px]',
        active ? 'bg-surface/20 text-surface' : 'bg-primary/5 text-primary/70',
      ].join(' ')}
    >
      {count}
    </span>
  </button>
);

const EmptyState = ({
  message = 'No products available yet. Check back soon.',
}: {
  message?: string;
}) => (
  <div className="border-border/60 bg-surface flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
    <div className="border-border/70 bg-background flex h-12 w-12 items-center justify-center rounded-full border">
      <PackageOpen
        className="text-primary/60 h-5 w-5"
        strokeWidth={2}
      />
    </div>
    <p className="text-primary/70 max-w-sm font-sans text-sm sm:text-base">
      {message}
    </p>
  </div>
);
