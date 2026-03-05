import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Layers, Workflow } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function MethodOverviewBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { sections, theme } = analysis;
  const { method } = sections;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const accentBg = ACCENT_BG[theme.accent];
  const { t } = useLanguage();

  if (!method) return null;

  return (
    <section className={cn("py-20 px-6 max-w-7xl mx-auto", styles.background)}>
      <div className="mb-16 text-center">
        <h2 className={cn("text-3xl md:text-5xl font-bold mb-6", styles.fontHeading, styles.primary)}>
          {t('blocks.method.title')}
        </h2>
        <p className={cn("text-xl max-w-3xl mx-auto", styles.muted)}>
          {method.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className={cn("text-2xl font-bold border-b pb-4", styles.fontHeading, styles.border)}>
            {t('blocks.method.steps')}
          </h3>
          <div className="space-y-6 relative">
            <div className={cn("absolute left-4 top-4 bottom-4 w-0.5 opacity-20", accentBg)} />
            {method.steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                <div className={cn("absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white z-10", accentBg)}>
                  {i + 1}
                </div>
                <p className={cn("text-lg", styles.foreground)}>{step}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className={cn("text-2xl font-bold border-b pb-4", styles.fontHeading, styles.border)}>
            {t('blocks.method.components')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {method.components.map((comp, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className={cn("p-6 rounded-xl border flex flex-col items-center text-center justify-center min-h-[140px]", styles.card, styles.border)}
              >
                <Box className={cn("w-8 h-8 mb-3 opacity-80", accentText)} />
                <span className={cn("font-medium", styles.foreground)}>{comp}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
