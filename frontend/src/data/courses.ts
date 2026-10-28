// EXPORTS: ICourse, IChapter, CourseCategory, CATEGORY_MAP, MOCK_COURSES
export interface IChapter {
  id: string
  lessonNo: number
  title: string
  duration: string
  status: 'learned' | 'learning' | 'not_started'
  hasAssignment: boolean
}

/** 课程品类 */
export type CourseCategory = 'agent-dev' | 'prompt' | 'ai-office' | 'ai-mgmt'

/** 品类展示名 */
export const CATEGORY_MAP: Record<CourseCategory, string> = {
  'agent-dev': 'Agent 开发',
  prompt: '提示词工程',
  'ai-office': 'AI 办公与创作',
  'ai-mgmt': 'AI 管理',
}

export interface ICourse {
  id: string
  title: string
  lessonCount: number
  status: 'ongoing' | 'completed' | 'not_started'
  progress: number
  currentLesson?: number
  stage: 'foundation' | 'collaboration' | 'engineering'
  /** 课程品类 */
  category: CourseCategory
  /** 推荐导师 ID（关联 tutor.ts 中的导师） */
  recommendedTutorId: string
  /** 售价（¥） */
  price: number
  /** 原价（¥），划线价展示用 */
  originalPrice?: number
  rating: number
  studentCount: number
  chapters: IChapter[]
}

