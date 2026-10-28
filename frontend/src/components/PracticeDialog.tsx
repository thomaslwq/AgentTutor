import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  Lightbulb,
  MessageSquareQuote,
  RotateCcw,
  Send,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react';

import type { IAgentRole } from '@/data/agent-roles';
import type { IMessage } from '@/data/messages';
import { getScenarioByRoleId } from '@/data/practice';
import {
  evaluatePractice,
  generateCoachFeedback,
  generateRoleReply,
  type ICoachFeedback,
  type IPracticeReport,
} from '@/lib/practice-engine';

import ChatMessage from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const ROLE_GRADIENTS: Record<IAgentRole['color'], [string, string]> = {
  primary: ['#1E3A5F', '#3C5A80'],
  accent: ['#E87722', '#F2954E'],
  info: ['#3B82F6', '#60A5FA'],
  purple: ['#8B5CF6', '#A78BFA'],
};

interface PracticeDialogProps {
  role: IAgentRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function nowTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export default function PracticeDialog({ role, open, onOpenChange }: PracticeDialogProps) {
  const scenario = role ? getScenarioByRoleId(role.id) : undefined;

  const [turns, setTurns] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<ICoachFeedback | null>(null);
  const [report, setReport] = useState<IPracticeReport | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !scenario) return;
    setTurns([
      { id: 'opening', role: 'tutor', content: scenario.openingLine, timestamp: nowTime() },
    ]);
    setInput('');
    setFeedback(null);
    setReport(null);
  }, [open, scenario]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns, report]);

  const studentTurns = useMemo(() => turns.filter((turn) => turn.role === 'student'), [turns]);

  if (!role || !scenario) return null;

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || report) return;

    const reply = generateRoleReply(scenario.id, content, studentTurns.length);
    setTurns((prev) => [
      ...prev,
      { id: `s-${Date.now()}`, role: 'student', content, timestamp: nowTime() },
      { id: `r-${Date.now()}`, role: 'tutor', content: reply, timestamp: nowTime() },
    ]);
    setFeedback(generateCoachFeedback(scenario, content));
    setInput('');
  };

  const handleEnd = () => {
    if (studentTurns.length < 2) {
      toast.error('至少完成 2 轮对话再生成报告');
      return;
    }
    setReport(evaluatePractice(scenario, role, turns));
    toast.success('练习报告已生成');
  };

  const handleRestart = () => {
    setTurns([
      { id: 'opening', role: 'tutor', content: scenario.openingLine, timestamp: nowTime() },
    ]);
    setInput('');
    setFeedback(null);
    setReport(null);
  };

  const applyInspiration = (text: string) => {
    setInput(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border/40 px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <span
              className={`${role.bgClass} flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white`}
            >
              {role.shortCode}
            </span>
            <span>AI 角色陪练 · {role.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">{scenario.title}</DialogDescription>
        </DialogHeader>

        {report ? (
          <PracticeReport report={report} onRestart={handleRestart} onClose={() => onOpenChange(false)} />
        ) : (
          <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.55fr_1fr] md:overflow-hidden">
            {/* 对话区 */}
            <div className="flex min-h-0 flex-col border-b border-border/40 md:border-b-0 md:border-r">
              <div className="shrink-0 border-b border-border/30 bg-secondary/50 px-5 py-3">
                <p className="text-xs leading-relaxed text-muted-foreground">{scenario.background}</p>
              </div>

              <div className="max-h-[34vh] min-h-[220px] flex-1 space-y-4 overflow-y-auto px-5 py-4 md:max-h-none">
                {turns.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    tutorInitial={role.shortCode}
                    tutorGradient={ROLE_GRADIENTS[role.color]}
                  />
                ))}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="flex shrink-0 items-center gap-2 px-4 pt-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="以学员身份回应..."
                  className="h-10 flex-1 rounded-full border border-border/60 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="发送"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>

              <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
                <span className="text-[11px] text-muted-foreground">
                  已完成 {studentTurns.length} 轮 · 建议至少 2 轮
                </span>
                <Button variant="outline" size="sm" onClick={handleEnd}>
                  <Flag className="size-3.5" />
                  结束并生成报告
                </Button>
              </div>
            </div>

            {/* 教练面板 */}
            <aside className="space-y-4 px-4 py-4 md:max-h-none md:overflow-y-auto">
              <section>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <UserRound className="size-3.5 text-primary" />
                  角色档案
                </h4>
                <div className="mt-2 space-y-1.5 text-xs leading-relaxed">
                  <p className="text-muted-foreground">
                    <span className="text-foreground">身份：</span>
                    {role.persona.identity}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">性格：</span>
                    {role.persona.personality}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">语言：</span>
                    {role.persona.languageStyle}
                  </p>
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
                    内在诉求已隐藏，练习结束后在报告中揭示
                  </p>
                </div>
              </section>

              <section>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Target className="size-3.5 text-primary" />
                  练习目标
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {scenario.objectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#2FAE6E]" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Lightbulb className="size-3.5 text-accent" />
                  对话灵感
                </h4>
                <div className="mt-2 space-y-2">
                  {scenario.inspirations.map((inspiration) => (
                    <button
                      key={inspiration}
                      type="button"
                      onClick={() => applyInspiration(inspiration)}
                      className="w-full rounded-lg border border-border/50 bg-secondary/40 px-3 py-2 text-left text-xs leading-relaxed text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
                    >
                      {inspiration}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <MessageSquareQuote className="size-3.5 text-primary" />
                  实时点评
                </h4>
                {feedback ? (
                  <div
                    className={`mt-2 rounded-lg border px-3 py-2.5 ${
                      feedback.tone === 'positive'
                        ? 'border-[#2FAE6E]/30 bg-[#2FAE6E]/5'
                        : 'border-accent/30 bg-accent/5'
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold ${
                        feedback.tone === 'positive' ? 'text-[#2FAE6E]' : 'text-accent'
                      }`}
                    >
                      {feedback.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feedback.detail}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-foreground">
                      建议：{feedback.suggestion}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                    发出第一句回应后，这里会给出即时反馈。
                  </p>
                )}
              </section>
            </aside>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PracticeReport({
  report,
  onRestart,
  onClose,
}: {
  report: IPracticeReport;
  onRestart: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* 总分 */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-secondary/60 p-5">
          <div>
            <p className="text-xs text-muted-foreground">维度评分报告 · 共 {report.studentTurnCount} 轮对话</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {report.totalScore}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ 5.0</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">按各维度权重加权计算</p>
          </div>
          <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-full bg-accent text-white">
            <span className="text-[10px] opacity-80">评级</span>
            <span className="text-lg font-bold leading-tight">{report.level}</span>
          </div>
        </div>

        {/* 维度得分 */}
        <div className="grid gap-3 md:grid-cols-2">
          {report.dimensionResults.map((dimension) => (
            <div key={dimension.id} className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground">{dimension.name}</h4>
                <span className="text-sm font-bold text-foreground">
                  {dimension.score}
                  <span className="text-xs font-normal text-muted-foreground">
                    {' '}
                    /5 · 权重 {Math.round(dimension.weight * 100)}%
                  </span>
                </span>
              </div>
              <Progress value={dimension.score * 20} className="my-2 h-1.5" />
              <p className="text-xs leading-relaxed text-muted-foreground">{dimension.description}</p>
              <div className="mt-2 space-y-1">
                {dimension.evidence.map((quote, index) => (
                  <p key={`${dimension.id}-${index}`} className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-foreground">依据：</span>「{quote}」
                  </p>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{dimension.comment}</p>
            </div>
          ))}
        </div>

        {/* 三段反馈 */}
        <div className="grid gap-3 md:grid-cols-3">
          <ReportBlock
            icon={<TrendingUp className="size-4 text-[#2FAE6E]" />}
            title="做得好的"
            items={report.strengths}
            tone="green"
          />
          <ReportBlock
            icon={<AlertTriangle className="size-4 text-amber-600" />}
            title="待改进"
            items={report.improvements}
            tone="amber"
          />
          <ReportBlock
            icon={<Lightbulb className="size-4 text-accent" />}
            title="下一步建议"
            items={report.suggestions}
            tone="accent"
          />
        </div>

        {/* 内在诉求揭示 */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs font-semibold text-foreground">角色内在诉求（复盘揭示）</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{report.hiddenAgenda}</p>
        </div>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-border/40 px-5 py-3">
        <Button variant="outline" size="sm" onClick={onRestart}>
          <RotateCcw className="size-3.5" />
          再练一次
        </Button>
        <Button size="sm" onClick={onClose}>
          完成
        </Button>
      </div>
    </>
  );
}

function ReportBlock({
  icon,
  title,
  items,
  tone,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  tone: 'green' | 'amber' | 'accent';
}) {
  const bg =
    tone === 'green' ? 'bg-[#2FAE6E]/5' : tone === 'amber' ? 'bg-amber-500/5' : 'bg-accent/5';

  return (
    <div className={`rounded-xl border border-border/50 p-4 ${bg}`}>
      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {icon}
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-[11px] leading-relaxed text-muted-foreground">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
