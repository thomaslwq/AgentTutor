import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Sparkles, ShoppingBag, MessageCircleQuestion, Check, Users } from 'lucide-react';

import { MOCK_TUTORS, type ITutor } from '@/data/tutor';
import { MOCK_COURSES } from '@/data/courses';
import { useAppStore } from '@/store/AppContext';
import TutorAvatar from '@/components/TutorAvatar';

export default function TutorSelectPage() {
  const { state, dispatch } = useAppStore();
  const myTutor = MOCK_TUTORS.find((t) => t.id === state.selectedTutorId);

  const handleSelect = (tutor: ITutor) => {
    if (tutor.id === state.selectedTutorId) return;
    dispatch({ type: 'SELECT_TUTOR', tutorId: tutor.id });
    toast.success(`已选择「${tutor.name}」为你的数字人导师`);
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 标题区 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
          <Sparkles className="size-3.5" />
          AI 数字人导师 · 7×24 陪你学
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">选择你的数字人导师</h1>
        <p className="text-muted-foreground">
          每位 AI 导师都有独立人设与教学风格，选择后全程引导你的学习，可随时更换
        </p>
      </div>

      {/* 我的导师横幅 */}
      {myTutor && (
        <div className="rounded-2xl bg-card border border-accent/30 p-5 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <TutorAvatar gradient={myTutor.gradient} initial={myTutor.avatarInitial} src={myTutor.avatar} size={56} online />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                我的导师
              </span>
              <h2 className="font-bold text-foreground">{myTutor.name}</h2>
              <span className="text-sm text-muted-foreground">{myTutor.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {myTutor.specialty} · 更换导师不会影响学习进度与答疑记录
            </p>
          </div>
          <Link
            to="/courses"
            className="shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <ShoppingBag className="size-4" />
            去选课
          </Link>
        </div>
      )}

      {/* 导师卡片 */}
      <div className="grid md:grid-cols-3 gap-5">
        {MOCK_TUTORS.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            isSelected={tutor.id === state.selectedTutorId}
            onSelect={() => handleSelect(tutor)}
          />
        ))}
      </div>
    </div>
  );
}

interface TutorCardProps {
  tutor: ITutor;
  isSelected: boolean;
  onSelect: () => void;
}

function TutorCard({ tutor, isSelected, onSelect }: TutorCardProps) {
  // 该导师主讲课程数（从课程数据反查推荐导师）
  const courseCount = MOCK_COURSES.filter((c) => c.recommendedTutorId === tutor.id).length;

  return (
    <div
      className={`rounded-2xl bg-card border p-6 shadow-sm flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isSelected ? 'border-accent/60 ring-1 ring-accent/30' : 'border-border/40'
      }`}
    >
      {/* 数字人形象 */}
      <div className="relative h-40 rounded-xl overflow-hidden mb-4">
        <img
          src={tutor.portrait}
          alt={`${tutor.name} 数字人形象`}
          draggable={false}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        {tutor.isOnline && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/90 text-white text-[11px] font-medium backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-white" />
            在线
          </span>
        )}
        <div className="absolute left-3 bottom-2.5 flex items-center gap-2">
          <span className="text-white font-bold text-lg drop-shadow-md">{tutor.name}</span>
          <span className="text-white/85 text-xs drop-shadow">{tutor.title}</span>
        </div>
      </div>

      {/* 定位与擅长 */}
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
          {tutor.specialty}
        </span>
        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full whitespace-nowrap">
          主讲 {courseCount} 门课程
        </span>
      </div>

      {/* 职责描述 */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{tutor.intro}</p>

      {/* 风格标签 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tutor.styleTags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 开场白 */}
      <div className="rounded-xl bg-background/80 border border-border/40 p-3 mb-5 flex-1">
        <div className="flex items-start gap-2">
          <MessageCircleQuestion className="size-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">{tutor.greeting}</p>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        <div>
          <div className="text-lg font-bold text-foreground">{tutor.totalAnswers.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">累计答疑</div>
        </div>
        <div>
          <div className="text-lg font-bold text-accent">{tutor.satisfactionRate}%</div>
          <div className="text-[11px] text-muted-foreground">满意度</div>
        </div>
        <div>
          <div className="text-lg font-bold text-foreground inline-flex items-center gap-1">
            {tutor.students.toLocaleString()}
            <Users className="size-3 text-muted-foreground" />
          </div>
          <div className="text-[11px] text-muted-foreground">在学学员</div>
        </div>
      </div>

      {/* 选择按钮 */}
      <button
        onClick={onSelect}
        disabled={isSelected}
        className={`h-11 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5 ${
          isSelected
            ? 'bg-success/10 text-success cursor-default'
            : 'bg-accent text-white hover:bg-accent/90'
        }`}
      >
        {isSelected ? (
          <>
            <Check className="size-4" />
            当前导师
          </>
        ) : (
          '选择 TA'
        )}
      </button>
    </div>
  );
}
