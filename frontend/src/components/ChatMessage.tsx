import { cn } from '@/lib/utils';
import type { IMessage } from '@/data/messages';

interface ChatMessageProps {
  message: IMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isStudent = message.role === 'student';

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
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
          isStudent ? 'bg-accent' : 'bg-primary'
        )}
      >
        {isStudent ? '学' : 'T'}
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
