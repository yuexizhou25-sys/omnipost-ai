import { PlatformAdapter, PlatformType } from '@types/index';
import {
  WeChatAdapter,
  ZhihuAdapter,
  BilibiliAdapter,
  XiaoHongShuAdapter,
  WeiboAdapter,
  DouyinAdapter,
} from './index';

/**
 * 平台工厂
 * 负责创建和管理平台适配器
 * 可扩展架构：新增平台只需注册到 adapters map
 */
export class PlatformFactory {
  private static adapters: Map<PlatformType, PlatformAdapter> = new Map();

  static {
    // 注册所有平台适配器
    this.register('wechat', new WeChatAdapter());
    this.register('zhihu', new ZhihuAdapter());
    this.register('bilibili', new BilibiliAdapter());
    this.register('xiaohongshu', new XiaoHongShuAdapter());
    this.register('weibo', new WeiboAdapter());
    this.register('douyin', new DouyinAdapter());
  }

  /**
   * 注册新平台适配器
   * @param platformType 平台类型
   * @param adapter 适配器实例
   */
  static register(platformType: PlatformType, adapter: PlatformAdapter): void {
    this.adapters.set(platformType, adapter);
  }

  /**
   * 获取平台适配器
   */
  static getAdapter(platformType: PlatformType): PlatformAdapter {
    const adapter = this.adapters.get(platformType);
    if (!adapter) {
      throw new Error(`平台 ${platformType} 暂不支持`);
    }
    return adapter;
  }

  /**
   * 获取所有支持的平台
   */
  static getAllPlatforms() {
    return Array.from(this.adapters.values()).map(adapter => ({
      type: adapter.platformType,
      ...adapter.getConfig(),
    }));
  }

  /**
   * 检查平台是否支持
   */
  static isSupported(platformType: PlatformType): boolean {
    return this.adapters.has(platformType);
  }

  /**
   * 获取平台数量
   */
  static getPlatformCount(): number {
    return this.adapters.size;
  }
}

export default PlatformFactory;
