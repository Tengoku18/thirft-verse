'use client';

import { ChatMessage as ChatMessageType } from '@/types/search';
import ProductResultCard from './ProductResultCard';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#D4A373] flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-[#3B2F2F] text-white'
              : message.error
              ? 'bg-red-50 text-red-900 border border-red-200'
              : 'bg-neutral-100 text-neutral-900'
          }`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Product results */}
        {message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((product) => (
              <ProductResultCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-neutral-500 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-neutral-700" />
        </div>
      )}
    </div>
  );
}
