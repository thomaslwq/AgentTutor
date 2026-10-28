// EXPORTS: ITransaction, MOCK_TRANSACTIONS
export interface ITransaction {
  id: string
  type: 'recharge' | 'purchase'
  amount: number
  method?: 'wechat' | 'alipay'
  bonus?: number
  courseId?: string
  title: string
  createdAt: string
}

export const MOCK_TRANSACTIONS: ITransaction[] = [
  {
    id: 'tx-1',
    type: 'recharge',
    amount: 699,
    bonus: 100,
    method: 'wechat',
    title: '充值 · ¥699 套餐（微信支付）',
    createdAt: '2026-09-20 20:15',
  },
  {
    id: 'tx-2',
    type: 'purchase',
    amount: 199,
    courseId: '2',
    title: '购买课程 · Agent 原理入门：大模型、提示词与工具调用',
    createdAt: '2026-09-22 14:32',
  },
  {
    id: 'tx-3',
    type: 'purchase',
    amount: 499,
    courseId: '1',
    title: '购买课程 · 多智能体 Agent 实战训练营',
    createdAt: '2026-10-08 09:47',
  },
]
