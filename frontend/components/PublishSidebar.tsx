'use client';

import { useAppStore } from '@/lib/store';
import { PlatformType } from '@/lib/types';
import { PLATFORM_META } from '@/lib/platform-meta';
import { PlatformBrandIcon } from '@/components/icons/PlatformBrandIcon';
import { RippleButton } from '@/components/ui/RippleButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { History, RotateCcw, Send, Rocket, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_PLATFORMS: PlatformType[] = [
  'wechat',
  'zhihu',
  'xiaohongshu',
  'bilibili',
  'weibo',
  'douyin',
];

interface PublishSidebarProps {
  onPublish: (simulated: boolean) => void;
  onReset: () => void;
  onShowHistory: () => void;
}

export function PublishSidebar({ onPublish, onReset, onShowHistory }: PublishSidebarProps) {
  const selectedPlatforms = useAppStore((s) => s.selectedPlatforms);
  const togglePlatform = useAppStore((s) => s.togglePlatform);
  const isPublishLoading = useAppStore((s) => s.isPublishLoading);

  return (
    <aside className="w-[280px] shrink-0 flex flex-col border-r border-border/60 bg-card/50 backdrop-blur-xl">
      <div className="px-5 py-5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#002FA7] to-[#6366F1] flex items-center justify-center shadow-lg shadow-[#002FA7]/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">OmniPost</h1>
            <p className="text-[10px] text-muted-foreground">多平台同步发布</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          发布平台
        </h2>
        <div className="space-y-3">
          {ALL_PLATFORMS.map((platform) => {
            const meta = PLATFORM_META[platform];
            const Icon = meta.icon;
            const isOn = selectedPlatforms.includes(platform);
            const isBrandIcon = platform === 'weibo' || platform === 'douyin';

            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
                  'hover:scale-[1.01] active:scale-[0.99]',
                  isOn
                    ? `${meta.borderColor} ${meta.bgColor} shadow-sm`
                    : 'border-border/50 bg-background/40 hover:border-primary/20'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    isOn ? meta.bgColor : 'bg-muted',
                    platform === 'weibo' && isOn && 'ring-1 ring-[#8B1538]/30',
                    platform === 'douyin' && isOn && 'ring-1 ring-[#25F4EE]/20'
                  )}
                >
                  {isBrandIcon ? (
                    <PlatformBrandIcon platform={platform} active={isOn} className="w-5 h-5" />
                  ) : (
                    <Icon className={cn('w-4 h-4', isOn ? meta.color : 'text-muted-foreground')} />
                  )}
                </div>
                <span className="flex-1 text-left text-sm font-medium text-foreground">
                  {meta.label}
                </span>
                <div
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors duration-300',
                    isOn
                      ? platform === 'weibo'
                        ? 'bg-[#8B1538]'
                        : platform === 'douyin'
                          ? 'bg-gradient-to-r from-[#25F4EE] to-[#FE2C55]'
                          : 'bg-[#002FA7]'
                      : 'bg-muted-foreground/30'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300',
                      isOn ? 'translate-x-[22px]' : 'translate-x-0.5'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground mt-4 px-1">
          已选 {selectedPlatforms.length} 个平台 · 手机端实时预览
        </p>
      </div>

      <div className="px-5 py-5 border-t border-border/40 space-y-2.5">
        <RippleButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onPublish(false)}
          disabled={isPublishLoading || selectedPlatforms.length === 0}
        >
          <Rocket className="w-4 h-4" />
          {isPublishLoading ? '发布中...' : '一键发布'}
        </RippleButton>
        <RippleButton
          variant="secondary"
          size="md"
          className="w-full"
          onClick={() => onPublish(true)}
          disabled={isPublishLoading || selectedPlatforms.length === 0}
        >
          <Send className="w-4 h-4" />
          模拟发布
        </RippleButton>
        <div className="flex gap-2 pt-1">
          <RippleButton variant="ghost" size="sm" className="flex-1" onClick={onReset} disabled={isPublishLoading}>
            <RotateCcw className="w-3.5 h-3.5" />
            重置
          </RippleButton>
          <RippleButton variant="ghost" size="sm" className="flex-1" onClick={onShowHistory}>
            <History className="w-3.5 h-3.5" />
            历史
          </RippleButton>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-xs text-muted-foreground">主题模式</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
