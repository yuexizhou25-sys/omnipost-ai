# OmniPost 系统架构设计文档

## 概述

OmniPost 采用分层架构设计，将系统分为前端、后端和适配层三部分，采用工厂模式和策略模式实现高度可扩展的平台支持系统。

## 架构层级

### 1. 表现层 (Frontend Layer)

**技术栈**：Next.js 16 + React 19 + TypeScript + Tailwind CSS

**职责**：
- 用户界面设计与交互
- 状态管理
- API 调用和数据处理

**主要组件**：

```
┌─────────────────────────────────────────┐
│          页面 (page.tsx)                │
│  ┌─────────────────────────────────────┐│
│  │ ContentEditor (内容编辑)            ││
│  │ PlatformSelector (平台选择)         ││
│  │ PreviewPanel (预览面板)             ││
│  │ PublishResults (发布结果)           ││
│  │ PublishHistoryPanel (历史记录)      ││
│  └─────────────────────────────────────┘│
│         ↓ Zustand 状态管理 ↓            │
│  ┌─────────────────────────────────────┐│
│  │        useAppStore (全局状态)        ││
│  │  - content                           ││
│  │  - selectedPlatforms                 ││
│  │  - publishResults                    ││
│  │  - isLoading                         ││
│  └─────────────────────────────────────┘│
│         ↓ Axios API 客户端 ↓            │
│  ┌─────────────────────────────────────┐│
│  │      apiClient (API 通信)            ││
│  │  - getPlatforms()                    ││
│  │  - adaptContent()                    ││
│  │  - getPreview()                      ││
│  │  - publish()                         ││
│  │  - getHistory()                      ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
        ↓ HTTP REST API ↓
```

### 2. 业务逻辑层 (Business Logic Layer)

**技术栈**：Express.js + TypeScript + Node.js

**职责**：
- 内容适配和转换
- 平台管理和调度
- 发布历史管理

**核心模块**：

#### A. 平台工厂 (PlatformFactory)

```typescript
class PlatformFactory {
  // 所有已注册的平台适配器
  private static adapters: Map<PlatformType, PlatformAdapter>;

  // 注册新平台
  static register(type: PlatformType, adapter: PlatformAdapter);

  // 获取平台适配器
  static getAdapter(type: PlatformType): PlatformAdapter;

  // 获取所有平台
  static getAllPlatforms(): PlatformConfig[];
}
```

**设计模式**：工厂模式
- **优势**：集中管理平台创建和配置
- **可扩展性**：新平台只需注册，无需修改其他代码

#### B. 平台适配器 (Platform Adapters)

```typescript
abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract platformType: PlatformType;

  // 获取平台配置
  abstract getConfig(): PlatformConfig;

  // 适配内容到该平台
  abstract adaptContent(input: ContentInput): AdaptedContent;

  // 发布内容
  abstract publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult>;

  // 生成预览
  abstract getPreview(content: AdaptedContent): string;

  // 通用工具方法
  protected truncateText(text: string, maxLength: number): string;
  protected sanitizeContent(content: string): string;
  protected extractHashtags(content: string): string[];
  protected extractMentions(content: string): string[];
  protected formatLinks(content: string, linkFormat: string): string;
}
```

**设计模式**：策略模式 + 模板方法模式
- **策略模式**：每个平台实现自己的适配策略
- **模板方法**：基类提供通用方法，子类实现具体逻辑

**每个平台的特性**：

| 平台 | 标题长度 | 内容长度 | 图片 | 视频 | 链接 | 标签 | 提及 | 排程 |
|------|---------|---------|------|------|------|------|------|------|
| 微信 | 64 | 5000 | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| 知乎 | 150 | 100000 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| B站 | 80 | 5000 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 小红书 | 0 | 1000 | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| 微博 | 0 | 280 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 抖音 | 30 | 2000 | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

#### C. 内容转换服务 (ContentTransformService)

```typescript
class ContentTransformService implements ContentTransformer {
  // 格式转换：Markdown ↔ HTML ↔ 纯文本
  transform(
    content: ContentInput,
    targetFormat: 'markdown' | 'html' | 'plain'
  ): string;

  // 内容清理
  sanitize(content: string): string;

  // 提取标签
  extractHashtags(content: string): string[];

  // 提取提及
  extractMentions(content: string): string[];

  // 私有方法
  private toMarkdown(content: string): string;
  private toHtml(content: string): string;
  private toPlain(content: string): string;
}
```

**功能**：
- Markdown → HTML（支持链接、加粗、斜体等）
- HTML → 纯文本（移除所有标签）
- 提取和规范化标签和提及

