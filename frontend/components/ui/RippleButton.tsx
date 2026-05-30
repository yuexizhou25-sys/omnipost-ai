'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function RippleButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples((prev) => [
        ...prev,
        { x: e.clientX - rect.left, y: e.clientY - rect.top, id },
      ]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-[#002FA7] to-[#6366F1] text-white shadow-lg shadow-[#002FA7]/25 hover:shadow-[#002FA7]/40',
    secondary:
      'border border-primary/40 bg-background text-primary hover:bg-primary/5',
    ghost: 'bg-secondary text-secondary-foreground hover:bg-accent',
    danger:
      'border border-red-500/30 text-red-500 hover:bg-red-500/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-5 py-3 text-sm rounded-xl font-semibold',
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden font-medium transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
