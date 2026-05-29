import { Router, Request, Response } from 'express';
import PlatformFactory from '@adapters/PlatformFactory';
import { publishHistoryService } from '@services/PublishHistoryService';
import { ContentInput, PlatformType } from '@types/index';

const router = Router();

/**
 * GET /api/platforms
 * 获取所有支持的平台列表
 */
router.get('/platforms', (req: Request, res: Response) => {
  try {
    const platforms = PlatformFactory.getAllPlatforms();
    res.json({
      success: true,
      data: platforms,
      count: platforms.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * POST /api/adapt
 * 适配内容到指定平台
 */
router.post('/adapt', (req: Request, res: Response) => {
  try {
    const { content, platforms } = req.body as {
      content: ContentInput;
      platforms: PlatformType[];
    };

    if (!content || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：content 和 platforms',
      });
    }

    const adaptedContents = platforms.map(platformType => {
      const adapter = PlatformFactory.getAdapter(platformType);
      return adapter.adaptContent(content);
    });

    res.json({
      success: true,
      data: adaptedContents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * POST /api/preview
 * 获取平台内容预览
 */
router.post('/preview', (req: Request, res: Response) => {
  try {
    const { content, platforms } = req.body as {
      content: ContentInput;
      platforms: PlatformType[];
    };

    if (!content || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数',
      });
    }

    const previews = platforms.map(platformType => {
      const adapter = PlatformFactory.getAdapter(platformType);
      const adapted = adapter.adaptContent(content);
      const preview = adapter.getPreview(adapted);

      return {
        platform: platformType,
        preview,
        warnings: adapted.warnings,
      };
    });

    res.json({
      success: true,
      data: previews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * POST /api/publish
 * 发布内容到指定平台
 */
router.post('/publish', async (req: Request, res: Response) => {
  try {
    const { content, platforms, isSimulated = true } = req.body as {
      content: ContentInput;
      platforms: PlatformType[];
      isSimulated?: boolean;
    };

    if (!content || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数',
      });
    }

    // 创建发布历史记录
    const history = publishHistoryService.createHistory(content, platforms);

    // 为每个平台发布内容
    const publishPromises = platforms.map(async platformType => {
      const adapter = PlatformFactory.getAdapter(platformType);
      const adapted = adapter.adaptContent(content);
      const result = await adapter.publish(adapted, { isSimulated });
      publishHistoryService.addPublishResult(history.id, result);
      return result;
    });

    const results = await Promise.all(publishPromises);

    res.json({
      success: true,
      data: {
        historyId: history.id,
        results,
        isSimulated,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * GET /api/history
 * 获取发布历史
 */
router.get('/history', (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const history = publishHistoryService.getRecentHistory(parseInt(limit as string));

    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * GET /api/history/:id
 * 获取单条发布历史
 */
router.get('/history/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = publishHistoryService.getHistory(id);

    if (!history) {
      return res.status(404).json({
        success: false,
        error: '发布历史不存在',
      });
    }

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

/**
 * DELETE /api/history/:id
 * 删除发布历史
 */
router.delete('/history/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = publishHistoryService.deleteHistory(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: '发布历史不存在',
      });
    }

    res.json({
      success: true,
      message: '发布历史已删除',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
});

export default router;
