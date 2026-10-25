// EXPORTS: IProject, MOCK_PROJECTS, ProjectStatus

export type ProjectStatus = 'ongoing' | 'completed' | 'not_started';

export interface IProject {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  statusLabel: string;
  studentCount: number | string;
  roleCount: number;
}

export const MOCK_PROJECTS: IProject[] = [
  {
    id: 'proj-1',
    title: '企业客服 Agent 系统',
    subtitle: '第 4 期训练营 · 6 名学员分组完成',
    status: 'ongoing',
    statusLabel: '进行中',
    studentCount: 6,
    roleCount: 4,
  },
  {
    id: 'proj-2',
    title: '多角色内容协作流水线',
    subtitle: '第 3 期训练营 · 5 名学员分组完成',
    status: 'completed',
    statusLabel: '已完成',
    studentCount: 5,
    roleCount: 5,
  },
  {
    id: 'proj-3',
    title: '代码审查智能体团队',
    subtitle: '第 5 期训练营 · 待组队',
    status: 'not_started',
    statusLabel: '未开始',
    studentCount: '待组队',
    roleCount: 4,
  },
];
