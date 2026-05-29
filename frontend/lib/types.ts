export type PlatformType = 'wechat' | 'zhihu' | 'bilibili' | 'xiaohongshu' | 'weibo' | 'douyin';

export interface PlatformConfig {
  name: string;
  displayName: string;
  icon: string;
  maxTitleLength: number;
  maxContentLength: number;
  supportsImages: boolean;
  supportsVideo: boolean;
  supportsLink: boolean;
  contentFormat: 'markdown' | 'html' | 'plain';
  features: PlatformFeatures;
}

export interface PlatformFeatures {
  hashtags: boolean;
  mentions: boolean;
  emojis: boolean;
  richText: boolean;
  scheduling: boolean;
  analytics: boolean;
  comments: boolean;
}

export interface ContentInput {
  title: string;
  content: string;
  summary?: string;
  images?: string[];
  videoUrl?: string;
  tags?: string[];
  mentions?: string[];
  links?: Array<{ text: string; url: string }>;
  metadata?: Record<string, any>;
}

export interface AdaptedContent {
  platformType: PlatformType;
  title: string;
  content: string;
  images: string[];
  videoUrl?: string;
  metadata: Record<string, any>;
  warnings: string[];
}

export interface PublishResult {
  id: string;
  platformType: PlatformType;
  contentId?: string;
  status: 'success' | 'failed' | 'mock';
  message: string;
  timestamp: Date;
  previewUrl?: string;
  isSimulated: boolean;
}

export interface PublishHistory {
  id: string;
  originalContent: ContentInput;
  results: PublishResult[];
  createdAt: Date;
  updatedAt: Date;
  platforms: PlatformType[];
}

export interface PlatformAdapter {
  platformType: PlatformType;
  getConfig(): PlatformConfig;
  adaptContent(input: ContentInput): AdaptedContent;
  publish(content: AdaptedContent, options?: any): Promise<PublishResult>;
  getPreview(content: AdaptedContent): string;
}

export interface PublishOptions {
  isSimulated?: boolean;
  scheduleTime?: Date;
  draft?: boolean;
}

export interface ContentTransformer {
  transform(content: ContentInput, targetFormat: PlatformConfig['contentFormat']): string;
  sanitize(content: string): string;
  extractHashtags(content: string): string[];
  extractMentions(content: string): string[];
}
