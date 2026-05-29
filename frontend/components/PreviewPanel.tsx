'use client';

import React from 'react';
import { PreviewItem } from '@/lib/api';
import { PlatformType } from '@/lib/types';
import { PLATFORM_META, getPlatformLabel } from '@/lib/platform-meta';
import { AlertTriangle, Eye, Sparkles } from 'lucide-react';

interface PreviewPanelProps {
  previews: PreviewItem[];
  isLoading?: boolean;
}

export function PreviewPanel({ previews, isLoading = false }: PreviewPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">正在适配各平台格式...</p>
      </div>
    );
  }

  if (previews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-primary/60" />
        </div>
        <p className="text-foreground font-medium mb-1">平台预览</p>
        <p className="text-sm text-muted-foreground">
          选择平台并输入内容后，点击「生成预览」查看各平台适配效果
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          平台预览
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {previews.length} 个平台已适配
          </span>
        </h3>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {previews.map((preview) => {
          const meta = PLATFORM_META[preview.platform as PlatformType];
          const Icon = meta?.icon;

          return (
            <div
              key={preview.platform}
              className={`rounded-xl border bg-gradient-to-br ${meta?.gradient} ${meta?.borderColor} overflow-hidden`}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
                {Icon && <Icon className={`w-4 h-4 ${meta?.color}`} />}
                <h4 className="font-medium text-foreground text-sm">
                  {getPlatformLabel(preview.platform as PlatformType)}
                </h4>
                {preview.warnings.length > 0 && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                    {preview.warnings.length} 条提示
                  </span>
                )}
              </div>

              <div className="px-4 py-3">
                <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed font-mono text-[13px]">
                  {preview.preview}
                </p>
              </div>

              {preview.warnings.length > 0 && (
                <div className="px-4 pb-3 space-y-1.5">
                  {preview.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/10 rounded-lg px-3 py-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
