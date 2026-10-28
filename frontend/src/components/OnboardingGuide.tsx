import { useState } from 'react';
import { Sparkles, UserRoundCheck, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';

import { useAppStore } from '@/store/AppContext';

const STEPS = [
  {
    icon: Sparkles,
    iconClass: 'bg-accent/10 text-accent',
    title: '欢迎来到 AgentTutor',
    description: '这里是你的 AI Agent 学习平台。数字人导师 7×24 在线，答疑、批改、陪练全程护航。',
  },
  {
    icon: UserRoundCheck,
    iconClass: 'bg-primary/10 text-primary',
    title: '第 1 步 · 选一位专属导师',
    description: '陈默、小暖、老K 三位导师人设与风格各不相同，选一位合眼缘的开始学习吧。',
  },
  {
    icon: CreditCard,
    iconClass: 'bg-success/10 text-success',
    title: '第 2 步 · 选课充值，开始学习',
    description: '在课程商城选购课程，钱包充值即可支付；购买后导师会引导你逐课学习。',
  },
];

export default function OnboardingGuide() {
  const { state, dispatch } = useAppStore();
  const [step, setStep] = useState(0);

  if (state.onboardingDone) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const finish = () => dispatch({ type: 'FINISH_ONBOARDING' });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-card shadow-lg p-8 text-center">
        <div
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${current.iconClass}`}
        >
          <Icon className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{current.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.description}</p>

        {/* 步骤圆点 */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-accent' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="h-11 px-5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="size-4" />
              上一步
            </button>
          )}
          <button
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="flex-1 h-11 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            {isLast ? '开始体验' : '下一步'}
            {!isLast && <ArrowRight className="size-4" />}
          </button>
        </div>

        {!isLast && (
          <button
            onClick={finish}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            跳过引导
          </button>
        )}
      </div>
    </div>
  );
}
