'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { PublishResult, PlatformType } from '@/lib/types';
import { getPlatformLabel } from '@/lib/platform-meta';
import { Check, X, Clock, XCircle, Send } from 'lucide-react';

interface PublishResultsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PublishResults({ isOpen = true, onClose }: PublishResultsProps) {
  const publishResults = useAppStore((state) => state.publishResults);

  if (!isOpen || !publishResults || publishResults.length === 0) {
    return null;
  }

  const successCount = publishResults.filter(
    (r) => r.status === 'success' || r.status === 'mock'
  ).length;
  const failedCount = publishResults.filter((r) => r.status === 'failed').length;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">发布结果</h2>
              <p className="text-xs text-muted-foreground">
                {successCount} 成功 · {failedCount} 失败
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {publishResults.map((result) => (
            <PublishResultItem key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishResultItem({ result }: { result: PublishResult }) {
  const isSuccess = result.status === 'success' || result.status === 'mock';

  const statusIcon = isSuccess ? (
    <Check className="w-4 h-4 text-emerald-400" />
  ) : result.status === 'failed' ? (
    <X className="w-4 h-4 text-red-400" />
  ) : (
    <Clock className="w-4 h-4 text-amber-400" />
  );

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        isSuccess
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : result.status === 'failed'
            ? 'border-red-500/20 bg-red-500/5'
            : 'border-amber-500/20 bg-amber-500/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSuccess ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}
        >
          {statusIcon}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">
            {getPlatformLabel(result.platformType as PlatformType)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{result.message}</p>
          {result.isSimulated && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full">
              模拟发布
            </span>
          )}
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">
        {new Date(result.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
