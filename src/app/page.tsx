'use client';

import { useState, useEffect } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { ChecklistDisplay } from '@/components/ChecklistDisplay';
import type { ChecklistItem } from '@/lib/openai';
import Head from 'next/head';

export default function Home() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('checklist-items');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to load saved items:', e);
      }
    }
  }, []);

  // Save items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('checklist-items', JSON.stringify(items));
  }, [items]);

  const handleConvert = async (message: string) => {
    setItems([]); // Clear previous items
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsLoading(false);
              return;
            }

            try {
              const item = JSON.parse(data);
              if (item.error) {
                throw new Error(item.error);
              }
              setItems(prev => [...prev, item]);
            } catch (e) {
              console.error('Failed to parse item:', e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error converting message:', e);
      setError('Failed to convert message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItems = (newItems: ChecklistItem[]) => {
    setItems(newItems);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>msg2checklist</title>
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Message to Checklist Converter
        </h1>
        
        <div className="space-y-6">
          <MessageInput onConvert={handleConvert} isLoading={isLoading} />
          
          {error && (
            <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900 rounded-lg">
              {error}
            </div>
          )}
          
          <ChecklistDisplay items={items} onUpdateItems={handleUpdateItems} />
        </div>
      </div>
    </main>
  );
}
