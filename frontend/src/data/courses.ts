// EXPORTS: ICourse, IChapter, MOCK_COURSES
export interface IChapter {
  id: string
  lessonNo: number
  title: string
  duration: string
  status: 'learned' | 'learning' | 'not_started'
  hasAssignment: boolean
}

export interface ICourse {
  id: string
  title: string
  lessonCount: number
  status: 'ongoing' | 'completed' | 'not_started'
  progress: number
  currentLesson?: number
  stage: 'foundation' | 'collaboration' | 'engineering'
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
]