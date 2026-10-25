import { useState, useMemo, FormEvent } from 'react';
import { toast } from 'sonner';
import { Users, Bot, Send } from 'lucide-react';

import { MOCK_PROJECTS, type IProject } from '@/data/projects';
import { MOCK_TASKS, type ITask, type TaskStatus } from '@/data/tasks';
import { MOCK_AGENT_ROLES } from '@/data/agent-roles';
import { MOCK_COMMUNICATIONS } from '@/data/communications';

import RoleCard from '@/components/RoleCard';
import TaskKanban from '@/components/TaskKanban';
import StatusBadge from '@/components/StatusBadge';

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
};

export default function PlatformPage() {
  const [selectedId, setSelectedId] = useState(MOCK_PROJECTS[0].id);
  const [tasks, setTasks] = useState<ITask[]>(MOCK_TASKS);
  const [comms, setComms] = useState(MOCK_COMMUNICATIONS);
  const [newMsg, setNewMsg] = useState('');

  const selectedProject = useMemo(
    () => MOCK_PROJECTS.find((p) => p.id === selectedId)!,
    [selectedId]
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === selectedId),
    [tasks, selectedId]
  );

  const projectComms = useMemo(
    () => comms.filter((c) => c.projectId === selectedId),
    [comms, selectedId]
  );

  const handleTaskClick = (task: ITask) => {
    const nextStatus = STATUS_CYCLE[task.status];
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    toast.success(`已移至「${STATUS_LABEL[nextStatus]}」`);
  };

  const handleSendMsg = (e: FormEvent) => {
    e.preventDefault();
    const content = newMsg.trim();
    if (!content) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setComms((prev) => [
      ...prev,
      {
        id: `com-${Date.now()}`,
        roleId: 'pm',
        roleName: '学员（我）',
        roleColor: 'accent',
        content,
        timestamp: timeStr,
        projectId: selectedId,
      },
    ]);
    setNewMsg('');
    toast.success('消息已发送');
  };

  return (
    <div className="w-full py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">实战平台</h1>
          <p className="text-sm text-muted-foreground">
            多智能体协作实战项目，边学边练，代码可复现
          </p>
        </div>

        {/* 项目切换卡 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {MOCK_PROJECTS.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              isActive={p.id === selectedId}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>

        {/* 项目详情 */}
        <div className="space-y-5">
          {/* 项目标题条 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  实战项目：{selectedProject.title}
                </h2>
                <p className="text-sm text-muted-foreground">{selectedProject.subtitle}</p>
              </div>
              <StatusBadge
                status={selectedProject.status}
                label={selectedProject.statusLabel}
                dot
              />
            </div>
          </div>

          {/* 智能体角色 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">智能体角色</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MOCK_AGENT_ROLES.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </div>

          {/* 任务看板 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">任务看板</h3>
              <p className="text-xs text-muted-foreground">
                点击任务卡片切换状态：待办 → 进行中 → 已完成
              </p>
            </div>
            <TaskKanban tasks={projectTasks} onTaskClick={handleTaskClick} />
          </div>

          {/* 角色通信 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">角色通信 · 协作消息</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {projectComms.map((com) => (
                <div key={com.id} className="flex items-start gap-3">
                  <div
                    className={`shrink-0 px-2 py-1 rounded-md text-white text-xs font-bold ${
                      com.roleColor === 'primary'
                        ? 'bg-primary'
                        : com.roleColor === 'accent'
                        ? 'bg-accent'
                        : com.roleColor === 'info'
                        ? 'bg-info'
                        : 'bg-[rgb(139_92_246)]'
                    }`}
                  >
                    {com.roleName.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {com.roleName}
                      </span>
                      <span className="text-xs text-muted-foreground">{com.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{com.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMsg}
              className="flex items-center gap-2 pt-3 border-t border-border/30"
            >
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="以产品经理身份发送协作消息..."
                className="flex-1 h-10 px-4 rounded-full border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={!newMsg.trim()}
                className="size-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="发送"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: IProject;
  isActive: boolean;
  onClick: () => void;
}

function ProjectCard({ project, isActive, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border p-5 transition-all hover:shadow-md ${
        isActive
          ? 'bg-card border-accent/50 ring-2 ring-accent/20 shadow-md'
          : 'bg-card/60 border-border/40 hover:border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground text-base">{project.title}</h3>
        <StatusBadge
          status={project.status}
          label={project.statusLabel}
          dot
          className="text-[11px]"
        />
      </div>
      <p className="text-xs text-muted-foreground mb-4">{project.subtitle}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          <span>{project.studentCount} 名学员</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Bot className="size-3.5" />
          <span>{project.roleCount} 个角色</span>
        </div>
      </div>
    </button>
  );
}
