# OmniPost 可扩展架构设计

## 概述

OmniPost 采用**工厂模式 + 策略模式**的可扩展架构，使添加新平台只需最小改动，无需修改核心业务逻辑。

```
用户输入 ContentInput
       │
       ▼
┌──────────────────────────────────────────┐
│           Express API 路由层              │
│  /adapt  /preview  /publish  /history    │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│         PlatformFactory（工厂）            │
│  根据 platformType 返回对应适配器实例      │
└──────────────────┬───────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  WeChatAdapter ZhihuAdapter  ...Adapter
       │           │           │
       └───────────┴───────────┘
                   │
                   ▼
         BasePlatformAdapter（基类）
         ├─ transformContent()    ← ContentTransformService
         ├─ truncateText()
         ├─ extractHashtags()
         ├─ formatLinks()
         └─ mergeTags()
```

## 核心接口

### PlatformAdapter

每个平台适配器必须实现：

| 方法 | 职责 |
|------|------|
| `getConfig()` | 返回平台配置（字数限制、格式、功能开关） |
| `adaptContent(input)` | 将原始内容适配为平台格式 |
| `publish(content, options)` | 发布内容（支持模拟/真实） |
| `getPreview(content)` | 生成人类可读的预览文本 |

### ContentInput → AdaptedContent

```
ContentInput {
  title, content, summary, tags, images, videoUrl, mentions, links
}
        ↓ adaptContent()
AdaptedContent {
  platformType, title, content, images, videoUrl, metadata, warnings[]
}
```

## 添加新平台（4 步）

### 1. 定义类型

```typescript
// backend/src/types/index.ts
export type PlatformType = 'wechat' | 'zhihu' | ... | 'newplatform';
```

### 2. 创建适配器

```typescript
// backend/src/adapters/index.ts
export class NewPlatformAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'newplatform';

  getConfig(): PlatformConfig {
    return {
      name: 'newplatform',
      displayName: '新平台',
      maxTitleLength: 100,
      maxContentLength: 5000,
      contentFormat: 'plain',
      // ...
    };
  }

  adaptContent(input: ContentInput): AdaptedContent {
    // 利用基类工具：this.transformContent(input)、this.mergeTags() 等
  }

  async publish(content, options): Promise<PublishResult> { /* ... */ }
}
```

### 3. 注册到工厂

```typescript
// backend/src/adapters/PlatformFactory.ts
this.register('newplatform', new NewPlatformAdapter());
```

### 4. 前端添加元数据

```typescript
// frontend/lib/platform-meta.ts
PLATFORM_META.newplatform = { label: '新平台', icon: ..., color: ... };
```

完成！API 自动识别新平台，前端通过 `/api/platforms` 动态加载。

## 内容转换管道

`ContentTransformService` 提供统一的格式转换：

- **Markdown** → 保留链接、标题、加粗等格式（知乎）
- **HTML** → 富文本链接、段落（微信公众号）
- **Plain** → 剥离所有格式（微博、B站、小红书、抖音）

适配器通过 `this.transformContent(input)` 调用，无需重复实现转换逻辑。

## 发布模式

| 模式 | 环境变量 | 行为 |
|------|----------|------|
| 模拟发布 | `ENABLE_MOCK_MODE=true` | 强制模拟，不调用真实 API |
| 真实发布 | `ENABLE_REAL_PUBLISH=true` | 调用各平台 API（需配置密钥） |

## 目录结构建议（未来拆分）

```
backend/src/adapters/
├── BasePlatformAdapter.ts
├── PlatformFactory.ts
├── wechat/WeChatAdapter.ts
├── zhihu/ZhihuAdapter.ts
├── bilibili/BilibiliAdapter.ts
└── ...
```

当前所有适配器集中在 `index.ts` 中，适合 MVP 阶段；平台增多后建议按目录拆分。
