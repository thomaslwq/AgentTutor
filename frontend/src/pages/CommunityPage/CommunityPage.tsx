import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  MessageSquare,
  CalendarCheck,
  UsersRound,
  BookOpenCheck,
  ChevronDown,
  Send,
  Star,
  Flame,
} from 'lucide-react';

import {
  MOCK_QA_TOPICS,
  MOCK_CHECKINS,
  MOCK_WEEKLY_MEMBERS,
  MOCK_PEER_REVIEWS,
  MOCK_REVIEW_POSTS,
  type ICheckin,
  type IPeerReview,
} from '@/data/community';
import StatusBadge from '@/components/StatusBadge';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'qa' | 'checkin' | 'review' | 'recap'>('qa');

  const tabs = [
    { id: 'qa' as const, label: '助教答疑', icon: MessageSquare },
    { id: 'checkin' as const, label: '学习打卡', icon: CalendarCheck },
    { id: 'review' as const, label: '同伴互评', icon: UsersRound },
    { id: 'recap' as const, label: '阶段复盘', icon: BookOpenCheck },
  ];

  return (
    <div className="w-full py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">学员社群</h1>
          <p className="text-sm text-muted-foreground">
            助教答疑、学习打卡、同伴互评、阶段复盘，陪你走完训练营
          </p>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/40'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 内容区 */}
        <div>
          {activeTab === 'qa' && <QaSection />}
          {activeTab === 'checkin' && <CheckinSection />}
          {activeTab === 'review' && <PeerReviewSection />}
          {activeTab === 'recap' && <RecapSection />}
        </div>
      </div>
    </div>
  );
}