export const MOCK_COURSES: ICourse[] = [
  {
    id: '1',
    title: '多智能体 Agent 实战训练营',
    lessonCount: 12,
    status: 'ongoing',
    progress: 58,
    currentLesson: 7,
    stage: 'collaboration',
    category: 'agent-dev',
    recommendedTutorId: 'chen-mo',
    price: 499,
    originalPrice: 699,
    rating: 4.9,
    studentCount: 1286,
    chapters: [
      { id: 'c1-1', lessonNo: 1, title: '多智能体系统概述', duration: '45min', status: 'learned', hasAssignment: false },
      { id: 'c1-2', lessonNo: 2, title: '角色分工与职责边界', duration: '52min', status: 'learned', hasAssignment: true },
      { id: 'c1-3', lessonNo: 3, title: '任务分派策略', duration: '48min', status: 'learned', hasAssignment: true },
      { id: 'c1-4', lessonNo: 4, title: '通信协议设计', duration: '60min', status: 'learned', hasAssignment: true },
      { id: 'c1-5', lessonNo: 5, title: '消息格式与序列化', duration: '42min', status: 'learned', hasAssignment: false },
      { id: 'c1-6', lessonNo: 6, title: '状态同步机制', duration: '55min', status: 'learned', hasAssignment: true },
      { id: 'c1-7', lessonNo: 7, title: '协作流程设计', duration: '58min', status: 'learning', hasAssignment: true },
      { id: 'c1-8', lessonNo: 8, title: '冲突检测与解决', duration: '50min', status: 'not_started', hasAssignment: false },
      { id: 'c1-9', lessonNo: 9, title: '性能调优策略', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c1-10', lessonNo: 10, title: '错误处理与重试', duration: '48min', status: 'not_started', hasAssignment: false },
      { id: 'c1-11', lessonNo: 11, title: '监控与可观测性', duration: '52min', status: 'not_started', hasAssignment: true },
      { id: 'c1-12', lessonNo: 12, title: '项目实战与复盘', duration: '80min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '2',
    title: 'Agent 原理入门：大模型、提示词与工具调用',
    lessonCount: 8,
    status: 'completed',
    progress: 100,
    currentLesson: 8,
    stage: 'foundation',
    category: 'agent-dev',
    recommendedTutorId: 'xiao-nuan',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    studentCount: 2341,
    chapters: [
      { id: 'c2-1', lessonNo: 1, title: '大模型基础原理', duration: '40min', status: 'learned', hasAssignment: false },
      { id: 'c2-2', lessonNo: 2, title: '提示词工程入门', duration: '45min', status: 'learned', hasAssignment: true },
      { id: 'c2-3', lessonNo: 3, title: '上下文窗口管理', duration: '38min', status: 'learned', hasAssignment: false },
      { id: 'c2-4', lessonNo: 4, title: '函数调用原理', duration: '50min', status: 'learned', hasAssignment: true },
      { id: 'c2-5', lessonNo: 5, title: '工具集成方式', duration: '42min', status: 'learned', hasAssignment: true },
      { id: 'c2-6', lessonNo: 6, title: 'ReAct 推理模式', duration: '55min', status: 'learned', hasAssignment: true },
      { id: 'c2-7', lessonNo: 7, title: '记忆机制设计', duration: '48min', status: 'learned', hasAssignment: false },
      { id: 'c2-8', lessonNo: 8, title: '单 Agent 实战项目', duration: '70min', status: 'learned', hasAssignment: true },
    ],
  },
  {
    id: '3',
    title: '多智能体协作架构：角色分工、任务分派与通信协议',
    lessonCount: 10,
    status: 'not_started',
    progress: 0,
    stage: 'collaboration',
    category: 'agent-dev',
    recommendedTutorId: 'chen-mo',
    price: 399,
    originalPrice: 499,
    rating: 4.7,
    studentCount: 867,
    chapters: [
      { id: 'c3-1', lessonNo: 1, title: '多智能体架构模式', duration: '50min', status: 'not_started', hasAssignment: false },
      { id: 'c3-2', lessonNo: 2, title: '角色定义与画像', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c3-3', lessonNo: 3, title: '任务拆解算法', duration: '55min', status: 'not_started', hasAssignment: true },
      { id: 'c3-4', lessonNo: 4, title: '动态任务分派', duration: '48min', status: 'not_started', hasAssignment: false },
      { id: 'c3-5', lessonNo: 5, title: '消息中间件选型', duration: '42min', status: 'not_started', hasAssignment: true },
      { id: 'c3-6', lessonNo: 6, title: '事件驱动架构', duration: '50min', status: 'not_started', hasAssignment: true },
      { id: 'c3-7', lessonNo: 7, title: '共享状态管理', duration: '45min', status: 'not_started', hasAssignment: false },
      { id: 'c3-8', lessonNo: 8, title: '协作编排模式', duration: '52min', status: 'not_started', hasAssignment: true },
      { id: 'c3-9', lessonNo: 9, title: '容错与降级策略', duration: '48min', status: 'not_started', hasAssignment: false },
      { id: 'c3-10', lessonNo: 10, title: '综合架构实战', duration: '75min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '4',
    title: '工程化落地：前后端分离、WebSocket 实时通信与 LLM 多供应商路由',
    lessonCount: 9,
    status: 'not_started',
    progress: 0,
    stage: 'engineering',
    category: 'agent-dev',
    recommendedTutorId: 'lao-k',
    price: 349,
    originalPrice: 449,
    rating: 4.8,
    studentCount: 642,
    chapters: [
      { id: 'c4-1', lessonNo: 1, title: '前后端分离架构设计', duration: '48min', status: 'not_started', hasAssignment: false },
      { id: 'c4-2', lessonNo: 2, title: 'RESTful API 规范', duration: '42min', status: 'not_started', hasAssignment: true },
      { id: 'c4-3', lessonNo: 3, title: 'WebSocket 实时通信', duration: '55min', status: 'not_started', hasAssignment: true },
      { id: 'c4-4', lessonNo: 4, title: '流式响应处理', duration: '50min', status: 'not_started', hasAssignment: false },
      { id: 'c4-5', lessonNo: 5, title: 'LLM 供应商接入', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c4-6', lessonNo: 6, title: '多模型路由策略', duration: '52min', status: 'not_started', hasAssignment: true },
      { id: 'c4-7', lessonNo: 7, title: '限流与降级设计', duration: '48min', status: 'not_started', hasAssignment: false },
      { id: 'c4-8', lessonNo: 8, title: '日志与监控体系', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c4-9', lessonNo: 9, title: '部署与运维实战', duration: '70min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '5',
    title: '提示词工程实战：从零写出稳定可控的高质量 Prompt',
    lessonCount: 6,
    status: 'not_started',
    progress: 0,
    stage: 'foundation',
    category: 'prompt',
    recommendedTutorId: 'xiao-nuan',
    price: 129,
    originalPrice: 199,
    rating: 4.8,
    studentCount: 1520,
    chapters: [
      { id: 'c5-1', lessonNo: 1, title: '提示词的基本结构', duration: '35min', status: 'not_started', hasAssignment: false },
      { id: 'c5-2', lessonNo: 2, title: '角色设定与任务描述', duration: '42min', status: 'not_started', hasAssignment: true },
      { id: 'c5-3', lessonNo: 3, title: '少样本与思维链技巧', duration: '48min', status: 'not_started', hasAssignment: true },
      { id: 'c5-4', lessonNo: 4, title: '结构化输出与格式约束', duration: '40min', status: 'not_started', hasAssignment: true },
      { id: 'c5-5', lessonNo: 5, title: '提示词调试与评测', duration: '45min', status: 'not_started', hasAssignment: false },
      { id: 'c5-6', lessonNo: 6, title: '提示词模板库实战', duration: '60min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '6',
    title: 'RAG 知识库实战：企业级检索增强系统搭建',
    lessonCount: 5,
    status: 'not_started',
    progress: 0,
    stage: 'collaboration',
    category: 'agent-dev',
    recommendedTutorId: 'lao-k',
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    studentCount: 735,
    chapters: [
      { id: 'c6-1', lessonNo: 1, title: 'RAG 原理与整体架构', duration: '45min', status: 'not_started', hasAssignment: false },
      { id: 'c6-2', lessonNo: 2, title: '文档解析与切片策略', duration: '50min', status: 'not_started', hasAssignment: true },
      { id: 'c6-3', lessonNo: 3, title: '向量数据库选型与入库', duration: '48min', status: 'not_started', hasAssignment: true },
      { id: 'c6-4', lessonNo: 4, title: '检索优化与重排序', duration: '52min', status: 'not_started', hasAssignment: false },
      { id: 'c6-5', lessonNo: 5, title: '项目实战：企业知识库问答', duration: '75min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '7',
    title: 'AI 办公提效：让日常工作时间减少一半',
    lessonCount: 5,
    status: 'not_started',
    progress: 0,
    stage: 'engineering',
    category: 'ai-office',
    recommendedTutorId: 'lao-k',
    price: 99,
    originalPrice: 149,
    rating: 4.9,
    studentCount: 3120,
    chapters: [
      { id: 'c7-1', lessonNo: 1, title: 'AI 办公工具全景图', duration: '30min', status: 'not_started', hasAssignment: false },
      { id: 'c7-2', lessonNo: 2, title: '智能文档与表格处理', duration: '40min', status: 'not_started', hasAssignment: true },
      { id: 'c7-3', lessonNo: 3, title: '会议纪要与邮件自动化', duration: '38min', status: 'not_started', hasAssignment: true },
      { id: 'c7-4', lessonNo: 4, title: '数据分析与报告生成', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c7-5', lessonNo: 5, title: '搭建个人提效工作流', duration: '55min', status: 'not_started', hasAssignment: false },
    ],
  },
  {
    id: '8',
    title: 'AI 内容创作工作流：图文、短视频与数字人口播',
    lessonCount: 6,
    status: 'not_started',
    progress: 0,
    stage: 'foundation',
    category: 'ai-office',
    recommendedTutorId: 'xiao-nuan',
    price: 159,
    originalPrice: 229,
    rating: 4.8,
    studentCount: 986,
    chapters: [
      { id: 'c8-1', lessonNo: 1, title: 'AI 内容创作方法论', duration: '35min', status: 'not_started', hasAssignment: false },
      { id: 'c8-2', lessonNo: 2, title: '图文创作工作流', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c8-3', lessonNo: 3, title: '短视频脚本与分镜', duration: '48min', status: 'not_started', hasAssignment: true },
      { id: 'c8-4', lessonNo: 4, title: '数字人口播内容生产', duration: '50min', status: 'not_started', hasAssignment: true },
      { id: 'c8-5', lessonNo: 5, title: '多平台内容分发策略', duration: '40min', status: 'not_started', hasAssignment: false },
      { id: 'c8-6', lessonNo: 6, title: '个人 IP 内容矩阵实战', duration: '65min', status: 'not_started', hasAssignment: true },
    ],
  },
  {
    id: '9',
    title: 'AI 管理实战：用智能体重塑团队效能与决策',
    lessonCount: 5,
    status: 'not_started',
    progress: 0,
    stage: 'engineering',
    category: 'ai-mgmt',
    recommendedTutorId: 'gu-yan',
    price: 259,
    originalPrice: 359,
    rating: 4.8,
    studentCount: 452,
    chapters: [
      { id: 'c9-1', lessonNo: 1, title: 'AI 时代管理者的新角色', duration: '35min', status: 'not_started', hasAssignment: false },
      { id: 'c9-2', lessonNo: 2, title: '团队效能诊断与 AI 工具盘点', duration: '45min', status: 'not_started', hasAssignment: true },
      { id: 'c9-3', lessonNo: 3, title: '用智能体自动化管理工作流', duration: '50min', status: 'not_started', hasAssignment: true },
      { id: 'c9-4', lessonNo: 4, title: 'AI 辅助决策与数据驱动管理', duration: '48min', status: 'not_started', hasAssignment: true },
      { id: 'c9-5', lessonNo: 5, title: '实战：搭建你的管理驾驶舱', duration: '70min', status: 'not_started', hasAssignment: true },
    ],
  },
]
