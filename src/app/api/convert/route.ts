import { NextResponse } from 'next/server';
import { extractChecklistItems } from '@/lib/openai';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    );
  }

  try {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Start the streaming response
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    // Process the items in the background
    extractChecklistItems(message, async (item) => {
      const itemWithId = { ...item, id: uuidv4() };
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(itemWithId)}\n\n`)
      );
    }).then(async () => {
      await writer.write(encoder.encode('data: [DONE]\n\n'));
      await writer.close();
    }).catch(async (error) => {
      console.error('Error processing message:', error);
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ error: 'Failed to process message' })}\n\n`)
      );
      await writer.close();
    });

    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 