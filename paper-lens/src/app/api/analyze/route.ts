import { NextRequest, NextResponse } from 'next/server';
import { analyzePaper } from '@/lib/openai';
import { PaperAnalysis, LayoutBlock } from '@/lib/types';
// @ts-ignore
import pdf from 'pdf-parse';

function applyFallbackRules(analysis: PaperAnalysis): PaperAnalysis {
  const { paper_profile, theme, layout } = analysis;

  // Rule 1: Survey Papers
  if (paper_profile.type === 'survey') {
    theme.style = 'editorial_magazine';
    // Ensure key takeaways and qa
    if (!layout.find(l => l.block === 'key_takeaways')) layout.push({ block: 'key_takeaways', count: 5 });
    if (!layout.find(l => l.block === 'qa')) layout.push({ block: 'qa' });
  }

  // Rule 2: Medical Papers
  if (paper_profile.type === 'medical') {
    theme.style = 'clinical_clean';
    if (!['green', 'cyan'].includes(theme.accent)) theme.accent = 'green';
    // Ensure standard medical flow
    const required = ['problem', 'method_overview', 'experiments', 'limitations'];
    required.forEach(req => {
      if (!layout.find(l => l.block === req)) layout.push({ block: req });
    });
  }

  // Rule 3: High Formula Density
  if (paper_profile.formula_density === 'high') {
    if (!layout.find(l => l.block === 'glossary')) layout.push({ block: 'glossary' });
  }

  // Rule 4: Many Figures
  if (paper_profile.figure_count >= 4) {
    const existingIndex = layout.findIndex(l => l.block === 'figures');
    if (existingIndex === -1) {
      // Insert after experiments or method
      const expIndex = layout.findIndex(l => l.block === 'experiments');
      if (expIndex !== -1) {
        layout.splice(expIndex + 1, 0, { block: 'figures' });
      } else {
        layout.push({ block: 'figures' });
      }
    }
  }

  // Rule 5: No Experiments
  if (!paper_profile.has_experiments) {
    const expIndex = layout.findIndex(l => l.block === 'experiments');
    if (expIndex !== -1) {
      layout.splice(expIndex, 1);
    }
  }

  return analysis;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse PDF
    let text = "";
    try {
      const data = await pdf(buffer);
      text = data.text;
    } catch (e) {
      console.error("PDF Parse Error", e);
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }

    // Analyze with LLM (or mock)
    let analysis = await analyzePaper(text);

    // Apply Fallback Rules
    analysis = applyFallbackRules(analysis);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
