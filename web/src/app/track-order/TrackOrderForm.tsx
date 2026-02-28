'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Button from '@/_components/common/Button';
import { findOrderByCodeOrId } from '@/actions/orders';

export default function TrackOrderForm() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter an order code or ID.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await findOrderByCodeOrId(query);

    if (result) {
      router.push(`/order/${result.id}?view=buyer`);
    } else {
      setLoading(false);
      setError('No order found with that code. Please double-check and try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="order-query"
          className="mb-2 block text-sm font-semibold text-primary"
        >
          Order Code or ID
        </label>
        <input
          id="order-query"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. #TV-260102-101528-VCBZ"
          disabled={loading}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-primary placeholder:text-primary/40 outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20 disabled:opacity-50"
        />
        {error && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-red-600">
            <span className="mt-0.5 shrink-0">⚠</span>
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={loading}
        className="gap-2"
      >
        <Search className="h-5 w-5" />
        {loading ? 'Searching…' : 'Track Order'}
      </Button>
    </form>
  );
}
