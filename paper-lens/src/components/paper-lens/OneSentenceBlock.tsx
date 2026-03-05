import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS } from '@/lib/theme';
import { motion } from 'framer-motion';

export function OneSentenceBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { core, theme } = analysis;
  const styles = THEMES[theme.style];
  const accent = ACCENTS[theme.accent];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("py-12 md:py-20 text-center px-4 max-w-4xl mx-auto", styles.background)}
    >
      <h2 className={cn("text-2xl md:text-4xl font-bold leading-relaxed", styles.fontHeading, styles.primary)}>
        "{core.one_sentence_summary}"
      </h2>
      <div className={cn("mt-6 h-1 w-20 mx-auto rounded-full", accent.split(' ')[2])} />
    </motion.section>
  );
}
