import axios, { AxiosInstance } from 'axios';
import {
  ContentInput,
  PlatformType,
  AdaptedContent,
  PublishResult,
  PublishHistory,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface PlatformInfo {
  name: string;
  displayName: string;
  icon: string;
  maxTitleLength: number;
  maxContentLength: number;
  supportsImages: boolean;
  supportsVideo: boolean;
  supportsLink: boolean;
  contentFormat: 'markdown' | 'html' | 'plain';
  features: any;
}

interface PreviewItem {
  platform: PlatformType;
  preview: string;
  warnings: string[];
}

/**
 * API 客户端
 */
class OmniPostClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 获取所有支持的平台
   */
  async getPlatforms(): Promise<PlatformInfo[]> {
    const response = await this.client.get('/platforms');
    return response.data.data;
  }

  /**
   * 适配内容到指定平台
   */
  async adaptContent(
    content: ContentInput,
    platforms: PlatformType[]
  ): Promise<AdaptedContent[]> {
    const response = await this.client.post('/adapt', { content, platforms });
    return response.data.data;
  }

  /**
   * 获取平台预览
   */
  async getPreview(
    content: ContentInput,
    platforms: PlatformType[]
  ): Promise<PreviewItem[]> {
    const response = await this.client.post('/preview', { content, platforms });
    return response.data.data;
  }

  /**
   * 发布内容
   */
  async publish(
    content: ContentInput,
    platforms: PlatformType[],
    isSimulated: boolean = true
  ): Promise<{
    historyId: string;
    results: PublishResult[];
    isSimulated: boolean;
  }> {
    const response = await this.client.post('/publish', {
      content,
      platforms,
      isSimulated,
    });
    return response.data.data;
  }

  /**
   * 获取发布历史
   */
  async getHistory(limit: number = 10): Promise<PublishHistory[]> {
    const response = await this.client.get('/history', { params: { limit } });
    return response.data.data;
  }

  /**
   * 获取单条发布历史
   */
  async getHistoryItem(id: string): Promise<PublishHistory> {
    const response = await this.client.get(`/history/${id}`);
    return response.data.data;
  }

  /**
   * 删除发布历史
   */
  async deleteHistory(id: string): Promise<void> {
    await this.client.delete(`/history/${id}`);
  }
}

// 导出单例
export const apiClient = new OmniPostClient();
export type { PlatformInfo, PreviewItem };
