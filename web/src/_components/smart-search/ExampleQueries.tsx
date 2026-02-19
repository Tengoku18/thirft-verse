'use client';

import { Sparkles } from 'lucide-react';

interface ExampleQueriesProps {
  onQueryClick: (query: string) => void;
}

const EXAMPLE_QUERIES = [
  "Show me affordable winter jackets",
  "Find vintage denim jeans",
  "Comfortable running shoes",
  "Boho style dresses",
  "Electronics under 5000 rupees",
  "Trendy accessories for women"
];

export default function ExampleQueries({ onQueryClick }: ExampleQueriesProps) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A373] to-[#CB997E] mb-4">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        👋 Hi! I'm Your Thrift Buddy
      </h2>
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        Tell me what thrift treasures you're hunting for, and I'll help you discover the perfect finds!
      </p>

      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
        {EXAMPLE_QUERIES.map((query) => (
          <button
            key={query}
            onClick={() => onQueryClick(query)}
            className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm text-neutral-700 hover:border-[#D4A373] hover:text-[#D4A373] hover:bg-[#D4A373]/5 transition-all"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
