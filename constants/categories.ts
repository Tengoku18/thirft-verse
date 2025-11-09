// Product categories - keep in sync with web/src/lib/constants/categories.ts
export const PRODUCT_CATEGORIES = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
  'Home & Decor',
  'Electronics',
  'Books',
  'Other',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
