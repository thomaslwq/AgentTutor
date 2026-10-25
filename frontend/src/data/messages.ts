// EXPORTS: IMessage, MOCK_MESSAGES
export interface IMessage {
  id: string
  role: 'student' | 'tutor'
  content: string
  timestamp: string
}

export const MOCK_MESSAGES: IMessage[] = [
  {
    id: '1',
    role: 'student',
    content: '多智能体之间应该怎么分配任务给 CTO 和开发工程师？',
    timestamp: '10:23',
  },
  {
    id: '2',
    role: 'tutor',
    content: '按角色职责划分：CTO 负责架构设计与任务拆解，后端工程师负责编码执行，产品经理先确认需求边界；每个角色只处理自己职责范围内的子任务。',
    timestamp: '10:23',
  },
  {
    id: '3',
    role: 'student',
    content: '那看板上的任务状态由谁更新？',
    timestamp: '10:25',
  },
  {
    id: '4',
    role: 'tutor',
    content: '智能体完成子任务后会自动回写看板状态，你也可以在看板上手动调整；系统会记录每一次状态变更，便于复盘。',
    timestamp: '10:25',
  },
]