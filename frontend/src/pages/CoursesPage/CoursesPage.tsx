import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  ChevronDown,
  CheckCircle,
  Clock,
  FileText,
  Star,
  ShoppingBag,
  GraduationCap,
  LayoutGrid,
  Bot,
  MessageSquareText,
  BriefcaseBusiness,
  Users,
} from 'lucide-react';

import {
  MOCK_COURSES,
  CATEGORY_MAP,
  type ICourse,
  type IChapter,
  type CourseCategory,
} from '@/data/courses';
import { MOCK_TUTORS } from '@/data/tutor';
import { useAppStore } from '@/store/AppContext';
import StatusBadge from '@/components/StatusBadge';
import TutorAvatar from '@/components/TutorAvatar';
import PurchaseDialog from './PurchaseDialog';

/** 品类展示信息（图标 + 文案） */
const CATEGORY_INFO: Record<
  CourseCategory,
  { label: string; description: string; icon: typeof Bot }
> = {
  'agent-dev': {
    label: CATEGORY_MAP['agent-dev'],
    description: '大模型原理、多智能体协作到 RAG 与工程化落地',
    icon: Bot,
  },
  prompt: {
    label: CATEGORY_MAP.prompt,
    description: '写出稳定可控的高质量 Prompt，让 AI 输出精准可控',
    icon: MessageSquareText,
  },
  'ai-office': {
    label: CATEGORY_MAP['ai-office'],
    description: 'AI 提效日常办公与内容创作，即学即用',
    icon: BriefcaseBusiness,
  },
  'ai-mgmt': {
    label: CATEGORY_MAP['ai-mgmt'],
    description: '面向管理者的 AI 落地课，用智能体重塑团队效能与决策',
    icon: Users,
  },
};

const CATEGORY_ORDER: CourseCategory[] = ['agent-dev', 'prompt', 'ai-office', 'ai-mgmt'];

const statusLabelMap: Record<IChapter['status'], string> = {
  learned: '已学',
  learning: '进行中',
  not_started: '未开始',
};

