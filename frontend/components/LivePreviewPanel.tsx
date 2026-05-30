'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PlatformType } from '@/lib/types';
import { PLATFORM_META } from '@/lib/platform-meta';
import { PreviewSkeleton } from '@/components/ui/Skeleton';
import { PhoneMockup } from '@/components/preview/PhoneMockup';
import {
  WeiboSkin,
  DouyinSkin,
  XiaohongshuSkin,
  WeChatSkin,
  ZhihuSkin,
  BilibiliSkin,
} from '@/components/preview/PlatformSkins';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewItem } from '@/lib/api';

const ALL_PLATFORMS: PlatformType[] = [
  'wechat',
  'zhihu',
  'xiaohongshu',
  'bilibili',
  'weibo',
  'douyin',
];

function extractAdaptedText(preview?: PreviewItem, fallback = ''): string {
  if (!preview?.preview) return fallback;
  const text = preview.preview
    .replace(/^【[^】]+】\s*\n?/, '')
    .replace(/^[═─━✨🎬]+\s*\n?/gm, '')
    .replace(/\n\[.+?\]\s*$/g, '')
    .trim();
  return text || fallback;
}

function PlatformSkinContent({
  platform,
  content,
  preview,
}: {
  platform: PlatformType;
  content: ReturnType<typeof useAppStore.getState>['content'];
  preview?: PreviewItem;
}) {
  const adaptedText = extractAdaptedText(preview, content.content);

  switch (platform) {
    case 'weibo':
      return <WeiboSkin content={content} adaptedText={adaptedText} warnings={preview?.warnings} />;
    case 'douyin':
      return <DouyinSkin content={content} adaptedText={adaptedText} warnings={preview?.warnings} />;
    case 'xiaohongshu':
      return <XiaohongshuSkin content={content} adaptedText={adaptedText} />;
    case 'wechat':
      return <WeChatSkin content={content} adaptedText={adaptedText} />;
    case 'zhihu':
      return <ZhihuSkin content={content} adaptedText={adaptedText} />;
    case 'bilibili':
      return <BilibiliSkin content={content} adaptedText={adaptedText} />;
    default:
      return null;
  }
}

export function LivePreviewPanel() {
  const previews = useAppStore((s) => s.previews);
  const isPreviewLoading = useAppStore((s) => s.isPreviewLoading);
  const selectedPlatforms = useAppStore((s) => s.selectedPlatforms);
  const content = useAppStore((s) => s.content);
  const previewTab = useAppStore((s) => s.previewTab);
  const setPreviewTab = useAppStore((s) => s.setPreviewTab);

  const visibleTabs = ALL_PLATFORMS.filter((p) => selectedPlatforms.includes(p));
  const [animKey, setAnimKey] = useState(previewTab);

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(previewTab)) {
      setPreviewTab(visibleTabs[0]);
    }
  }, [visibleTabs, previewTab, setPreviewTab]);

  useEffect(() => {
    setAnimKey(previewTab);
  }, [previewTab]);

  const currentPreview = previews.find((p) => p.platform === previewTab);
  const hasContent = content.title || content.content;

  return (
    <aside className="w-[420px] shrink-0 flex flex-col border-l border-border/60 bg-gradient-to-b from-card/40 to-background/80 backdrop-blur-xl">
      <div className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#002FA7] dark:text-primary" />
          <h2 className="text-sm font-semibold text-foreground">实时预览</h2>
          {isPreviewLoading && (
            <span className="ml-auto text-[10px] text-primary animate-pulse">适配中...</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {visibleTabs.length === 0 ? (
            <span className="text-xs text-muted-foreground">请先在左侧选择平台</span>
          ) : (
            visibleTabs.map((platform) => {
              const meta = PLATFORM_META[platform];
              const isActive = previewTab === platform;
              return (
                <button
                  key={platform}
                  onClick={() => setPreviewTab(platform)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    isActive
                      ? 'bg-[#002FA7] text-white shadow-md shadow-[#002FA7]/30 dark:bg-primary'
                      : 'bg-muted/80 text-muted-foreground hover:bg-accent'
                  )}
                >
                  {meta.shortLabel}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPreviewLoading ? (
          <div className="p-5">
            <PreviewSkeleton />
          </div>
        ) : visibleTabs.length === 0 || !hasContent ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center py-16">
            <PhoneMockup>
              <div className="h-full flex items-center justify-center bg-zinc-900 text-white/40 text-[11px] px-6 text-center">
                选择平台并输入内容，手机预览将实时更新
              </div>
            </PhoneMockup>
          </div>
        ) : (
          <div className="py-2">
            <PhoneMockup>
              <div key={animKey} className="h-full animate-skin-in">
                <PlatformSkinContent
                  platform={previewTab}
                  content={content}
                  preview={currentPreview}
                />
              </div>
            </PhoneMockup>

            {currentPreview && currentPreview.warnings.length > 0 && (
              <div className="px-5 pb-4 space-y-1.5">
                {currentPreview.warnings.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1.5 text-[10px] text-amber-500 bg-amber-500/10 rounded-lg px-3 py-2"
                  >
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
