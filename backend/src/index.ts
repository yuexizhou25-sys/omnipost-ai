import dotenv from 'dotenv';
import { createApp } from '@/app';
import logger from '@/utils/logger';

// 加载环境变量
dotenv.config();

const PORT = process.env.PORT || 3001;

// 创建应用
const app = createApp();

// 启动服务器
app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════════════════╗
║           🚀 OmniPost 多平台发布工具 - 后端服务启动            ║
╠════════════════════════════════════════════════════════════════╣
║ 服务器运行于: http://localhost:${PORT}                     ║
║ 环境: ${process.env.NODE_ENV || 'development'}                              ║
║ 模拟模式: ${process.env.ENABLE_MOCK_MODE === 'true' ? '启用' : '禁用'}                            ║
║ 支持平台: 6 个 (微信、知乎、B站、小红书、微博、抖音)           ║
╚════════════════════════════════════════════════════════════════╝

📡 API 文档:
  • GET  /health                    - 健康检查
  • GET  /api/platforms             - 获取所有平台
  • POST /api/adapt                 - 适配内容
  • POST /api/preview               - 获取预览
  • POST /api/publish               - 发布内容
  • GET  /api/history               - 获取发布历史
  • GET  /api/history/:id           - 获取单条历史
  • DELETE /api/history/:id         - 删除历史
  `);
});

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`未处理的 Promise 拒绝:`, reason);
});

process.on('uncaughtException', (error) => {
  logger.error(`未捕获的异常:`, error);
  process.exit(1);
});