export default function CoursesPage() {
  const { state } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_COURSES[0].id);
  const [purchaseCourse, setPurchaseCourse] = useState<ICourse | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | CourseCategory>('all');
  const [parent] = useAutoAnimate({ duration: 300 });

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const visibleCategories: CourseCategory[] =
    activeCategory === 'all' ? CATEGORY_ORDER : [activeCategory];

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 标题区 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
          <ShoppingBag className="size-3.5" />
          多品类课程 · 购买后导师全程引导学习
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">课程商城</h1>
        <p className="text-muted-foreground">
          四大品类 9 门课程，每门课都有专属数字人导师 · 余额支付即时开通
        </p>
      </div>

      {/* 品类筛选 Tab */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        <CategoryTab
          label="全部课程"
          count={MOCK_COURSES.length}
          icon={LayoutGrid}
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {CATEGORY_ORDER.map((cat) => (
          <CategoryTab
            key={cat}
            label={CATEGORY_INFO[cat].label}
            count={MOCK_COURSES.filter((c) => c.category === cat).length}
            icon={CATEGORY_INFO[cat].icon}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* 按品类分组渲染 */}
      <div className="space-y-12" ref={parent}>
        {visibleCategories.map((category) => {
          const courses = MOCK_COURSES.filter((c) => c.category === category);
          const info = CATEGORY_INFO[category];
          const Icon = info.icon;
          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-accent rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-foreground inline-flex items-center gap-2">
                    <Icon className="size-5 text-primary" />
                    {info.label}
                    <span className="text-xs font-medium text-muted-foreground">
                      {courses.length} 门
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    purchased={state.purchasedCourseIds.includes(course.id)}
                    progressOverride={state.courseProgress[course.id]}
                    isExpanded={expandedId === course.id}
                    onToggle={() => handleToggle(course.id)}
                    onBuy={() => setPurchaseCourse(course)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 购买弹窗 */}
      {purchaseCourse && (
        <PurchaseDialog
          course={purchaseCourse}
          open={!!purchaseCourse}
          onOpenChange={(v) => !v && setPurchaseCourse(null)}
        />
      )}
    </div>
  );
}

interface CategoryTabProps {
  label: string;
  count: number;
  icon: typeof Bot;
  active: boolean;
  onClick: () => void;
}

function CategoryTab({ label, count, icon: Icon, active, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        active
          ? 'bg-primary text-white shadow-sm'
          : 'bg-card text-muted-foreground border border-border/40 hover:text-foreground hover:border-border'
      }`}
    >
      <Icon className="size-4" />
      {label}
      <span className={`text-xs ${active ? 'text-white/70' : 'text-muted-foreground/70'}`}>
        {count}
      </span>
    </button>
  );
}

interface CourseCardProps {
  course: ICourse;
  purchased: boolean;
  progressOverride?: { currentLesson: number; progressPercent: number };
  isExpanded: boolean;
  onToggle: () => void;
  onBuy: () => void;
}

function CourseCard({
  course,
  purchased,
  progressOverride,
  isExpanded,
  onToggle,
  onBuy,
}: CourseCardProps) {
  const [chaptersParent] = useAutoAnimate({ duration: 300 });

  const progress = progressOverride?.progressPercent ?? course.progress;
  const currentLesson = progressOverride?.currentLesson ?? course.currentLesson;
  const showProgress =
    purchased && (course.status === 'ongoing' || course.status === 'completed' || progress > 0);

  const tutor = MOCK_TUTORS.find((t) => t.id === course.recommendedTutorId);
  const CategoryIcon = CATEGORY_INFO[course.category].icon;

  return (
    <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="w-full p-5 flex items-start gap-4">
        <button
          onClick={onToggle}
          className="flex items-start gap-4 flex-1 min-w-0 text-left"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CategoryIcon className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h3 className="font-semibold text-foreground">{course.title}</h3>
            <span className="text-[11px] font-medium text-primary bg-primary/5 border border-primary/15 px-2 py-0.5 rounded-full whitespace-nowrap">
              {CATEGORY_MAP[course.category]}
            </span>
            <StatusBadge
              status={course.status}
              label={
                course.status === 'ongoing'
                  ? '进行中'
                  : course.status === 'completed'
                  ? '已完成'
                  : purchased
                  ? '已购 · 未开始'
                  : '未开始'
              }
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
            <span>共 {course.lessonCount} 课</span>
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 text-accent fill-accent" />
              {course.rating}
            </span>
            <span>{course.studentCount.toLocaleString()} 人在学</span>
            {tutor && (
              <span className="inline-flex items-center gap-1.5">
                <TutorAvatar
                  gradient={tutor.gradient}
                  initial={tutor.avatarInitial}
                  src={tutor.avatar}
                  size={18}
                />
                {tutor.name} 主讲
              </span>
            )}
            {purchased && course.status === 'ongoing' && currentLesson && (
              <span>· 第 {currentLesson} 课进行中</span>
            )}
          </div>

          {showProgress && (
            <div className="mt-3">
              <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden max-w-md">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    course.status === 'completed'
                      ? 'bg-success'
                      : 'bg-gradient-to-r from-primary to-accent'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">进度 {progress}%</div>
            </div>
          )}
          </div>
        </button>

        {/* 价格 + 操作 */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          {purchased ? (
            <Link
              to={`/learning/${course.id}`}
              className="h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-1.5"
            >
              <GraduationCap className="size-4" />
              开始学习
            </Link>
          ) : (
            <>
              <div className="text-right">
                <span className="text-xl font-bold text-accent">¥{course.price}</span>
                {course.originalPrice && (
                  <span className="ml-1.5 text-xs text-muted-foreground line-through">
                    ¥{course.originalPrice}
                  </span>
                )}
              </div>
              <button
                onClick={onBuy}
                className="h-9 px-4 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                立即购买
              </button>
            </>
          )}
        </div>

        <button
          onClick={onToggle}
          aria-label={isExpanded ? '收起章节' : '展开章节'}
          className="shrink-0 mt-1 rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <ChevronDown
            className={`size-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-border/30 bg-background/30" ref={chaptersParent}>
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
