// EXPORTS:
//   IQaTopic, MOCK_QA_TOPICS,
//   ICheckin, MOCK_CHECKINS,
//   IPeerReview, MOCK_PEER_REVIEWS,
//   IReviewPost, MOCK_REVIEW_POSTS

// —— 助教答疑话题 ——
export interface IQaTopic {
  id: string;
  title: string;
  author: string;
  avatarInitial: string;
  replyCount: number;
  lastReplyTime: string;
  tags: string[];
  content: string;
  replies: { author: string; content: string; time: string; isInstructor: boolean }[];
}

export const MOCK_QA_TOPICS: IQaTopic[] = [
  {
    id: 'qa1',
    title: '多智能体系统中，如何设计合理的任务拆解粒度？',
    author: '张明远',
    avatarInitial: '张',
    replyCount: 8,
    lastReplyTime: '2 小时前',
    tags: ['协作架构', '任务分派'],
    content:
      '在做实战项目时，发现任务拆得太细会导致协作 overhead 太高，拆得太粗又没法并行推进。想请教大家一般怎么把握这个粒度？有没有什么原则可以参考？',
    replies: [
      {
        author: '李助教',
        content:
          '好问题！推荐一个判断原则：每个子任务应该能被一个角色独立完成，且完成时间控制在 2-4 小时以内。如果一个任务需要多个角色反复沟通，说明拆得还不够；如果一个任务 30 分钟就能做完，说明可能拆太细了。',
        time: '2 小时前',
        isInstructor: true,
      },
      {
        author: '王同学',
        content: '补充一下：我一般按「可验收」来拆，每个子任务都要有明确的交付物和验收标准，这样角色之间不容易扯皮。',
        time: '1 小时前',
        isInstructor: false,
      },
    ],
  },
  {
    id: 'qa2',
    title: 'ReAct 模式下，工具调用失败后怎么优雅重试？',
    author: '李思涵',
    avatarInitial: '李',
    replyCount: 5,
    lastReplyTime: '昨天',
    tags: ['Agent 原理', '工具调用'],
    content:
      '在调用外部 API 工具时，经常遇到超时或返回格式不对的情况。直接重试又可能造成死循环，想问问大家有什么好的重试策略？',
    replies: [
      {
        author: '陈助教',
        content:
          '建议采用指数退避 + 最大重试次数的策略，同时每次重试前让 Agent 先反思失败原因，而不是盲目重调。可以结合课程第 6 讲的错误处理章节来看。',
        time: '昨天',
        isInstructor: true,
      },
    ],
  },
  {
    id: 'qa3',
    title: '前后端分离项目中，WebSocket 连接管理最佳实践',
    author: '赵一鸣',
    avatarInitial: '赵',
    replyCount: 12,
    lastReplyTime: '3 天前',
    tags: ['工程化', '实时通信'],
    content:
      '在做多智能体平台的实时消息推送时，发现 WebSocket 断线重连、消息去重、心跳检测这些细节挺容易出 bug 的。想收集一下大家的工程实践经验。',
    replies: [
      {
        author: '刘助教',
        content:
          '推荐几个关键点：1) 心跳间隔建议 30s，超时 3 次判定断线；2) 消息必须带唯一 ID，前端做去重；3) 重连后要做状态同步，不能假设服务端状态没变。具体可以参考工程化第 3 讲。',
        time: '3 天前',
        isInstructor: true,
      },
    ],
  },
  {
    id: 'qa4',
    title: 'RAG 检索召回率低怎么办？向量库选型求助',
    author: '孙晓峰',
    avatarInitial: '孙',
    replyCount: 6,
    lastReplyTime: '4 天前',
    tags: ['Agent 原理', 'RAG'],
    content:
      '目前用的是 openAI embedding + 某开源向量库，发现召回率大概只有 60% 左右，很多相关文档搜不出来。是 embedding 模型的问题还是检索策略的问题？',
    replies: [
      {
        author: '周助教',
        content:
          '召回率低通常有几个排查方向：1) 文本切块策略是否合理；2) 是否做了查询改写（query rewriting）；3) 是否结合了关键词检索做 hybrid search。建议先从 query rewriting 入手，见效最快。',
        time: '4 天前',
        isInstructor: true,
      },
    ],
  },
  {
    id: 'qa5',
    title: '组队求带！第 5 期代码审查项目还缺 2 人',
    author: '吴佳琪',
    avatarInitial: '吴',
    replyCount: 3,
    lastReplyTime: '5 天前',
    tags: ['组队', '招募'],
    content: '我们组目前有 2 人，还差后端和测试角色。有兴趣一起做代码审查智能体项目的同学欢迎留言！',
    replies: [
      {
        author: '郑同学',
        content: '我可以做后端！怎么联系你？',
        time: '5 天前',
        isInstructor: false,
      },
    ],
  },
];

// —— 学习打卡 ——
export interface ICheckin {
  id: string;
  userId: string;
  userName: string;
  avatarInitial: string;
  content: string;
  time: string;
  dayStreak: number;
}

