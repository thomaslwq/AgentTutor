// EXPORTS: IHomework, MOCK_HOMEWORK_FEEDBACK

export interface IHomeworkFeedback {
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

export interface IHomework {
  id: string;
  title: string;
  subtitle: string;
  knowledgeScore: number;
  engineeringScore: number;
  feedback: IHomeworkFeedback;
}

export const MOCK_HOMEWORK_FEEDBACK: IHomework = {
  id: 'hw-3',
  title: '作业 3 · 多智能体协作流程设计',
  subtitle: '待批改 · 已生成导师批改建议与讲解要点',
  knowledgeScore: 4,
  engineeringScore: 3,
  feedback: {
    strengths: [
      '角色职责划分清晰，CTO / PM / BE / QA 四角色边界明确',
      '任务拆解逻辑合理，里程碑节点安排得当',
      '通信协议设计考虑了异步消息与确认机制',
    ],
    improvements: [
      '缺少冲突检测与仲裁机制的设计，多智能体意见不一致时如何处理未说明',
      '工程落地部分缺少具体的技术选型方案与架构图',
      '错误重试与降级策略描述较简略，未覆盖关键故障场景',
    ],
    suggestions: [
      '建议补充「冲突仲裁」章节，设计当 PM 需求与 BE 实现方案冲突时的 escalation 路径',
      '可参考课程第 8 讲「协作编排模式」中的 Supervisor 模式，增加协调者角色',
      '工程落地方面建议画出时序图，明确消息流转顺序与异常分支处理',
    ],
  },
};
