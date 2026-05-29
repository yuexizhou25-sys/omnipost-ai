'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PlatformType } from '@/lib/types';
import {
  MessageCircle,
  BookOpen,
  Play,
  Heart,
  MessageDots,
  Zap,
} from 'lucide-react';

const platformIcons: Record<PlatformType, React.ReactNode> = {
  wechat: <MessageCircle className="w-6 h-6" />,
  zhihu: <BookOpen className="w-6 h-6" />,
  bilibili: <Play className="w-6 h-6" />,
  xiaohongshu: <Heart className="w-6 h-6" />,
  weibo: <MessageDots className="w-6 h-6" />,
  douyin: <Zap className="w-6 h-6" />,
};

interface PlatformSelectorProps {
  platforms: any[];
}

export function PlatformSelector({ platforms }: PlatformSelectorProps) {
  const selectedPlatforms = useAppStore((state) => state.selectedPlatforms);
  const togglePlatform = useAppStore((state) => state.togglePlatform);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">选择发布平台</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => togglePlatform(platform.name)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              flex flex-col items-center justify-center gap-2
              hover:shadow-lg transform hover:scale-105
              ${
                selectedPlatforms.includes(platform.name)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className={selectedPlatforms.includes(platform.name) ? 'text-blue-600' : 'text-gray-600'}>
              {platformIcons[platform.name as PlatformType]}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">
              {platform.displayName}
            </span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        已选择 {selectedPlatforms.length} 个平台
      </p>
    </div>
  );
}