export const MOCK_CHECKINS: ICheckin[] = [
  {
    id: 'ck1',
    userId: 'u1',
    userName: '林同学',
    avatarInitial: '林',
    content: '今天完成了第 7 课「协作流程设计」的学习，开始做第三次作业。多智能体协作的模式比想象中复杂，继续加油！',
    time: '今天 09:30',
    dayStreak: 12,
  },
  {
    id: 'ck2',
    userId: 'u2',
    userName: '张明远',
    avatarInitial: '张',
    content: '打卡第 8 天，复习了通信协议设计那一章，对消息格式和序列化有了更深的理解。',
    time: '今天 08:15',
    dayStreak: 8,
  },
  {
    id: 'ck3',
    userId: 'u3',
    userName: '李思涵',
    avatarInitial: '李',
    content: '完成作业 2 提交，等导师批改中。顺便预习了下一章的冲突检测内容。',
    time: '昨天 22:40',
    dayStreak: 15,
  },
  {
    id: 'ck4',
    userId: 'u4',
    userName: '赵一鸣',
    avatarInitial: '赵',
    content: '实战项目推进中，工单分派模块写了 80%，明天联调测试。',
    time: '昨天 21:10',
    dayStreak: 6,
  },
  {
    id: 'ck5',
    userId: 'u5',
    userName: '王同学',
    avatarInitial: '王',
    content: '今天学习了状态同步机制，结合实战项目理解更深刻了。',
    time: '昨天 19:25',
    dayStreak: 10,
  },
];

// 本周打卡成员（用于头像展示）
export interface IWeeklyMember {
  id: string;
  name: string;
  avatarInitial: string;
  checkinDays: number;
}

export const MOCK_WEEKLY_MEMBERS: IWeeklyMember[] = [
  { id: 'u1', name: '林同学', avatarInitial: '林', checkinDays: 5 },
  { id: 'u2', name: '张明远', avatarInitial: '张', checkinDays: 5 },
  { id: 'u3', name: '李思涵', avatarInitial: '李', checkinDays: 6 },
  { id: 'u4', name: '赵一鸣', avatarInitial: '赵', checkinDays: 4 },
  { id: 'u5', name: '王同学', avatarInitial: '王', checkinDays: 5 },
  { id: 'u6', name: '孙晓峰', avatarInitial: '孙', checkinDays: 3 },
  { id: 'u7', name: '吴佳琪', avatarInitial: '吴', checkinDays: 6 },
  { id: 'u8', name: '郑同学', avatarInitial: '郑', checkinDays: 2 },
];

// —— 同伴互评 ——
export interface IPeerReview {
  id: string;
  studentName: string;
  avatarInitial: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'pending' | 'scored';
  knowledgeScore?: number;
  engineeringScore?: number;
}

export const MOCK_PEER_REVIEWS: IPeerReview[] = [
  {
    id: 'pr1',
    studentName: '张明远',
    avatarInitial: '张',
    assignmentTitle: '作业 3 · 多智能体协作流程设计',
    submittedAt: '2 天前',
    status: 'pending',
  },
  {
    id: 'pr2',
    studentName: '李思涵',
    avatarInitial: '李',
    assignmentTitle: '作业 3 · 多智能体协作流程设计',
    submittedAt: '1 天前',
    status: 'pending',
  },
  {
    id: 'pr3',
    studentName: '赵一鸣',
    avatarInitial: '赵',
    assignmentTitle: '作业 3 · 多智能体协作流程设计',
    submittedAt: '3 天前',
    status: 'scored',
    knowledgeScore: 4,
    engineeringScore: 4,
  },
];

// —— 阶段复盘 ——
export interface IReviewQa {
  question: string;
  answer: string;
}

export interface IReviewPost {
  id: string;
  title: string;
  subtitle: string;
  highlights: IReviewQa[];
}

export const MOCK_REVIEW_POSTS: IReviewPost[] = [
  {
    id: 'rv1',
    title: '第 4 期训练营 · 第三周阶段复盘',
    subtitle: 'CTO 导师主讲 · 多智能体协作常见误区与避坑指南',
    highlights: [
      {
        question: '学员最容易在多智能体协作中踩什么坑？',
        answer:
          '三个最高频的坑：第一是角色职责不清晰，导致「谁都能管 = 谁都不管」；第二是通信协议设计太随意，消息格式一改全链路都要改；第三是缺少状态同步机制，各智能体的世界观不一致。这三个坑在实战项目里几乎每一组都会遇到。',
      },
      {
        question: '怎么判断一个任务应该拆给哪个角色？',
        answer:
          '一个简单的判断框架：这个任务需要什么核心能力？需要决策判断的给 CTO，需要需求理解和验收的给 PM，需要写代码实现的给 BE，需要验证和找 bug 的给 QA。当你纠结给谁时，想想「这个任务做砸了谁来背锅」，背锅的人就是最合适的执行者。',
      },
      {
        question: '多智能体系统的性能瓶颈通常出在哪里？',
        answer:
          '大多数情况下瓶颈不在大模型调用速度，而在「等待」——A 等 B 的输出，B 等 C 的确认。所以优化方向不是让每个智能体更快，而是减少串行等待，尽可能并行化。好的任务拆解和依赖关系设计比调优单个智能体的响应速度重要 10 倍。',
      },
    ],
  },
];
