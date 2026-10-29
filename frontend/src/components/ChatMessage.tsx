import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { IMessage } from '@/data/messages';

interface ChatMessageProps {
  message: IMessage;
  /** 导师头像字母，默认 T */
  tutorInitial?: string;
  /** 导师头像渐变色，传入后替代默认深蓝纯色 */
  tutorGradient?: [string, string];
  /** 导师真人头像图，传入后替代字母/渐变 */
  tutorAvatar?: string;
}

export default function ChatMessage({
  message,
  tutorInitial = 'T',
  tutorGradient,
  tutorAvatar,
}: ChatMessageProps) {
  const isStudent = message.role === 'student';
  // 导师头像图加载失败时回退为渐变底 + 首字
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={cn(
        'flex items-end gap-2 max-w-full',
        isStudent ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* 头像 */}
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden',
          !isStudent && !tutorGradient && 'bg-primary',
          isStudent && 'bg-accent'
        )}
        style={
          !isStudent && tutorGradient
            ? { background: `linear-gradient(135deg, ${tutorGradient[0]}, ${tutorGradient[1]})` }
            : undefined
        }
      >
        {isStudent ? (
          '学'
        ) : tutorAvatar && !imgFailed ? (
          <img
            src={tutorAvatar}
            alt={tutorInitial}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          tutorInitial
        )}
      </div>
      {/* 气泡 */}
      <div
        className={cn(
          'max-w-[75%] px-4 py-3 text-sm leading-relaxed',
          isStudent
            ? 'bg-muted/70 text-foreground rounded-2xl rounded-br-md'
            : 'bg-secondary text-foreground rounded-2xl rounded-bl-md'
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
