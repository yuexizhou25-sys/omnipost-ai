import {
  PlatformConfig,
  PlatformAdapter,
  ContentInput,
  AdaptedContent,
  PublishResult,
  PublishOptions,
  PlatformType,
} from '@types/index';

/**
 * 平台适配器基类
 * 提供通用的适配逻辑框架
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
    return `[${this.getConfig().displayName}]\\n${title}\\n${text}`;
  }

  /**
   * 截断文本
   */
  protected truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * 清理内容中的格式
   */
  protected sanitizeContent(content: string): string {
    // 移除 HTML 标签
    return content
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  /**
   * 提取主题标签
   */
  protected extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\\w\u4e00-\u9fff]+/g;
    const matches = content.match(hashtagRegex);
    return matches || [];
  }

  /**
   * 提取 @ 提及
   */
  protected extractMentions(content: string): string[] {
    const mentionRegex = /@[\\w\u4e00-\u9fff]+/g;
    const matches = content.match(mentionRegex);
    return matches || [];
  }

  /**
   * 转换链接格式
   */
  protected formatLinks(content: string, linkFormat: 'markdown' | 'plain' | 'html'): string {
    let result = content;

    switch (linkFormat) {
      case 'markdown':
        result = result.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '[$1]($2)');
        break;
      case 'plain':
        result = result.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '$2');
        break;
      case 'html':
        result = result.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
        break;
    }

    return result;
  }
}
