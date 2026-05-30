'use client';

import { Fragment } from 'react';

/** 高亮 #话题 和 @用户 */
export function HighlightSocialText({ text }: { text: string }) {
  if (!text) {
    return <span className="text-muted-foreground/60">输入内容后显示...</span>;
  }

  const parts = text.split(/(#[\w\u4e00-\u9fff]+|@[\w\u4e00-\u9fff]+)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('#')) {
          return (
            <span key={i} className="text-[#FF8200] font-medium">
              {part}
            </span>
          );
        }
        if (part.startsWith('@')) {
          return (
            <span key={i} className="text-[#576B95] font-medium">
              {part}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
