'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn('flex justify-center py-4', className)}>
      <div className="relative">
        {/* 外框阴影 */}
        <div className="absolute -inset-3 bg-gradient-to-b from-primary/20 via-transparent to-violet-500/10 rounded-[3rem] blur-xl opacity-60" />

        {/* 手机外壳 */}
        <div
          className={cn(
            'relative w-[260px] h-[520px] rounded-[2.5rem] p-[10px]',
            'bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900',
            'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]',
            'border border-zinc-600/50'
          )}
        >
          {/* 侧边按钮 */}
          <div className="absolute -left-[2px] top-28 w-[3px] h-8 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[2px] top-40 w-[3px] h-12 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -right-[2px] top-36 w-[3px] h-16 bg-zinc-600 rounded-r-sm" />

          {/* 屏幕 */}
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black">
            {/* 灵动岛 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[90px] h-[26px] bg-black rounded-full flex items-center justify-center gap-2 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="w-10 h-2.5 rounded-full bg-zinc-900" />
            </div>

            {/* 状态栏 */}
            <div className="absolute top-0 left-0 right-0 z-20 h-10 flex items-end justify-between px-6 pb-0.5 text-[9px] text-white/80 font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-2 border border-white/60 rounded-sm relative">
                  <span className="absolute inset-0.5 bg-white/80 rounded-[1px]" />
                </span>
              </div>
            </div>

            {/* 内容区 */}
            <div className="absolute inset-0 pt-10 overflow-hidden">{children}</div>

            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-28 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
