import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { Send, MessageCircle, FileCheck, Sparkles, CircleDot } from 'lucide-react';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { MOCK_TUTOR, type ITutor } from '@/data/tutor';
import { MOCK_MESSAGES, type IMessage } from '@/data/messages';
import { MOCK_COURSES } from '@/data/courses';
import { MOCK_HOMEWORK_FEEDBACK } from '@/data/homework';
import { getTutorReply } from '@/data/tutor-replies';
import { MOCK_AGENT_ROLES } from '@/data/agent-roles';
import { MOCK_TASKS, type ITask, type TaskStatus } from '@/data/tasks';
import { MOCK_PROJECTS } from '@/data/projects';
import { MOCK_COMMUNICATIONS } from '@/data/communications';

import ChatMessage from '@/components/ChatMessage';
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

export default function DashboardPage() {
  const tutor: ITutor = MOCK_TUTOR;
  const course = MOCK_COURSES.find((c) => c.status === 'ongoing')!;
  const project = MOCK_PROJECTS[0];
  const homework = MOCK_HOMEWORK_FEEDBACK;

  // 对话
  const [messages, setMessages] = useState<IMessage[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 作业反馈展开
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackParent] = useAutoAnimate({ duration: 300 });

  // 看板任务
  const [tasks, setTasks] = useState<ITask[]>(
    MOCK_TASKS.filter((t) => t.projectId === project.id)
  );

  const projectRoles = useMemo(() => MOCK_AGENT_ROLES, []);
  const projectComms = useMemo(
    () => MOCK_COMMUNICATIONS.filter((c) => c.projectId === project.id),
    [project.id]
  );

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTutorTyping]);

  // 发送消息
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const content = inputValue.trim();
    if (!content) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const studentMsg: IMessage = {
      id: `s-${Date.now()}`,
      role: 'student',
      content,
      timestamp: timeStr,
    };
    setMessages((prev) => [...prev, studentMsg]);
    setInputValue('');
    setIsTutorTyping(true);

    // 模拟导师思考延迟
    setTimeout(() => {
      const reply = getTutorReply(content);
      const tutorMsg: IMessage = {
        id: `t-${Date.now()}`,
        role: 'tutor',
        content: reply,
        timestamp: timeStr,
      };
      setMessages((prev) => [...prev, tutorMsg]);
      setIsTutorTyping(false);
    }, 900);
  };

  // 任务状态切换
  const handleTaskClick = (task: ITask) => {
    const nextStatus = STATUS_CYCLE[task.status];
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    toast.success(`已移至「${STATUS_LABEL[nextStatus]}」`);
  };

  return (
    <div className="w-full py-6 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ========== 左栏：数字人导师工作台 ========== */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* 导师卡 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="size-16 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {tutor.avatarInitial}
                </div>
                {tutor.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-success border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-lg font-bold text-foreground">{tutor.name}</h2>
                  <StatusBadge
                    status="ongoing"
                    label="7×24 在线"
                    dot
                    className="text-[11px] px-2 py-0.5"
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tutor.description}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {tutor.totalAnswers.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">累计答疑</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {tutor.satisfactionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">学员满意度</div>
                </div>
              </div>
            </div>
          </div>

          {/* 课程进度卡 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{course.title}</h3>
              <span className="text-sm text-muted-foreground">
                第 {course.currentLesson} / {course.lessonCount} 课
              </span>
            </div>
            <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                已完成 {Math.floor(course.lessonCount * (course.progress / 100))} 课，进度{' '}
                {course.progress}%
              </span>
              <span>预计剩余 3 周</span>
            </div>
          </div>

          {/* 答疑对话面板 */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" />
                <h3 className="font-semibold text-foreground">课程答疑陪练</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <Sparkles className="size-3.5" />
                AI 实时解答中
              </div>
            </div>

            <div className="px-4 py-4 space-y-4 max-h-[380px] overflow-y-auto bg-background/30">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTutorTyping && (
                <div className="flex items-end gap-2">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                    T
                  </div>
                  <div className="bg-secondary text-foreground rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-3 border-t border-border/30 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入你的问题，随时向导师提问..."
                className="flex-1 h-10 px-4 rounded-full border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTutorTyping}
                className="shrink-0 size-10 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="发送"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>

          {/* 作业批改卡 */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden" ref={feedbackParent}>
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileCheck className="size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5">{homework.title}</h3>
                  <p className="text-sm text-muted-foreground">{homework.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {homework.knowledgeScore}/5
                    </div>
                    <div className="text-xs text-muted-foreground">知识点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {homework.engineeringScore}/5
                    </div>
                    <div className="text-xs text-muted-foreground">工程落地</div>
                  </div>
                  <button
                    onClick={() => setShowFeedback((v) => !v)}
                    className="h-10 px-4 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap"
                  >
                    {showFeedback ? '收起反馈' : '查看反馈'}
                  </button>
                </div>
              </div>
            </div>

            {showFeedback && (
              <div className="border-t border-border/30 px-5 py-4 space-y-4 bg-background/40">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-success" />
                    优点
                  </h4>
                  <ul className="space-y-1.5">
                    {homework.feedback.strengths.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-success shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent" />
                    待改进项
                  </h4>
                  <ul className="space-y-1.5">
                    {homework.feedback.improvements.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CircleDot className="size-4 text-primary" />
                    导师讲解建议
                  </h4>
                  <ul className="space-y-1.5">
                    {homework.feedback.suggestions.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== 右栏：多智能体实战平台 ========== */}
        <div className="flex-1 min-w-0 xl:max-w-[58%] space-y-5">
          {/* 项目标题条 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">
                  实战项目：{project.title}
                </h2>
                <p className="text-sm text-muted-foreground">{project.subtitle}</p>
              </div>
              <StatusBadge status={project.status} label={project.statusLabel} dot />
            </div>
          </div>

          {/* 智能体角色 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">实战智能体角色</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {projectRoles.map((role) => (
                <RoleCard key={role.id} role={role} compact />
              ))}
            </div>
          </div>

          {/* 任务看板 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">任务看板</h3>
            <p className="text-xs text-muted-foreground mb-4">
              点击任务卡片可在「待办 → 进行中 → 已完成」之间切换状态
            </p>
            <TaskKanban tasks={tasks} onTaskClick={handleTaskClick} />
          </div>

          {/* 角色通信 */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">角色通信 · 协作消息</h3>
            <div className="space-y-3">
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
                      <span className="text-sm font-medium text-foreground">{com.roleName}</span>
                      <span className="text-xs text-muted-foreground">{com.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{com.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
