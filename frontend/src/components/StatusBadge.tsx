import { cn } from '@/lib/utils';

const statusVariantMap: Record<string, string> = {
  ongoing: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary',
  not_started: 'bg-muted-foreground/10 text-muted-foreground',
  pending: 'bg-accent/10 text-accent',
  scored: 'bg-success/10 text-success',
  learned: 'bg-success/10 text-success',
  learning: 'bg-accent/10 text-accent',
  not_started_chapter: 'bg-muted-foreground/10 text-muted-foreground',
};

interface StatusBadgeProps {
  status: string;
  label: string;
  dot?: boolean;
  className?: string;
}

export default function StatusBadge({ status, label, dot = false, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] ?? statusVariantMap.not_started;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        variant,
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
