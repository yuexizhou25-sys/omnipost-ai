'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { PublishHistory, PlatformType } from '@/lib/types';
import { getPlatformLabel } from '@/lib/platform-meta';
import { Trash2, Copy, CheckCircle, XCircle, RotateCcw, History } from 'lucide-react';

interface PublishHistoryProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PublishHistoryPanel({ isOpen = true, onClose }: PublishHistoryProps) {
  const publishHistory = useAppStore((state) => state.publishHistory);
  const setPublishHistory = useAppStore((state) => state.setPublishHistory);
  const setContent = useAppStore((state) => state.setContent);
  const setSelectedPlatforms = useAppStore((state) => state.setSelectedPlatforms);
  const setMessage = useAppStore((state) => state.setMessage);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此发布记录吗？')) return;

    try {
      setDeletingId(id);
      await apiClient.deleteHistory(id);
      setPublishHistory(publishHistory.filter((h) => h.id !== id));
      setMessage({ type: 'success', text: '记录已删除' });
    } catch {
      setMessage({ type: 'error', text: '删除失败' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (history: PublishHistory) => {
    const text = `标题: ${history.originalContent.title}\n内容: ${history.originalContent.content}\n平台: ${history.platforms.map(getPlatformLabel).join(', ')}`;
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: '已复制到剪贴板' });
  };

  const handleRestore = (history: PublishHistory) => {
    setContent(history.originalContent);
    setSelectedPlatforms(history.platforms);
    onClose?.();
    setMessage({ type: 'info', text: '内容已恢复到编辑器' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">发布历史</h2>
              <p className="text-xs text-muted-foreground">共 {publishHistory.length} 条记录</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {publishHistory.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">暂无发布记录</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {publishHistory.map((history) => (
                <HistoryItem
                  key={history.id}
                  history={history}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  onRestore={handleRestore}
                  isDeleting={deletingId === history.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryItem({
  history,
  onDelete,
  onCopy,
  onRestore,
  isDeleting,
}: {
  history: PublishHistory;
  onDelete: (id: string) => void;
  onCopy: (h: PublishHistory) => void;
  onRestore: (h: PublishHistory) => void;
  isDeleting: boolean;
}) {
  const successCount = history.results.filter(
    (r) => r.status === 'success' || r.status === 'mock'
  ).length;
  const snippet = history.originalContent.content;
  const preview =
    snippet.length > 80 ? snippet.substring(0, 80) + '...' : snippet;

  return (
    <div className="p-5 hover:bg-accent/30 transition">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {history.originalContent.title || '(无标题)'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{preview}</p>
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {new Date(history.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {history.platforms.map((platform) => (
              <span
                key={platform}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-full"
              >
                {getPlatformLabel(platform as PlatformType)}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            {successCount}/{history.results.length}
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onRestore(history)}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"
            title="恢复到编辑器"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onCopy(history)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition"
            title="复制"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(history.id)}
            disabled={isDeleting}
            className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
