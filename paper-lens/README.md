# PaperLens - Vibe Coding MVP

PaperLens transforms dense academic PDFs into beautiful, interactive, and easy-to-read "popular science" web pages.

## Features

- **Adaptive Layout & Theme**: Automatically adjusts visual style based on paper type (e.g., Clinical for medical, Editorial for surveys).
- **AI-Powered Analysis**: Extracts structured insights using OpenAI GPT-4o.
- **Smart Fallbacks**: Robust rule-based engine ensures quality even when AI misses details.
- **Interactive Q&A**: Chat with the paper.
- **Visual Enhancements**: Generates or selects appropriate illustrations (mock/placeholder support).

## Tech Stack

- Next.js 14 (App Router)
- React, TailwindCSS, Framer Motion
- OpenAI API
- pdf-parse

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env.local` file:

   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

   *Note: If no key is provided, the app runs in **Mock Mode** using pre-generated data.*

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `src/lib/types.ts`: Strict JSON schema for paper analysis.
- `src/lib/theme.ts`: Theme definitions (Minimal, Dark Tech, Editorial, Clinical).
- `src/app/api/analyze`: Main logic for PDF parsing and Adaptive Rules application.
- `src/components/paper-lens`: UI blocks (Hero, Experiments, Method, etc.).

## Adaptive Rules (Examples)

- **Survey Papers**: Uses "Editorial Magazine" theme, ensures "Key Takeaways" and "Q&A" blocks are present.
- **Medical Papers**: Uses "Clinical Clean" theme (green/teal), enforces "Limitations" and "Evidence Strength" sections.
- **High Formula Density**: Automatically adds a "Glossary" block.

## License

MIT
