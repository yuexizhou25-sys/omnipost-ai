import { cn } from '@/lib/utils';
import { PlatformType } from '@/lib/types';

interface PlatformBrandIconProps {
  platform: PlatformType;
  className?: string;
  active?: boolean;
}

/** 微博品牌图标 - 内敛深红 */
export function WeiboBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-5 h-5', className)} fill="currentColor">
      <path d="M9.82 13.87c-.42.18-.84.27-1.24.27-.76 0-1.18-.42-1.18-1.05 0-.72.54-1.32 1.32-1.32.36 0 .72.09 1.05.24-.3.84-.72 1.56-1.2 2.1-.06-.06-.12-.12-.18-.18.06-.06.12-.06.18-.06h.25zm8.4-2.1c-.06-.84-.48-1.56-1.14-2.04-.66-.48-1.5-.72-2.4-.72-1.02 0-1.92.3-2.64.84-.72.54-1.2 1.32-1.38 2.22-.06.3-.06.6-.06.9 0 1.68.72 3.12 2.04 4.08 1.32.96 3 1.44 4.92 1.44 1.38 0 2.64-.3 3.72-.9 1.08-.6 1.92-1.44 2.46-2.46.54-1.02.84-2.16.84-3.36 0-.72-.12-1.38-.36-1.98-.24-.6-.6-1.14-1.02-1.56-.42-.42-.9-.78-1.44-1.02-.54-.24-1.14-.36-1.74-.36-.6 0-1.14.12-1.62.36-.48.24-.9.54-1.26.9-.36.36-.66.78-.9 1.26-.24.48-.36 1.02-.36 1.56 0 .54.12 1.02.36 1.5.24.48.6.9 1.02 1.26.42.36.9.66 1.44.84.54.18 1.14.3 1.74.3.6 0 1.14-.12 1.62-.36.48-.24.9-.54 1.26-.9.36-.36.66-.78.9-1.26.24-.48.36-1.02.36-1.56 0-.54-.12-1.02-.36-1.5-.24-.48-.6-.9-1.02-1.26z" opacity="0.9"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 10.5c0-2.2 2.2-4 5-4s5 1.8 5 4-2.2 4-5 4-5-1.8-5-4z" fill="currentColor"/>
    </svg>
  );
}

/** 抖音品牌图标 - 青/红叠影 */
export function DouyinBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('w-5 h-5', className)}>
      <path
        d="M16 5.5c.8 1.2 2 2 3.5 2.2V11c-1.2-.1-2.3-.5-3.2-1.1v4.8c0 3.2-2.6 5.8-5.8 5.8S4.7 17.9 4.7 14.7s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V2h3.3c.1 1.2.5 2.3 1.2 3.5z"
        fill="#25F4EE"
        transform="translate(-0.8, 0)"
      />
      <path
        d="M16 5.5c.8 1.2 2 2 3.5 2.2V11c-1.2-.1-2.3-.5-3.2-1.1v4.8c0 3.2-2.6 5.8-5.8 5.8S4.7 17.9 4.7 14.7s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.1c-.3-.1-.6-.2-.9-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V2h3.3c.1 1.2.5 2.3 1.2 3.5z"
        fill="#FE2C55"
        transform="translate(0.8, 0)"
        opacity="0.85"
      />
    </svg>
  );
}

export function PlatformBrandIcon({ platform, className, active }: PlatformBrandIconProps) {
  if (platform === 'weibo') {
    return (
      <WeiboBrandIcon
        className={cn(active ? 'text-[#C41230]' : 'text-[#8B1538]/70', className)}
      />
    );
  }
  if (platform === 'douyin') {
    return <DouyinBrandIcon className={className} />;
  }
  return null;
}
