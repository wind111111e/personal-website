import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function GlossaryBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { sections, theme } = analysis;
  const { glossary } = sections;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const { t } = useLanguage();

  if (!glossary || glossary.length === 0) return null;

  return (
    <section className={cn("py-20 px-6 max-w-4xl mx-auto", styles.background)}>
      <div className="flex items-center gap-4 mb-10 border-b pb-4">
        <BookOpen className={cn("w-8 h-8", accentText)} />
        <h2 className={cn("text-3xl font-bold", styles.fontHeading, styles.primary)}>
          {t('blocks.glossary.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {glossary.map((term, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className={cn("p-6 rounded-xl border group transition-all duration-300", styles.card, styles.border, "hover:shadow-lg")}
          >
            <h3 className={cn("text-xl font-bold mb-3 group-hover:text-primary transition-colors", styles.fontHeading, styles.primary)}>
              {term.term}
            </h3>
            <p className={cn("text-sm leading-relaxed", styles.muted)}>
              {term.meaning}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
