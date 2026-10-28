// EXPORTS: ICourseProgressOverride, AppState, PayMethod, AppAction, STORAGE_KEY, INITIAL_STATE, appReducer, loadState, saveState
import type { ITransaction } from '@/data/transactions'
import { MOCK_TRANSACTIONS } from '@/data/transactions'

/** 「完成本课」后对课程进度的持久化覆盖值 */
export interface ICourseProgressOverride {
  currentLesson: number
  progressPercent: number
}

export interface AppState {
  selectedTutorId: string | null
  balance: number
  purchasedCourseIds: string[]
  onboardingDone: boolean
  transactions: ITransaction[]
  courseProgress: Record<string, ICourseProgressOverride>
}

export type PayMethod = 'wechat' | 'alipay'

export type AppAction =
  | { type: 'SELECT_TUTOR'; tutorId: string }
  | { type: 'TOP_UP'; amount: number; bonus: number; method: PayMethod }
  | { type: 'PURCHASE_COURSE'; courseId: string; title: string; amount: number }
  | { type: 'COMPLETE_LESSON'; courseId: string; lessonCount: number; baseCurrentLesson: number }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'RESET_STATE' }

export const STORAGE_KEY = 'at_app_state_v1'

/** 初始余额与流水自洽：699+100−199−499 = 101 */
export const INITIAL_STATE: AppState = {
  selectedTutorId: null,
  balance: 101,
  purchasedCourseIds: ['1', '2'],
  onboardingDone: false,
  transactions: MOCK_TRANSACTIONS,
  courseProgress: {},
}

function nowStr(): string {
  const d = new Date()
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/** 纯函数 reducer，所有副作用（持久化）放在 Provider 的 useEffect 中 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SELECT_TUTOR':
      return { ...state, selectedTutorId: action.tutorId }

    case 'TOP_UP': {
      const credit = action.amount + action.bonus
      return {
        ...state,
        balance: state.balance + credit,
        transactions: [
          {
            id: `tx-${Date.now()}`,
            type: 'recharge',
            amount: action.amount,
            bonus: action.bonus,
            method: action.method,
            title: `充值 · ¥${action.amount} 套餐（${action.method === 'wechat' ? '微信支付' : '支付宝'}）`,
            createdAt: nowStr(),
          },
          ...state.transactions,
        ],
      }
    }

    case 'PURCHASE_COURSE': {
      const insufficient = state.balance < action.amount
      const alreadyOwned = state.purchasedCourseIds.includes(action.courseId)
      if (insufficient || alreadyOwned) return state
      return {
        ...state,
        balance: state.balance - action.amount,
        purchasedCourseIds: [...state.purchasedCourseIds, action.courseId],
        transactions: [
          {
            id: `tx-${Date.now()}`,
            type: 'purchase',
            amount: action.amount,
            courseId: action.courseId,
            title: `购买课程 · ${action.title}`,
            createdAt: nowStr(),
          },
          ...state.transactions,
        ],
      }
    }

    case 'COMPLETE_LESSON': {
      const prev = state.courseProgress[action.courseId]
      const nextLesson = Math.min(
        (prev?.currentLesson ?? action.baseCurrentLesson) + 1,
        action.lessonCount
      )
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [action.courseId]: {
            currentLesson: nextLesson,
            progressPercent: Math.round((nextLesson / action.lessonCount) * 100),
          },
        },
      }
    }

    case 'FINISH_ONBOARDING':
      return { ...state, onboardingDone: true }

    case 'RESET_STATE':
      return INITIAL_STATE

    default:
      return state
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    if (parsed && parsed.version === 1 && parsed.state && typeof parsed.state === 'object') {
      return { ...INITIAL_STATE, ...parsed.state }
    }
  } catch {
    // 数据损坏时回退初始状态
  }
  return INITIAL_STATE
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }))
  } catch {
    // 忽略持久化失败（如隐私模式）
  }
}
