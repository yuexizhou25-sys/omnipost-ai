'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { PublishSidebar } from '@/components/PublishSidebar';
import { ImmersiveEditor } from '@/components/ImmersiveEditor';
import { LivePreviewPanel } from '@/components/LivePreviewPanel';
import { PublishResults } from '@/components/PublishResults';
import { PublishHistoryPanel } from '@/components/PublishHistoryPanel';
import { EditorSkeleton } from '@/components/ui/Skeleton';
import { useDebouncedPreview } from '@/lib/hooks/useDebouncedPreview';
import { PlatformType } from '@/lib/types';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function Home() {
  const {
    content,
    selectedPlatforms,
    publishResults,
    showHistory,
    message,
    setMessage,
    setPlatforms,
    setPublishResults,
    setIsPublishLoading,
    setShowHistory,
    resetContent,
    setPublishHistory,
    setSelectedPlatforms,
  } = useAppStore();

  const [initialLoading, setInitialLoading] = useState(true);

  useDebouncedPreview();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.getPlatforms();
        setPlatforms(data);
        setSelectedPlatforms(['wechat', 'zhihu'] as PlatformType[]);
      } catch {
        setMessage({ type: 'error', text: '加载平台失败，请确认后端已启动' });
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [setPlatforms, setMessage, setSelectedPlatforms]);

  useEffect(() => {
    if (!initialLoading) {
      apiClient.getHistory(20).then(setPublishHistory).catch(() => {});
    }
  }, [initialLoading, setPublishHistory]);

  const validate = (): boolean => {
    if (selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: '请至少选择一个平台' });
      return false;
    }
    if (!content.title && !content.content) {
      setMessage({ type: 'error', text: '请输入标题或内容' });
      return false;
    }
    return true;
  };

  const handlePublish = async (isSimulated: boolean) => {
    if (!validate()) return;
    if (!isSimulated && !confirm('确定要真实发布到所有选中平台吗？')) return;

    try {
      setIsPublishLoading(true);
      const result = await apiClient.publish(
        content,
        selectedPlatforms as PlatformType[],
        isSimulated
      );
      setPublishResults(result.results);
      setMessage({
        type: 'success',
        text: isSimulated ? '模拟发布完成' : '发布完成',
      });
      const history = await apiClient.getHistory(20);
      setPublishHistory(history);
    } catch {
      setMessage({ type: 'error', text: '发布失败' });
    } finally {
      setIsPublishLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-[280px] border-r border-border/60 bg-card/50" />
        <div className="flex-1 flex items-center justify-center p-10">
          <EditorSkeleton />
        </div>
        <div className="w-[400px] border-l border-border/60 bg-card/30" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-xl animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500 text-white'
              : message.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-[#002FA7] text-white'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : message.type === 'info' ? (
            <Info className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      {/* 三栏布局 */}
      <div className="flex flex-1 min-h-0">
        <PublishSidebar
          onPublish={handlePublish}
          onReset={() => resetContent()}
          onShowHistory={() => setShowHistory(true)}
        />
        <ImmersiveEditor />
        <LivePreviewPanel />
      </div>

      <PublishResults
        isOpen={publishResults !== null}
        onClose={() => setPublishResults(null)}
      />
      <PublishHistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
