import { Metadata } from 'next';
import ChatInterface from '@/_components/smart-search/ChatInterface';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ask AI - Find Products Naturally | Thriftverse',
  description: 'Ask our AI assistant to find exactly what you\'re looking for. Just describe it in your own words and let AI do the rest.',
};

export default function AskPage() {
  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-neutral-600 hover:text-[#D4A373] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Explore</span>
          </Link>

          <h1 className="text-lg sm:text-xl font-bold text-[#3B2F2F]">
            Ask AI
          </h1>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
