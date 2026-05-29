import { ContentInput, ContentTransformer } from '@types/index';

/**
 * 内容转换引擎
 * 负责将原始内容转换为不同格式
 */
export class ContentTransformService implements ContentTransformer {
  /**
   * 转换内容格式
   */
  transform(
    content: ContentInput,
    targetFormat: 'markdown' | 'html' | 'plain'
  ): string {
    let result = content.content;

    switch (targetFormat) {
      case 'markdown':
        result = this.toMarkdown(result);
        break;
      case 'html':
        result = this.toHtml(result);
        break;
      case 'plain':
        result = this.toPlain(result);
        break;
    }

    return result;
  }

  /**
   * 清理内容
   */
  sanitize(content: string): string {
    return content
      .replace(/<script[^>]*>.*?<\\/script>/gi, '') // 移除 script
      .replace(/<iframe[^>]*>.*?<\\/iframe>/gi, '') // 移除 iframe
      .replace(/on\\w+\\s*=\\s*['\"][^'\"]*['\"]/gi, '') // 移除事件监听器
      .trim();
  }

  /**
   * 提取标签
   */
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\\w\u4e00-\u9fff]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  /**
   * 提取提及
   */
  extractMentions(content: string): string[] {
    const mentionRegex = /@[\\w\u4e00-\u9fff]+/g;
    const matches = content.match(mentionRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  /**
   * 转为 Markdown 格式
   */
  private toMarkdown(content: string): string {
    let result = content;

    // 转换 HTML 标签为 Markdown
    result = result
      .replace(/<h1[^>]*>([^<]*)<\\/h1>/gi, '# $1')
      .replace(/<h2[^>]*>([^<]*)<\\/h2>/gi, '## $1')
      .replace(/<h3[^>]*>([^<]*)<\\/h3>/gi, '### $1')
      .replace(/<strong[^>]*>([^<]*)<\\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>([^<]*)<\\/em>/gi, '*$1*')
      .replace(/<b[^>]*>([^<]*)<\\/b>/gi, '**$1**')
      .replace(/<i[^>]*>([^<]*)<\\/i>/gi, '*$1*')
      .replace(/<a[^>]*href=['\"]([^'\"]*)['\"][^>]*>([^<]*)<\\/a>/gi, '[$2]($1)')
      .replace(/<p[^>]*>([^<]*)<\\/p>/gi, '$1\\n')
      .replace(/<br[^>]*>/gi, '\\n')
      .replace(/<\\/?(ul|ol|li|blockquote)[^>]*>/gi, '');

    return result.trim();
  }

  /**
   * 转为 HTML 格式
   */
  private toHtml(content: string): string {
    let result = content;

    // 转换 Markdown 为 HTML
    result = result
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\\n/g, '<br>');

    return `<p>${result}</p>`;
  }

  /**
   * 转为纯文本格式
   */
  private toPlain(content: string): string {
    let result = content;

    // 移除所有 HTML 标签
    result = result.replace(/<[^>]*>/g, '');

    // 移除 Markdown 格式
    result = result
      .replace(/^#+\\s+/gm, '')
      .replace(/\\*\\*([^*]+)\\*\\*/g, '$1')
      .replace(/\\*([^*]+)\\*/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
      .replace(/_{3,}/g, '');

    // 移除多余空格
    result = result
      .replace(/\\n\\n+/g, '\\n')
      .trim();

    return result;
  }
}

/**
 * 单例实例
 */
export const contentTransformService = new ContentTransformService();
