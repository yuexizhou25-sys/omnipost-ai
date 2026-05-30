'use client';

import { ContentInput } from '@/lib/types';
import { HighlightSocialText } from './HighlightSocialText';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  ThumbsUp,
  Eye,
} from 'lucide-react';

interface SkinProps {
  content: ContentInput;
  adaptedText?: string;
  warnings?: string[];
}

export function WeiboSkin({ content, adaptedText }: SkinProps) {
  const text = adaptedText ?? content.content;
  const images = content.images?.filter(Boolean) ?? [];

  return (
    <div className="h-full bg-white text-gray-900 overflow-y-auto">
      <div className="px-3 py-3 flex items-start gap-2.5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C41230] to-[#8B1538] flex items-center justify-center text-white text-xs font-bold shrink-0">
          创
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-gray-900">OmniPost创作者</p>
          <p className="text-[9px] text-gray-400">刚刚 · 来自 OmniPost</p>
        </div>
      </div>

      <div className="px-3 py-2.5">
        <p className="text-[12px] leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
          <HighlightSocialText text={text} />
        </p>

        {images.length > 0 && (
          <div className={`mt-2 grid gap-0.5 rounded-lg overflow-hidden ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {images.slice(0, 9).map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" className="w-full aspect-square object-cover bg-gray-100" />
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2.5 flex items-center justify-around border-t border-gray-100 text-gray-500">
        <button className="flex items-center gap-1 text-[10px]">
          <Repeat2 className="w-3.5 h-3.5" /> 转发
        </button>
        <button className="flex items-center gap-1 text-[10px]">
          <MessageCircle className="w-3.5 h-3.5" /> 评论
        </button>
        <button className="flex items-center gap-1 text-[10px]">
          <ThumbsUp className="w-3.5 h-3.5" /> 赞
        </button>
      </div>
    </div>
  );
}

export function DouyinSkin({ content, adaptedText }: SkinProps) {
  const caption = adaptedText ?? content.title ?? content.content.split('\n')[0] ?? '';
  const videoUrl = content.videoUrl?.trim();
  const hasMedia = videoUrl || (content.images?.length ?? 0) > 0;

  return (
    <div className="h-full relative bg-black overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay
        />
      ) : content.images?.[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-2">
            <span className="text-2xl">▶</span>
          </div>
          <p className="text-[10px] text-white/40">请填写视频或图片 URL</p>
        </div>
      )}

      {/* 右侧互动栏 */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-10">
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white/80" />
          </div>
          <span className="text-[8px] text-white">1.2w</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-[8px] text-white">886</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-[8px] text-white">分享</span>
        </div>
      </div>

      {/* 底部文案 */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
        <p className="text-[11px] font-bold text-white mb-1">@OmniPost创作者</p>
        <p className="text-[10px] text-white/90 leading-relaxed line-clamp-2">
          <HighlightSocialText text={caption} />
        </p>
        {!hasMedia && (
          <p className="text-[9px] text-red-400 mt-1">⚠ 缺少视频/图片，无法发布</p>
        )}
      </div>
    </div>
  );
}

export function XiaohongshuSkin({ content, adaptedText }: SkinProps) {
  const text = adaptedText ?? content.content;
  const images = content.images?.filter(Boolean) ?? [];

  return (
    <div className="h-full bg-white overflow-y-auto">
      {images.length > 0 ? (
        <div className={`grid gap-0.5 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {images.slice(0, 4).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className="w-full aspect-square object-cover" />
          ))}
        </div>
      ) : (
        <div className="aspect-square bg-gradient-to-br from-red-100 via-pink-50 to-orange-50 flex items-center justify-center">
          <span className="text-3xl">📷</span>
        </div>
      )}

      <div className="p-3">
        <p className="text-[11px] text-gray-800 leading-relaxed line-clamp-4 whitespace-pre-wrap">
          {text || '笔记正文...'}
        </p>
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
          <div className="w-6 h-6 rounded-full bg-red-400" />
          <span className="text-[10px] text-gray-500 flex-1">OmniPost</span>
          <Heart className="w-4 h-4 text-gray-400" />
          <Bookmark className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

export function WeChatSkin({ content, adaptedText }: SkinProps) {
  const body = adaptedText ?? content.content;
  const title = content.title || '文章标题';

  return (
    <div className="h-full bg-[#EDEDED] overflow-y-auto">
      <div className="bg-white mx-0 px-4 py-4 min-h-full">
        <h1 className="text-[15px] font-bold text-gray-900 leading-snug mb-3">{title}</h1>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-6 h-6 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-gray-500">OmniPost · 刚刚</span>
        </div>
        <div
          className="text-[16px] text-gray-800 leading-[1.8] text-justify whitespace-pre-wrap break-words"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          {body || '正文内容...'}
        </div>
        <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> 阅读 1,024
          </span>
          <span>在看 56</span>
        </div>
      </div>
    </div>
  );
}

export function ZhihuSkin({ content, adaptedText }: SkinProps) {
  const title = content.title || '问题标题';
  const body = adaptedText ?? content.content;

  return (
    <div className="h-full bg-white overflow-y-auto px-3 py-3">
      <h2 className="text-[13px] font-bold text-gray-900 leading-snug mb-2">{title}</h2>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-blue-500" />
        <span className="text-[9px] text-gray-500">OmniPost · 创作者</span>
      </div>
      <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">{body || '回答内容...'}</p>
      <div className="flex gap-4 mt-4 text-[10px] text-gray-400">
        <span>▲ 赞同 128</span>
        <span>💬 12 评论</span>
      </div>
    </div>
  );
}

export function BilibiliSkin({ content, adaptedText }: SkinProps) {
  const title = content.title || '动态标题';
  const body = adaptedText ?? content.content;

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="px-3 py-3 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-pink-400" />
        <div>
          <p className="text-[11px] font-bold text-gray-900">OmniPost</p>
          <p className="text-[9px] text-gray-400">发布了动态</p>
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="text-[12px] font-medium text-gray-900 mb-1">{title}</p>
        <p className="text-[11px] text-gray-600 whitespace-pre-wrap">{body || '动态内容...'}</p>
      </div>
      {content.videoUrl && (
        <div className="mx-3 mb-3 aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs">
          ▶ 视频预览
        </div>
      )}
    </div>
  );
}
