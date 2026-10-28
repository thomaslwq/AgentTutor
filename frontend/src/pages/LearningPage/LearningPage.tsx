import { useState, useRef, useEffect, FormEvent } from 'react';
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

/** 生成当前课的演示要点（原型 mock：按章节标题派生 3 条） */
function getLessonPoints(chapter: IChapter): string[] {
  return [
    `${chapter.title}的核心概念与运行原理`,
    `${chapter.title}在多智能体系统中的典型应用场景`,
    `动手练习：结合实战项目演练「${chapter.title}」`,
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
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const override = course ? state.courseProgress[course.id] : undefined;
  const currentLesson = override?.currentLesson ?? course?.currentLesson ?? 1;
  const progressPercent = override?.progressPercent ?? course?.progress ?? 0;
  const [viewingLessonNo, setViewingLessonNo] = useState(currentLesson);
  const [lectureKey, setLectureKey] = useState(0); // 重新讲解时触发解说词淡入

  // 进入课堂 / 更换导师时，重置为该导师的开场白
  useEffect(() => {
    if (!tutor) return;
    setMessages([
      { id: `greet-${tutor.id}`, role: 'tutor', content: tutor.greeting, timestamp: nowTime() },
    ]);
  }, [tutor?.id, tutor?.greeting]);

  // 新消息自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        {/* 主区：左 = 数字人课堂 + 章节 + 作业；右 = 实时互动 */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
          {/* 左列 */}
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

          {/* 右列：实时互动对话 */}
          <ChatDock
            tutor={tutor}
            course={course}
            messages={messages}
            isTutorTyping={isTutorTyping}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            onQuickAction={send}
            chatEndRef={chatEndRef}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
}

/** 左：数字人课堂（数字人出镜 + 课程内容板书同步播放 + 字幕控制条） */
function DigitalHumanPanel({
  tutor,
  course,
  chapter,
  viewingLessonNo,
  progressPercent,
  lectureKey,
  onReplay,
  onCompleteLesson,
}: {
  tutor: ITutor;
  course: ICourse;
  chapter: IChapter;
  viewingLessonNo: number;
  progressPercent: number;
  lectureKey: number;
  onReplay: () => void;
  onCompleteLesson: () => void;
}) {
  const [speaking, setSpeaking] = useState(true);
  // 打字机效果：讲解词逐字出现，模拟数字人在"说话"
  const [typedCount, setTypedCount] = useState(0);
  const script = getLectureScript(tutor, chapter, chapter.lessonNo, course.lessonCount);
  const points = getLessonPoints(chapter);
  // 完成本课的即时视觉反馈：按钮短暂变绿
  const [flashDone, setFlashDone] = useState(false);

  // 切换课次 / 重新讲解时，从头开始播放
  useEffect(() => {
    setTypedCount(0);
  }, [script, lectureKey]);

  useEffect(() => {
    if (!speaking) return;
    const timer = setInterval(() => {
      setTypedCount((n) => {
        if (n >= script.length) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [speaking, script, lectureKey]);

  const isTyping = speaking && typedCount < script.length;
  // 板书联动：按讲解进度依次点亮对应要点，模拟"讲到哪、亮到哪"
  const playRatio = script.length ? typedCount / script.length : 0;
  const activePoint =
    typedCount === 0 ? -1 : playRatio < 0.34 ? 0 : playRatio < 0.67 ? 1 : 2;

  const handleComplete = () => {
    onCompleteLesson();
    setFlashDone(true);
    setTimeout(() => setFlashDone(false), 1200);
  };

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #2a4a73 55%, #4a3f63 100%)' }}
    >
      {/* 面板头：课堂名 + 课程信息 */}
      <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          数字人课堂
        </div>
        <span className="text-xs text-white/60 truncate">
          {course.title} · {tutor.name}
        </span>
      </div>

      {/* 主体：左数字人出镜 + 右课程内容板书 */}
      <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-center gap-5 px-5 py-5">
        {/* 数字人出镜 */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative">
            {speaking && (
              <span
                className="absolute -inset-1.5 rounded-full animate-ping opacity-25 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${tutor.gradient[0]}, ${tutor.gradient[1]})` }}
              />
            )}
            <div
              className="relative size-32 sm:size-36 rounded-full overflow-hidden border-4 border-white/25 shadow-xl"
              style={{ background: `linear-gradient(135deg, ${tutor.gradient[0]}, ${tutor.gradient[1]})` }}
            >
              <img
                src={tutor.portrait}
                alt={`${tutor.name} 数字人形象`}
                draggable={false}
                className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                  speaking ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
            <span className="absolute right-2 bottom-2 size-4 rounded-full bg-success border-2 border-white/80" />
          </div>

          {/* 声波动效 */}
          <div className="flex items-end gap-1 h-5 mt-3" aria-hidden={true}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`w-1 rounded-full bg-accent transition-all ${
                  speaking ? 'animate-pulse' : 'opacity-30'
                }`}
                style={{
                  height: speaking ? `${8 + ((i * 7) % 12)}px` : '4px',
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: '0.9s',
                }}
              />
            ))}
          </div>
        </div>

        {/* 课程内容板书：标题 + 要点（讲到哪亮到哪） */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold text-white leading-snug flex items-center gap-2 min-w-0">
              <BookOpenText className="size-5 text-accent shrink-0" />
              <span className="truncate">
                第 {chapter.lessonNo} 课 · {chapter.title}
              </span>
            </h2>
            <span className="shrink-0 inline-flex items-center gap-1 text-xs text-white/60">
              <Clock className="size-3.5" />
              {chapter.duration}
            </span>
          </div>

          <ol className="space-y-2">
            {points.map((point, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-500 ${
                  i === activePoint
                    ? 'bg-white/15 border-accent/60 shadow-[0_0_0_1px_rgba(232,119,34,0.25)]'
                    : i < activePoint
                    ? 'bg-white/[0.06] border-white/10 opacity-70'
                    : 'bg-white/[0.06] border-white/10 opacity-45'
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 transition-colors ${
                    i === activePoint
                      ? 'bg-accent text-white'
                      : i < activePoint
                      ? 'bg-success/25 text-success'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {i < activePoint ? <CheckCircle2 className="size-3.5" /> : i + 1}
                </span>
                <span className="text-sm text-white/90 leading-relaxed">{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 字幕条：打字机讲解词 */}
      <div className="px-5 pb-1">
        <div className="text-xs text-white/60 mb-1.5">
          正在讲解 · 第 {chapter.lessonNo} / {course.lessonCount} 课
        </div>
        <div
          key={lectureKey}
          className="min-h-[68px] rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm leading-relaxed text-white/90"
        >
          {script.slice(0, typedCount)}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 ml-0.5 align-[-2px] bg-accent animate-pulse" aria-hidden={true} />
          )}
        </div>
      </div>

      {/* 控制条：播放控制 + 课程进度 + 完成本课 */}
      <div className="px-5 py-4 flex items-center gap-3 flex-wrap border-t border-white/10 mt-4">
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
}) {
  return (
    <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden xl:sticky xl:top-20">
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
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium shrink-0">
          AI 实时答疑
        </span>
      </div>

      {/* 消息流 */}
      <div className="px-4 py-4 space-y-4 h-[320px] xl:h-[560px] overflow-y-auto bg-background/30">
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
              <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" draggable={false} />
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
