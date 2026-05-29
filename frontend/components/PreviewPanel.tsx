'use client';

import React from 'react';
import { PreviewItem } from '@/lib/api';
import { PlatformType } from '@/lib/types';
import {
  MessageCircle,
  BookOpen,
  Play,
  Heart,
  MessageDots,
  Zap,
  AlertTriangle,
} from 'lucide-react';

const platformIcons: Record<PlatformType, React.ReactNode> = {
  wechat: <MessageCircle className="w-5 h-5" />,
  zhihu: <BookOpen className="w-5 h-5" />,
  bilibili: <Play className="w-5 h-5" />,
  xiaohongshu: <Heart className="w-5 h-5" />,
  weibo: <MessageDots className="w-5 h-5" />,
  douyin: <Zap className="w-5 h-5" />,
};

const platformColors: Record<PlatformType, string> = {
  wechat: 'from-green-50 to-green-100',
  zhihu: 'from-blue-50 to-blue-100',
  bilibili: 'from-pink-50 to-pink-100',
  xiaohongshu: 'from-red-50 to-red-100',
  weibo: 'from-orange-50 to-orange-100',
  douyin: 'from-purple-50 to-purple-100',
};

interface PreviewPanelProps {
  previews: PreviewItem[];
  isLoading?: boolean;
}

export function PreviewPanel({ previews, isLoading = false }: PreviewPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (previews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>选择平台并输入内容后，预览将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">平台预览</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {previews.map((preview) => (
          <div
            key={preview.platform}
            className={`bg-gradient-to-br ${
              platformColors[preview.platform]
            } rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="text-gray-700">{platformIcons[preview.platform]}</div>
              <h4 className="font-semibold text-gray-900">
                {preview.platform.toUpperCase()}
              </h4>
            </div>

            <div className="bg-white rounded p-3 mb-3 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {preview.preview}
              </p>
            </div>

            {preview.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 space-y-1">
                {preview.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
