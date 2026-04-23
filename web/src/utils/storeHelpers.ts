import type { Product } from '@/types/database';

export function getStoreInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  return initials || '?';
}

export function getUniqueCategories(
  products: Pick<Product, 'category'>[]
): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.category) set.add(p.category);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function formatStoreUrl(
  storeUsername: string,
  { withProtocol = true }: { withProtocol?: boolean } = {}
): string {
  const host = `${storeUsername}.thriftverse.shop`;
  return withProtocol ? `https://${host}` : host;
}

export function formatMemberSince(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
