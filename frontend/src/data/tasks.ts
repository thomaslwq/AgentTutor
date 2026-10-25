// EXPORTS: ITask, MOCK_TASKS, TaskStatus

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask {
  id: string;
  title: string;
  roleId: string;
  roleName: string;
  roleColor: string;
  status: TaskStatus;
  projectId: string;
}

export const MOCK_TASKS: ITask[] = [
  // 项目 1：企业客服 Agent 系统
  {
    id: 't1',
    title: '梳理客服系统需求清单与边界',
    roleId: 'pm',
    roleName: '产品经理',
    roleColor: 'accent',
    status: 'todo',
    projectId: 'proj-1',
  },
  {
    id: 't2',
    title: '设计多智能体通信协议与消息格式',
    roleId: 'cto',
    roleName: 'CTO 架构师',
    roleColor: 'primary',
    status: 'todo',
    projectId: 'proj-1',
  },
  {
    id: 't3',
    title: '实现工单智能分派与优先级路由',
    roleId: 'be',
    roleName: '后端工程师',
    roleColor: 'info',
    status: 'in_progress',
    projectId: 'proj-1',
  },
  {
    id: 't4',
    title: '编写核心流程测试用例并回归',
    roleId: 'qa',
    roleName: '测试工程师',
    roleColor: 'purple',
    status: 'in_progress',
    projectId: 'proj-1',
  },
  {
    id: 't5',
    title: '拆解项目里程碑与角色分工表',
    roleId: 'cto',
    roleName: 'CTO 架构师',
    roleColor: 'primary',
    status: 'done',
    projectId: 'proj-1',
  },
  {
    id: 't6',
    title: '完成各角色画像与能力标签配置',
    roleId: 'pm',
    roleName: '产品经理',
    roleColor: 'accent',
    status: 'done',
    projectId: 'proj-1',
  },
  // 项目 2：多角色内容协作流水线
  {
    id: 't7',
    title: '内容选题与大纲策划',
    roleId: 'pm',
    roleName: '内容策划',
    roleColor: 'accent',
    status: 'done',
    projectId: 'proj-2',
  },
  {
    id: 't8',
    title: '正文撰写与素材整理',
    roleId: 'be',
    roleName: '文案撰写',
    roleColor: 'info',
    status: 'done',
    projectId: 'proj-2',
  },
  {
    id: 't9',
    title: '多渠道排版与发布',
    roleId: 'cto',
    roleName: '运营专员',
    roleColor: 'primary',
    status: 'done',
    projectId: 'proj-2',
  },
  // 项目 3：代码审查智能体团队
  {
    id: 't10',
    title: '代码审查规则与标准制定',
    roleId: 'cto',
    roleName: '技术主管',
    roleColor: 'primary',
    status: 'todo',
    projectId: 'proj-3',
  },
  {
    id: 't11',
    title: '审查智能体角色配置',
    roleId: 'pm',
    roleName: '产品经理',
    roleColor: 'accent',
    status: 'todo',
    projectId: 'proj-3',
  },
];