#### D. 发布历史服务 (PublishHistoryService)

```typescript
class PublishHistoryService {
  // 内存存储（可扩展为数据库）
  private history: Map<string, PublishHistory>;

  // CRUD 操作
  createHistory(content: ContentInput, platforms: PlatformType[]): PublishHistory;
  addPublishResult(historyId: string, result: PublishResult): void;
  getHistory(id: string): PublishHistory | undefined;
  getAllHistory(): PublishHistory[];
  deleteHistory(id: string): boolean;
  getRecentHistory(limit: number): PublishHistory[];
  getHistoryByPlatform(platform: PlatformType): PublishHistory[];
}
```

**设计**：
- 使用 Map 存储（易于迁移到数据库）
- 支持完整的 CRUD 操作
- 支持复杂查询

### 3. API 层 (API Layer)

**技术栈**：Express.js Router

**端点设计**：

```
GET  /api/platforms               获取所有支持的平台
POST /api/adapt                   适配内容到指定平台
POST /api/preview                 生成平台预览
POST /api/publish                 发布内容到平台
GET  /api/history                 获取发布历史
GET  /api/history/:id             获取单条历史
DELETE /api/history/:id           删除历史记录
```

**请求/响应格式**：

```typescript
// 通用成功响应
{
  success: true,
  data: any,
  count?: number
}

// 通用错误响应
{
  success: false,
  error: string
}
```

## 数据流

### 内容发布流程

```
1. 用户输入
   ↓
2. 状态管理 (Zustand)
   ↓
3. API 调用 (axios)
   POST /api/preview
   ↓
4. 后端处理
   ├─ PlatformFactory.getAdapter()
   ├─ adapter.adaptContent()
   ├─ adapter.getPreview()
   └─ ContentTransformService 辅助
   ↓
5. 返回预览
   ↓
6. 用户确认
   ↓
7. API 调用
   POST /api/publish
   ↓
8. 后端处理
   ├─ PlatformFactory.getAdapter()
   ├─ adapter.adaptContent()
   ├─ adapter.publish() (模拟或真实)
   ├─ PublishHistoryService.addPublishResult()
   └─ 返回结果
   ↓
9. UI 更新
   ├─ 显示发布结果
   ├─ 更新发布历史
   └─ 用户反馈
```

### 类型系统

```typescript
// 核心数据类型
ContentInput {
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

AdaptedContent {
  platformType: PlatformType;
  title: string;
  content: string;
  images: string[];
  videoUrl?: string;
  metadata: Record<string, any>;
  warnings: string[];
}

PublishResult {
  id: string;
  platformType: PlatformType;
  contentId?: string;
  status: 'success' | 'failed' | 'mock';
  message: string;
  timestamp: Date;
  previewUrl?: string;
  isSimulated: boolean;
}

PublishHistory {
  id: string;
  originalContent: ContentInput;
  results: PublishResult[];
  createdAt: Date;
  updatedAt: Date;
  platforms: PlatformType[];
}
```

## 扩展机制

### 添加新平台的完整流程

#### 步骤 1：创建适配器类

