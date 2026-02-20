import { Metadata } from 'next';
import ChatInterface from '@/_components/smart-search/ChatInterface';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thrift Buddy - Your AI Shopping Assistant | Thriftverse',
  description: 'Meet your personal thrift shopping buddy! Chat with our AI assistant to find unique treasures that match exactly what you\'re looking for.',
};

export default function ThriftBuddyPage() {
  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Logo (visible on large screens) */}
          <Link
            href="/"
            className="hidden lg:flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/horizontal-logo.png"
              alt="ThriftVerse Logo"
              height={32}
              width={120}
              className="object-contain"
            />
          </Link>

          {/* Center: Thrift Buddy Title */}
          <h1 className="text-lg sm:text-xl font-bold text-[#3B2F2F] flex-1 lg:flex-none text-center lg:text-left">
            🛍️ Thrift Buddy
          </h1>

          {/* Right: Back to Explore */}
          <Link
            href="/explore"
            className="flex items-center gap-2 text-neutral-600 hover:text-[#D4A373] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Back to Explore</span>
          </Link>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}
