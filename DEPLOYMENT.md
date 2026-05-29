# OmniPost 快速开始指南

## 🎯 5 分钟快速部署

### 前置条件
- Node.js 18+
- npm 或 yarn
- Git

### 一键启动脚本

#### Windows PowerShell

```powershell
# 克隆项目
git clone https://github.com/yourusername/omnipost-ai.git
cd omnipost-ai

# 安装依赖
Write-Host "=== 安装后端依赖 ===" -ForegroundColor Green
cd backend
npm install
cd ..

Write-Host "=== 安装前端依赖 ===" -ForegroundColor Green
cd frontend
npm install
cd ..

# 配置环境
Write-Host "=== 配置环境变量 ===" -ForegroundColor Green
cp backend\.env.example backend\.env
cp frontend\.env.example frontend\.env.local

# 启动服务
Write-Host "=== 启动后端服务 ===" -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "=== 启动前端服务 ===" -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "启动完成！" -ForegroundColor Green
Write-Host "前端: http://localhost:3000" -ForegroundColor Cyan
Write-Host "后端: http://localhost:3001" -ForegroundColor Cyan
```

#### Linux/macOS

```bash
#!/bin/bash

# 克隆项目
git clone https://github.com/yourusername/omnipost-ai.git
cd omnipost-ai

# 安装依赖
echo "=== 安装后端依赖 ==="
cd backend
npm install
cd ..

echo "=== 安装前端依赖 ==="
cd frontend
npm install
cd ..

# 配置环境
echo "=== 配置环境变量 ==="
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 启动服务（需要两个终端，或使用 tmux）
echo "=== 启动服务 ==="
echo "请在两个终端运行："
echo "终端1: cd backend && npm run dev"
echo "终端2: cd frontend && npm run dev"
echo ""
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
```

### Docker 部署

#### Dockerfile

```dockerfile
# 后端 Dockerfile
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app/backend
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/.env ./.env
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      ENABLE_MOCK_MODE: "true"
    volumes:
      - ./backend/src:/app/src
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    depends_on:
      - backend
    command: npm run dev
```

启动容器：
```bash
docker-compose up
```

## 📚 详细开发指南

### 项目结构

```
omnipost-ai/
├── backend/                    # Express.js 后端
│   ├── src/
│   │   ├── adapters/          # 平台适配器
│   │   ├── services/          # 业务服务
│   │   ├── routes/            # API 路由
│   │   ├── types/             # 类型定义
│   │   ├── utils/             # 工具函数
│   │   ├── app.ts             # 应用配置
│   │   └── index.ts           # 服务器入口
│   ├── dist/                  # 编译输出
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js 前端
│   ├── app/
│   │   ├── page.tsx           # 主页面
│   │   ├── layout.tsx         # 全局布局
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   ├── lib/
│   │   ├── api.ts             # API 客户端
│   │   ├── store.ts           # 状态管理
│   │   ├── types.ts           # 类型定义
│   │   └── utils.ts           # 工具函数
│   ├── public/                # 静态资源
│   ├── package.json
│   └── tsconfig.json
│
├── README.md                  # 项目文档
├── ARCHITECTURE.md            # 架构设计
└── DEPLOYMENT.md              # 部署指南
```

### 常用命令

#### 后端

```bash
cd backend

# 开发模式
npm run dev

# 构建
npm run build

# 生产环境运行
npm start

# 代码检查
npm run lint

# 运行测试
npm run test
```

#### 前端

```bash
cd frontend

# 开发模式
npm run dev

# 构建
npm run build

# 生产环境运行
npm start

# 代码检查
npm run lint
```

### 添加新平台教程

#### 1. 创建适配器类

编辑 `backend/src/adapters/index.ts`，添加新的适配器类：

```typescript
export class TikTokAdapter extends BasePlatformAdapter {
  platformType: PlatformType = 'tiktok';

  getConfig(): PlatformConfig {
    return {
      name: 'tiktok',
      displayName: 'TikTok',
      icon: 'tiktok',
      maxTitleLength: 150,
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
    // 实现 TikTok 特定的适配逻辑
    const config = this.getConfig();
    let content = this.sanitizeContent(input.content);

    if (content.length > config.maxContentLength) {
      content = this.truncateText(content, config.maxContentLength);
    }

    return {
      platformType: this.platformType,
      title: '',
      content,
      images: input.images || [],
      videoUrl: input.videoUrl,
      metadata: {},
      warnings: [],
    };
  }

  async publish(
    content: AdaptedContent,
    options?: PublishOptions
  ): Promise<PublishResult> {
    // 实现 TikTok 发布逻辑
    return {
      id: uuidv4(),
      platformType: this.platformType,
      status: 'mock',
      message: 'TikTok 内容已准备好',
      timestamp: new Date(),
      isSimulated: true,
    };
  }

  getPreview(content: AdaptedContent): string {
    return `【TikTok】\\n${content.content}`;
  }
}
```

