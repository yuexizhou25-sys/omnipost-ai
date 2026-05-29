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
import {
  Eye,
  Send,
  History,
  RotateCcw,
  Zap,
  PenLine,
  Layers,
  Rocket,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { icon: PenLine, label: '创作内容', desc: '输入标题与正文' },
  { icon: Layers, label: '选择平台', desc: '勾选目标平台' },
  { icon: Eye, label: '预览适配', desc: '查看各平台效果' },
  { icon: Rocket, label: '一键发布', desc: '模拟或真实发布' },
];

export default function Home() {
  const {
    content,
    platforms,
    selectedPlatforms,
    previews,
    publishResults,
    isPreviewLoading,
    isPublishLoading,
    showHistory,
    message,
    setMessage,
    setPlatforms,
    setPreviews,
    setPublishResults,
    setIsPreviewLoading,
    setIsPublishLoading,
    setShowHistory,
    resetContent,
    setPublishHistory,
  } = useAppStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const data = await apiClient.getPlatforms();
        setPlatforms(data);
      } catch {
        setMessage({ type: 'error', text: '加载平台列表失败，请确认后端已启动' });
      } finally {
        setInitialLoading(false);
      }
    };
    loadPlatforms();
  }, [setPlatforms, setMessage]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiClient.getHistory(20);
        setPublishHistory(data);
      } catch {
        /* ignore */
      }
    };
    if (!initialLoading) loadHistory();
  }, [initialLoading, setPublishHistory]);

  useEffect(() => {
    if (content.title || content.content) setActiveStep(0);
    if (selectedPlatforms.length > 0) setActiveStep(1);
    if (previews.length > 0) setActiveStep(2);
  }, [content, selectedPlatforms, previews]);

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

  const handleGeneratePreview = async () => {
    if (!validate()) return;
    try {
      setIsPreviewLoading(true);
      const data = await apiClient.getPreview(content, selectedPlatforms as PlatformType[]);
      setPreviews(data);
      setActiveStep(2);
      setMessage({ type: 'success', text: `已生成 ${data.length} 个平台预览` });
    } catch {
      setMessage({ type: 'error', text: '生成预览失败' });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handlePublish = async (isSimulated: boolean = true) => {
    if (!validate()) return;
    if (!isSimulated && !confirm('确定要真实发布到所有选中平台吗？此操作不可撤销。')) return;

    try {
      setIsPublishLoading(true);
      const result = await apiClient.publish(
        content,
        selectedPlatforms as PlatformType[],
        isSimulated
      );
      setPublishResults(result.results);
      setActiveStep(3);
      setMessage({
        type: 'success',
        text: isSimulated ? '内容已模拟发布' : '内容已发布',
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="text-foreground text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">OmniPost</h1>
                <p className="text-[10px] text-muted-foreground leading-tight">多平台内容同步发布</p>
              </div>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                Beta
              </span>
            </div>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition text-sm"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">发布历史</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Toast */}
      {message && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500/90 text-white'
              : message.type === 'error'
                ? 'bg-red-500/90 text-white'
                : 'bg-primary/90 text-white'
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

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            一次创作，<span className="gradient-text">多平台同步</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            自动适配微信公众号、知乎、B站、小红书、微博、抖音的格式与风格，支持预览与一键发布
          </p>
        </div>

        {/* 工作流步骤 */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 max-w-3xl mx-auto">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= activeStep;
            return (
              <div
                key={step.label}
                className={`flex flex-col items-center text-center p-3 rounded-xl transition ${
                  isActive ? 'bg-primary/10' : 'bg-card/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">{step.desc}</span>
              </div>
            );
          })}
        </div>

        {/* 主内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：编辑 + 操作 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6">
              <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-primary" />
                编辑内容
              </h2>
              <ContentEditor />
            </div>

            <div className="glass-card p-5 space-y-2.5">
              <button
                onClick={() => resetContent()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-accent text-secondary-foreground transition text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                重置内容
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={isPreviewLoading || isPublishLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition disabled:opacity-50 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                {isPreviewLoading ? '生成中...' : '生成预览'}
              </button>
              <button
                onClick={() => handlePublish(true)}
                disabled={isPreviewLoading || isPublishLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition disabled:opacity-50 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                {isPublishLoading ? '发布中...' : '模拟发布'}
              </button>
              <div className="pt-2 border-t border-border/40">
                <button
                  onClick={() => handlePublish(false)}
                  disabled={isPreviewLoading || isPublishLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50 text-xs"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  真实发布（需配置 API 密钥）
                </button>
              </div>
            </div>
          </div>

          {/* 中间：平台选择 */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6 h-full">
              {platforms.length > 0 && <PlatformSelector platforms={platforms} />}
            </div>
          </div>

          {/* 右侧：预览 */}
          <div className="lg:col-span-4">
            <div className="glass-card p-6 h-full">
              <PreviewPanel previews={previews} isLoading={isPreviewLoading} />
            </div>
          </div>
        </div>

        {/* 架构说明 */}
        <div className="mt-10 glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            可扩展架构设计
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="p-4 rounded-xl bg-background/50 border border-border/40">
              <p className="font-medium text-foreground mb-1">工厂模式 PlatformFactory</p>
              <p>集中注册与管理所有平台适配器，新增平台只需注册即可自动识别</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/40">
              <p className="font-medium text-foreground mb-1">策略模式 BasePlatformAdapter</p>
              <p>每个平台独立实现 adaptContent / publish / getPreview，互不影响</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/40">
              <p className="font-medium text-foreground mb-1">内容转换 ContentTransformService</p>
              <p>统一处理 Markdown / HTML / 纯文本转换，适配器按平台格式调用</p>
            </div>
          </div>
        </div>
      </main>

      <PublishResults
        isOpen={publishResults !== null}
        onClose={() => setPublishResults(null)}
      />
      <PublishHistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
