import { useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ChevronDown, Play, CheckCircle, Clock, FileText } from 'lucide-react';

import { MOCK_COURSES, type ICourse, type IChapter } from '@/data/courses';
import StatusBadge from '@/components/StatusBadge';

const STAGE_MAP: Record<string, { label: string; description: string }> = {
  foundation: {
    label: 'Agent 原理入门',
    description: '打好大模型与单 Agent 基础，理解核心原理与工具调用',
  },
  collaboration: {
    label: '多智能体协作架构',
    description: '掌握角色分工、任务分派与通信协议，构建多智能体系统',
  },
  engineering: {
    label: '工程化落地',
    description: '前后端分离、实时通信与多供应商路由，工程化实战能力',
  },
};

const statusLabelMap: Record<IChapter['status'], string> = {
  learned: '已学',
  learning: '进行中',
  not_started: '未开始',
};

export default function CurriculumPage() {
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_COURSES[0].id);
  const [parent] = useAutoAnimate({ duration: 300 });

  const stages = ['foundation', 'collaboration', 'engineering'] as const;

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 标题区 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-3">实战课程体系</h1>
        <p className="text-muted-foreground">
          原理到项目实战分阶段递进，代码可复现
        </p>
      </div>

      <div className="space-y-12" ref={parent}>
        {stages.map((stage) => {
          const courses = MOCK_COURSES.filter((c) => c.stage === stage);
          const stageInfo = STAGE_MAP[stage];
          return (
            <section key={stage}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-accent rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{stageInfo.label}</h2>
                  <p className="text-sm text-muted-foreground">{stageInfo.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isExpanded={expandedId === course.id}
                    onToggle={() => handleToggle(course.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: ICourse;
  isExpanded: boolean;
  onToggle: () => void;
}

function CourseCard({ course, isExpanded, onToggle }: CourseCardProps) {
  const [chaptersParent] = useAutoAnimate({ duration: 300 });

  return (
    <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left"
      >
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Play className="size-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
            <StatusBadge
              status={course.status}
              label={
                course.status === 'ongoing'
                  ? '进行中'
                  : course.status === 'completed'
                  ? '已完成'
                  : '未开始'
              }
            />
          </div>
          <div className="text-sm text-muted-foreground">
            共 {course.lessonCount} 课
            {course.status === 'ongoing' && course.currentLesson && (
              <span className="ml-2">· 第 {course.currentLesson} 课进行中</span>
            )}
          </div>

          {(course.status === 'ongoing' || course.status === 'completed') && (
            <div className="mt-3">
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden max-w-md">
                <div
                  className={`h-full rounded-full transition-all ${
                    course.status === 'completed'
                      ? 'bg-success'
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                进度 {course.progress}%
              </div>
            </div>
          )}
        </div>

        <ChevronDown
          className={`size-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div
          className="border-t border-border/30 bg-background/30"
          ref={chaptersParent}
        >
          <div className="p-4 space-y-2">
            {course.chapters.map((chapter) => (
              <ChapterRow key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChapterRow({ chapter }: { chapter: IChapter }) {
  const isLearned = chapter.status === 'learned';
  const isLearning = chapter.status === 'learning';

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card/60 transition-colors">
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center">
        {isLearned ? (
          <CheckCircle className="size-5 text-success" />
        ) : isLearning ? (
          <div className="size-5 rounded-full border-2 border-accent flex items-center justify-center">
            <span className="size-2 rounded-full bg-accent" />
          </div>
        ) : (
          <div className="size-5 rounded-full border-2 border-border flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground font-medium">
              {chapter.lessonNo}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium truncate ${
            isLearned ? 'text-muted-foreground' : 'text-foreground'
          }`}
        >
          第 {chapter.lessonNo} 课 · {chapter.title}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {chapter.hasAssignment && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="size-3.5" />
            含作业
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {chapter.duration}
        </div>
        <StatusBadge
          status={chapter.status === 'not_started' ? 'not_started_chapter' : chapter.status}
          label={statusLabelMap[chapter.status]}
          className="text-[11px]"
        />
      </div>
    </div>
  );
}
