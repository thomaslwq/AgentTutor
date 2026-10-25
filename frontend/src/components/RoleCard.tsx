import type { IAgentRole } from '@/data/agent-roles';

interface RoleCardProps {
  role: IAgentRole;
  compact?: boolean;
}

export default function RoleCard({ role, compact = false }: RoleCardProps) {
  return (
    <div
      className={`rounded-xl border border-border/60 bg-card flex items-center gap-3 transition-all hover:shadow-md ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div
        className={`${role.bgClass} text-white font-bold rounded-lg flex items-center justify-center shrink-0 ${
          compact ? 'size-9 text-xs' : 'size-11 text-sm'
        }`}
      >
        {role.shortCode}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-foreground text-sm">{role.name}</div>
        <div className="text-xs text-muted-foreground">{role.description}</div>
      </div>
    </div>
  );
}
