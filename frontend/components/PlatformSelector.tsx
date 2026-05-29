'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PlatformType } from '@/lib/types';
import { PlatformInfo } from '@/lib/api';
import { PLATFORM_META } from '@/lib/platform-meta';
import { Check, CheckCheck, X } from 'lucide-react';

interface PlatformSelectorProps {
  platforms: PlatformInfo[];
}

export function PlatformSelector({ platforms }: PlatformSelectorProps) {
  const selectedPlatforms = useAppStore((state) => state.selectedPlatforms);
  const togglePlatform = useAppStore((state) => state.togglePlatform);
  const selectAllPlatforms = useAppStore((state) => state.selectAllPlatforms);
  const clearPlatforms = useAppStore((state) => state.clearPlatforms);

  const allSelected = platforms.length > 0 && selectedPlatforms.length === platforms.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">选择发布平台</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            已选 {selectedPlatforms.length}/{platforms.length} 个平台
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={allSelected ? clearPlatforms : selectAllPlatforms}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-secondary hover:bg-accent text-secondary-foreground transition"
          >
            {allSelected ? <X className="w-3 h-3" /> : <CheckCheck className="w-3 h-3" />}
            {allSelected ? '取消全选' : '全选'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const meta = PLATFORM_META[platform.name as PlatformType];
          const isSelected = selectedPlatforms.includes(platform.name as PlatformType);
          const Icon = meta?.icon;

          return (
            <button
              key={platform.name}
              onClick={() => togglePlatform(platform.name as PlatformType)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center gap-2.5 group
                ${isSelected
                  ? `${meta?.borderColor} ${meta?.bgColor} glow-blue`
                  : 'border-border bg-background/40 hover:border-primary/30 hover:bg-accent/50'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className={`${isSelected ? meta?.color : 'text-muted-foreground group-hover:text-foreground'} transition`}>
                {Icon && <Icon className="w-7 h-7" />}
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground block">
                  {platform.displayName}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {platform.maxContentLength > 0
                    ? `≤${platform.maxContentLength}字`
                    : platform.contentFormat}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
