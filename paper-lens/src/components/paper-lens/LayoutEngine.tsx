"use client";

import { PaperAnalysis } from '@/lib/types';
import { HeroBlock } from './HeroBlock';
import { PaperBadgesBlock } from './PaperBadgesBlock';
import { OneSentenceBlock } from './OneSentenceBlock';
import { KeyTakeawaysBlock } from './KeyTakeawaysBlock';
import { MethodOverviewBlock } from './MethodOverviewBlock';
import { ExperimentsBlock } from './ExperimentsBlock';
import { FiguresBlock } from './FiguresBlock';
import { LimitationsBlock } from './LimitationsBlock';
import { GlossaryBlock } from './GlossaryBlock';
import { QABlock } from './QABlock'; // This is a client component, but imported in client component is fine.
import { useEffect, useState } from 'react';

const BLOCK_MAP: Record<string, React.ComponentType<{ analysis: PaperAnalysis; imageUrl?: string }>> = {
  hero: HeroBlock,
  paper_badges: PaperBadgesBlock,
  one_sentence: OneSentenceBlock,
  key_takeaways: KeyTakeawaysBlock,
  method_overview: MethodOverviewBlock,
  experiments: ExperimentsBlock,
  figures: FiguresBlock,
  limitations: LimitationsBlock,
  glossary: GlossaryBlock,
  qa: QABlock,
};

export function LayoutEngine({ analysis }: { analysis: PaperAnalysis }) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const { theme } = analysis;
    if (theme.hero_variant === 'cover_image' && theme.illustration_policy !== 'none') {
      const fetchImage = async () => {
        try {
          const res = await fetch('/api/illustrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: theme.image_prompt.prompt }),
          });
          const data = await res.json();
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        } catch (e) {
          console.error("Failed to fetch illustration", e);
        }
      };
      fetchImage();
    }
  }, [analysis]);

  return (
    <div className="flex flex-col gap-8">
      {analysis.layout.map((blockItem, index) => {
        const BlockComponent = BLOCK_MAP[blockItem.block];
        if (!BlockComponent) return null;
        return <BlockComponent key={index} analysis={analysis} imageUrl={imageUrl} />;
      })}
    </div>
  );
}
