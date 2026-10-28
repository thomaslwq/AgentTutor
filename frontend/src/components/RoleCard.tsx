import { PlayCircle } from 'lucide-react';

import type { IAgentRole } from '@/data/agent-roles';

interface RoleCardProps {
  role: IAgentRole;
  compact?: boolean;
  onPractice?: () => void;
}

export default function RoleCard({ role, compact = false, onPractice }: RoleCardProps) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-border/60 bg-card transition-all hover:shadow-md ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${role.bgClass} shrink-0 rounded-lg font-bold text-white flex items-center justify-center ${
            compact ? 'size-9 text-xs' : 'size-11 text-sm'
          }`}
        >
          {role.shortCode}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground">{role.name}</div>
          <div className="text-xs text-muted-foreground">{role.description}</div>
        </div>
      </div>

      {onPractice && (
        <button
          type="button"
          onClick={onPractice}
          className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
        >
          <PlayCircle className="size-3.5" />
          开始陪练
        </button>
      )}
    </div>
  );
}
