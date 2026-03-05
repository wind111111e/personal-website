import OpenAI from 'openai';
import { MOCK_ANALYSIS } from './mock';
import { PaperAnalysis } from './types';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function analyzePaper(text: string): Promise<PaperAnalysis> {
  if (!openai) {
    console.log("No OpenAI key found, using mock mode");
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return MOCK_ANALYSIS;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert scientific communicator and designer. Analyze the following research paper text and output a structured JSON for a "popular science" web page.
          
          Strictly follow this JSON structure:
          {
            "paper_profile": { ... },
            "theme": { ... },
            "core": { ... },
            "sections": { ... },
            "layout": [ ... ]
          }

          Ensure "layout" is an array of objects like { "block": "hero" }.
          Customize "theme" and "layout" based on the paper type (e.g., survey papers should have editorial style, medical papers clinical style).
          `
        },
        {
          role: "user",
          content: `Analyze this paper text (truncated): ${text.slice(0, 15000)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");
    
    return JSON.parse(content) as PaperAnalysis;
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    return MOCK_ANALYSIS;
  }
}

export async function generateIllustration(prompt: string): Promise<string> {
  if (!openai) {
    return `https://placehold.co/1200x600/EEE/31343C?text=${encodeURIComponent("Illustration Placeholder")}`;
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Image generation failed:", error);
    return `https://placehold.co/1200x600/EEE/31343C?text=${encodeURIComponent("Illustration Placeholder")}`;
  }
}
