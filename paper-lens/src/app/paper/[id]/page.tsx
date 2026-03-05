"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PaperAnalysis } from '@/lib/types';
import { LayoutEngine } from '@/components/paper-lens/LayoutEngine';
import { Loader2 } from 'lucide-react';
import { THEMES } from '@/lib/theme';
import { useLanguage } from '@/lib/language-context';

export default function PaperPage() {
  const { id } = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!id) return;

    // Simulate fetch from "DB" (localStorage)
    const stored = localStorage.getItem(`paper_${id}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setAnalysis(data);
      } catch (e) {
        console.error("Failed to parse paper data", e);
      }
    } else {
      // If not found, maybe redirect to home after a delay
      setTimeout(() => router.push('/'), 3000);
    }
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-slate-400" size={48} />
          <p className="text-slate-500 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('paper.notFound')}</h1>
          <p className="text-slate-500">{t('paper.redirecting')}</p>
        </div>
      </div>
    );
  }

  const styles = THEMES[analysis.theme.style];

  return (
    <main className={`min-h-screen transition-colors duration-500 ${styles.background} ${styles.foreground}`}>
      <LayoutEngine analysis={analysis} />
      
      {/* Footer / Credit */}
      <footer className={`py-12 text-center text-sm opacity-50 ${styles.muted}`}>
        {t('paper.footer')}
      </footer>
    </main>
  );
}
