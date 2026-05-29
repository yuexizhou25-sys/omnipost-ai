'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { PublishHistory, PlatformType } from '@/lib/types';
import { Trash2, Copy, CheckCircle, AlertCircle } from 'lucide-react';

interface PublishHistoryProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PublishHistoryPanel({ isOpen = true, onClose }: PublishHistoryProps) {
  const publishHistory = useAppStore((state) => state.publishHistory);
  const setPublishHistory = useAppStore((state) => state.setPublishHistory);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此发布记录吗？')) return;

    try {
      setLoading(true);
      await apiClient.deleteHistory(id);
      setPublishHistory(publishHistory.filter((h) => h.id !== id));
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (history: PublishHistory) => {
    const content = `
标题: ${history.originalContent.title}
内容: ${history.originalContent.content}
平台: ${history.platforms.join(', ')}
创建时间: ${new Date(history.createdAt).toLocaleString()}
    `.trim();

    navigator.clipboard.writeText(content);
    alert('已复制到剪贴板');
  };

  const getPlatformLabel = (platform: PlatformType): string => {
    const labels: Record<PlatformType, string> = {
      wechat: '微信',
      zhihu: '知乎',
      bilibili: 'B站',
      xiaohongshu: '小红书',
      weibo: '微博',
      douyin: '抖音',
    };
    return labels[platform];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">发布历史</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded p-2 transition"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {publishHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>暂无发布记录</p>
            </div>
          ) : (
            <div className="divide-y">
              {publishHistory.map((history) => (
                <PublishHistoryItem
                  key={history.id}
                  history={history}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  getPlatformLabel={getPlatformLabel}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PublishHistoryItemProps {
  history: PublishHistory;
  onDelete: (id: string) => void;
  onCopy: (history: PublishHistory) => void;
  getPlatformLabel: (platform: PlatformType) => string;
  loading: boolean;
}

function PublishHistoryItem({
  history,
  onDelete,
  onCopy,
  getPlatformLabel,
  loading,
}: PublishHistoryItemProps) {
  const successCount = history.results.filter(
    (r) => r.status === 'success' || r.status === 'mock'
  ).length;

  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {history.originalContent.title || '(无标题)'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {history.originalContent.content.substring(0, 100)}...
          </p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
          {new Date(history.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {history.platforms.map((platform) => (
              <span
                key={platform}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {getPlatformLabel(platform)}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">
              {successCount}/{history.results.length}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onCopy(history)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
            title="复制"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(history.id)}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
