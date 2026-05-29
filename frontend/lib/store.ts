import { create } from 'zustand';
import {
  ContentInput,
  PlatformType,
  AdaptedContent,
  PublishResult,
  PublishHistory,
} from '@/types';
import { PlatformInfo, PreviewItem } from '@/lib/api';

/**
 * 应用状态
 */
interface AppState {
  // 内容
  content: ContentInput;
  setContent: (content: Partial<ContentInput>) => void;
  resetContent: () => void;

  // 平台
  platforms: PlatformInfo[];
  setPlatforms: (platforms: PlatformInfo[]) => void;

  // 选中的平台
  selectedPlatforms: PlatformType[];
  togglePlatform: (platform: PlatformType) => void;
  setSelectedPlatforms: (platforms: PlatformType[]) => void;

  // 预览
  previews: PreviewItem[];
  setPreviews: (previews: PreviewItem[]) => void;

  // 发布结果
  publishResults: PublishResult[] | null;
  setPublishResults: (results: PublishResult[] | null) => void;

  // 发布历史
  publishHistory: PublishHistory[];
  setPublishHistory: (history: PublishHistory[]) => void;

  // UI 状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  showPreview: boolean;
  setShowPreview: (show: boolean) => void;

  showHistory: boolean;
  setShowHistory: (show: boolean) => void;

  // 消息
  message: { type: 'success' | 'error' | 'info'; text: string } | null;
  setMessage: (message: { type: 'success' | 'error' | 'info'; text: string } | null) => void;
}

const defaultContent: ContentInput = {
  title: '',
  content: '',
  summary: '',
  images: [],
  videoUrl: '',
  tags: [],
  mentions: [],
  links: [],
  metadata: {},
};

/**
 * Zustand 状态管理
 */
export const useAppStore = create<AppState>((set) => ({
  // 内容
  content: defaultContent,
  setContent: (newContent) =>
    set((state) => ({
      content: { ...state.content, ...newContent },
    })),
  resetContent: () => set({ content: defaultContent }),

  // 平台
  platforms: [],
  setPlatforms: (platforms) => set({ platforms }),

  // 选中的平台
  selectedPlatforms: [],
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),

  // 预览
  previews: [],
  setPreviews: (previews) => set({ previews }),

  // 发布结果
  publishResults: null,
  setPublishResults: (results) => set({ publishResults: results }),

  // 发布历史
  publishHistory: [],
  setPublishHistory: (history) => set({ publishHistory: history }),

  // UI 状态
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  showPreview: false,
  setShowPreview: (show) => set({ showPreview: show }),

  showHistory: false,
  setShowHistory: (show) => set({ showHistory: show }),

  // 消息
  message: null,
  setMessage: (message) => set({ message }),
}));
