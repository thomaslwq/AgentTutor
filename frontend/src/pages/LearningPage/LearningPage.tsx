import { useState, useRef, useEffect, useMemo, FormEvent, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  Send,
  GraduationCap,
  ShoppingBag,
  UserRoundCheck,
  CheckCircle2,
  CircleDot,
  FileCheck,
  HelpCircle,
  Clock,
  FileText,
  BookOpenText,
  Pause,
  Play,
  RotateCcw,
  ListChecks,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  Hand,
  ThumbsUp,
} from 'lucide-react';

import { MOCK_COURSES, type ICourse, type IChapter } from '@/data/courses';
import { getTutorById, type ITutor } from '@/data/tutor';
import { getTutorReply } from '@/data/tutor-replies';
import type { IMessage } from '@/data/messages';
import { MOCK_HOMEWORK_FEEDBACK } from '@/data/homework';
import { useAppStore } from '@/store/AppContext';
import ChatMessage from '@/components/ChatMessage';
import TutorAvatar from '@/components/TutorAvatar';

/** 快捷指令：点击即向导师发送固定提问 */
const QUICK_ACTIONS = [
  { label: '讲解本章重点', query: '讲解本章重点' },
  { label: '继续学习', query: '继续学习' },
  { label: '布置练习', query: '布置练习' },
];

