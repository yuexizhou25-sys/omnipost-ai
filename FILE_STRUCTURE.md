# OmniPost 项目文件说明

## 核心文件结构

### 后端文件 (backend/)

```
backend/
├── src/
│   ├── adapters/
│   │   ├── BasePlatformAdapter.ts      # 平台适配器基类
│   │   ├── index.ts                    # 所有平台适配器实现
│   │   └── PlatformFactory.ts          # 平台工厂类
│   │
│   ├── services/
│   │   ├── ContentTransformService.ts  # 内容转换服务
│   │   └── PublishHistoryService.ts    # 发布历史管理
│   │
│   ├── routes/
│   │   └── api.ts                      # API 路由定义
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript 类型定义
│   │
│   ├── utils/
│   │   └── logger.ts                   # Winston 日志系统
│   │
│   ├── app.ts                          # Express 应用配置
│   └── index.ts                        # 服务器入口点
│
├── dist/                               # 编译后的 JavaScript
├── logs/                               # 日志文件
├── package.json                        # 依赖配置
├── tsconfig.json                       # TypeScript 配置
├── .env.example                        # 环境变量示例
└── .eslintrc                           # ESLint 配置
```

### 前端文件 (frontend/)

```
frontend/
├── app/
│   ├── page.tsx                        # 主页面组件
│   ├── layout.tsx                      # 全局布局
│   ├── globals.css                     # 全局样式
│   └── favicon.ico                     # 网站图标
│
├── components/
│   ├── ContentEditor.tsx               # 内容编辑器组件
│   ├── PlatformSelector.tsx            # 平台选择器组件
│   ├── PreviewPanel.tsx                # 预览面板组件
│   ├── PublishResults.tsx              # 发布结果组件
│   └── PublishHistoryPanel.tsx         # 历史记录面板组件
│
├── lib/
│   ├── api.ts                          # Axios API 客户端
│   ├── store.ts                        # Zustand 状态管理
│   ├── types.ts                        # TypeScript 类型定义
│   └── utils.ts                        # 工具函数
│
├── public/
│   ├── next.svg                        # Next.js 图标
│   └── vercel.svg                      # Vercel 图标
│
├── .next/                              # Next.js 构建输出
├── node_modules/                       # 依赖包
├── package.json                        # 依赖配置
├── tsconfig.json                       # TypeScript 配置
├── next.config.ts                      # Next.js 配置
├── .env.example                        # 环境变量示例
├── .eslintrc.json                      # ESLint 配置
└── postcss.config.mjs                  # PostCSS 配置
```

### 项目根目录文件

```
omnipost-ai/
├── README.md                           # 项目主文档
├── ARCHITECTURE.md                     # 系统架构设计文档
├── DEPLOYMENT.md                       # 部署和开发指南
├── package.json                        # 根项目配置
├── .gitignore                          # Git 忽略文件
├── docker-compose.yml                  # Docker Compose 配置
├── ecosystem.config.js                 # PM2 配置（生产部署）
└── LICENSE                             # 开源许可证
```

## 关键文件详解

### 1. 平台适配器系统

**文件**: `backend/src/adapters/index.ts`

包含 6 个平台适配器的完整实现：
- `WeChatAdapter` - 微信公众号
- `ZhihuAdapter` - 知乎
- `BilibiliAdapter` - B 站
- `XiaoHongShuAdapter` - 小红书
- `WeiboAdapter` - 微博
- `DouyinAdapter` - 抖音

每个适配器都实现了以下方法：
- `getConfig()` - 获取平台配置
- `adaptContent()` - 适配内容到该平台
- `publish()` - 发布内容（支持模拟和真实发布）
- `getPreview()` - 生成预览

### 2. 状态管理

**文件**: `frontend/lib/store.ts`

使用 Zustand 实现全局状态管理：
- `content` - 编辑的内容
- `selectedPlatforms` - 选中的平台列表
- `previews` - 生成的预览内容
- `publishResults` - 发布结果
- `isLoading` - 加载状态

### 3. API 客户端

**文件**: `frontend/lib/api.ts` 和 `backend/src/routes/api.ts`

定义了完整的 REST API 接口：
- `GET /api/platforms` - 获取平台列表
- `POST /api/adapt` - 适配内容
- `POST /api/preview` - 生成预览
- `POST /api/publish` - 发布内容
- `GET /api/history` - 获取发布历史

### 4. UI 组件

**文件**: `frontend/components/*.tsx`

5 个核心 React 组件：
- `ContentEditor` - 内容编辑器
- `PlatformSelector` - 平台选择
- `PreviewPanel` - 预览面板
- `PublishResults` - 发布结果弹窗
- `PublishHistoryPanel` - 历史记录弹窗

### 5. 类型系统

**文件**: `backend/src/types/index.ts` 和 `frontend/lib/types.ts`

完整的 TypeScript 类型定义：
- `PlatformType` - 平台类型枚举
- `ContentInput` - 用户输入内容
- `AdaptedContent` - 适配后的内容
- `PublishResult` - 发布结果
- `PlatformConfig` - 平台配置

### 6. 服务层

**文件**: `backend/src/services/`

两个核心服务类：
- `ContentTransformService` - 内容格式转换
- `PublishHistoryService` - 发布历史管理

## 代码流程

### 发布流程

```
用户输入内容
    ↓
点击"生成预览"
    ↓
API: POST /api/preview
    ├─ PlatformFactory.getAdapter()
    ├─ adapter.adaptContent()
    ├─ adapter.getPreview()
    └─ ContentTransformService 辅助
    ↓
返回预览内容
    ↓
用户查看预览和警告
    ↓
点击"模拟发布" 或 "真实发布"
    ↓
API: POST /api/publish
    ├─ 创建发布历史记录
    ├─ 并行调用所有平台的 publish()
    └─ 返回发布结果
    ↓
显示发布结果弹窗
    ↓
更新发布历史
```

## 扩展新平台

要添加新平台（如 Instagram），需要修改以下文件：

1. **backend/src/adapters/index.ts**
   - 添加 `InstagramAdapter` 类

2. **backend/src/types/index.ts**
   - 更新 `PlatformType` 类型

3. **backend/src/adapters/PlatformFactory.ts**
   - 注册新适配器

完成这 3 步后，系统会自动识别新平台。

## 配置说明

### 环境变量

**后端 (.env)**：
```
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
ENABLE_MOCK_MODE=true
LOG_LEVEL=debug
```

**前端 (.env.local)**：
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 依赖说明

**后端主要依赖**：
- express - Web 框架
- axios - HTTP 客户端
- winston - 日志系统
- uuid - UUID 生成

**前端主要依赖**：
- next - React 框架
- react - UI 库
- zustand - 状态管理
- axios - HTTP 客户端
- tailwindcss - CSS 框架
- lucide-react - 图标库

## 性能优化

### 前端优化
- 使用 Zustand 选择器优化重渲染
- 动态导入组件
- Next.js 图片优化

### 后端优化
- 异步并行处理多个平台
- 内存中缓存平台配置
- Winston 日志系统优化

## 安全考虑

- 所有输入都进行验证和清理
- 环境变量保护敏感信息
- CORS 限制只允许特定源
- API 端点错误处理完善

## 许可证和贡献

本项目采用 MIT 许可证，欢迎贡献代码！
