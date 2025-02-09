'use client';

import { useState, useEffect } from 'react';
import { MessageInput } from '@/components/MessageInput';
import { ChecklistDisplay } from '@/components/ChecklistDisplay';
import type { ChecklistItem } from '@/lib/openai';

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

      const data = await response.json();
      setItems(data.items);
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