function nowTime(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/** PPT 课件页：数字人"对着这一页"讲 script 这段话，讲完自动翻页 */
interface ISlide {
  kind: 'cover' | 'concept' | 'flow' | 'practice' | 'summary';
  title: string;
  subtitle?: string;
  bullets?: string[];
  steps?: string[];
  task?: string;
  hasAssignment?: boolean;
  script: string;
}

/** 按导师人设取话术 */
function voice(tutor: ITutor, lines: Record<string, string | undefined> & { default: string }): string {
  return lines[tutor.id] ?? lines.default;
}

/** 生成本课的 PPT 课件（原型 mock：按章节标题派生 5 页，参考 reveal.js 的分页/逐条结构） */
function getLessonSlides(tutor: ITutor, course: ICourse, chapter: IChapter): ISlide[] {
  const T = chapter.title;
  const opening = getLectureScript(tutor, chapter, chapter.lessonNo, course.lessonCount);

  const conceptScript = voice(tutor, {
    'xiao-nuan': `先看这一页的三个要点，别急着背定义。你就记住「${T}」解决什么问题、边界在哪，剩下的我们一点点来～`,
    'lao-k': `概念部分我不念稿。盯着这三条：解决什么问题、角色怎么接、和相邻概念差在哪，判断标准就在里面。`,
    'gu-yan': `先建立认知框架：这三条讲清了「${T}」解决什么问题。放到团队里怎么用，下一页流程展开。`,
    default: `这一页把「${T}」的概念讲清楚：注意每条的适用边界，这是后面避免误用的关键。`,
  });

  const flowScript = voice(tutor, {
    'xiao-nuan': `接下来按流程走一遍～从定目标到沉淀结果，四步走完，你对「${T}」就有整体感觉啦。`,
    'lao-k': `流程这页照着走，四步缺一不可。尤其第三步协作执行，实战项目里最容易出问题。`,
    'gu-yan': `流程落到团队上就是分工：谁定目标、谁拆解、谁执行、谁验收，对号入座。`,
    default: `按这四步走：每一步的输出是下一步的输入，实践中最常见的错误就是跳步。`,
  });

  const practiceScript = voice(tutor, {
    'xiao-nuan': `轮到你动手啦～${chapter.hasAssignment ? '完成配套练习记得交给我，我会认真批改给你反馈哦' : '在实战项目里找到对应场景动手点一点，试过才算学会'}。`,
    'lao-k': `动手环节。${chapter.hasAssignment ? '作业别拖，写完就提交，我按工程标准批。' : '去实战项目把对应模块跑一遍，跑不通随时截屏问我。'}`,
    'gu-yan': `这一页是行动清单：学完这节，回团队先做哪件事，想清楚再动手。`,
    default: `现在轮到你：${chapter.hasAssignment ? '完成本课作业，导师会逐条批改。' : '对照实战项目演练一遍，加深理解。'}`,
  });

  const summaryScript = voice(tutor, {
    'xiao-nuan': `小结一下～这三条记住，这一课就没白学。累的话休息一下再继续，我一直在哦～`,
    'lao-k': `收尾。三条要点能自己复述出来，这课就算过；复述不出来，翻回去重看。`,
    'gu-yan': `本课小结：把这三条带回你的管理场景，下周复盘我们再看落地效果。`,
    default: `本课小结：三条要点构成完整闭环，下一课会在这个基础上继续深入。`,
  });

  return [
    {
      kind: 'cover',
      title: `第 ${chapter.lessonNo} 课 · ${T}`,
      subtitle: `${course.title} · 主讲 ${tutor.name}`,
      script: opening,
    },
    {
      kind: 'concept',
      title: `核心概念：${T}`,
      bullets: [
        `${T} 要解决的核心问题与适用边界`,
        `关键角色与输入输出：谁发起、谁承接、产出什么`,
        `常见误区：与相邻概念的区别和联系`,
      ],
      script: conceptScript,
    },
    {
      kind: 'flow',
      title: `「${T}」运行流程`,
      steps: ['明确目标与输入', '按规则拆解任务', '智能体协作执行', '校验结果并沉淀'],
      script: flowScript,
    },
    {
      kind: 'practice',
      title: '动手实战',
      task: chapter.hasAssignment
        ? `完成「${T}」配套练习并提交，导师将逐条批改反馈`
        : `跟随讲解，在实战项目中找到「${T}」对应场景并演练一遍`,
      hasAssignment: chapter.hasAssignment,
      script: practiceScript,
    },
    {
      kind: 'summary',
      title: '本课小结',
      bullets: [
        `${T}：概念与边界已建立框架`,
        `四步流程可直接套用到实战项目`,
        chapter.hasAssignment ? `作业提交后等待导师批改反馈` : `完成场景演练，沉淀个人学习笔记`,
      ],
      script: summaryScript,
    },
  ];
}

/** 数字人讲解词（按导师人设生成） */
function getLectureScript(tutor: ITutor, chapter: IChapter, lessonNo: number, total: number): string {
  if (tutor.id === 'xiao-nuan') {
    return `这一节我们学「${chapter.title}」，大概 ${chapter.duration}。别担心内容多，我会把最关键的几点掰开揉碎讲给你听，随时打断我问问题哦～`;
  }
  if (tutor.id === 'lao-k') {
    return `第 ${lessonNo} 课「${chapter.title}」，时长 ${chapter.duration}。不讲虚的，直接过干货，边讲边对着你的实战项目找对应场景，学完就能用。`;
  }
  if (tutor.id === 'gu-yan') {
    return `第 ${lessonNo} / ${total} 课：「${chapter.title}」。这一节我们从一个真实团队案例切入，先看问题怎么发生，再看 AI 工具怎么介入，最后落到你团队可以直接用的动作清单。`;
  }
  return `第 ${lessonNo} / ${total} 课：${chapter.title}。这一节的核心是把「${chapter.title}」放进整体架构里理解——先建立框架，再看细节，最后落到工程实践。`;
}

export default function LearningPage() {
  const { courseId } = useParams<{ courseId?: string }>();

  if (!courseId) return <MyCourseList />;
  return <LearningRoom courseId={courseId} />;
}

/** /learning：已购课程列表 */
function MyCourseList() {
  const { state } = useAppStore();
  const purchased = MOCK_COURSES.filter((c) => state.purchasedCourseIds.includes(c.id));

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">我的学习</h1>
        <p className="text-muted-foreground">已购课程都会在这里，导师将引导你逐课完成</p>
      </div>

      {purchased.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-12 text-center">
          <GraduationCap className="size-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">还没有已购课程</p>
          <p className="text-sm text-muted-foreground mb-6">去课程商城选购一门课，开始你的学习之旅</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <ShoppingBag className="size-4" />
            去课程商城
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {purchased.map((course) => {
            const override = state.courseProgress[course.id];
            const progress = override?.progressPercent ?? course.progress;
            const currentLesson = override?.currentLesson ?? course.currentLesson;
            return (
              <div
                key={course.id}
                className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground leading-snug">{course.title}</h3>
                  <span className="shrink-0 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    共 {course.lessonCount} 课
                  </span>
                </div>
                <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      course.status === 'completed'
                        ? 'bg-success'
                        : 'bg-gradient-to-r from-primary to-accent'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">进度 {progress}%</span>
                  {currentLesson && course.status !== 'completed' && (
                    <span className="text-xs text-muted-foreground">第 {currentLesson} 课进行中</span>
                  )}
                </div>
                <Link
                  to={`/learning/${course.id}`}
                  className="mt-auto h-10 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="size-4" />
                  {course.status === 'completed' ? '重新学习' : '继续学习'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** /learning/:courseId：数字人课堂（上：数字人 + 课件；下：互动对话） */
function LearningRoom({ courseId }: { courseId: string }) {
  const { state, dispatch } = useAppStore();
  const course = MOCK_COURSES.find((c) => c.id === courseId);
  const tutor = getTutorById(state.selectedTutorId);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackParent] = useAutoAnimate({ duration: 300 });

  const override = course ? state.courseProgress[course.id] : undefined;
  const currentLesson = override?.currentLesson ?? course?.currentLesson ?? 1;
  const progressPercent = override?.progressPercent ?? course?.progress ?? 0;
  const [viewingLessonNo, setViewingLessonNo] = useState(currentLesson);
  const [lectureKey, setLectureKey] = useState(0); // 重新讲解时触发解说词淡入
  const [chatOpen, setChatOpen] = useState(false); // 课堂内嵌对话抽屉
  const drawerChatEndRef = useRef<HTMLDivElement>(null);
  const drawerInputRef = useRef<HTMLInputElement>(null);

  // 进入课堂 / 更换导师时，重置为该导师的开场白
  useEffect(() => {
    if (!tutor) return;
    setMessages([
      { id: `greet-${tutor.id}`, role: 'tutor', content: tutor.greeting, timestamp: nowTime() },
    ]);
  }, [tutor?.id, tutor?.greeting]);

  // 新消息自动滚动到底部（仅滚动消息容器自身，避免页面跟着滚动）
  useEffect(() => {
    const scrollToEnd = (el: HTMLDivElement | null) => {
      const container = el?.parentElement;
      if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    };
    scrollToEnd(drawerChatEndRef.current);
  }, [messages, isTutorTyping]);

  // 守卫：课程不存在 / 未购买 / 未选导师
  if (!course) {
    return (
      <GuardCard
        icon={GraduationCap}
        title="课程不存在或已下架"
        description="去看看其他课程吧"
        actionLabel="返回课程商城"
        actionTo="/courses"
      />
    );
  }
  if (!state.purchasedCourseIds.includes(course.id)) {
    return (
      <GuardCard
        icon={ShoppingBag}
        title="该课程还未购买"
        description="购买后即可解锁导师引导学习"
        actionLabel="去购买课程"
        actionTo="/courses"
      />
    );
  }
  if (!tutor) {
    return (
      <GuardCard
        icon={UserRoundCheck}
        title="请先选择你的数字人导师"
        description="选择一位导师后，TA 将全程引导你的学习"
        actionLabel="去选择导师"
        actionTo="/"
      />
    );
  }

  const viewingChapter: IChapter =
    course.chapters.find((ch) => ch.lessonNo === viewingLessonNo) ?? course.chapters[0];

  const send = (raw?: string) => {
    const content = (raw ?? inputValue).trim();
    if (!content || isTutorTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `s-${Date.now()}`, role: 'student', content, timestamp: nowTime() },
    ]);
    setInputValue('');
    setIsTutorTyping(true);

    // 模拟导师按人设思考延迟后回复
    setTimeout(() => {
      const reply = getTutorReply(content, tutor.id);
      setMessages((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, role: 'tutor', content: reply, timestamp: nowTime() },
      ]);
      setIsTutorTyping(false);
    }, 900);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  const handleCompleteLesson = () => {
    if (viewingLessonNo >= course.lessonCount) {
      toast.info('已经是最后一课了，去复习前面的内容吧');
      return;
    }
    dispatch({
      type: 'COMPLETE_LESSON',
      courseId: course.id,
      lessonCount: course.lessonCount,
      baseCurrentLesson: currentLesson,
    });
    setViewingLessonNo((n) => Math.min(n + 1, course.lessonCount));
    setLectureKey((k) => k + 1);
    toast.success(`第 ${viewingLessonNo} 课已完成，解锁下一课`);
  };

  const switchLesson = (no: number) => {
    setViewingLessonNo(no);
    setLectureKey((k) => k + 1);
  };

  const homework = MOCK_HOMEWORK_FEEDBACK;

  return (
    <div className="w-full py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* 主区：数字人课堂 + 章节 + 作业（实时互动收进「向导师提问」抽屉） */}
        <div className="space-y-5 min-w-0">
            {/* 数字人课堂（数字人 + 课程内容同步播放） */}
            <DigitalHumanPanel
              tutor={tutor}
              course={course}
              chapter={viewingChapter}
              viewingLessonNo={viewingLessonNo}
              progressPercent={progressPercent}
              lectureKey={lectureKey}
              onReplay={() => setLectureKey((k) => k + 1)}
              onCompleteLesson={handleCompleteLesson}
              chatOpen={chatOpen}
              onToggleChat={() => setChatOpen((v) => !v)}
              chatSlot={
                <ChatDock
                  compact
                  tutor={tutor}
                  course={course}
                  messages={messages}
                  isTutorTyping={isTutorTyping}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSend={handleSend}
                  onQuickAction={send}
                  chatEndRef={drawerChatEndRef}
                  inputRef={drawerInputRef}
                />
              }
            />

            {/* 课程章节（横向铺开） */}
            <ChapterStrip
              course={course}
              viewingLessonNo={viewingLessonNo}
              onSwitchLesson={switchLesson}
            />

            {/* 作业批改卡 */}
            <div
              className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden"
              ref={feedbackParent}
            >
              <div className="px-5 py-4 flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FileCheck className="size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-0.5">{homework.title}</h3>
                  <p className="text-xs text-muted-foreground">{homework.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <div className="text-base font-bold text-foreground">
                      {homework.knowledgeScore}/5
                    </div>
                    <div className="text-[11px] text-muted-foreground">知识点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-foreground">
                      {homework.engineeringScore}/5
                    </div>
                    <div className="text-[11px] text-muted-foreground">工程落地</div>
                  </div>
                  <button
                    onClick={() => setShowFeedback((v) => !v)}
                    className="h-8 px-3.5 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors whitespace-nowrap"
                  >
                    {showFeedback ? '收起反馈' : '查看反馈'}
                  </button>
                </div>
              </div>

              {showFeedback && (
                <div className="border-t border-border/30 px-5 py-4 space-y-4 bg-background/40">
                  <FeedbackSection
                    title="优点"
                    dotClass="bg-success"
                    items={homework.feedback.strengths}
                    marker="·"
                    markerClass="text-success"
                  />
                  <FeedbackSection
                    title="待改进项"
                    dotClass="bg-accent"
                    items={homework.feedback.improvements}
                    marker="·"
                    markerClass="text-accent"
                  />
                  <FeedbackSection
                    title="导师讲解建议"
                    dotClass="bg-primary"
                    items={homework.feedback.suggestions}
                    marker="num"
                    markerClass="text-primary"
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

/** PPT 页类型 → 舞台左上角页签 */
const SLIDE_KIND_LABEL: Record<ISlide['kind'], string> = {
  cover: '课程封面',
  concept: '核心概念',
  flow: '运行流程',
  practice: '动手实战',
  summary: '本课小结',
};

/** 左：数字人课堂（PPT 课件播放 + 画中画数字人讲解 + 打字机字幕 + 讲完自动翻页） */
function DigitalHumanPanel({
  tutor,
  course,
  chapter,
  viewingLessonNo,
  progressPercent,
  lectureKey,
  onReplay,
  onCompleteLesson,
  chatOpen,
  onToggleChat,
  chatSlot,
}: {
  tutor: ITutor;
  course: ICourse;
  chapter: IChapter;
  viewingLessonNo: number;
  progressPercent: number;
  lectureKey: number;
  onReplay: () => void;
  onCompleteLesson: () => void;
  /** 对话抽屉开关（悬浮提问入口） */
  chatOpen: boolean;
  onToggleChat: () => void;
  /** 课堂内嵌对话面板（复用 ChatDock） */
  chatSlot: ReactNode;
}) {
  const slides = useMemo(() => getLessonSlides(tutor, course, chapter), [tutor, course, chapter]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [speaking, setSpeaking] = useState(true);
  // 完成本课的即时视觉反馈：按钮短暂变绿
  const [flashDone, setFlashDone] = useState(false);

  const slide = slides[Math.min(slideIndex, slides.length - 1)];
  const script = slide.script;
  const isLastSlide = slideIndex >= slides.length - 1;
  const isTyping = speaking && typedCount < script.length;

  // 切换课次 / 重新讲解时，回到第一页从头播放
  useEffect(() => {
    setSlideIndex(0);
    setTypedCount(0);
    setSpeaking(true);
  }, [chapter.id, lectureKey]);

  // 打字机：逐字输出当前页讲解词，模拟数字人"说话"
  useEffect(() => {
    if (!speaking) return;
    const timer = setInterval(() => {
      setTypedCount((n) => (n >= script.length ? n : n + 1));
    }, 42);
    return () => clearInterval(timer);
  }, [speaking, script, slideIndex]);

  // 当前页讲完 → 停顿 1 秒自动翻下一页；最后一页停住
  useEffect(() => {
    if (!speaking || isLastSlide || typedCount < script.length) return;
    const timer = setTimeout(() => {
      setSlideIndex((i) => Math.min(i + 1, slides.length - 1));
      setTypedCount(0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [speaking, typedCount, script, isLastSlide, slides.length]);

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(i, slides.length - 1));
    if (next === slideIndex) return;
    setSlideIndex(next);
    setTypedCount(0);
    setSpeaking(true);
  };

  // 键盘 ← → 翻页（输入框聚焦时忽略）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') goTo(slideIndex - 1);
      if (e.key === 'ArrowRight') goTo(slideIndex + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slideIndex, slides.length]);

  const handleComplete = () => {
    onCompleteLesson();
    setFlashDone(true);
    setTimeout(() => setFlashDone(false), 1200);
  };

  return (
    <div
      className="relative rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2a4a73 55%, #4a3f63 100%)' }}
    >
      {/* 面板头：课堂名 + 悬浮提问入口 + 课程信息 */}
      <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          数字人课堂 · PPT 讲解中
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs text-white/60 truncate">
            {course.title} · {tutor.name}
          </span>
          <button
            onClick={onToggleChat}
            className="shrink-0 h-8 px-3.5 rounded-full bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-1.5 shadow-md focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            {chatOpen ? <X className="size-3.5" /> : <MessageCircle className="size-3.5" />}
            {chatOpen ? '收起对话' : '向导师提问'}
          </button>
        </div>
      </div>

      {/* PPT 舞台：深色包边 + 白色幻灯片 */}
      <div className="px-5 pt-5">
        <div className="rounded-xl bg-[#0d1b2e] p-2 sm:p-2.5 shadow-inner">
          <div
            key={`${slideIndex}-${lectureKey}`}
            className="relative rounded-lg bg-white shadow-lg min-h-[320px] sm:min-h-[380px] overflow-hidden flex animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {/* 页签 + 页码 */}
            <span className="absolute left-5 top-3 z-10 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/50">
              {SLIDE_KIND_LABEL[slide.kind]}
            </span>
            <span className="absolute right-5 top-3 z-10 text-[10px] text-muted-foreground/50 tabular-nums">
              {slideIndex + 1} / {slides.length}
            </span>

            {/* 幻灯片内容（底部留白给画中画数字人） */}
            <div className="flex-1 flex flex-col px-6 sm:px-8 pt-9 pb-24 min-w-0">
              {slide.kind === 'cover' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-accent/80">
                    AGENTTUTOR · 数字人课堂
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    <Clock className="size-3.5" />
                    本节时长 {chapter.duration}
                  </span>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-foreground leading-snug flex items-center gap-2 mb-4 min-w-0">
                    {slide.kind === 'concept' && <BookOpenText className="size-5 text-accent shrink-0" />}
                    {slide.kind === 'flow' && <ListChecks className="size-5 text-accent shrink-0" />}
                    {slide.kind === 'practice' && <FileText className="size-5 text-accent shrink-0" />}
                    {slide.kind === 'summary' && <CheckCircle2 className="size-5 text-success shrink-0" />}
                    <span className="truncate">{slide.title}</span>
                  </h2>

                  {slide.kind === 'concept' && (
                    <ol className="space-y-2.5">
                      {slide.bullets?.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/40 px-4 py-3"
                        >
                          <span className="shrink-0 size-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground/90 leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {slide.kind === 'flow' && (
                    <div className="flex-1 flex items-center">
                      <ol className="w-full flex items-center gap-1.5 flex-wrap">
                        {slide.steps?.map((s, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <div className="rounded-xl border border-border/50 bg-secondary/40 px-3.5 py-3 text-center min-w-[96px]">
                              <div className="text-[10px] text-accent font-semibold mb-0.5">
                                STEP {i + 1}
                              </div>
                              <div className="text-sm text-foreground/90 font-medium leading-snug">{s}</div>
                            </div>
                            {i < (slide.steps?.length ?? 0) - 1 && (
                              <ChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {slide.kind === 'practice' && (
                    <div className="flex-1 flex items-center">
                      <div
                        className={`w-full rounded-xl border px-5 py-5 ${
                          slide.hasAssignment
                            ? 'border-accent/40 bg-accent/[0.06]'
                            : 'border-border/50 bg-secondary/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="size-4 text-accent" />
                          <span className="text-xs font-semibold text-accent">
                            {slide.hasAssignment ? '本课含作业' : '课堂演练'}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{slide.task}</p>
                      </div>
                    </div>
                  )}

                  {slide.kind === 'summary' && (
                    <ul className="space-y-2.5">
                      {slide.bullets?.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/40 px-4 py-3"
                        >
                          <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/90 leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            {/* 手势动画：封面页挥手迎宾，其余页翻页后指向讲解内容 */}
            {isTyping && (
              <div
                key={`hand-${slideIndex}`}
                aria-hidden={true}
                className={`absolute z-10 pointer-events-none select-none ${
                  slide.kind === 'cover' ? 'right-28 bottom-24 at-wave' : 'right-24 bottom-28 at-present'
                }`}
              >
                <Hand className="size-6 text-accent drop-shadow-md" />
              </div>
            )}
            {/* 完成本课：点赞手势 */}
            {flashDone && (
              <div
                aria-hidden={true}
                className="absolute right-24 bottom-28 z-10 pointer-events-none select-none animate-in fade-in zoom-in-50 duration-300"
              >
                <ThumbsUp className="size-6 text-success drop-shadow-md" />
              </div>
            )}

            {/* 画中画数字人：叠在幻灯片右下角 */}
            <div className="absolute right-4 bottom-4 z-10 flex items-end gap-2 pointer-events-none select-none">
              <div className="flex items-end gap-0.5 h-6 mb-1" aria-hidden={true}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-0.5 rounded-full bg-accent ${speaking ? 'animate-pulse' : 'opacity-30'}`}
                    style={{
                      height: speaking ? `${8 + ((i * 5) % 10)}px` : '4px',
                      animationDelay: `${i * 0.12}s`,
                      animationDuration: '0.9s',
                    }}
                  />
                ))}
              </div>
              <div className="relative">
                {speaking && (
                  <span
                    className="absolute -inset-1 rounded-full animate-ping opacity-25 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${tutor.gradient[0]}, ${tutor.gradient[1]})`,
                    }}
                  />
                )}
                <div
                  className="relative size-20 sm:size-24 rounded-full overflow-hidden border-[3px] border-white shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${tutor.gradient[0]}, ${tutor.gradient[1]})`,
                  }}
                >
                  <img
                    src={tutor.portrait}
                    alt={`${tutor.name} 数字人讲解中`}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                      isTyping ? 'at-talking' : speaking ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>
                <span className="absolute right-0.5 bottom-0.5 size-3 rounded-full bg-success border-2 border-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 字幕条：打字机讲解当前页 */}
      <div className="px-5 pt-3">
        <div className="text-xs text-white/60 mb-1.5 truncate">
          正在讲解 · 第 {viewingLessonNo} / {course.lessonCount} 课 · 「{slide.title}」
        </div>
        <div
          key={`cap-${slideIndex}-${lectureKey}`}
          className="min-h-[64px] rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm leading-relaxed text-white/90"
        >
          {script.slice(0, typedCount)}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 ml-0.5 align-[-2px] bg-accent animate-pulse" aria-hidden={true} />
          )}
        </div>
      </div>

      {/* 控制条：翻页 + 播放控制 + 课程进度 + 完成本课 */}
      <div className="px-5 py-4 flex items-center gap-3 flex-wrap border-t border-white/10 mt-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => goTo(slideIndex - 1)}
            disabled={slideIndex === 0}
            aria-label="上一页"
            className="size-9 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            {slides.map((s, i) => (
              <button
                key={s.kind}
                onClick={() => goTo(i)}
                aria-label={`跳到第 ${i + 1} 页`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === slideIndex ? 'w-5 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(slideIndex + 1)}
            disabled={isLastSlide}
            aria-label="下一页"
            className="size-9 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeaking((v) => !v)}
            className="h-9 px-4 rounded-full bg-white/10 border border-white/15 text-white text-xs font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
          >
            {speaking ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {speaking ? '暂停讲解' : '继续讲解'}
          </button>
          <button
            onClick={onReplay}
            className="h-9 px-4 rounded-full bg-white/10 border border-white/15 text-white text-xs font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            重新讲解
          </button>
        </div>

        <div className="flex-1 min-w-[140px]">
          <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
            <span>学习进度 · 第 {viewingLessonNo} / {course.lessonCount} 课</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-white/80 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleComplete}
          className={`h-9 px-4 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
            flashDone ? 'bg-success text-white' : 'bg-accent text-white hover:bg-accent/90'
          }`}
        >
          <CheckCircle2 className="size-3.5" />
          {flashDone ? '已完成，太棒了！' : '完成本课'}
        </button>
      </div>

      {/* 课堂内嵌对话抽屉：悬浮在 PPT 右侧，随开随问 */}
      {chatOpen && (
        <div className="absolute inset-0 z-30">
          <div
            className="absolute inset-0 bg-[#0a1626]/45 animate-in fade-in duration-200"
            onClick={onToggleChat}
          />
          <div className="absolute inset-y-3 right-3 left-3 sm:left-auto sm:w-[380px] animate-in fade-in slide-in-from-right-5 duration-300">
            {chatSlot}
          </div>
        </div>
      )}
    </div>
  );
}

/** 下：课程章节（横向铺开，点击切换课次） */
function ChapterStrip({
  course,
  viewingLessonNo,
  onSwitchLesson,
}: {
  course: ICourse;
  viewingLessonNo: number;
  onSwitchLesson: (no: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden">
      {/* 标题行 */}
      <div className="px-5 py-3.5 border-b border-border/30 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          课程章节
        </span>
        <span className="text-xs text-muted-foreground">共 {course.lessonCount} 课 · 点击切换</span>
      </div>

      {/* 横向章节卡 */}
      <div className="p-3 flex gap-2 overflow-x-auto">
        {course.chapters.map((ch) => {
          const status =
            ch.lessonNo < viewingLessonNo
              ? 'learned'
              : ch.lessonNo === viewingLessonNo
              ? 'learning'
              : 'not_started';
          const isActive = ch.lessonNo === viewingLessonNo;
          return (
            <button
              key={ch.id}
              onClick={() => onSwitchLesson(ch.lessonNo)}
              className={`shrink-0 w-[168px] text-left rounded-xl border p-3 transition-colors ${
                isActive
                  ? 'bg-accent/10 border-accent/50'
                  : 'bg-background/60 border-border/30 hover:bg-secondary/60 hover:border-accent/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                  {status === 'learned' ? (
                    <CheckCircle2 className="size-4.5 text-success" />
                  ) : status === 'learning' ? (
                    <div className="size-4.5 rounded-full border-2 border-accent flex items-center justify-center">
                      <span className="size-1.5 rounded-full bg-accent" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {ch.lessonNo}
                    </span>
                  )}
                </div>
                {ch.hasAssignment && (
                  <FileText className="size-3.5 text-muted-foreground shrink-0" />
                )}
              </div>
              <div
                className={`text-sm font-medium leading-snug line-clamp-2 mb-1.5 ${
                  status === 'learned' && !isActive ? 'text-muted-foreground' : 'text-foreground'
                }`}
              >
                {ch.title}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3" />
                {ch.duration}
                {isActive && (
                  <span className="ml-auto text-accent font-medium">正在学</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 右：实时互动对话栏（宽屏固定在右侧，随页面滚动保持可见） */
function ChatDock({
  tutor,
  course,
  messages,
  isTutorTyping,
  inputValue,
  onInputChange,
  onSend,
  onQuickAction,
  chatEndRef,
  inputRef,
  compact = false,
}: {
  tutor: ITutor;
  course: ICourse;
  messages: IMessage[];
  isTutorTyping: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
  onSend: (e: FormEvent) => void;
  onQuickAction: (query: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** 紧凑模式：嵌入课堂对话抽屉时撑满容器高度 */
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden flex flex-col h-full min-h-0'
          : 'rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden xl:sticky xl:top-20'
      }
    >
      {/* 对话头 */}
      <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <TutorAvatar gradient={tutor.gradient} initial={tutor.avatarInitial} src={tutor.avatar} size={36} online={tutor.isOnline} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">与 {tutor.name} 实时互动</span>
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <span className="size-1.5 rounded-full bg-success" />
                在线
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              有疑问随时提问，{tutor.name} 会结合《{course.title}》为你解答
            </p>
          </div>
        </div>
      </div>

      {/* 消息流 */}
      <div
        className={
          compact
            ? 'px-4 py-4 space-y-4 flex-1 min-h-0 overflow-y-auto bg-background/30'
            : 'px-4 py-4 space-y-4 h-[320px] xl:h-[560px] overflow-y-auto bg-background/30'
        }
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            tutorInitial={tutor.avatarInitial}
            tutorGradient={tutor.gradient}
            tutorAvatar={tutor.avatar}
          />
        ))}
        {isTutorTyping && (
          <div className="flex items-end gap-2">
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${tutor.gradient[0]}, ${tutor.gradient[1]})`,
              }}
            >
              <img
                src={tutor.avatar}
                alt={tutor.name}
                draggable={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover"
              />
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

      {/* 快捷指令 */}
      <div className="px-3 py-2.5 border-t border-border/30 flex items-center gap-2 flex-wrap">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onQuickAction(action.query)}
            disabled={isTutorTyping}
            className="px-3 py-1.5 rounded-full border border-border/60 bg-background text-xs font-medium text-foreground hover:bg-secondary hover:border-accent/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
        <button
          onClick={() => inputRef.current?.focus()}
          className="px-3 py-1.5 rounded-full border border-dashed border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1"
        >
          <HelpCircle className="size-3.5" />
          我有个问题
        </button>
      </div>

      {/* 输入框 */}
      <form onSubmit={onSend} className="p-3 border-t border-border/30 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={`向 ${tutor.name} 提问，或点击上方快捷指令...`}
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
  );
}

function FeedbackSection({
  title,
  dotClass,
  items,
  marker,
  markerClass,
}: {
  title: string;
  dotClass: string;
  items: string[];
  marker: '·' | 'num';
  markerClass: string;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
        <span className={`size-1.5 rounded-full ${dotClass}`} />
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex gap-2">
            <span className={`${markerClass} shrink-0`}>{marker === 'num' ? `${i + 1}.` : '·'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 学习页守卫提示卡 */
function GuardCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="w-full py-16 px-4 flex justify-center">
      <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-10 text-center max-w-sm">
        <Icon className="size-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-foreground font-semibold mb-1">{title}</p>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          {actionLabel}
          <CircleDot className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
