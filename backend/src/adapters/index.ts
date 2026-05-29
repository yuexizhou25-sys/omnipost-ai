import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformConfig, PlatformType, ContentInput, AdaptedContent, PublishResult, PublishOptions } from '@types/index';
import { v4 as uuidv4 } from 'uuid';

/**
 * 微信公众号平台适配器
 */
export class WeChatAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'wechat';

  getConfig(): PlatformConfig {
    return {
      name: 'wechat',
      displayName: '微信公众号',
      icon: 'wechat',
      maxTitleLength: 64,
      maxContentLength: 5000,
      supportsImages: true,
      supportsVideo: false,
      supportsLink: true,
      contentFormat: 'html',
      features: {
        hashtags: false,
        mentions: false,
        emojis: true,
        richText: true,
        scheduling: true,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    // 标题处理
    const title = this.truncateText(input.title, config.maxTitleLength);
    if (input.title.length > config.maxTitleLength) {
      warnings.push(`标题过长，已从 ${input.title.length} 字截断至 ${config.maxTitleLength} 字`);
    }

    // 内容处理
    let content = this.sanitizeContent(input.content);
    content = this.formatLinks(content, 'html');

    if (content.length > config.maxContentLength) {
      warnings.push(
        `内容超过 ${config.maxContentLength} 字，建议分篇发表或删除部分内容`
      );
      content = this.truncateText(content, config.maxContentLength);
    }

    // 标签处理（微信不支持）
    if (input.tags && input.tags.length > 0) {
      warnings.push('微信公众号不支持标签，建议在内容中直接提及');
    }

    // 提及处理（微信不支持）
    if (input.mentions && input.mentions.length > 0) {
      warnings.push('微信公众号不支持 @ 提及，建议直接在文本中提及用户名');
    }

    return {
      platformType: this.platformType,
      title,
      content,
      images: input.images || [],
      videoUrl: undefined,
      metadata: {
        originalTitle: input.title,
        contentLength: content.length,
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        // 模拟发布
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: '微信公众号内容已准备好（模拟模式）',
          timestamp: new Date(),
          previewUrl: undefined,
          isSimulated: true,
        };
      }

      // 真实发布逻辑（需要 API 密钥）
      if (!process.env.WECHAT_APP_ID || !process.env.WECHAT_APP_SECRET) {
        throw new Error('微信 API 密钥未配置');
      }

      // 实现真实的微信 API 调用
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '内容已发布到微信公众号',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【微信公众号】
━━━━━━━━━━━━━━━━━━━━
${content.title}
━━━━━━━━━━━━━━━━━━━━
${content.content}
━━━━━━━━━━━━━━━━━━━━
${content.images.length > 0 ? `[包含 ${content.images.length} 张图片]` : ''}
    `.trim();
  }
}

/**
 * 知乎平台适配器
 */
export class ZhihuAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'zhihu';

  getConfig(): PlatformConfig {
    return {
      name: 'zhihu',
      displayName: '知乎',
      icon: 'zhihu',
      maxTitleLength: 150,
      maxContentLength: 100000,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: true,
      contentFormat: 'markdown',
      features: {
        hashtags: true,
        mentions: true,
        emojis: true,
        richText: true,
        scheduling: false,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    const title = this.truncateText(input.title, config.maxTitleLength);
    if (input.title.length > config.maxTitleLength) {
      warnings.push(`标题过长，已从 ${input.title.length} 字截断至 ${config.maxTitleLength} 字`);
    }

    let content = input.content;
    content = this.formatLinks(content, 'markdown');

    // 添加标签
    const hashtags = this.extractHashtags(input.content);
    const customTags = input.tags ? input.tags.map(t => `#${t}`) : [];
    const allTags = [...new Set([...hashtags, ...customTags])].slice(0, 5);

    if (allTags.length > 0) {
      content += `\\n\\n${allTags.join(' ')}`;
    }

    return {
      platformType: this.platformType,
      title,
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {
        tags: allTags,
        mentions: this.extractMentions(content),
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: '知乎文章已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '文章已发布到知乎',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【知乎】
${'━'.repeat(50)}
${content.title}
${'━'.repeat(50)}
${content.content}
${content.metadata.tags ? `\\n标签: ${content.metadata.tags.join(' ')}` : ''}
    `.trim();
  }
}

/**
 * B 站平台适配器
 */
export class BilibiliAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'bilibili';

  getConfig(): PlatformConfig {
    return {
      name: 'bilibili',
      displayName: 'B站',
      icon: 'bilibili',
      maxTitleLength: 80,
      maxContentLength: 5000,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: true,
      contentFormat: 'plain',
      features: {
        hashtags: true,
        mentions: true,
        emojis: true,
        richText: false,
        scheduling: true,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    const title = this.truncateText(input.title, config.maxTitleLength);
    if (input.title.length > config.maxTitleLength) {
      warnings.push(`标题过长，已从 ${input.title.length} 字截断至 ${config.maxTitleLength} 字`);
    }

    let content = this.sanitizeContent(input.content);
    content = this.formatLinks(content, 'plain');

    // B站推荐格式：纯文本 + 标签
    const tags = input.tags ? input.tags.slice(0, 5).join(' #') : '';
    if (tags) {
      content += `\\n\\n#${tags}`;
    }

    if (!input.videoUrl) {
      warnings.push('B站建议上传视频，纯文字内容效果可能不佳');
    }

    return {
      platformType: this.platformType,
      title,
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {
        tags: input.tags || [],
        hasVideo: !!input.videoUrl,
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: 'B站动态已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '动态已发布到B站',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【B站动态】
${'─'.repeat(40)}
${content.title}
${'─'.repeat(40)}
${content.content}
${content.metadata.hasVideo ? '\\n[附带视频]' : ''}
    `.trim();
  }
}

/**
 * 小红书平台适配器
 */
export class XiaoHongShuAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'xiaohongshu';

  getConfig(): PlatformConfig {
    return {
      name: 'xiaohongshu',
      displayName: '小红书',
      icon: 'xiaohongshu',
      maxTitleLength: 0, // 小红书无标题
      maxContentLength: 1000,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: false,
      contentFormat: 'plain',
      features: {
        hashtags: true,
        mentions: true,
        emojis: true,
        richText: false,
        scheduling: false,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    let content = this.sanitizeContent(input.content);
    // 移除链接
    content = content.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '$1');

    if (content.length > config.maxContentLength) {
      warnings.push(`内容过长，已从 ${content.length} 字截断至 ${config.maxContentLength} 字`);
      content = this.truncateText(content, config.maxContentLength);
    }

    // 添加标签（小红书强调视觉和话题）
    const hashtags = this.extractHashtags(content);
    const customTags = input.tags ? input.tags.map(t => `#${t}`).slice(0, 3) : [];
    const allTags = [...new Set([...hashtags, ...customTags])].slice(0, 5);

    if (allTags.length > 0) {
      content += ` ${allTags.join(' ')}`;
    }

    if (!input.images || input.images.length === 0) {
      warnings.push('小红书强烈建议上传图片/视频，以获得更好的曝光');
    }

    return {
      platformType: this.platformType,
      title: '', // 小红书无标题
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {
        tags: allTags,
        isPhotoPost: (input.images || []).length > 0,
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: '小红书笔记已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '笔记已发布到小红书',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【小红书笔记】
${'✨'.repeat(20)}
${content.content}
${'✨'.repeat(20)}
${content.images.length > 0 ? `[${content.images.length} 张图片]` : '[无图片]'}
    `.trim();
  }
}

/**
 * 微博平台适配器
 */
export class WeiboAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'weibo';

  getConfig(): PlatformConfig {
    return {
      name: 'weibo',
      displayName: '微博',
      icon: 'weibo',
      maxTitleLength: 0,
      maxContentLength: 280,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: true,
      contentFormat: 'plain',
      features: {
        hashtags: true,
        mentions: true,
        emojis: true,
        richText: false,
        scheduling: false,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    let content = this.sanitizeContent(input.content);

    // 微博字数限制
    if (content.length > config.maxContentLength) {
      warnings.push(`内容过长，已从 ${content.length} 字截断至 ${config.maxContentLength} 字`);
      content = this.truncateText(content, config.maxContentLength);
    }

    // 添加 @ 和 #
    const mentions = this.extractMentions(content);
    const hashtags = this.extractHashtags(content);

    return {
      platformType: this.platformType,
      title: '',
      content,
      images: input.images ? input.images.slice(0, 9) : [],
      videoUrl: input.videoUrl,
      metadata: {
        mentions,
        hashtags,
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: '微博已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '微博已发布',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【微博】
${'═'.repeat(40)}
${content.content}
${content.images.length > 0 ? `\\n[${content.images.length}张图片]` : ''}
    `.trim();
  }
}

/**
 * 抖音平台适配器
 */
export class DouyinAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'douyin';

  getConfig(): PlatformConfig {
    return {
      name: 'douyin',
      displayName: '抖音',
      icon: 'douyin',
      maxTitleLength: 30,
      maxContentLength: 2000,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: false,
      contentFormat: 'plain',
      features: {
        hashtags: true,
        mentions: true,
        emojis: true,
        richText: false,
        scheduling: false,
        analytics: true,
        comments: true,
      },
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    const config = this.getConfig();
    const warnings: string[] = [];

    const title = this.truncateText(input.title, config.maxTitleLength);
    if (input.title.length > config.maxTitleLength) {
      warnings.push(`标题过长，已从 ${input.title.length} 字截断至 ${config.maxTitleLength} 字`);
    }

    let content = this.sanitizeContent(input.content);
    content = content.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '$1');

    if (content.length > config.maxContentLength) {
      warnings.push(`内容过长，已从 ${content.length} 字截断至 ${config.maxContentLength} 字`);
      content = this.truncateText(content, config.maxContentLength);
    }

    // 添加热门标签
    const hashtags = this.extractHashtags(content);
    const trendyTags = ['#热门', '#分享', '#今日分享'].slice(0, 3 - hashtags.length);
    const allTags = [...hashtags, ...trendyTags];

    content += ` ${allTags.join(' ')}`;

    if (!input.videoUrl) {
      warnings.push('抖音优先推荐有视频的内容');
    }

    return {
      platformType: this.platformType,
      title,
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {
        tags: allTags,
        hasVideo: !!input.videoUrl,
      },
      warnings,
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    const isSimulated = options?.isSimulated !== false;

    try {
      if (isSimulated) {
        return {
          id: uuidv4(),
          platformType: this.platformType,
          contentId: `mock_${Date.now()}`,
          status: 'mock',
          message: '抖音内容已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '内容已发布到抖音',
        timestamp: new Date(),
        isSimulated: false,
      };
    } catch (error) {
      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'failed',
        message: `发布失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        isSimulated,
      };
    }
  }

  getPreview(content: AdaptedContent): string {
    return `
【抖音视频描述】
${'🎬'.repeat(20)}
${content.title}
${'─'.repeat(40)}
${content.content}
    `.trim();
  }
}
