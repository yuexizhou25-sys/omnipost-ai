import { PlatformType } from '@/lib/types';
import {
  MessageCircle,
  BookOpen,
  Play,
  Heart,
  MessageSquareDot,
  Zap,
  LucideIcon,
} from 'lucide-react';

export interface PlatformMeta {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
}

export const PLATFORM_META: Record<PlatformType, PlatformMeta> = {
  wechat: {
    label: '微信公众号',
    shortLabel: '微信',
    icon: MessageCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  zhihu: {
    label: '知乎',
    shortLabel: '知乎',
    icon: BookOpen,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500/20 to-blue-600/5',
  },
  bilibili: {
    label: 'B站',
    shortLabel: 'B站',
    icon: Play,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    gradient: 'from-pink-500/20 to-pink-600/5',
  },
  xiaohongshu: {
    label: '小红书',
    shortLabel: '小红书',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    gradient: 'from-red-500/20 to-red-600/5',
  },
  weibo: {
    label: '微博',
    shortLabel: '微博',
    icon: MessageSquareDot,
    color: 'text-[#C41230]',
    bgColor: 'bg-[#8B1538]/10',
    borderColor: 'border-[#8B1538]/30',
    gradient: 'from-[#8B1538]/20 to-[#C41230]/5',
  },
  douyin: {
    label: '抖音',
    shortLabel: '抖音',
    icon: Zap,
    color: 'text-[#FE2C55]',
    bgColor: 'bg-gradient-to-br from-[#25F4EE]/10 to-[#FE2C55]/10',
    borderColor: 'border-[#FE2C55]/30',
    gradient: 'from-[#25F4EE]/15 to-[#FE2C55]/10',
  },
};

export function getPlatformLabel(platform: PlatformType): string {
  return PLATFORM_META[platform]?.label ?? platform;
}
