'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/search';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ExampleQueries from './ExampleQueries';
import { Loader2 } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Call semantic search API
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content, limit: 6 })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      // Create assistant response
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.results.length > 0
          ? `I found ${data.results.length} product${data.results.length > 1 ? 's' : ''} that match your search:`
          : "I couldn't find any products matching your search. Try different keywords or browse our categories!",
        products: data.results.map((r: any) => r.product),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Search error:', error);

      // Add error message
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <ExampleQueries onQueryClick={handleSendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4A373] flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="rounded-2xl px-4 py-2.5 bg-neutral-100">
                    <p className="text-sm text-neutral-600">Searching...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
