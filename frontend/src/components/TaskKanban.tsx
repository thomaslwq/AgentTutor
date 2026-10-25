import { useAutoAnimate } from '@formkit/auto-animate/react';
import { cn } from '@/lib/utils';
import type { ITask, TaskStatus } from '@/data/tasks';

interface TaskKanbanProps {
  tasks: ITask[];
  onTaskClick?: (task: ITask) => void;
}

const COLUMNS: { status: TaskStatus; label: string; dotClass: string }[] = [
  { status: 'todo', label: '待办', dotClass: 'bg-muted-foreground/50' },
  { status: 'in_progress', label: '进行中', dotClass: 'bg-accent' },
  { status: 'done', label: '已完成', dotClass: 'bg-success' },
];

const roleColorMap: Record<string, string> = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  info: 'bg-info',
  purple: 'bg-[rgb(139_92_246)]',
};

export default function TaskKanban({ tasks, onTaskClick }: TaskKanbanProps) {
  const [parent] = useAutoAnimate({ duration: 250 });

  return (
    <div className="grid grid-cols-3 gap-3" ref={parent}>
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('size-2 rounded-full shrink-0', col.dotClass)} />
              <span className="text-sm font-medium text-foreground">{col.label}</span>
              <span className="text-xs text-muted-foreground">{colTasks.length}</span>
            </div>
            <div className="space-y-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="rounded-lg border border-border/40 bg-secondary/30 p-3 cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="text-sm text-foreground leading-snug mb-2">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-2 rounded-full shrink-0',
                        roleColorMap[task.roleColor] ?? 'bg-muted-foreground'
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{task.roleName}</span>
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/40 p-4 text-center text-xs text-muted-foreground">
                  暂无任务
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