```typescript
// backend/src/adapters/index.ts 添加

export class InstagramAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'instagram';

  getConfig(): PlatformConfig {
    return {
      name: 'instagram',
      displayName: 'Instagram',
      icon: 'instagram',
      maxTitleLength: 0,
      maxContentLength: 2200,
      supportsImages: true,
      supportsVideo: true,
      supportsLink: false,
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

    // Instagram 特定的适配逻辑
    let content = this.sanitizeContent(input.content);
    
    // 移除链接
    content = content.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '$1');

    // 字数检查
    if (content.length > config.maxContentLength) {
      warnings.push(`内容过长，已截断至 ${config.maxContentLength} 字`);
      content = this.truncateText(content, config.maxContentLength);
    }

    // 添加话题标签
    const hashtags = this.extractHashtags(content);
    const customTags = input.tags 
      ? input.tags.map(t => `#${t}`).slice(0, 5) 
      : [];
    const allTags = [...new Set([...hashtags, ...customTags])];

    if (allTags.length > 0) {
      content += ` ${allTags.join(' ')}`;
    }

    // 图片检查
    if (!input.images || input.images.length === 0) {
      warnings.push('Instagram 强烈建议上传图片/视频');
    }

    return {
      platformType: this.platformType,
      title: '',
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {
        tags: allTags,
        imageCount: (input.images || []).length,
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
          message: 'Instagram 内容已准备好（模拟模式）',
          timestamp: new Date(),
          isSimulated: true,
        };
      }

      // 真实 API 调用
      if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
        throw new Error('Instagram 访问令牌未配置');
      }

      // 实现实际的 API 调用...

      return {
        id: uuidv4(),
        platformType: this.platformType,
        status: 'success',
        message: '内容已发布到 Instagram',
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
【Instagram 帖子】
${'═'.repeat(40)}
${content.content}
${content.images.length > 0 ? `[${content.images.length} 张图片]` : ''}
    `.trim();
  }
}
```

#### 步骤 2：更新类型定义

```typescript
// backend/src/types/index.ts

export type PlatformType = 
  | 'wechat' 
  | 'zhihu' 
  | 'bilibili' 
  | 'xiaohongshu' 
  | 'weibo' 
  | 'douyin'
  | 'instagram';  // 添加新平台
```

#### 步骤 3：注册适配器

```typescript
// backend/src/adapters/PlatformFactory.ts

static {
  this.register('wechat', new WeChatAdapter());
  this.register('zhihu', new ZhihuAdapter());
  this.register('bilibili', new BilibiliAdapter());
  this.register('xiaohongshu', new XiaoHongShuAdapter());
  this.register('weibo', new WeiboAdapter());
  this.register('douyin', new DouyinAdapter());
  this.register('instagram', new InstagramAdapter());  // 添加新平台
}
```

#### 步骤 4：完成！

系统会自动识别新平台，无需修改任何其他代码。

### 扩展到数据库

#### 修改发布历史服务

```typescript
// backend/src/services/PublishHistoryService.ts

// 从内存存储改为数据库
import { Database } from 'sqlite3';

export class PublishHistoryService {
  private db: Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS publish_history (
        id TEXT PRIMARY KEY,
        original_content TEXT NOT NULL,
        platforms TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS publish_results (
        id TEXT PRIMARY KEY,
        history_id TEXT NOT NULL,
        platform_type TEXT NOT NULL,
        status TEXT NOT NULL,
        message TEXT,
        is_simulated BOOLEAN,
        timestamp DATETIME,
        FOREIGN KEY(history_id) REFERENCES publish_history(id)
      );
    `);
  }

  // 实现 CRUD 操作...
}
```

## 性能优化

### 1. 前端优化

- **代码分割**：使用动态导入加载组件
- **图片优化**：使用 Next.js Image 组件
- **状态管理**：Zustand 支持选择器优化重渲染
- **缓存策略**：浏览器缓存 API 响应

### 2. 后端优化

- **连接池**：数据库连接复用
- **缓存层**：Redis 缓存平台配置
- **异步处理**：使用 Promise.all 并行发布
- **日志级别**：生产环境只记录错误

### 3. 网络优化

- **请求压缩**：启用 gzip 压缩
- **CDN**：静态资源 CDN 分发
- **WebSocket**：实时推送发布进度

## 安全性考虑

### 1. 输入验证

```typescript
// 所有输入都需要验证
function validateContentInput(input: ContentInput): string[] {
  const errors = [];

  if (!input.title && !input.content) {
    errors.push('标题或内容不能为空');
  }

  if (input.content.length > 100000) {
    errors.push('内容过长');
  }

  // 检查恶意标签
  if (containsMaliciousScript(input.content)) {
    errors.push('检测到恶意脚本');
  }

  return errors;
}
```

### 2. 输出编码

```typescript
// 防止 XSS 攻击
function sanitizeForDisplay(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

### 3. 认证授权

```typescript
// 使用 JWT 令牌认证
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
```

## 监控和日志

### 日志系统

```typescript
// 使用 Winston 记录详细日志
logger.info('用户发起发布请求', {
  platforms: ['wechat', 'zhihu'],
  contentLength: 1000,
});

logger.error('发布失败', {
  platform: 'wechat',
  error: error.message,
  stack: error.stack,
});
```

### 指标收集

```typescript
// 实现指标收集
const publishMetrics = {
  totalPublishes: 0,
  successfulPublishes: 0,
  failedPublishes: 0,
  averageResponseTime: 0,
  platformStats: {
    wechat: { success: 0, failed: 0 },
    // ...
  },
};
```

## 总结

OmniPost 的架构设计遵循以下原则：

1. **模块化**：每个功能独立，易于维护和测试
2. **可扩展**：使用工厂模式和策略模式，轻松添加新平台
3. **高内聚**：相关功能聚合在一起
4. **低耦合**：各层松耦合，支持独立演进
5. **可靠性**：错误处理和日志完善
6. **性能**：异步处理和缓存策略

这种设计使得 OmniPost 不仅能满足当前需求，还能随着业务发展灵活扩展。
