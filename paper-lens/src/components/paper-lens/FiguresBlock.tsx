import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function FiguresBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { sections, theme } = analysis;
  const { figures_explained } = sections;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const { t } = useLanguage();

  if (!figures_explained || figures_explained.length === 0) return null;

  return (
    <section className={cn("py-20 px-6 max-w-7xl mx-auto", styles.background)}>
      <h2 className={cn("text-3xl md:text-5xl font-bold mb-12 text-center", styles.fontHeading, styles.primary)}>
        {t('blocks.figures.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {figures_explained.map((fig, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn("rounded-2xl border overflow-hidden flex flex-col h-full", styles.card, styles.border)}
          >
            <div className={cn("h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group", styles.muted)}>
              <ImageIcon className="w-12 h-12 opacity-20" />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">{t('blocks.figures.preview')}</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <span className={cn("text-xs font-bold uppercase tracking-wider mb-2 block", accentText)}>
                {fig.figure}
              </span>
              <p className={cn("text-sm leading-relaxed", styles.foreground)}>
                {fig.explanation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
