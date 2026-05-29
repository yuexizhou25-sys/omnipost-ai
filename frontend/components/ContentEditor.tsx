'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export function ContentEditor() {
  const content = useAppStore((state) => state.content);
  const setContent = useAppStore((state) => state.setContent);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题
        </label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => setContent({ title: e.target.value })}
          placeholder="输入文章标题..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{content.title.length}/100</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          内容
        </label>
        <textarea
          value={content.content}
          onChange={(e) => setContent({ content: e.target.value })}
          placeholder="输入文章内容...支持 Markdown 格式"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition h-64 resize-none"
          maxLength={10000}
        />
        <p className="text-xs text-gray-500 mt-1">{content.content.length}/10000</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签 (逗号分隔)
        </label>
        <input
          type="text"
          value={content.tags?.join(',') || ''}
          onChange={(e) =>
            setContent({
              tags: e.target.value.split(',').filter((t) => t.trim()),
            })
          }
          placeholder="如：技术, 分享, 编程"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          图片 URL (逗号分隔)
        </label>
        <input
          type="text"
          value={content.images?.join(',') || ''}
          onChange={(e) =>
            setContent({
              images: e.target.value.split(',').filter((u) => u.trim()),
            })
          }
          placeholder="如：https://example.com/image1.jpg, https://example.com/image2.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          视频 URL (可选)
        </label>
        <input
          type="text"
          value={content.videoUrl || ''}
          onChange={(e) => setContent({ videoUrl: e.target.value })}
          placeholder="视频链接 (支持 B 站、抖音等平台)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>
    </div>
  );
}
