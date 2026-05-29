import { PublishHistory, ContentInput, PublishResult, PlatformType } from '@types/index';
import { v4 as uuidv4 } from 'uuid';

/**
 * 发布历史管理服务
 * 实际应用中应使用数据库
 */
export class PublishHistoryService {
  private history: Map<string, PublishHistory> = new Map();

  /**
   * 创建发布记录
   */
  createHistory(content: ContentInput, platforms: PlatformType[]): PublishHistory {
    const id = uuidv4();
    const history: PublishHistory = {
      id,
      originalContent: content,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      platforms,
    };

    this.history.set(id, history);
    return history;
  }

  /**
   * 添加发布结果
   */
  addPublishResult(historyId: string, result: PublishResult): void {
    const history = this.history.get(historyId);
    if (!history) {
      throw new Error(`发布历史 ${historyId} 不存在`);
    }

    history.results.push(result);
    history.updatedAt = new Date();
  }

  /**
   * 获取发布记录
   */
  getHistory(id: string): PublishHistory | undefined {
    return this.history.get(id);
  }

  /**
   * 获取所有发布记录
   */
  getAllHistory(): PublishHistory[] {
    return Array.from(this.history.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * 删除发布记录
   */
  deleteHistory(id: string): boolean {
    return this.history.delete(id);
  }

  /**
   * 获取最近的发布记录
   */
  getRecentHistory(limit: number = 10): PublishHistory[] {
    return this.getAllHistory().slice(0, limit);
  }

  /**
   * 按平台获取发布记录
   */
  getHistoryByPlatform(platform: PlatformType): PublishHistory[] {
    return this.getAllHistory().filter(h => h.platforms.includes(platform));
  }
}

/**
 * 单例实例
 */
export const publishHistoryService = new PublishHistoryService();
