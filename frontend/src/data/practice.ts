// EXPORTS: IScoreDimension, IPracticeScenario, IPracticeReplyRule, MOCK_PRACTICE_SCENARIOS, PRACTICE_REPLY_RULES, PRACTICE_FALLBACK_REPLIES, getScenarioByRoleId

/** 维度评分项：原型阶段用关键词覆盖度做规则打分，接入 LLM 后可替换为语义评分 */
export interface IScoreDimension {
  id: string;
  name: string;
  description: string;
  /** 权重，四项之和为 1 */
  weight: number;
  /** 规则评分使用的行为关键词 */
  keywords: string[];
}

/** 一次角色陪练的完整剧本 */
export interface IPracticeScenario {
  id: string;
  roleId: string;
  title: string;
  brief: string;
  background: string;
  openingLine: string;
  objectives: string[];
  dimensions: IScoreDimension[];
  tips: string[];
  /** 可直接说出口的对话灵感，点击后填入输入框 */
  inspirations: string[];
}

export interface IPracticeReplyRule {
  keywords: string[];
  reply: string;
}

export const MOCK_PRACTICE_SCENARIOS: IPracticeScenario[] = [
  {
    id: 'practice-cto',
    roleId: 'cto',
    title: '架构评审：客服 Agent 的多轮上下文方案',
    brief: '向 CTO 说明会话记忆方案，并争取在周五前冻结架构。',
    background:
      '第 4 期训练营 · 企业客服 Agent 系统。当前消息链路频繁超时，CTO 对新增向量库持保留意见。',
    openingLine:
      '先对齐一下：你这个方案要新增一个向量库，为什么不能直接在现有数据库上做？给我一个不增加运维成本的理由。',
    objectives: ['说明方案与现有架构的兼容性', '给出可验证的取舍依据', '明确风险与回滚方案'],
    tips: ['先复述 CTO 的顾虑，再给结论', '用一个具体指标支撑你的判断', '主动说明失败时的回滚路径'],
    inspirations: [
      '我理解你担心新增组件带来的运维成本，先说结论：我们复用现有 PostgreSQL，不引入新的存储。',
      '按上周压测数据，改造后 P95 延迟从 800ms 降到 300ms，样本是近一周的真实会话。',
      '如果上线后错误率超过 1%，我们 10 分钟内切回旧链路，回滚脚本已经演练过两次。',
    ],
    dimensions: [
      {
        id: 'fit',
        name: '方案兼容性',
        description: '能否说明新方案与现有架构、现有链路的衔接方式与改造边界。',
        weight: 0.35,
        keywords: ['现有架构', '兼容', '复用', '改造', '迁移', '数据库', '链路'],
      },
      {
        id: 'evidence',
        name: '依据与数据',
        description: '是否用可验证的指标、压测结果或成本数据支撑判断，而不是只讲结论。',
        weight: 0.4,
        keywords: ['数据', '指标', '压测', '延迟', '耗时', '成本', 'qps', '%'],
      },
      {
        id: 'risk',
        name: '风险与回滚',
        description: '是否主动识别风险，并给出灰度、回滚或降级方案。',
        weight: 0.25,
        keywords: ['风险', '回滚', '降级', '兜底', '灰度', '监控', '失败'],
      },
    ],
  },
  {
    id: 'practice-pm',
    roleId: 'pm',
    title: '需求变更：上线前新增导出功能',
    brief: '与 PM 对齐新增导出功能的范围与时间，守住本期交付边界。',
    background: '距离提测只剩 3 天，PM 希望增加 Excel 导出，研发侧只剩 1 人可投入。',
    openingLine: '业务方明天要看演示，导出这块能不能先加上？不用太复杂，能导出就行。',
    objectives: ['澄清真实业务目标', '给出范围取舍方案', '确认变更后的时间与责任'],
    tips: ['先问业务方到底要拿数据做什么', '给出「本期最小可用 + 下期完整」两档方案', '把变更后的提测时间写入共同确认'],
    inspirations: [
      '我想先确认一下：业务方明天演示，是要展示导出结果，还是需要他们自己操作导出？',
      '本期我建议只做固定字段导出，筛选和自定义列放到下期，这样能赶在提测前完成。',
      '如果范围按这个版本冻结，我可以在周三下班前给到提测包，验收标准我们明天上午确认。',
    ],
    dimensions: [
      {
        id: 'goal',
        name: '目标澄清',
        description: '是否先确认业务目标与使用场景，而不是直接接受或拒绝需求。',
        weight: 0.35,
        keywords: ['业务', '目标', '用户', '场景', '价值', '为什么', '用途'],
      },
      {
        id: 'scope',
        name: '范围取舍',
        description: '是否给出明确的最小范围、优先级与分期方案。',
        weight: 0.4,
        keywords: ['范围', '本期', '优先级', '取舍', '最小', '分期', '下期'],
      },
      {
        id: 'commitment',
        name: '时间与责任',
        description: '是否锁定新的提测时间、验收方式与双方责任。',
        weight: 0.25,
        keywords: ['时间', '提测', '上线', '节点', '责任', '确认', '验收'],
      },
    ],
  },
  {
    id: 'practice-be',
    roleId: 'be',
    title: '接口延期：推动后端给出可交付时间',
    brief: '推动后端明确接口交付时间与降级方案，保证前端联调不被阻塞。',
    background: '前端已按 mock 完成页面，后端接口延期 2 天且未给出新的时间点。',
    openingLine: '这个接口我这边还有两个项目在并行，具体时间我现在给不了，先按你们 mock 联调不行吗？',
    objectives: ['确认延期的真实原因', '拿到分阶段交付时间', '约定联调与兜底方案'],
    tips: ['先问清阻塞点，而不是催时间', '把接口拆成「先可联调 / 后完整」两阶段', '明确字段冻结时间，避免返工'],
    inspirations: [
      '我先了解一下：现在卡住你的是接口设计，还是这周另一个项目的上线？',
      '能不能先拆分一下：查询接口明天给，写入接口周四给，前端先用 mock 字段联调？',
      '字段结构我们今天冻结，如果后面要改，我们约定只做增量，不做返工。',
    ],
    dimensions: [
      {
        id: 'diagnosis',
        name: '原因确认',
        description: '是否先定位延期的真实原因与资源约束。',
        weight: 0.35,
        keywords: ['原因', '阻塞', '依赖', '排期', '并行', '工时', '困难'],
      },
      {
        id: 'milestone',
        name: '分阶段交付',
        description: '是否争取到可执行的分阶段时间点，而不是模糊的「尽快」。',
        weight: 0.4,
        keywords: ['分阶段', '先', '接口', '联调', '时间', '周三', '周四', '明天', '今天'],
      },
      {
        id: 'fallback',
        name: '兜底方案',
        description: '是否约定 mock、降级或临时方案，并明确切换条件。',
        weight: 0.25,
        keywords: ['mock', '兜底', '降级', '临时', '假数据', '切换'],
      },
    ],
  },
  {
    id: 'practice-qa',
    roleId: 'qa',
    title: '上线标准争议：与 QA 达成发布共识',
    brief: '与 QA 就本期上线标准达成一致，明确必须修复与可延后的缺陷范围。',
    background: '距上线 1 天，QA 坚持 3 个 P2 缺陷全部修复，PM 希望按时发布。',
    openingLine: '这 3 个 P2 不修就上线，出了问题谁负责？我不能签这个字。',
    objectives: ['区分缺陷风险等级', '给出可接受的发布条件', '形成双方认可的责任边界'],
    tips: ['先把缺陷按影响面分级，而不是按标签争论', '用灰度与监控换取发布时间', '把风险清单和责任人写清楚'],
    inspirations: [
      '我们先把三个缺陷按影响面分级：哪几个会影响下单，哪几个只是展示问题？',
      '如果按灰度发布，前 10% 流量观察 2 小时，错误率低于 0.5% 再全量，你能接受吗？',
      '发布前我会把风险清单和责任人写进上线单，出问题按清单回溯，不需要你个人签字背锅。',
    ],
    dimensions: [
      {
        id: 'risk',
        name: '风险分级',
        description: '是否基于影响面与发生概率对缺陷进行分级，而不是笼统处理。',
        weight: 0.4,
        keywords: ['p0', 'p1', 'p2', '等级', '风险', '影响', '严重', '概率'],
      },
      {
        id: 'release',
        name: '发布条件',
        description: '是否给出明确的发布条件、灰度策略与监控方案。',
        weight: 0.35,
        keywords: ['发布', '上线', '条件', '标准', '验收', '灰度', '监控'],
      },
      {
        id: 'boundary',
        name: '责任边界',
        description: '是否明确风险清单、责任人与问题回溯方式。',
        weight: 0.25,
        keywords: ['责任', '签字', '谁', '回溯', '记录', '确认', '清单'],
      },
    ],
  },
];

