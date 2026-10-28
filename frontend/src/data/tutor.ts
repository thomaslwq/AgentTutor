// EXPORTS: ITutor, MOCK_TUTORS, getTutorById
export interface ITutor {
  id: string
  name: string
  title: string
  specialty: string
  intro: string
  styleTags: string[]
  greeting: string
  avatarInitial: string
  /** 头像渐变色对 [起始色, 结束色]，图片加载前的兜底 */
  gradient: [string, string]
  /** 导师真人头像图（public/tutors 下） */
  avatar: string
  /** 数字人讲解台半身形象图（public/tutors 下） */
  portrait: string
  isOnline: boolean
  totalAnswers: number
  satisfactionRate: number
  students: number
}

export const MOCK_TUTORS: ITutor[] = [
  {
    id: 'chen-mo',
    name: '陈默',
    title: '资深架构师',
    specialty: '多智能体架构 · 工程化落地',
    intro: '主讲多智能体架构与工程化落地，擅长把复杂系统拆成可执行的步骤',
    styleTags: ['严谨', '体系化', '一针见血'],
    greeting: '你好，我是陈默。架构的本质是取舍——我们一步一步，把复杂问题拆简单。',
    avatarInitial: '默',
    gradient: ['#1E3A5F', '#E87722'],
    avatar: '/tutors/chenmo-avatar.jpg',
    portrait: '/tutors/chenmo-portrait.jpg',
    isOnline: true,
    totalAnswers: 1286,
    satisfactionRate: 96,
    students: 2314,
  },
  {
    id: 'xiao-nuan',
    name: '小暖',
    title: '陪学教练',
    specialty: '零基础入门 · 提示词工程',
    intro: '主讲 Agent 原理入门与提示词工程，擅长陪伴零基础学员建立信心',
    styleTags: ['温柔', '鼓励', '循序渐进'],
    greeting: '嗨，我是小暖～别怕难，再小的进步也算数，我们一起学！',
    avatarInitial: '暖',
    gradient: ['#E87722', '#F472B6'],
    avatar: '/tutors/xiaonuan-avatar.jpg',
    portrait: '/tutors/xiaonuan-portrait.jpg',
    isOnline: true,
    totalAnswers: 987,
    satisfactionRate: 98,
    students: 1876,
  },
  {
    id: 'lao-k',
    name: '老K',
    title: '实战专家',
    specialty: 'Agent 项目实战 · 调试复盘',
    intro: '主讲实战项目与调试复盘，带你提前踩完所有的坑再上路',
    styleTags: ['犀利', '代码说话', '结果导向'],
    greeting: '我是老K。少聊概念，直接上代码——先跑通，再跑好。',
    avatarInitial: 'K',
    gradient: ['#3B82F6', '#8B5CF6'],
    avatar: '/tutors/laok-avatar.jpg',
    portrait: '/tutors/laok-portrait.jpg',
    isOnline: true,
    totalAnswers: 1532,
    satisfactionRate: 95,
    students: 1943,
  },
  {
    id: 'gu-yan',
    name: '顾远',
    title: '管理实战导师',
    specialty: 'AI 管理实战 · 团队效能',
    intro: '主讲 AI 时代团队管理与效能提升，擅长把管理方法落到智能体工作流里',
    styleTags: ['沉稳', '有格局', '案例驱动'],
    greeting: '你好，我是顾远。管理的本质是激发人、用好事——AI 时代，这两件事都要重新学。',
    avatarInitial: '顾',
    gradient: ['#2FAE6E', '#1E3A5F'],
    avatar: '/tutors/guyan-avatar.jpg',
    portrait: '/tutors/guyan-portrait.jpg',
    isOnline: true,
    totalAnswers: 864,
    satisfactionRate: 97,
    students: 1028,
  },
]

export function getTutorById(id: string | null | undefined): ITutor | undefined {
  return MOCK_TUTORS.find((t) => t.id === id)
}
