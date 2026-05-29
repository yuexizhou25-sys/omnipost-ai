'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { PublishResult, PlatformType } from '@/lib/types';
import { Check, X, Clock } from 'lucide-react';

interface PublishResultsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PublishResults({ isOpen = true, onClose }: PublishResultsProps) {
  const publishResults = useAppStore((state) => state.publishResults);

  if (!isOpen || !publishResults || publishResults.length === 0) {
    return null;
  }

  const successCount = publishResults.filter((r) => r.status === 'success' || r.status === 'mock').length;
  const failedCount = publishResults.filter((r) => r.status === 'failed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">发布结果</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded p-2 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{publishResults.length}</p>
              <p className="text-sm text-gray-600">总计</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{successCount}</p>
              <p className="text-sm text-gray-600">成功/模拟</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{failedCount}</p>
              <p className="text-sm text-gray-600">失败</p>
            </div>
          </div>

          <div className="space-y-3">
            {publishResults.map((result) => (
              <PublishResultItem key={result.id} result={result} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishResultItem({ result }: { result: PublishResult }) {
  const getPlatformLabel = (platform: PlatformType): string => {
    const labels: Record<PlatformType, string> = {
      wechat: '微信公众号',
      zhihu: '知乎',
      bilibili: 'B站',
      xiaohongshu: '小红书',
      weibo: '微博',
      douyin: '抖音',
    };
    return labels[platform];
  };

  const statusIcon =
    result.status === 'success' || result.status === 'mock' ? (
      <Check className="w-5 h-5 text-green-600" />
    ) : result.status === 'failed' ? (
      <X className="w-5 h-5 text-red-600" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-600" />
    );

  const statusBg =
    result.status === 'success' || result.status === 'mock'
      ? 'bg-green-50'
      : result.status === 'failed'
        ? 'bg-red-50'
        : 'bg-yellow-50';

  return (
    <div className={`${statusBg} border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {statusIcon}
          <div>
            <p className="font-semibold text-gray-900">
              {getPlatformLabel(result.platformType)}
            </p>
            <p className="text-sm text-gray-600">{result.message}</p>
            {result.isSimulated && (
              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                模拟模式
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
