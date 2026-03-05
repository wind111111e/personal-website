"use client";

import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS, ACCENT_BG } from '@/lib/theme';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function QABlock({ analysis }: { analysis: PaperAnalysis }) {
  const { theme, core } = analysis;
  const styles = THEMES[theme.style];
  const accentText = ACCENTS[theme.accent];
  const accentBg = ACCENT_BG[theme.accent];
  const { t } = useLanguage();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, analysis }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("py-20 px-6 max-w-3xl mx-auto", styles.background)}>
      <div className={cn("p-8 md:p-12 rounded-3xl border shadow-xl relative overflow-hidden", styles.card, styles.border)}>
        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-10", accentBg)} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", accentBg)}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className={cn("text-2xl font-bold", styles.fontHeading, styles.primary)}>
                {t('blocks.qa.title')}
              </h2>
              <p className={cn("text-sm opacity-80", styles.muted)}>
                {t('blocks.qa.subtitle')} "{core.title}"
              </p>
            </div>
          </div>

          <form onSubmit={handleAsk} className="relative mb-8">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('blocks.qa.placeholder')}
              className={cn(
                "w-full px-6 py-4 rounded-xl border-2 pr-16 outline-none transition-all focus:ring-2 focus:ring-opacity-50",
                styles.background,
                styles.border,
                styles.foreground,
                accentText.split(' ')[1].replace('text-', 'focus:ring-') // Hacky way to get focus ring color
              )}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className={cn(
                "absolute right-2 top-2 bottom-2 aspect-square rounded-lg flex items-center justify-center text-white transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                accentBg
              )}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </form>

          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn("p-6 rounded-xl border-l-4 bg-opacity-50", styles.muted, accentText.split(' ')[1].replace('text-', 'border-'))}
              >
                <h4 className={cn("font-bold text-sm uppercase tracking-wider mb-2", accentText)}>{t('common.answer')}</h4>
                <p className={cn("leading-relaxed", styles.foreground)}>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
