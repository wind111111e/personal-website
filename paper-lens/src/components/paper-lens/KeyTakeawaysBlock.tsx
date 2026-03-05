import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';
import { Check, Star, Target, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function KeyTakeawaysBlock({ analysis }: { analysis: PaperAnalysis }) {
  const { core, theme } = analysis;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const accentBg = ACCENT_BG[theme.accent];
  const { t } = useLanguage();

  const icons = [Check, Star, Target, Lightbulb];

  return (
    <section className={cn("py-16 px-6 md:px-12 max-w-7xl mx-auto", styles.background)}>
      <h3 className={cn("text-3xl font-bold mb-10 text-center", styles.fontHeading, styles.primary)}>{t('blocks.takeaways.title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {core.tldr.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className={cn("p-6 rounded-2xl border transition-all duration-300", styles.card, styles.border, "hover:shadow-lg")}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white", accentBg)}>
                <Icon size={20} />
              </div>
              <p className={cn("text-lg font-medium leading-relaxed", styles.foreground)}>{item}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
