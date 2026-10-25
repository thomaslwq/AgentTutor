// EXPORTS: IChapter, MOCK_CHAPTERS
export interface IChapter {
  id: string
  courseId: string
  lessonNo: number
  title: string
  duration: string
  status: 'learned' | 'learning' | 'not_started'
  hasAssignment: boolean
}

export const MOCK_CHAPTERS: IChapter[] = [
  // 多智能体 Agent 实战训练营（course-1，12课，第7课进行中）
  { id: 'ch1-1', courseId: 'course-1', lessonNo: 1, title: '开营与学习路径导览', duration: '25 min', status: 'learned', hasAssignment: false },
  { id: 'ch1-2', courseId: 'course-1', lessonNo: 2, title: 'Agent 核心能力拆解', duration: '35 min', status: 'learned', hasAssignment: true },
  { id: 'ch1-3', courseId: 'course-1', lessonNo: 3, title: '大模型调用与 Prompt 设计', duration: '40 min', status: 'learned', hasAssignment: true },
  { id: 'ch1-4', courseId: 'course-1', lessonNo: 4, title: '工具调用与函数式编程', duration: '45 min', status: 'learned', hasAssignment: true },
  { id: 'ch1-5', courseId: 'course-1', lessonNo: 5, title: '记忆机制与上下文管理', duration: '38 min', status: 'learned', hasAssignment: false },
  { id: 'ch1-6', courseId: 'course-1', lessonNo: 6, title: '多智能体角色与分工', duration: '42 min', status: 'learned', hasAssignment: true },
  { id: 'ch1-7', courseId: 'course-1', lessonNo: 7, title: '任务分派与协作流程', duration: '50 min', status: 'learning', hasAssignment: true },
  { id: 'ch1-8', courseId: 'course-1', lessonNo: 8, title: '通信协议与消息格式', duration: '45 min', status: 'not_started', hasAssignment: true },
  { id: 'ch1-9', courseId: 'course-1', lessonNo: 9, title: '项目实战：客服系统搭建', duration: '60 min', status: 'not_started', hasAssignment: true },
  { id: 'ch1-10', courseId: 'course-1', lessonNo: 10, title: '工程化：前后端分离', duration: '55 min', status: 'not_started', hasAssignment: false },
  { id: 'ch1-11', courseId: 'course-1', lessonNo: 11, title: '实时通信与 WebSocket', duration: '50 min', status: 'not_started', hasAssignment: true },
  { id: 'ch1-12', courseId: 'course-1', lessonNo: 12, title: '结业项目答辩与复盘', duration: '80 min', status: 'not_started', hasAssignment: true },

  // Agent 原理入门（course-2，8课，已完成）
  { id: 'ch2-1', courseId: 'course-2', lessonNo: 1, title: '大模型基础与能力边界', duration: '30 min', status: 'learned', hasAssignment: false },
  { id: 'ch2-2', courseId: 'course-2', lessonNo: 2, title: '提示词工程核心技巧', duration: '40 min', status: 'learned', hasAssignment: true },
  { id: 'ch2-3', courseId: 'course-2', lessonNo: 3, title: '结构化输出与 JSON 解析', duration: '35 min', status: 'learned', hasAssignment: true },
  { id: 'ch2-4', courseId: 'course-2', lessonNo: 4, title: '工具调用原理详解', duration: '45 min', status: 'learned', hasAssignment: true },
  { id: 'ch2-5', courseId: 'course-2', lessonNo: 5, title: 'RAG 检索增强生成', duration: '50 min', status: 'learned', hasAssignment: true },
  { id: 'ch2-6', courseId: 'course-2', lessonNo: 6, title: 'Agent 思维链与规划', duration: '42 min', status: 'learned', hasAssignment: false },
  { id: 'ch2-7', courseId: 'course-2', lessonNo: 7, title: '记忆系统设计', duration: '38 min', status: 'learned', hasAssignment: true },
  { id: 'ch2-8', courseId: 'course-2', lessonNo: 8, title: '阶段测验与知识巩固', duration: '60 min', status: 'learned', hasAssignment: true },

  // 多智能体协作架构（course-3，10课，未开始）
  { id: 'ch3-1', courseId: 'course-3', lessonNo: 1, title: '多智能体系统概述', duration: '30 min', status: 'not_started', hasAssignment: false },
  { id: 'ch3-2', courseId: 'course-3', lessonNo: 2, title: '角色画像与能力建模', duration: '40 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-3', courseId: 'course-3', lessonNo: 3, title: '任务拆解与分派机制', duration: '45 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-4', courseId: 'course-3', lessonNo: 4, title: '协作模式：层级 vs 扁平', duration: '38 min', status: 'not_started', hasAssignment: false },
  { id: 'ch3-5', courseId: 'course-3', lessonNo: 5, title: '通信协议设计', duration: '50 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-6', courseId: 'course-3', lessonNo: 6, title: '消息队列与事件驱动', duration: '45 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-7', courseId: 'course-3', lessonNo: 7, title: '冲突检测与仲裁机制', duration: '42 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-8', courseId: 'course-3', lessonNo: 8, title: '状态同步与一致性', duration: '48 min', status: 'not_started', hasAssignment: false },
  { id: 'ch3-9', courseId: 'course-3', lessonNo: 9, title: '性能监控与优化', duration: '40 min', status: 'not_started', hasAssignment: true },
  { id: 'ch3-10', courseId: 'course-3', lessonNo: 10, title: '架构实战演练', duration: '70 min', status: 'not_started', hasAssignment: true },

  // 工程化落地（course-4，9课，未开始）
  { id: 'ch4-1', courseId: 'course-4', lessonNo: 1, title: '前后端分离架构设计', duration: '35 min', status: 'not_started', hasAssignment: false },
  { id: 'ch4-2', courseId: 'course-4', lessonNo: 2, title: 'RESTful API 与接口规范', duration: '40 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-3', courseId: 'course-4', lessonNo: 3, title: 'WebSocket 实时通信', duration: '50 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-4', courseId: 'course-4', lessonNo: 4, title: '流式响应与 SSE', duration: '45 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-5', courseId: 'course-4', lessonNo: 5, title: 'LLM 多供应商路由', duration: '42 min', status: 'not_started', hasAssignment: false },
  { id: 'ch4-6', courseId: 'course-4', lessonNo: 6, title: '降级策略与容错设计', duration: '38 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-7', courseId: 'course-4', lessonNo: 7, title: '监控、日志与可观测性', duration: '45 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-8', courseId: 'course-4', lessonNo: 8, title: '部署与容器化', duration: '50 min', status: 'not_started', hasAssignment: true },
  { id: 'ch4-9', courseId: 'course-4', lessonNo: 9, title: '结业项目：工程化全栈', duration: '90 min', status: 'not_started', hasAssignment: true },
]