// —— 助教答疑 ——
function QaSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [parent] = useAutoAnimate({ duration: 250 });

  return (
    <div className="space-y-3" ref={parent}>
      {MOCK_QA_TOPICS.map((topic) => {
        const isExpanded = expandedId === topic.id;
        return (
          <div
            key={topic.id}
            className="rounded-xl bg-card border border-border/40 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : topic.id)}
              className="w-full p-5 flex items-start gap-4 text-left"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                {topic.avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1.5">{topic.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{topic.author}</span>
                  <span>{topic.replyCount} 条回复</span>
                  <span>{topic.lastReplyTime}</span>
                  <div className="flex gap-1.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-secondary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`size-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-border/30 bg-background/40 px-5 py-4 space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{topic.content}</p>
                <div className="space-y-3">
                  {topic.replies.map((reply, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {reply.author.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {reply.author}
                          </span>
                          {reply.isInstructor && (
                            <StatusBadge status="ongoing" label="助教" className="text-[10px] px-1.5 py-0" />
                          )}
                          <span className="text-xs text-muted-foreground">{reply.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// —— 学习打卡 ——
function CheckinSection() {
  const [checkins, setCheckins] = useState<ICheckin[]>(MOCK_CHECKINS);
  const [content, setContent] = useState('');
  const [streak, setStreak] = useState(12);
  const [parent] = useAutoAnimate({ duration: 300 });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    const newCheckin: ICheckin = {
      id: `ck-${Date.now()}`,
      userId: 'me',
      userName: '林同学',
      avatarInitial: '林',
      content: text,
      time: '刚刚',
      dayStreak: streak + 1,
    };
    setCheckins((prev) => [newCheckin, ...prev]);
    setStreak((s) => s + 1);
    setContent('');
    toast.success('打卡成功！继续加油 💪');
  };

  return (
    <div className="space-y-5">
      {/* 打卡统计卡 */}
      <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent flex items-center justify-center gap-1">
              <Flame className="size-6" />
              {streak}
            </div>
            <div className="text-xs text-muted-foreground mt-1">连续打卡天数</div>
          </div>
          <div className="text-center border-x border-border/40">
            <div className="text-3xl font-bold text-foreground">
              {MOCK_WEEKLY_MEMBERS.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">本周打卡成员</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{checkins.length}</div>
            <div className="text-xs text-muted-foreground mt-1">今日打卡数</div>
          </div>
        </div>

        {/* 本周打卡成员 */}
        <div>
          <div className="text-sm font-medium text-foreground mb-3">本周打卡伙伴</div>
          <div className="flex -space-x-2">
            {MOCK_WEEKLY_MEMBERS.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="shrink-0 w-9 h-9 rounded-full border-2 border-card bg-primary/80 flex items-center justify-center text-white text-xs font-medium"
                title={`${m.name} · 打卡 ${m.checkinDays} 天`}
              >
                {m.avatarInitial}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 打卡输入 */}
      <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="记录今天的学习收获、进度或心得..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 h-9 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CalendarCheck className="size-4" />
              打卡
            </button>
          </div>
        </form>
      </div>

      {/* 打卡列表 */}
      <div className="space-y-3" ref={parent}>
        {checkins.map((ck) => (
          <div
            key={ck.id}
            className="rounded-xl bg-card border border-border/40 p-4 shadow-sm flex gap-3"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
              {ck.avatarInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{ck.userName}</span>
                <span className="flex items-center gap-0.5 text-xs text-accent">
                  <Flame className="size-3" />
                  {ck.dayStreak} 天
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{ck.time}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ck.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// —— 同伴互评 ——
function PeerReviewSection() {
  const [reviews, setReviews] = useState<IPeerReview[]>(MOCK_PEER_REVIEWS);
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [knowledgeScore, setKnowledgeScore] = useState(4);
  const [engineeringScore, setEngineeringScore] = useState(4);
  const [comment, setComment] = useState('');

  const handleOpenScoring = (id: string) => {
    setScoringId(id);
    setKnowledgeScore(4);
    setEngineeringScore(4);
    setComment('');
  };

  const handleSubmitScore = () => {
    if (!scoringId) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === scoringId
          ? {
              ...r,
              status: 'scored',
              knowledgeScore,
              engineeringScore,
            }
          : r
      )
    );
    setScoringId(null);
    toast.success('评分已提交');
  };

  const scoringItem = reviews.find((r) => r.id === scoringId);

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl bg-card border border-border/40 p-5 shadow-sm flex items-center gap-4"
        >
          <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {review.avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{review.studentName}</h3>
              <StatusBadge
                status={review.status}
                label={review.status === 'scored' ? '已评' : '待互评'}
                className="text-[11px]"
              />
            </div>
            <p className="text-sm text-muted-foreground">{review.assignmentTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">提交时间：{review.submittedAt}</p>

            {review.status === 'scored' && review.knowledgeScore && review.engineeringScore && (
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">
                  知识点：
                  <span className="text-accent font-semibold ml-1">
                    {review.knowledgeScore}/5
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  工程落地：
                  <span className="text-primary font-semibold ml-1">
                    {review.engineeringScore}/5
                  </span>
                </span>
              </div>
            )}
          </div>
          {review.status === 'pending' && (
            <button
              onClick={() => handleOpenScoring(review.id)}
              className="shrink-0 h-9 px-4 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              去评分
            </button>
          )}
        </div>
      ))}

      {/* 评分弹窗 */}
      {scoringId && scoringItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setScoringId(null)}
        >
          <div
            className="bg-card rounded-2xl w-full max-w-md p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">同伴互评</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {scoringItem.studentName} · {scoringItem.assignmentTitle}
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">知识点</label>
                  <span className="text-accent font-bold">{knowledgeScore}/5</span>
                </div>
                <StarRating value={knowledgeScore} onChange={setKnowledgeScore} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">工程落地</label>
                  <span className="text-accent font-bold">{engineeringScore}/5</span>
                </div>
                <StarRating value={engineeringScore} onChange={setEngineeringScore} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  评语（可选）
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="写下你的评价和建议..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setScoringId(null)}
                className="flex-1 h-10 rounded-full border border-border/60 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitScore}
                className="flex-1 h-10 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                提交评分
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`size-6 ${
              n <= value ? 'fill-accent text-accent' : 'text-border'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// —— 阶段复盘 ——
function RecapSection() {
  const post = MOCK_REVIEW_POSTS[0];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white p-6 shadow-lg">
        <StatusBadge
          status="completed"
          label="本期精华"
          className="bg-white/20 text-white"
        />
        <h2 className="text-xl font-bold mt-3 mb-2">{post.title}</h2>
        <p className="text-white/70 text-sm">{post.subtitle}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border/40 p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
          <MessageSquare className="size-5 text-accent" />
          精华问答
        </h3>
        <div className="space-y-6">
          {post.highlights.map((qa, i) => (
            <div key={i} className="space-y-3">
              <div className="flex gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                  Q
                </div>
                <p className="text-foreground font-medium leading-relaxed">{qa.question}</p>
              </div>
              <div className="flex gap-3 pl-10">
                <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  A
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{qa.answer}</p>
              </div>
              {i < post.highlights.length - 1 && (
                <div className="border-b border-border/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
