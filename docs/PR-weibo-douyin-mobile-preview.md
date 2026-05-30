# PR: 扩展微博/抖音适配器并升级手机端高仿真预览

## 标题

feat: 增强微博/抖音平台适配逻辑，新增手机端高仿真实时预览

## 功能描述

- **后端**：在 `PlatformFactory` 架构下强化微博与抖音适配器——微博支持 140 字限制、Markdown 转纯文本与图片保留；抖音自动提取标题/首句作为视频文案、合并 #话题，并在发布时校验视频/图片 URL。
- **前端左侧栏**：新增微博（内敛深红品牌色）与抖音（青/红叠影图标）Switch 切换，与现有四平台样式一致。
- **前端右侧栏**：重构为带灵动岛的手机模型外壳，内含微信、知乎、小红书、B站、微博、抖音六套高仿真皮肤，Tabs 切换时平滑淡入淡出，数据与中间编辑器双向绑定。

## 实现思路

### 后端

| 平台 | 关键逻辑 |
|------|----------|
| **微博** | `maxContentLength: 140`；`transformContent()` 将 Markdown 转纯文本；保留最多 9 张图片 URL；超长截断并写入 `warnings` |
| **抖音** | 文案 = 标题 \|\| 正文首句；`mergeTags()` 自动合并 #话题；`publish()` 校验 `videoUrl` 或 `images` 至少一项，否则返回 `status: failed` |

### 前端

- `PublishSidebar`：6 平台 Switch + 品牌图标组件 `PlatformBrandIcon`
- `PhoneMockup`：纯 CSS/Tailwind 绘制 iOS 外壳（灵动岛、Home Indicator）
- `PlatformSkins`：各平台独立皮肤组件，`HighlightSocialText` 高亮 #/@
- `useDebouncedPreview`：600ms 防抖调用 `/api/preview`，驱动实时预览
- `animate-skin-in`：Tabs 切换时皮肤淡入动画

## 测试方式

### 后端

```bash
# 启动服务
npm run dev --workspace=backend

# 微博适配 - 超长文本应截断至 140 字
curl -X POST http://localhost:3001/api/adapt \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"","content":"#测试 **加粗** 内容..."},"platforms":["weibo"]}'

# 抖音发布 - 无视频/图片应失败
curl -X POST http://localhost:3001/api/publish \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"测试文案","content":"第一句话。#热门","tags":["分享"]},"platforms":["douyin"],"isSimulated":true}'

# 抖音发布 - 有 videoUrl 应成功（mock）
curl -X POST http://localhost:3001/api/publish \
  -H "Content-Type: application/json" \
  -d '{"content":{"title":"测试","content":"内容","videoUrl":"https://example.com/v.mp4"},"platforms":["douyin"],"isSimulated":true}'
```

### 前端

1. 访问 http://localhost:3000
2. 左侧开启「微博」「抖音」Switch，确认品牌色与图标
3. 中间输入 Markdown 正文，观察右侧手机预览实时更新
4. 切换 Tabs（微信/知乎/小红书/B站/微博/抖音），确认皮肤淡入切换
5. 微博预览：验证 #话题 @用户 高亮、140 字截断警告
6. 抖音预览：无 URL 时显示占位；填写视频 URL 后播放；无媒体时模拟发布应提示失败
