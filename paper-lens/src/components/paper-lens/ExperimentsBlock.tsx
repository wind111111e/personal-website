import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { BarChart2, Database, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function ExperimentsBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { sections, theme } = analysis;
  const { experiments } = sections;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const accentBg = ACCENT_BG[theme.accent];
  const { t } = useLanguage();

  if (!experiments) return null;

  return (
    <section className={cn("py-20 px-6 max-w-7xl mx-auto", styles.background)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div className="mb-8">
            <h2 className={cn("text-3xl md:text-5xl font-bold mb-6", styles.fontHeading, styles.primary)}>
              {t('blocks.experiments.title')}
            </h2>
            <p className={cn("text-xl leading-relaxed", styles.muted)}>
              {experiments.setup}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={cn("p-6 rounded-2xl border bg-opacity-50", styles.border, styles.card)}>
              <div className="flex items-center gap-3 mb-4">
                <Database className={cn("w-6 h-6", accentText)} />
                <h3 className={cn("font-bold", styles.fontHeading)}>{t('blocks.experiments.datasets')}</h3>
              </div>
              <ul className="space-y-2 list-disc list-inside">
                {experiments.datasets.map((d, i) => (
                  <li key={i} className={cn("text-sm", styles.foreground)}>{d}</li>
                ))}
              </ul>
            </div>

            <div className={cn("p-6 rounded-2xl border bg-opacity-50", styles.border, styles.card)}>
              <div className="flex items-center gap-3 mb-4">
                <BarChart2 className={cn("w-6 h-6", accentText)} />
                <h3 className={cn("font-bold", styles.fontHeading)}>{t('blocks.experiments.baselines')}</h3>
              </div>
              <ul className="space-y-2 list-disc list-inside">
                {experiments.baselines.map((b, i) => (
                  <li key={i} className={cn("text-sm", styles.foreground)}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-8 lg:mt-0">
          <div className="flex items-center gap-4 mb-6">
            <TrendingUp className={cn("w-8 h-8", accentText)} />
            <h3 className={cn("text-2xl font-bold", styles.fontHeading)}>{t('blocks.experiments.results')}</h3>
          </div>
          
          <div className="space-y-6">
            {experiments.results.map((result, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={cn("p-8 rounded-3xl border relative overflow-hidden group", styles.card, styles.border)}
              >
                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity", accentBg)} />
                <div className="relative z-10 flex gap-4">
                  <Award className={cn("w-6 h-6 shrink-0 mt-1", accentText)} />
                  <p className={cn("text-lg leading-relaxed", styles.foreground)}>{result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