#### 2. 更新类型定义

编辑 `backend/src/types/index.ts`：

```typescript
export type PlatformType = 
  | 'wechat' 
  | 'zhihu' 
  | 'bilibili' 
  | 'xiaohongshu' 
  | 'weibo' 
  | 'douyin'
  | 'tiktok';  // 添加这一行
```

#### 3. 注册适配器

编辑 `backend/src/adapters/PlatformFactory.ts`：

```typescript
static {
  // ... 现有注册
  this.register('tiktok', new TikTokAdapter());  // 添加这一行
}
```

完成！新平台会自动出现在系统中。

### 调试技巧

#### 1. 启用详细日志

编辑 `backend/.env`：

```bash
LOG_LEVEL=debug
```

#### 2. 模拟模式测试

```bash
# 后端启动时设置模拟模式
ENABLE_MOCK_MODE=true npm run dev
```

#### 3. 浏览器开发工具

```javascript
// 在浏览器控制台中检查应用状态
import { useAppStore } from '@/lib/store';
const state = useAppStore.getState();
console.log(state);
```

#### 4. API 调试

使用 Postman 或 curl 测试 API：

```bash
# 获取平台列表
curl http://localhost:3001/api/platforms

# 生成预览
curl -X POST http://localhost:3001/api/preview \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": {
      "title": "测试标题",
      "content": "测试内容"
    },
    "platforms": ["wechat", "zhihu"]
  }'
```

## 🚀 生产部署

### 环境配置

#### 后端 (.env)

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com

# 平台 API 密钥
WECHAT_APP_ID=your_production_app_id
WECHAT_APP_SECRET=your_production_secret
ZHIHU_ACCESS_TOKEN=your_token
BILIBILI_ACCESS_TOKEN=your_token
XIAOHONGSHU_ACCESS_TOKEN=your_token
WEIBO_ACCESS_TOKEN=your_token
DOUYIN_ACCESS_TOKEN=your_token

# 数据库配置（如果使用）
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=omnipost
DB_USER=db_user
DB_PASSWORD=secure_password

# JWT 配置（如果使用认证）
JWT_SECRET=your_jwt_secret_key

# 功能标志
ENABLE_REAL_PUBLISH=true
ENABLE_MOCK_MODE=false
LOG_LEVEL=info
```

#### 前端 (.env.production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=OmniPost
```

### Nginx 配置

```nginx
upstream backend {
  server localhost:3001;
}

upstream frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name omnipost.yourdomain.com;
  
  # 重定向到 HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name omnipost.yourdomain.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  # 前端
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # API
  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### PM2 管理

#### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'omnipost-backend',
      script: './dist/index.js',
      cwd: './backend',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'omnipost-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
    },
  ],
};
```

启动：
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📊 监控和日志

### 日志文件位置

```
backend/logs/
├── error.log       # 错误日志
├── combined.log    # 所有日志
└── /YYYY-MM-DD/   # 按日期分类
```

### 查看实时日志

```bash
# 后端日志
tail -f backend/logs/combined.log

# PM2 日志
pm2 logs omnipost-backend
```

### 性能监控

```bash
# 使用 PM2 监控
pm2 monit

# 查看应用状态
pm2 status

# 生成报告
pm2 web  # 打开 http://localhost:9615
```

## 🔧 故障排除

### 问题 1：后端无法连接

**症状**：前端显示"无法连接到后端"

**解决方案**：
```bash
# 检查后端是否运行
curl http://localhost:3001/health

# 检查防火墙
sudo ufw allow 3001

# 检查 CORS 配置
# backend/.env: CORS_ORIGIN=http://localhost:3000
```

### 问题 2：模块未找到错误

**症状**：`Error: Cannot find module`

**解决方案**：
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 清除缓存
npm cache clean --force
```

### 问题 3：端口占用

**症状**：`Error: listen EADDRINUSE: address already in use :::3001`

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :3001  # Linux/macOS
netstat -ano | findstr :3001  # Windows

# 杀死进程
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

### 问题 4：数据库连接失败

**症状**：发布历史无法保存

**解决方案**：
```bash
# 检查数据库连接
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# 检查 .env 中的数据库配置
cat backend/.env | grep DB_
```

## 📞 获取帮助

- 📖 查看 [README.md](README.md)
- 🏗️ 查看 [ARCHITECTURE.md](ARCHITECTURE.md)
- 🐛 提交 [GitHub Issues](https://github.com/yourusername/omnipost-ai/issues)
- 💬 加入 [讨论区](https://github.com/yourusername/omnipost-ai/discussions)
