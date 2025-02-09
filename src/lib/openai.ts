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

export async function extractChecklistItems(message: string): Promise<ChecklistItem[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts actionable items from informal messages.
Given the following message, return only the items that should be in a checklist.
Group similar actions together and list the items under them.
Convert singular items to numerical format (e.g., 'a bag' to '1 bag').
Remove any icons or formatting and use plain text.
Return the items in a JSON array format.
Ignore conversational elements and focus on items to be checked off.
Each item should have: id (string), text (string), and checked (boolean).

IMPORTANT: You must respond with ONLY a valid JSON array of objects.
Each object must have exactly these properties:
{
  "id": "unique-string-id",
  "text": "the checklist item text",
  "checked": false
}

Example response format:
[
  {
    "id": "1",
    "text": "- 1 bag brown rice\n- 2 cans coconut milk\n- 2 cans chickpeas",
    "checked": false
  }
]

Do not include any other text, markdown formatting, or explanations in your response.
Just return the JSON array.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    try {
      const items = JSON.parse(result);
      return Array.isArray(items) ? items : [];
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
} 