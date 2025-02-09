# Message to Checklist Converter

A Next.js application that converts informal messages into interactive checklists using OpenAI's GPT model.

## Features

- Convert informal messages into structured checklists
- Interactive checkboxes with strike-through effect
- Dark mode support
- Mobile-responsive design
- Local storage persistence
- Export checklist as plain text
- Clean, minimal interface

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- OpenAI API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/msg2checklist.git
   cd msg2checklist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Paste your message in the text area
2. Click "Convert to Checklist"
3. The message will be processed and converted into a checklist
4. Check off items as you complete them
5. Use "Copy as Text" to export the checklist
6. Use "Reset All" to uncheck all items

## Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add your `OPENAI_API_KEY` to the environment variables in your Vercel project settings
4. Deploy!

## License

MIT