export const PRACTICE_REPLY_RULES: Record<string, IPracticeReplyRule[]> = {
  'practice-cto': [
    {
      keywords: ['数据', '压测', '延迟', 'qps', '指标'],
      reply: '这个数据是压测出来的还是估算的？样本量多大？如果只在测试环境成立，说服不了我。',
    },
    {
      keywords: ['回滚', '降级', '兜底', '灰度'],
      reply: '回滚这块你提到了一部分。回滚需要多久？切换期间用户会话会不会丢？',
    },
    {
      keywords: ['兼容', '复用', '现有', '改造'],
      reply: '复用现有能力我认可，但改造边界在哪里？会不会影响现在的客服链路？',
    },
    {
      keywords: ['周五', '时间', '节点', '冻结'],
      reply: '时间我可以给，但前提是方案今天冻结。你准备什么时候把评审结论给我？',
    },
    {
      keywords: ['风险', '失败', '监控'],
      reply: '风险你列了，但我要知道触发条件。出现什么信号时我们决定回滚？',
    },
  ],
  'practice-pm': [
    {
      keywords: ['导出', 'excel', '表格'],
      reply: '导出本身不难，业务方明天就要看。你能不能先给我一个最小可用的范围？',
    },
    {
      keywords: ['范围', '取舍', '优先级', '最小', '分期'],
      reply: '如果只做一部分，业务方那边我去沟通，但你得告诉我哪部分必须本期做。',
    },
    {
      keywords: ['时间', '提测', '上线', '节点'],
      reply: '时间我理解，但业务方只会记住上线日期。你能不能给我一个明确的提测时间？',
    },
    {
      keywords: ['替代', '手工', '临时', '下期'],
      reply: '手工方案能撑多久？如果这周每天都有一批导出，谁来兜？',
    },
    {
      keywords: ['业务', '目标', '场景', '用户'],
      reply: '业务方要的是明天演示能拿出数据，不一定非要完整导出。你觉得最小可用怎么定义？',
    },
  ],
  'practice-be': [
    {
      keywords: ['时间', '多久', '什么时候', '哪天'],
      reply: '我这周还有另一个项目要上线，最快也只能先给你一个查询接口，写入的要往后排。',
    },
    {
      keywords: ['分阶段', '先', '一部分', '拆'],
      reply: '分阶段可以，但你得说清楚先要哪几个字段，不然我拆不出来。',
    },
    {
      keywords: ['mock', '假数据', '联调', '字段'],
      reply: 'mock 你们先联调没问题，但字段结构今天得定，不然我后面改一次你们全要返工。',
    },
    {
      keywords: ['原因', '并行', '工时', '阻塞', '依赖'],
      reply: '原因不复杂，就是两个项目撞一起了。你要具体时间，我得先跟另一个项目对一下。',
    },
    {
      keywords: ['兜底', '降级', '临时', '切换'],
      reply: '兜底方案你们先想，我这边能保证的是查询接口先通，写入接口我不会给你一个假时间。',
    },
  ],
  'practice-qa': [
    {
      keywords: ['p2', '等级', '优先级', '分级'],
      reply: 'P2 也分情况。这三个里有两个会影响下单，你告诉我哪个可以先放？',
    },
    {
      keywords: ['上线', '发布', '时间'],
      reply: '按时上线可以谈，但出了线上问题，测试不能替研发背这个锅。',
    },
    {
      keywords: ['灰度', '监控', '回滚'],
      reply: '灰度可以，那灰度期间谁盯监控？出了问题多久回滚？',
    },
    {
      keywords: ['责任', '签字', '谁负责'],
      reply: '签字不是目的，我要的是发布前把风险清单和责任人写清楚。',
    },
    {
      keywords: ['影响', '风险', '严重', '概率'],
      reply: '你按影响面分级我同意，但分级标准要写下来，不能到线上再各说各话。',
    },
  ],
};

