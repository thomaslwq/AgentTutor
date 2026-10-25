// EXPORTS: ICommunication, MOCK_COMMUNICATIONS

export interface ICommunication {
  id: string;
  roleId: string;
  roleName: string;
  roleColor: string;
  content: string;
  timestamp: string;
  projectId: string;
}

export const MOCK_COMMUNICATIONS: ICommunication[] = [
  {
    id: 'com1',
    roleId: 'cto',
    roleName: 'CTO 架构师',
    roleColor: 'primary',
    content: '需求清单已提交到看板，通信协议草案已同步至共享文档。',
    timestamp: '10:20',
    projectId: 'proj-1',
  },
  {
    id: 'com2',
    roleId: 'be',
    roleName: '后端工程师',
    roleColor: 'info',
    content: '工单分派模块开发完成 80%，待测试用例就绪后联调。',
    timestamp: '10:25',
    projectId: 'proj-1',
  },
  {
    id: 'com3',
    roleId: 'pm',
    roleName: '产品经理',
    roleColor: 'accent',
    content: '客服系统需求边界已梳理完成，共 12 个核心场景待评审。',
    timestamp: '10:15',
    projectId: 'proj-1',
  },
];
