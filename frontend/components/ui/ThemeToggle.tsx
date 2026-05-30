'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? '切换浅色模式' : '切换暗黑模式'}
      className={cn(
        'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
        'hover:scale-105 active:scale-95',
        isDark
          ? 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'bg-[#002FA7]/10 text-[#002FA7] hover:bg-[#002FA7]/20'
      )}
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
