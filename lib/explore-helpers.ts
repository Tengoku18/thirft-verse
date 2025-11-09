import { ProductWithStore, Profile } from './types/database';

// Sort options for products
export type ProductSortOption = 'newest' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

// Sort options for stores
export type StoreSortOption = 'newest' | 'name-az' | 'name-za';

/**
 * Sort products based on selected option
 */
export function sortProducts(
  products: ProductWithStore[],
  sortBy: ProductSortOption
): ProductWithStore[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-za':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

/**
 * Sort stores based on selected option
 */
export function sortStores(stores: Profile[], sortBy: StoreSortOption): Profile[] {
  const sorted = [...stores];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'name-az':
      return sorted.sort((a, b) =>
        (a.name || a.store_username).localeCompare(b.name || b.store_username)
      );
    case 'name-za':
      return sorted.sort((a, b) =>
        (b.name || b.store_username).localeCompare(a.name || a.store_username)
      );
    default:
      return sorted;
  }
}

/**
 * Filter products by search query
 */
export function filterProductsBySearch(
  products: ProductWithStore[],
  query: string
): ProductWithStore[] {
  if (!query.trim()) return products;

  const searchLower = query.toLowerCase().trim();

  return products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchLower);
    const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
    const categoryMatch = product.category.toLowerCase().includes(searchLower);
    const storeMatch =
      product.store?.name?.toLowerCase().includes(searchLower) ||
      product.store?.store_username?.toLowerCase().includes(searchLower);

    return titleMatch || descriptionMatch || categoryMatch || storeMatch;
  });
}

/**
 * Filter stores by search query
 */
export function filterStoresBySearch(stores: Profile[], query: string): Profile[] {
  if (!query.trim()) return stores;

  const searchLower = query.toLowerCase().trim();

  return stores.filter((store) => {
    const nameMatch = store.name?.toLowerCase().includes(searchLower);
    const usernameMatch = store.store_username?.toLowerCase().includes(searchLower);
    const bioMatch = store.bio?.toLowerCase().includes(searchLower);

    return nameMatch || usernameMatch || bioMatch;
  });
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(
  products: ProductWithStore[],
  categories: string[]
): ProductWithStore[] {
  if (categories.length === 0) return products;

  return products.filter((product) => categories.includes(product.category));
}

/**
 * Filter products by availability
 */
export function filterProductsByAvailability(
  products: ProductWithStore[],
  inStock: boolean
): ProductWithStore[] {
  if (!inStock) return products;

  return products.filter((product) => product.availability_count > 0);
}
