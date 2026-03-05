import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function LimitationsBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { sections, theme } = analysis;
  const { limitations } = sections;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const { t } = useLanguage();

  if (!limitations || limitations.length === 0) return null;

  return (
    <section className={cn("py-20 px-6 max-w-4xl mx-auto", styles.background)}>
      <div className={cn("p-8 md:p-12 rounded-3xl border-2 border-dashed flex flex-col items-center text-center", styles.border, accentText)}>
        <AlertTriangle className={cn("w-12 h-12 mb-6 opacity-80", accentText)} />
        <h2 className={cn("text-3xl font-bold mb-8", styles.fontHeading)}>
          {t('blocks.limitations.title')}
        </h2>
        <ul className="space-y-4 w-full text-left max-w-2xl mx-auto">
          {limitations.map((limit, i) => (
            <motion.li 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <AlertCircle className={cn("w-5 h-5 mt-1 shrink-0 opacity-60", accentText)} />
              <p className={cn("text-lg", styles.muted)}>{limit}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
