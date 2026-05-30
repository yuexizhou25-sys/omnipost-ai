'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Hash, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImmersiveEditor() {
  const content = useAppStore((s) => s.content);
  const setContent = useAppStore((s) => s.setContent);
  const selectedPlatforms = useAppStore((s) => s.selectedPlatforms);
  const platforms = useAppStore((s) => s.platforms);
  const [focused, setFocused] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const selectedConfigs = platforms.filter((p) =>
    selectedPlatforms.includes(p.name as typeof selectedPlatforms[number])
  );
  const minLimit = selectedConfigs.length
    ? Math.min(...selectedConfigs.map((p) => p.maxContentLength || 10000))
    : 10000;

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-background relative">
      {/* 聚焦光晕 */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          focused ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#002FA7]/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col px-6 lg:px-10 py-8 max-w-4xl mx-auto w-full relative z-10">
        {/* 标题 - 极简 */}
        <input
          type="text"
          value={content.title}
          onChange={(e) => setContent({ title: e.target.value })}
          placeholder="文章标题..."
          className={cn(
            'w-full bg-transparent text-2xl lg:text-3xl font-bold text-foreground',
            'placeholder:text-muted-foreground/50 outline-none border-none mb-4',
            'focus:placeholder:text-muted-foreground/30 transition-colors'
          )}
          maxLength={100}
        />

        {/* Markdown 编辑器 */}
        <div
          className={cn(
            'flex-1 relative rounded-2xl transition-all duration-300',
            focused && 'ring-2 ring-[#002FA7]/40 shadow-xl shadow-[#002FA7]/10'
          )}
        >
          <textarea
            ref={editorRef}
            value={content.content}
            onChange={(e) => setContent({ content: e.target.value })}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={'在此输入 Markdown 内容\n\n# 标题\n正文内容...\n\n系统将自动适配各平台格式'}
            spellCheck={false}
            className={cn(
              'w-full h-full min-h-[420px] resize-none rounded-2xl p-6 lg:p-8',
              'bg-card/60 backdrop-blur-sm border border-border/50',
              'font-mono text-[15px] leading-relaxed text-foreground',
              'placeholder:text-muted-foreground/40 outline-none',
              'transition-all duration-300'
            )}
            maxLength={10000}
          />

          {/* 底部工具栏 */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Markdown
              </span>
              {content.images && content.images.length > 0 && (
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {content.images.length} 张图
                </span>
              )}
            </div>
            <span
              className={cn(
                'text-[11px] tabular-nums',
                content.content.length > minLimit ? 'text-amber-500' : 'text-muted-foreground'
              )}
            >
              {content.content.length} / {minLimit}
            </span>
          </div>
        </div>

        {/* 扩展字段 - 折叠式 */}
        <details className="mt-4 group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            标签 / 图片 / 视频
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={content.tags?.join(', ') || ''}
              onChange={(e) =>
                setContent({
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="标签，逗号分隔"
              className="px-3 py-2 text-xs rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#002FA7]/30"
            />
            <input
              type="text"
              value={content.images?.join(', ') || ''}
              onChange={(e) =>
                setContent({
                  images: e.target.value.split(',').map((u) => u.trim()).filter(Boolean),
                })
              }
              placeholder="图片 URL"
              className="px-3 py-2 text-xs rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#002FA7]/30"
            />
            <input
              type="text"
              value={content.videoUrl || ''}
              onChange={(e) => setContent({ videoUrl: e.target.value })}
              placeholder="视频 URL（可选）"
              className="px-3 py-2 text-xs rounded-lg border border-border bg-card/50 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#002FA7]/30"
            />
          </div>
        </details>
      </div>
    </main>
  );
}
