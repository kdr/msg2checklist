'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { ChecklistItem } from '@/lib/openai';

interface ChecklistDisplayProps {
  items: ChecklistItem[];
  onUpdateItems: (items: ChecklistItem[]) => void;
}

export function ChecklistDisplay({ items, onUpdateItems }: ChecklistDisplayProps) {
  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onUpdateItems(updatedItems);
  };

  const handleCopyAsText = () => {
    const text = items
      .map(item => `${item.checked ? '✓' : '○'} ${item.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    const resetItems = items.map(item => ({ ...item, checked: false }));
    onUpdateItems(resetItems);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <span
              className={`flex-1 ${
                item.checked ? 'line-through text-gray-500' : ''
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset All
        </Button>
        <Button onClick={handleCopyAsText}>
          Copy as Text
        </Button>
      </div>
    </Card>
  );
} 