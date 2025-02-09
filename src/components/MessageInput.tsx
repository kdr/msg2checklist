'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';

interface MessageInputProps {
  onConvert: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function MessageInput({ onConvert, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleConvert = async () => {
    if (!message.trim()) return;
    await onConvert(message);
  };

  return (
    <Card className="p-4 space-y-4">
      <Textarea
        placeholder="Paste your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[200px] resize-none"
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleConvert}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? 'Converting...' : 'Convert to Checklist'}
        </Button>
      </div>
    </Card>
  );
} 