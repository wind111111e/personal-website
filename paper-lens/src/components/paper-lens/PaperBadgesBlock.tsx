import { PaperAnalysis } from '@/lib/types';
import { cn, THEMES, ACCENTS } from '@/lib/theme';
import { useLanguage } from '@/lib/language-context';

interface PaperBadgesBlockProps {
  analysis: PaperAnalysis;
}

export function PaperBadgesBlock({ analysis }: PaperBadgesBlockProps) {
  const { theme, paper_profile } = analysis;
  const styles = THEMES[theme.style];
  const accent = ACCENTS[theme.accent];
  const { t } = useLanguage();

  return (
    <div className={cn("flex flex-wrap gap-3 py-6", styles.background)}>
      <Badge variant="outline" className={cn("border-2", accent)}>{paper_profile.type}</Badge>
      {paper_profile.domain.map(d => (
        <Badge key={d} variant="outline" className={styles.border}>{d}</Badge>
      ))}
      <Badge variant="outline" className={cn(styles.border, paper_profile.confidence === 'high' ? 'text-green-600' : 'text-yellow-600')}>
        {t('blocks.badges.confidence')}: {paper_profile.confidence}
      </Badge>
      <Badge variant="outline" className={styles.border}>{paper_profile.formula_density} {t('blocks.badges.formulas')}</Badge>
      {paper_profile.has_experiments && <Badge variant="outline" className={styles.border}>{t('blocks.badges.experiments')}</Badge>}
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  );
}
