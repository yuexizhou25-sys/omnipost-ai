import express, { Express } from 'express';
import cors from 'cors';
import apiRouter from '@/routes/api';
import logger from '@/utils/logger';

/**
 * 初始化 Express 应用
 */
export function createApp(): Express {
  const app = express();

  // 中间件
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 请求日志
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // 健康检查
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API 路由
  app.use('/api', apiRouter);

  // 404 处理
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'API 端点不存在',
      path: req.path,
    });
  });

  // 错误处理
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`错误: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message || '服务器内部错误',
    });
  });

  return app;
}
