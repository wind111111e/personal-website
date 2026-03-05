import { ThemeStyle, AccentColor } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEMES: Record<ThemeStyle, {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  secondary: string;
  muted: string;
  border: string;
  fontHeading: string;
  fontBody: string;
}> = {
  minimal_white: {
    background: 'bg-white',
    foreground: 'text-slate-900',
    card: 'bg-white',
    cardForeground: 'text-slate-900',
    primary: 'text-slate-900',
    secondary: 'text-slate-500',
    muted: 'text-slate-400',
    border: 'border-slate-200',
    fontHeading: 'font-sans tracking-tight',
    fontBody: 'font-sans',
  },
  dark_tech: {
    background: 'bg-slate-950',
    foreground: 'text-slate-100',
    card: 'bg-slate-900',
    cardForeground: 'text-slate-100',
    primary: 'text-cyan-400',
    secondary: 'text-slate-400',
    muted: 'text-slate-600',
    border: 'border-slate-800',
    fontHeading: 'font-mono tracking-tight',
    fontBody: 'font-sans',
  },
  editorial_magazine: {
    background: 'bg-[#fdfbf7]',
    foreground: 'text-stone-900',
    card: 'bg-[#fdfbf7]',
    cardForeground: 'text-stone-900',
    primary: 'text-stone-900',
    secondary: 'text-stone-600',
    muted: 'text-stone-400',
    border: 'border-stone-300',
    fontHeading: 'font-serif',
    fontBody: 'font-serif leading-relaxed',
  },
  clinical_clean: {
    background: 'bg-teal-50/30',
    foreground: 'text-teal-900',
    card: 'bg-white',
    cardForeground: 'text-teal-900',
    primary: 'text-teal-700',
    secondary: 'text-teal-600',
    muted: 'text-teal-400',
    border: 'border-teal-100',
    fontHeading: 'font-sans',
    fontBody: 'font-sans',
  },
};

export const ACCENTS: Record<AccentColor, string> = {
  blue: 'text-blue-600 border-blue-600 bg-blue-100',
  cyan: 'text-cyan-500 border-cyan-500 bg-cyan-100',
  purple: 'text-purple-600 border-purple-600 bg-purple-100',
  green: 'text-emerald-600 border-emerald-600 bg-emerald-100',
  orange: 'text-orange-600 border-orange-600 bg-orange-100',
};

export const ACCENT_BG: Record<AccentColor, string> = {
  blue: 'bg-blue-600',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-600',
  green: 'bg-emerald-600',
  orange: 'bg-orange-600',
};
