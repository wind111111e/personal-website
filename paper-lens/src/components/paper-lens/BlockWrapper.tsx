import { Theme, cn, THEMES } from '@/lib/theme';
import { ReactNode } from 'react';

interface BlockWrapperProps {
  children: ReactNode;
  className?: string;
  theme: Theme;
}

export function BlockWrapper({ children, className, theme }: BlockWrapperProps) {
  const styles = THEMES[theme.style];
  return (
    <section className={cn(
      "py-12 px-6 md:px-12 max-w-7xl mx-auto",
      styles.background,
      styles.foreground,
      className
    )}>
      {children}
    </section>
  );
}
