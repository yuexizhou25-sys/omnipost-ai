import { create } from 'zustand';
import {
  ContentInput,
  PlatformType,
  PublishResult,
  PublishHistory,
} from '@/lib/types';
import { PlatformInfo, PreviewItem } from '@/lib/api';

interface AppState {
  content: ContentInput;
  setContent: (content: Partial<ContentInput>) => void;
  resetContent: () => void;

  platforms: PlatformInfo[];
  setPlatforms: (platforms: PlatformInfo[]) => void;

  selectedPlatforms: PlatformType[];
  togglePlatform: (platform: PlatformType) => void;
  setSelectedPlatforms: (platforms: PlatformType[]) => void;
  selectAllPlatforms: () => void;
  clearPlatforms: () => void;

  previews: PreviewItem[];
  setPreviews: (previews: PreviewItem[]) => void;

  publishResults: PublishResult[] | null;
  setPublishResults: (results: PublishResult[] | null) => void;

  publishHistory: PublishHistory[];
  setPublishHistory: (history: PublishHistory[]) => void;

  isPreviewLoading: boolean;
  setIsPreviewLoading: (loading: boolean) => void;
  isPublishLoading: boolean;
  setIsPublishLoading: (loading: boolean) => void;

  showHistory: boolean;
  setShowHistory: (show: boolean) => void;

  previewTab: PlatformType;
  setPreviewTab: (tab: PlatformType) => void;

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

export const useAppStore = create<AppState>((set, get) => ({
  content: defaultContent,
  setContent: (newContent) =>
    set((state) => ({
      content: { ...state.content, ...newContent },
    })),
  resetContent: () => set({ content: defaultContent, previews: [] }),

  platforms: [],
  setPlatforms: (platforms) => set({ platforms }),

  selectedPlatforms: [],
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  selectAllPlatforms: () =>
    set((state) => ({
      selectedPlatforms: state.platforms.map((p) => p.name as PlatformType),
    })),
  clearPlatforms: () => set({ selectedPlatforms: [] }),

  previews: [],
  setPreviews: (previews) => set({ previews }),

  publishResults: null,
  setPublishResults: (results) => set({ publishResults: results }),

  publishHistory: [],
  setPublishHistory: (history) => set({ publishHistory: history }),

  isPreviewLoading: false,
  setIsPreviewLoading: (loading) => set({ isPreviewLoading: loading }),
  isPublishLoading: false,
  setIsPublishLoading: (loading) => set({ isPublishLoading: loading }),

  showHistory: false,
  setShowHistory: (show) => set({ showHistory: show }),

  previewTab: 'wechat',
  setPreviewTab: (tab) => set({ previewTab: tab }),

  message: null,
  setMessage: (message) => {
    set({ message });
    if (message) {
      setTimeout(() => {
        if (get().message === message) {
          set({ message: null });
        }
      }, 4000);
    }
  },
}));
