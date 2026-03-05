import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: NextRequest) {
  try {
    const { question, analysis } = await req.json();

    if (!question || !analysis) {
      return NextResponse.json({ error: 'Question and analysis are required' }, { status: 400 });
    }

    if (!openai) {
      // Mock answer
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ answer: `[Mock Answer] Based on the paper "${analysis.core.title}", here is a generated answer to "${question}". In a real scenario, I would use the full text context.` });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant answering questions about a research paper based on its structured analysis.
          
          Paper Analysis: ${JSON.stringify(analysis)}
          
          Answer the user's question concisely and accurately based on the provided analysis.
          `
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    const answer = completion.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("QA failed:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
