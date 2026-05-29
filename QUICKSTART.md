# OmniPost 快速查看指南

## 📖 文档导航

### 🚀 快速开始（5 分钟）
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)** 中的"快速部署"章节

```bash
# 一分钟启动
cd backend && npm install && npm run dev &
cd ../frontend && npm install && npm run dev
# 访问 http://localhost:3000
```

### 📚 完整了解项目
👉 **[README.md](README.md)** - 项目全面介绍
- 核心特性
- 技术栈
- 快速开始
- API 文档

### 🏗️ 理解系统架构
👉 **[ARCHITECTURE.md](ARCHITECTURE.md)** - 架构设计文档
- 系统架构图
- 设计模式说明
- 如何添加新平台
- 性能优化

### 💻 开发和部署
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)** - 部署指南
- 开发环境配置
- 生产部署
- Docker 部署
- 故障排除

### 📁 代码结构
👉 **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - 文件结构说明
- 项目目录树
- 关键文件说明
- 代码流程

### 📊 项目完成情况
👉 **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - 项目总结
👉 **[COMPLETION_REPORT.md](COMPLETION_REPORT.md)** - 交付报告

## 🎯 按需求选择文档

### "我想快速开始"
→ DEPLOYMENT.md 中的"快速部署"

### "我想了解系统设计"
→ ARCHITECTURE.md

### "我想添加新平台"
→ ARCHITECTURE.md 中的"扩展机制"

### "我想部署到生产"
→ DEPLOYMENT.md 中的"生产部署"

### "我想了解代码结构"
→ FILE_STRUCTURE.md

### "我想看项目统计"
→ COMPLETION_REPORT.md

## 🔥 最常用的操作

### 启动项目
```bash
# 后端
cd backend && npm run dev

# 前端（另一个终端）
cd frontend && npm run dev
```

### 添加新平台
1. 编辑 `backend/src/adapters/index.ts`
2. 添加新的适配器类
3. 更新 `backend/src/types/index.ts`
4. 在 `PlatformFactory.ts` 中注册
完成！新平台自动出现

### 构建生产版本
```bash
# 后端
cd backend && npm run build

# 前端
cd frontend && npm run build
```

### 查看 API 文档
→ README.md 中的"API 文档"章节

## 📚 文档文件大小

| 文件 | 大小 | 用途 |
|------|------|------|
| README.md | 500+ 行 | 项目文档 |
| ARCHITECTURE.md | 600+ 行 | 架构设计 |
| DEPLOYMENT.md | 400+ 行 | 部署指南 |
| FILE_STRUCTURE.md | 300+ 行 | 文件说明 |
| PROJECT_SUMMARY.md | 400+ 行 | 项目总结 |
| COMPLETION_REPORT.md | 300+ 行 | 交付报告 |

## 🎓 学习路径

### 初学者
1. 阅读 README.md（了解项目）
2. 按照 DEPLOYMENT.md 快速部署
3. 使用前端界面体验功能
4. 查看 FILE_STRUCTURE.md 了解代码

### 开发者
1. 阅读 ARCHITECTURE.md（理解设计）
2. 查看后端源代码（src/adapters）
3. 尝试添加新平台
4. 参考最佳实践进行开发

### 运维人员
1. 阅读 DEPLOYMENT.md（部署指南）
2. 根据环境选择部署方式
3. 配置环境变量
4. 启动服务并监控

## 💡 关键概念

### 工厂模式
- 位置：`backend/src/adapters/PlatformFactory.ts`
- 作用：集中管理所有平台适配器
- 优势：新增平台无需修改主代码

### 策略模式
- 位置：`backend/src/adapters/BasePlatformAdapter.ts`
- 作用：定义平台适配的通用接口
- 优势：每个平台独立实现，易于维护

### 状态管理
- 位置：`frontend/lib/store.ts`
- 框架：Zustand
- 功能：管理所有 UI 状态

### API 客户端
- 位置：`frontend/lib/api.ts`
- 框架：Axios
- 功能：与后端通信

## 🔧 常见操作命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务
npm start

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 🚨 常见问题快速解答

**Q: 后端无法连接？**
A: 检查后端是否运行在 3001 端口
```bash
curl http://localhost:3001/health
```

**Q: 模块找不到？**
A: 重新安装依赖
```bash
rm -rf node_modules && npm install
```

**Q: 如何添加新平台？**
A: 参考 ARCHITECTURE.md 中的"扩展机制"章节

**Q: 如何部署到生产？**
A: 参考 DEPLOYMENT.md 中的"生产部署"章节

## 🎯 项目核心功能速览

### 前端
- ✅ 内容编辑器
- ✅ 平台选择
- ✅ 实时预览
- ✅ 一键发布
- ✅ 历史记录

### 后端
- ✅ 平台适配（6 个）
- ✅ 内容转换
- ✅ 预览生成
- ✅ 发布管理
- ✅ 历史存储

### API
- ✅ GET /api/platforms
- ✅ POST /api/adapt
- ✅ POST /api/preview
- ✅ POST /api/publish
- ✅ GET /api/history

## 📱 支持的平台

| 平台 | 状态 | 特性 |
|------|------|------|
| 微信公众号 | ✅ | 富文本、图文排版 |
| 知乎 | ✅ | 长文章、高权重 |
| B 站 | ✅ | 视频平台、社区互动 |
| 小红书 | ✅ | 种草平台、视觉内容 |
| 微博 | ✅ | 快速传播、评论活跃 |
| 抖音 | ✅ | 短视频、算法推荐 |

## 🎉 项目亮点

- 💯 100% TypeScript
- 🏗️ 工厂 + 策略模式
- 📚 5 个完整文档
- 🎨 现代化 UI 设计
- 🚀 生产就绪
- 🔧 易于扩展

## 📞 需要帮助？

1. 查看对应的文档文件
2. 搜索 FILE_STRUCTURE.md 中的类或方法
3. 查看代码中的详细注释
4. 参考 ARCHITECTURE.md 中的最佳实践

---

**Happy Coding! 🚀**

项目主页：[GitHub](https://github.com/yourusername/omnipost-ai)
