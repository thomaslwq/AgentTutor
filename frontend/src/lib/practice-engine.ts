// EXPORTS: ICoachFeedback, IDimensionResult, IPracticeReport, generateRoleReply, generateCoachFeedback, evaluatePractice

import type { IAgentRole } from '@/data/agent-roles'
import {
  PRACTICE_FALLBACK_REPLIES,
  PRACTICE_REPLY_RULES,
  type IPracticeScenario,
  type IScoreDimension,
} from '@/data/practice'
import type { IMessage } from '@/data/messages'

export interface ICoachFeedback {
  tone: 'positive' | 'hint'
  title: string
  detail: string
  suggestion: string
}

export interface IDimensionResult extends IScoreDimension {
  score: number
  evidence: string[]
  comment: string
}

export interface IPracticeReport {
  totalScore: number
  level: string
  dimensionResults: IDimensionResult[]
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  hiddenAgenda: string
  studentTurnCount: number
}

function normalize(text: string): string {
  return text.toLowerCase()
}

function matchedKeywords(dimension: IScoreDimension, text: string): string[] {
  const normalized = normalize(text)
  return dimension.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()))
}

/** 按关键词规则生成角色回复；同一场景内尽量不连续复用同一句 */
export function generateRoleReply(scenarioId: string, message: string, turnIndex: number): string {
  const normalized = normalize(message)
  const rules = PRACTICE_REPLY_RULES[scenarioId] ?? []
  const matched = rules.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
  )
  if (matched) return matched.reply

  const fallbacks = PRACTICE_FALLBACK_REPLIES[scenarioId] ?? ['你继续，我在听。']
  return fallbacks[turnIndex % fallbacks.length]
}

const POSITIVE_SIGNALS: { keywords: string[]; title: string; detail: string }[] = [
  {
    keywords: ['为什么', '原因', '目标', '诉求', '顾虑'],
    title: '先探询再回应',
    detail: '你在表达立场前先确认了对方的真实诉求，这能显著降低对话对抗性。',
  },
  {
    keywords: ['数据', '指标', '压测', '耗时', '成本', '%'],
    title: '用数据支撑判断',
    detail: '你引用了可验证的指标，让结论从「我觉得」变成了「可以验证」。',
  },
  {
    keywords: ['风险', '回滚', '降级', '兜底', '灰度', '监控'],
    title: '主动管理风险',
    detail: '你主动给出了失败路径，对方对交付确定性的顾虑会明显下降。',
  },
  {
    keywords: ['时间', '节点', '提测', '明天', '今天', '周五'],
    title: '锚定了时间点',
    detail: '你把讨论收敛到了具体时间，避免对话停留在「尽快」。',
  },
  {
    keywords: ['范围', '优先级', '取舍', '分期', '最小'],
    title: '给出了取舍方案',
    detail: '你没有直接承诺全部，而是提供了可分期的范围，便于对方做决策。',
  },
]

/** 实时点评：针对学员刚发出的一句话给出即时反馈 */
export function generateCoachFeedback(scenario: IPracticeScenario, message: string): ICoachFeedback {
  const normalized = normalize(message)
  const positive = POSITIVE_SIGNALS.find((signal) =>
    signal.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())),
  )

  if (positive) {
    return {
      tone: 'positive',
      title: positive.title,
      detail: positive.detail,
      suggestion: scenario.tips[0],
    }
  }

  if (message.trim().length < 12) {
    return {
      tone: 'hint',
      title: '信息量偏少',
      detail: '对方需要更多背景才能做判断，只表态很难推动对话。',
      suggestion: '补充一句具体事实或一个可执行的时间点。',
    }
  }

  return {
    tone: 'hint',
    title: '还没有落到可执行',
    detail: '你的表达是完整的，但对方仍不知道下一步该做什么。',
    suggestion: scenario.tips[1] ?? scenario.tips[0],
  }
}

function scoreDimension(dimension: IScoreDimension, studentTurns: IMessage[]): IDimensionResult {
  const combined = studentTurns.map((turn) => turn.content).join(' ')
  const hits = matchedKeywords(dimension, combined)
  const coverage = dimension.keywords.length
    ? Math.min(1, hits.length / Math.min(3, dimension.keywords.length))
    : 0

  let score = 2 + coverage * 3
  if (combined.length > 80) score += 0.3
  score = Math.round(Math.min(5, Math.max(1, score)) * 10) / 10

  const evidence = hits
    .map((hit) => studentTurns.find((turn) => normalize(turn.content).includes(hit.toLowerCase())))
    .filter((turn): turn is IMessage => Boolean(turn))
    .slice(0, 2)
    .map((turn) => (turn.content.length > 42 ? `${turn.content.slice(0, 42)}…` : turn.content))

  const comment =
    score >= 4
      ? '该维度表现突出，行为已经比较稳定。'
      : score >= 3
        ? '基本做到，但还缺少一次明确的收口。'
        : '该维度尚未覆盖，建议下一轮刻意练习。'

  return { ...dimension, score, evidence: evidence.length ? evidence : ['本轮对话未涉及该维度'], comment }
}

/** 结束练习后生成维度化评分报告 */
export function evaluatePractice(
  scenario: IPracticeScenario,
  role: IAgentRole,
  turns: IMessage[],
): IPracticeReport {
  const studentTurns = turns.filter((turn) => turn.role === 'student')
  const dimensionResults = scenario.dimensions.map((dimension) => scoreDimension(dimension, studentTurns))

  const totalScore =
    Math.round(
      dimensionResults.reduce((sum, item) => sum + item.score * item.weight, 0) * 10,
    ) / 10

  const level =
    totalScore >= 4.5 ? '优秀' : totalScore >= 3.5 ? '良好' : totalScore >= 2.5 ? '合格' : '待加强'

  const strengths = dimensionResults
    .filter((item) => item.score >= 3.8)
    .map((item) => `${item.name}：${item.comment}`)

  const improvements = dimensionResults
    .filter((item) => item.score < 3.5)
    .map((item) => `${item.name}：${item.description}`)

  const suggestions = [
    ...scenario.tips,
    ...dimensionResults
      .filter((item) => item.score < 3.5)
      .map((item) => `下一轮先补「${item.name}」，至少出现一次明确的行为表达。`),
  ].slice(0, 4)

  return {
    totalScore,
    level,
    dimensionResults,
    strengths: strengths.length ? strengths : ['对话完整度不错，能够持续回应对方。'],
    improvements: improvements.length ? improvements : ['整体已达到训练目标，可尝试更高难度的场景。'],
    suggestions,
    hiddenAgenda: role.persona.hiddenAgenda,
    studentTurnCount: studentTurns.length,
  }
}
