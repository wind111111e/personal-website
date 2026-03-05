"use client";

import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/theme';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 transition-all hover:bg-white/20", className)}>
      <Globe size={16} className="text-slate-300" />
      <button 
        onClick={() => setLanguage('en')}
        className={cn("text-sm font-medium transition-colors", language === 'en' ? 'text-white' : 'text-slate-400 hover:text-white')}
      >
        EN
      </button>
      <span className="text-slate-600 text-xs">|</span>
      <button 
        onClick={() => setLanguage('zh')}
        className={cn("text-sm font-medium transition-colors", language === 'zh' ? 'text-white' : 'text-slate-400 hover:text-white')}
      >
        中文
      </button>
    </div>
  );
}
