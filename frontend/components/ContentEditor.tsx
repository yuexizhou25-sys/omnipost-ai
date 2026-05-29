'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { FileText, Hash, Image, Video, AlignLeft } from 'lucide-react';

export function ContentEditor() {
  const content = useAppStore((state) => state.content);
  const setContent = useAppStore((state) => state.setContent);
  const selectedPlatforms = useAppStore((state) => state.selectedPlatforms);
  const platforms = useAppStore((state) => state.platforms);

  const inputClassName =
    'w-full px-4 py-2.5 rounded-xl border border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition';

  const selectedConfigs = platforms.filter((p) =>
    selectedPlatforms.includes(p.name as typeof selectedPlatforms[number])
  );
  const minContentLimit = selectedConfigs.length
    ? Math.min(...selectedConfigs.map((p) => p.maxContentLength || 10000))
    : 10000;

  const imageUrls = content.images?.filter(Boolean) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <FileText className="w-4 h-4 text-primary" />
          标题
        </label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => setContent({ title: e.target.value })}
          placeholder="输入文章标题..."
          className={inputClassName}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground mt-1.5">{content.title.length}/100</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <AlignLeft className="w-4 h-4 text-primary" />
          正文内容
          <span className="text-xs text-muted-foreground font-normal">支持 Markdown</span>
        </label>
        <textarea
          value={content.content}
          onChange={(e) => setContent({ content: e.target.value })}
          placeholder="在此输入内容，系统将自动适配各平台格式与风格..."
          className={`${inputClassName} h-52 resize-none leading-relaxed`}
          maxLength={10000}
        />
        <p className={`text-xs mt-1.5 ${content.content.length > minContentLimit ? 'text-amber-400' : 'text-muted-foreground'}`}>
          {content.content.length}/10000
          {selectedConfigs.length > 0 && ` · 最严限制 ${minContentLimit} 字`}
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Hash className="w-4 h-4 text-primary" />
          标签
          <span className="text-xs text-muted-foreground font-normal">逗号分隔</span>
        </label>
        <input
          type="text"
          value={content.tags?.join(', ') || ''}
          onChange={(e) =>
            setContent({
              tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
            })
          }
          placeholder="技术, 分享, 编程"
          className={inputClassName}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Image className="w-4 h-4 text-primary" />
          图片 URL
        </label>
        <input
          type="text"
          value={content.images?.join(', ') || ''}
          onChange={(e) =>
            setContent({
              images: e.target.value.split(',').map((u) => u.trim()).filter(Boolean),
            })
          }
          placeholder="https://example.com/image.jpg"
          className={inputClassName}
        />
        {imageUrls.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imageUrls.slice(0, 4).map((url, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-lg bg-muted border border-border overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
            {imageUrls.length > 4 && (
              <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                +{imageUrls.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Video className="w-4 h-4 text-primary" />
          视频 URL
          <span className="text-xs text-muted-foreground font-normal">可选</span>
        </label>
        <input
          type="text"
          value={content.videoUrl || ''}
          onChange={(e) => setContent({ videoUrl: e.target.value })}
          placeholder="B站、抖音等平台视频链接"
          className={inputClassName}
        />
      </div>
    </div>
  );
}
