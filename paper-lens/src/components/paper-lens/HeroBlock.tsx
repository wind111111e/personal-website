import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { motion } from 'framer-motion';

interface HeroBlockProps {
  analysis: PaperAnalysis;
  imageUrl?: string;
}

export function HeroBlock({ analysis, imageUrl }: HeroBlockProps) {
  const { theme, core, paper_profile } = analysis;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const accentBg = ACCENT_BG[theme.accent];

  const variant = theme.hero_variant;

  if (variant === 'cover_image' && imageUrl) {
    return (
      <section className="relative min-h-[60vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={imageUrl} alt="Hero" className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="relative z-10 p-8 md:p-16 max-w-4xl text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg", styles.fontHeading)}
          >
            {core.title}
          </motion.h1>
          <div className="flex flex-wrap gap-2 text-sm md:text-base opacity-90">
            <span>{core.venue} {core.year}</span>
            <span>•</span>
            <span>{core.authors}</span>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className={cn("grid grid-cols-1 md:grid-cols-2 min-h-[50vh]", styles.background)}>
        <div className={cn("p-12 flex flex-col justify-center border-r", styles.border)}>
          <span className={cn("text-sm uppercase tracking-widest mb-4", accentText.split(' ')[0])}>
            {paper_profile.type} Paper
          </span>
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-6", styles.fontHeading, styles.foreground)}>
            {core.title}
          </h1>
          <p className={cn("text-lg", styles.muted)}>{core.one_sentence_summary}</p>
        </div>
        <div className={cn("p-12 flex flex-col justify-center bg-opacity-5", accentBg)}>
          <div className="space-y-4">
            {core.key_contributions.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0", accentBg)}>
                  {i + 1}
                </span>
                <p className={cn("text-sm", styles.foreground)}>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Standard Variant
  return (
    <section className={cn("py-20 px-6 text-center max-w-4xl mx-auto", styles.background)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 border", accentText)}
      >
        {core.venue} • {core.year}
      </motion.div>
      <h1 className={cn("text-4xl md:text-6xl font-bold mb-6 leading-tight", styles.fontHeading, styles.foreground)}>
        {core.title}
      </h1>
      <p className={cn("text-xl max-w-2xl mx-auto", styles.muted)}>
        {core.authors}
      </p>
    </section>
  );
}
