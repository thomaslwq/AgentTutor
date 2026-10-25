// EXPORTS: ITutor, MOCK_TUTOR
export interface ITutor {
  id: string
  name: string
  avatarInitial: string
  isOnline: boolean
  description: string
  totalAnswers: number
  satisfactionRate: number
}

export const MOCK_TUTOR: ITutor = {
  id: '1',
  name: 'AgentTutor 数字人导师',
  avatarInitial: 'T',
  isOnline: true,
  description: '主讲方法论沉淀 · 标准化答疑陪练 · 作业批改反馈',
  totalAnswers: 1286,
  satisfactionRate: 96,
}