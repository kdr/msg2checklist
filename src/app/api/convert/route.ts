import { NextResponse } from 'next/server';
import { extractChecklistItems } from '@/lib/openai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const items = await extractChecklistItems(message);
    
    // Ensure each item has an ID
    const itemsWithIds = items.map(item => ({
      ...item,
      id: item.id || uuidv4()
    }));

    return NextResponse.json({ items: itemsWithIds });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 