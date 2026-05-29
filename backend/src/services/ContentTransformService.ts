import { ContentInput, ContentTransformer } from '@types/index';

/**
 * 内容转换引擎
 * 负责将原始内容转换为不同格式（Markdown / HTML / 纯文本）
 */
export class ContentTransformService implements ContentTransformer {
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

  sanitize(content: string): string {
    return content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*['"][^'"]*['"]/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w\u4e00-\u9fff]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  extractMentions(content: string): string[] {
    const mentionRegex = /@[\w\u4e00-\u9fff]+/g;
    const matches = content.match(mentionRegex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  private toMarkdown(content: string): string {
    return content
      .replace(/<h1[^>]*>([^<]*)<\/h1>/gi, '# $1')
      .replace(/<h2[^>]*>([^<]*)<\/h2>/gi, '## $1')
      .replace(/<h3[^>]*>([^<]*)<\/h3>/gi, '### $1')
      .replace(/<strong[^>]*>([^<]*)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>([^<]*)<\/em>/gi, '*$1*')
      .replace(/<b[^>]*>([^<]*)<\/b>/gi, '**$1**')
      .replace(/<i[^>]*>([^<]*)<\/i>/gi, '*$1*')
      .replace(/<a[^>]*href=['"]([^'"]*)['"][^>]*>([^<]*)<\/a>/gi, '[$2]($1)')
      .replace(/<p[^>]*>([^<]*)<\/p>/gi, '$1\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<\/?(ul|ol|li|blockquote)[^>]*>/gi, '')
      .trim();
  }

  private toHtml(content: string): string {
    const result = content
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n/g, '<br>');

    return `<p>${result}</p>`;
  }

  private toPlain(content: string): string {
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/^#+\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
      .replace(/_{3,}/g, '')
      .replace(/\n\n+/g, '\n')
      .trim();
  }
}

export const contentTransformService = new ContentTransformService();
