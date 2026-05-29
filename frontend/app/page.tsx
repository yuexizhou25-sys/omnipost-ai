'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { ContentEditor } from '@/components/ContentEditor';
import { PlatformSelector } from '@/components/PlatformSelector';
import { PreviewPanel } from '@/components/PreviewPanel';
import { PublishResults } from '@/components/PublishResults';
import { PublishHistoryPanel } from '@/components/PublishHistoryPanel';
import { PlatformType } from '@/lib/types';
import { Eye, Send, History, RotateCcw, Zap } from 'lucide-react';

export default function Home() {
  const {
    content,
    platforms,
    selectedPlatforms,
    previews,
    publishResults,
    isLoading,
    showPreview,
    showHistory,
    message,
    setMessage,
    setPlatforms,
    setPreviews,
    setPublishResults,
    setIsLoading,
    setShowPreview,
    setShowHistory,
    resetContent,
    setPublishHistory,
  } = useAppStore();

  const [initialLoading, setInitialLoading] = useState(true);

  // 初始化：加载平台列表
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await apiClient.getPlatforms();
        setPlatforms(data);
      } catch (error) {
        setMessage({
          type: 'error',
          text: '加载平台列表失败',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadPlatforms();
  }, []);

  // 加载发布历史
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiClient.getHistory(20);
        setPublishHistory(data);
      } catch (error) {
        console.error('加载历史失败:', error);
      }
    };

    if (!initialLoading) {
      loadHistory();
    }
  }, [initialLoading]);

  // 生成预览
  const handleGeneratePreview = async () => {
    if (selectedPlatforms.length === 0) {
      setMessage({
        type: 'error',
        text: '请至少选择一个平台',
      });
      return;
    }

    if (!content.title && !content.content) {
      setMessage({
        type: 'error',
        text: '请输入标题或内容',
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiClient.getPreview(
        content,
        selectedPlatforms as PlatformType[]
      );
      setPreviews(data);
      setShowPreview(true);
      setMessage({
        type: 'success',
        text: '预览生成成功',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: '生成预览失败',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发布内容
  const handlePublish = async (isSimulated: boolean = true) => {
    if (selectedPlatforms.length === 0) {
      setMessage({
        type: 'error',
        text: '请至少选择一个平台',
      });
      return;
    }

    if (!content.title && !content.content) {
      setMessage({
        type: 'error',
        text: '请输入标题或内容',
      });
      return;
    }

    if (!isSimulated && !confirm('确定要真实发布到所有平台吗？')) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await apiClient.publish(
        content,
        selectedPlatforms as PlatformType[],
        isSimulated
      );
      setPublishResults(result.results);

      setMessage({
        type: 'success',
        text: isSimulated ? '内容已模拟发布' : '内容已发布',
      });

      // 重新加载历史
      const history = await apiClient.getHistory(20);
      setPublishHistory(history);
    } catch (error) {
      setMessage({
        type: 'error',
        text: '发布失败',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
          <p className="text-white text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 导航栏 */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">OmniPost</h1>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded ml-2">
                Beta
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 transition"
              >
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">历史</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 消息提示 */}
      {message && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg text-white z-50 animate-fade-in ${
            message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：编辑区 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">编辑内容</h2>
              <ContentEditor />
            </div>

            {/* 快速操作 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
              <button
                onClick={() => resetContent()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <RotateCcw className="w-5 h-5" />
                <span>重置</span>
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
                <span>{isLoading ? '生成中...' : '生成预览'}</span>
              </button>
              <button
                onClick={() => handlePublish(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isLoading ? '发布中...' : '模拟发布'}</span>
              </button>
              <button
                onClick={() => handlePublish(false)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50 text-sm"
              >
                <Send className="w-5 h-5" />
                <span>{isLoading ? '发布中...' : '真实发布'}</span>
              </button>
            </div>
          </div>

          {/* 中间：平台选择 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              {platforms.length > 0 && <PlatformSelector platforms={platforms} />}
            </div>
          </div>

          {/* 右侧：预览区 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <PreviewPanel previews={previews} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>

      {/* 发布结果弹窗 */}
      <PublishResults
        isOpen={publishResults !== null}
        onClose={() => setPublishResults(null)}
      />

      {/* 发布历史弹窗 */}
      <PublishHistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
