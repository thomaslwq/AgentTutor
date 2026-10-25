// EXPORTS: ITutorReplyRule, MOCK_TUTOR_REPLIES, getTutorReply

export interface ITutorReplyRule {
  keywords: string[];
  reply: string;
}

export const MOCK_TUTOR_REPLIES: ITutorReplyRule[] = [
  {
    keywords: ['任务', '分工', '分配', 'cto', '角色', '职责'],
    reply: '按角色职责划分：CTO 负责架构设计与任务拆解，后端工程师负责编码执行，产品经理先确认需求边界；每个角色只处理自己职责范围内的子任务，避免越权导致协作混乱。',
  },
  {
    keywords: ['看板', '状态', '更新', '进度', '完成'],
    reply: '智能体完成子任务后会自动回写看板状态，你也可以在看板上手动调整；系统会记录每一次状态变更，便于后期复盘与协作追溯。',
  },
  {
    keywords: ['课程', '学习', '进度', '几课', '剩余'],
    reply: '当前你正在学习「多智能体 Agent 实战训练营」第 7 课，课程进度 58%，预计还剩 3 周完成全部内容。坚持每天学习，有任何问题随时问我。',
  },
  {
    keywords: ['作业', '批改', '提交', '评分', '反馈'],
    reply: '作业提交后 AI 导师会在 24 小时内生成初步批改反馈，包括知识点评分、工程落地评分以及详细的改进建议。你可以在作业卡中点击「查看反馈」查看详细批改内容。',
  },
  {
    keywords: ['通信', '协议', '消息', '格式'],
    reply: '多智能体之间的通信采用标准化消息协议，包含消息头（发送方、接收方、消息类型）、消息体（结构化 JSON 内容）和确认机制。建议参考课程第 4 讲的通信协议设计章节。',
  },
  {
    keywords: ['实战', '项目', '平台', '智能体'],
    reply: '实战平台支持自定义角色配置、任务看板管理和角色通信协作。你当前的项目「企业客服 Agent 系统」有 4 个智能体角色、6 项任务正在推进，可以在右侧看板中查看详细进度。',
  },
  {
    keywords: ['社群', '打卡', '互评', '助教'],
    reply: '学员社群提供助教答疑、学习打卡、同伴互评和阶段复盘四大功能。你可以在「学员社群」页面参与每日打卡、互评同伴作业，助教也会定期组织阶段复盘。',
  },
];

export function getTutorReply(question: string): string {
  const lower = question.toLowerCase();
  for (const rule of MOCK_TUTOR_REPLIES) {
    if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return rule.reply;
    }
  }
  return '这是一个很好的问题。建议你结合课程内容和实战项目来理解，可以先回顾一下相关章节的知识点，也可以在学员社群中和同学们讨论。如果需要更深入的讲解，随时告诉我你的具体困惑点，我会进一步展开说明。';
}
