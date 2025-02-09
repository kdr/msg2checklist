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

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    onUpdateItems(updatedItems);
  };

  const handleCopyAsText = () => {
    const text = items
      .map(item => `${item.checked ? '✓ ' : ''}${item.text}`.trim())
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    onUpdateItems([]);
    localStorage.removeItem('checklist-items');
  };

  useEffect(() => {
    localStorage.removeItem('checklist-items');
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-2 space-y-2">
      <div className="space-y-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-1 p-1 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg group"
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
            <button
              onClick={() => deleteItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Delete item"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-1">
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
