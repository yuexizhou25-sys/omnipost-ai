import {
  PlatformConfig,
  PlatformAdapter,
  ContentInput,
  AdaptedContent,
  PublishResult,
  PublishOptions,
  PlatformType,
} from '@types/index';
import { contentTransformService } from '@services/ContentTransformService';

/**
 * 平台适配器基类
 * 提供通用的适配逻辑框架，子类只需实现平台特有的适配策略
 */
export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract platformType: PlatformType;

  abstract getConfig(): PlatformConfig;

  abstract adaptContent(input: ContentInput): AdaptedContent;

  abstract publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult>;

  /**
   * 生成平台预览
   */
  getPreview(content: AdaptedContent): string {
    const { title, content: text } = content;
    const header = this.getConfig().displayName;
    return title ? `【${header}】\n${title}\n${'─'.repeat(30)}\n${text}` : `【${header}】\n${text}`;
  }

  /**
   * 按平台目标格式转换内容
   */
  protected transformContent(input: ContentInput): string {
    const format = this.getConfig().contentFormat;
    return contentTransformService.transform(input, format);
  }

  /**
   * 截断文本
   */
  protected truncateText(text: string, maxLength: number): string {
    if (!maxLength || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * 清理内容中的格式
   */
  protected sanitizeContent(content: string): string {
    return contentTransformService.sanitize(content);
  }

  /**
   * 提取主题标签
   */
  protected extractHashtags(content: string): string[] {
    return contentTransformService.extractHashtags(content);
  }

  /**
   * 提取 @ 提及
   */
  protected extractMentions(content: string): string[] {
    return contentTransformService.extractMentions(content);
  }

  /**
   * 合并用户标签与内容中的标签
   */
  protected mergeTags(content: string, customTags?: string[], max = 5): string[] {
    const fromContent = this.extractHashtags(content);
    const fromInput = customTags ? customTags.map((t) => (t.startsWith('#') ? t : `#${t}`)) : [];
    return [...new Set([...fromContent, ...fromInput])].slice(0, max);
  }

  /**
   * 转换链接格式
   */
  protected formatLinks(content: string, linkFormat: 'markdown' | 'plain' | 'html'): string {
    let result = content;

    switch (linkFormat) {
      case 'markdown':
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1]($2)');
        break;
      case 'plain':
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
        break;
      case 'html':
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        break;
    }

    return result;
  }
}
