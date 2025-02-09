import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export async function extractChecklistItems(
  message: string,
  onItem: (item: ChecklistItem) => Promise<void>
): Promise<void> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts actionable items from informal messages.
Given the following message, extract only the clear actionable items or list items.
Ignore any conversational text, greetings, or explanatory content.

Rules for extraction:
1. Only extract items that could be part of a checklist
2. Group similar actions together (e.g., all "buy" items should be grouped)
3. Convert singular items to numerical format (e.g., 'a bag' to '1 bag')
4. Remove any icons or formatting and use plain text
5. For shopping items, list quantities first (e.g., "2 cans coconut milk")
6. Ignore any text that isn't clearly a list item

IMPORTANT: Return each item as a separate JSON object with these properties:
{
  "text": "the checklist item text",
  "checked": false
}

Example input:
"Hey, can you grab these from the store? We need a bag of rice, some coconut milk (2 cans), and don't forget to pick up chickpeas. Oh, and while you're there, maybe get some tofu. Thanks!"

Example output (sent as separate objects):
{"text": "1 bag rice", "checked": false}
{"text": "2 cans coconut milk", "checked": false}
{"text": "1 can chickpeas", "checked": false}
{"text": "1 pack tofu", "checked": false}

Do not wrap the items in an array. Send each item as a complete JSON object on its own.
Do not include any other text or explanations in your response.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let buffer = '';
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      buffer += content;
      
      // Try to parse complete JSON objects from the buffer
      try {
        // Look for complete JSON objects in the buffer
        const match = buffer.match(/\{[^{}]*\}/);
        if (match) {
          const jsonStr = match[0];
          const item = JSON.parse(jsonStr);
          
          // Remove the parsed object from the buffer
          buffer = buffer.slice(match.index! + jsonStr.length);
          
          // Send the item to the callback
          await onItem(item);
        }
      } catch {
        // Continue accumulating if we don't have a complete JSON object yet
        continue;
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
} 