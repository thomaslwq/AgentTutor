// EXPORTS: IAgentRole, MOCK_AGENT_ROLES

export interface IAgentRole {
  id: string;
  name: string;
  shortCode: string;
  color: 'primary' | 'accent' | 'info' | 'purple';
  bgClass: string;
  description: string;
}

export const MOCK_AGENT_ROLES: IAgentRole[] = [
  {
    id: 'cto',
    name: 'CTO 架构师',
    shortCode: 'CT',
    color: 'primary',
    bgClass: 'bg-primary',
    description: '架构拆解 · 任务分派',
  },
  {
    id: 'pm',
    name: '产品经理',
    shortCode: 'PM',
    color: 'accent',
    bgClass: 'bg-accent',
    description: '需求梳理 · 验收确认',
  },
  {
    id: 'be',
    name: '后端工程师',
    shortCode: 'BE',
    color: 'info',
    bgClass: 'bg-info',
    description: '代码执行 · 接口实现',
  },
  {
    id: 'qa',
    name: '测试工程师',
    shortCode: 'QA',
    color: 'purple',
    bgClass: 'bg-[rgb(139_92_246)]',
    description: '用例校验 · 缺陷回归',
  },
];