export const PRACTICE_FALLBACK_REPLIES: Record<string, string[]> = {
  'practice-cto': [
    '你说的方向我听到了，但还不够具体。落到架构上，改动哪几个模块？',
    '先别讲愿景，讲取舍：这个方案放弃了什么，换来了什么？',
    '我关心的不是方案新不新，是出了问题能不能兜住。继续。',
  ],
  'practice-pm': [
    '我理解你的顾虑，但业务方的演示时间已经定了。你能给我一个可执行的替代方案吗？',
    '先把话说完：本期到底能交付什么，不能交付什么？',
    '这个点我需要你给结论，不然我没法跟业务方同步。',
  ],
  'practice-be': [
    '你先说清楚要什么，我才能判断能不能给时间。具体是哪个接口、哪些字段？',
    '我这边不是不配合，是排期已经满了。你给我一个能接受的先后顺序。',
    '这个场景我还没完全理解，你再说具体一点。',
  ],
  'practice-qa': [
    '你说的我听到了，但风险不能靠感觉判断。具体影响哪条链路？',
    '发布标准要先说清楚，不然测试没法给结论。',
    '如果上线后真出问题，你希望我拿什么依据来判断是否回滚？',
  ],
};

export function getScenarioByRoleId(roleId: string): IPracticeScenario | undefined {
  return MOCK_PRACTICE_SCENARIOS.find((s) => s.roleId === roleId);
}
