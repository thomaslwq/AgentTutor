# AgentTutor 前端模块 - 需求拆解文档

## 产品概述

- **产品类型**: AI Agent 培训机构 Web 应用（学习平台 + 实战平台 + 社群）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 参加 AgentTutor 训练营的学员，使用数字人导师答疑、在多智能体平台实战、在社群打卡互评
- **核心价值**: 自研 AI 数字人导师 7×24 答疑陪练 + 多智能体实战平台边学边练 + 社群陪跑保障完课率
- **界面语言**: 中文
- **主题偏好**: 浅色（暖白底色 #FAF8F5，品牌色深靛蓝 + 暖橙）
- **导航模式**: 路径导航
- **导航布局**: Topbar（顶部导航，消费者/学员前台）
- **设计参考**: 用户提供 1 张工作台双区一体高保真参考截图（`tmp/media/summarize-url-e6e5b391-399a-488f-829d-f72d0d7b816d.png`），需优先还原其信息层级、卡片分组与双区结构；其余页面沿用同一视觉语言

---

## 页面结构总览

> **说明**：此表为页面生成的唯一数据源，共 4 个一级页面，全部出现在顶部导航中

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 工作台 | `DashboardPage.tsx` | `/` | 一级 | 导航（默认首页） |
| 课程体系 | `CurriculumPage.tsx` | `/curriculum` | 一级 | 导航 |
| 实战平台 | `PlatformPage.tsx` | `/platform` | 一级 | 导航 |
| 学员社群 | `CommunityPage.tsx` | `/community` | 一级 | 导航 |

> **页面说明**：
> - 四个页面对应导航四个模块，各自独立，互不重叠
> - 工作台：数字人导师 + 实战平台双区一体，学员日常学习主入口
> - 课程体系：全部课程目录与章节，按阶段分组
> - 实战平台：全部实战项目列表 + 项目详情
> - 学员社群：答疑、打卡、互评、复盘四大社群功能

---

## 页面布局建议

### 工作台（DashboardPage）

- **布局模式**: 左右分栏（双区一体）—— 左栏数字人导师工作台、右栏多智能体实战平台，大致比例 1:1.2
- **视觉重心**: 答疑对话面板 + 任务看板 为双核心，学员既可以问导师也可以看实战进度
- **结果承载区**: 对话面板为消息气泡流（初始含 4 条 mock 消息）；看板为三列任务卡片（初始含 6 张 mock 任务卡）
- **左栏自上而下**: 导师卡 → 课程进度卡 → 答疑对话面板 → 作业批改卡
- **右栏自上而下**: 项目标题条 → 智能体角色卡横排 → 任务看板三列 → 角色通信消息流

### 课程体系（CurriculumPage）

- **布局模式**: 单栏主内容区，标题区 + 三阶段课程分组卡片列表
- **视觉重心**: 课程卡片（含进度、状态、展开章节）
- **结果承载区**: 课程卡展开后的章节列表（初始态收起，点击展开）

### 实战平台（PlatformPage）

- **布局模式**: 上下列表+详情结构 —— 顶部项目切换列表（Tab/卡片横排），下方为选中项目详情（角色卡 + 看板 + 通信）
- **视觉重心**: 任务看板三列
- **结果承载区**: 项目详情区（默认展示第一个项目），看板任务可点击流转

### 学员社群（CommunityPage）

- **布局模式**: 上下分区，4 个功能区块纵向堆叠（助教答疑 → 学习打卡 → 同伴互评 → 阶段复盘）
- **视觉重心**: 各模块内容区均匀分布
- **结果承载区**: 打卡列表（提交后追加）、评分弹窗操作反馈

---

## 导航配置

- **导航布局**: Topbar（顶部深色导航栏 #1E3A5F）
- **导航项**（4 个一级页面）:

| 导航文字 | 路由 | 图标(可选) |
|---------|------|-----------|
| 工作台 | `/` | LayoutDashboard |
| 课程体系 | `/curriculum` | BookOpen |
| 实战平台 | `/platform` | Kanban |
| 学员社群 | `/community` | Users |

- **导航右侧**: 搜索框（占位"搜索课程、任务与学员"） + 学员头像（橙色圆形，内有文字"林"）
- **品牌区**: AgentTutor Logo + 定位语"AI Agent 培训机构 · AI 数字人导师"

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 数字人导师信息、统计数据 | demo-mock | `src/data/mock.ts` 中 `MOCK_TUTOR` 对象 | ✅ 本身就是 mock |
| 课程列表与章节数据 | demo-mock | `src/data/mock.ts` 中 `MOCK_COURSES` 数组 + `MOCK_CHAPTERS` 映射 | ✅ 本身就是 mock |
| 学习进度数据 | demo-mock | `src/data/mock.ts` 中 `MOCK_PROGRESS` 对象 | ✅ 本身就是 mock |
| 答疑对话消息 | demo-mock | `src/data/mock.ts` 中 `MOCK_MESSAGES` 初始数组 + 本地 state 追加 | ✅ 本身就是 mock |
| 导师回复（mock 规则） | demo-mock | `src/data/mock.ts` 中 `MOCK_TUTOR_REPLIES` 规则数组，按关键词匹配返回 | ✅ 本身就是 mock（预设规则，不做真实 AI 调用） |
| 作业批改反馈 | demo-mock | `src/data/mock.ts` 中 `MOCK_HOMEWORK_FEEDBACK` 对象 | ✅ 本身就是 mock |
| 实战项目列表 | demo-mock | `src/data/mock.ts` 中 `MOCK_PROJECTS` 数组 | ✅ 本身就是 mock |
| 智能体角色数据 | demo-mock | `src/data/mock.ts` 中 `MOCK_AGENT_ROLES` 数组 | ✅ 本身就是 mock |
| 任务看板数据 | demo-mock | `src/data/mock.ts` 中 `MOCK_TASKS` 数组，含 `status` 字段用于前端流转 | ✅ 本身就是 mock |
| 角色通信消息 | demo-mock | `src/data/mock.ts` 中 `MOCK_COMMUNICATIONS` 数组 | ✅ 本身就是 mock |
| 社群答疑话题 | demo-mock | `src/data/mock.ts` 中 `MOCK_QA_TOPICS` 数组 | ✅ 本身就是 mock |
| 学习打卡记录 | demo-mock | `src/data/mock.ts` 中 `MOCK_CHECKINS` 初始数组 + 本地 state 追加 | ✅ 本身就是 mock |
| 同伴互评作业 | demo-mock | `src/data/mock.ts` 中 `MOCK_PEER_REVIEWS` 数组 | ✅ 本身就是 mock |
| 阶段复盘内容 | demo-mock | `src/data/mock.ts` 中 `MOCK_REVIEW_POSTS` 数组 | ✅ 本身就是 mock |

> **说明**: 用户明确要求"后端暂时还没开发，先用 mock 数据模拟整个流程，所有交互在前端本地完成，不接后端、不做登录与持久化"，因此全部数据为 demo-mock 类型。mock 数据集中放在独立数据层文件中，字段结构清晰，便于后续替换为真实接口。

---

## 功能列表

### 页面：工作台（DashboardPage）

- **页面目标**: 学员日常学习主入口，左栏数字人导师答疑陪练 + 右栏多智能体实战平台进度一览
- **功能点**:

  1. **导师信息展示**
     - 展示圆形渐变头像（深蓝#1E3A5F到暖橙#E87722渐变，内有字母T）、名称"AgentTutor 数字人导师"、绿色"7×24 在线"徽标
     - 展示职责描述"主讲方法论沉淀 · 标准化答疑陪练 · 作业批改反馈"
     - 展示累计答疑 1,286、学员满意度 96% 两个统计数字

  2. **课程进度展示**
     - 展示课程名"多智能体 Agent 实战训练营"、"第 7 / 12 课"
     - 进度条 58%（深蓝到橙渐变填充）
     - 底部文字"已完成 7 课，进度 58%" + "预计剩余 3 周"

  3. **答疑对话（学员发送消息 + 导师 mock 回复）**
     - 初始展示 4 条气泡消息（2 条学员、2 条导师），学员气泡靠右配橙色圆形头像"学"，导师气泡靠左配深蓝圆形头像"T"
     - 底部输入框 + 发送按钮，发送后本地追加一条学员气泡
     - 导师按预设 mock 规则返回解答气泡：匹配消息关键词（如"任务/分工/CTO""看板/状态""进度/课程""作业/批改"等），从预设回复库中返回对应标准化回复
     - 对话面板可滚动，新消息自动滚动到底部

  4. **作业批改反馈查看**
     - 展示作业 3 标题、副标题"待批改 · 已生成导师批改建议与讲解要点"
     - 展示两项评分：知识点 4/5、工程落地 3/5
     - 橙色"查看反馈"按钮，点击后展开/弹出批改反馈面板，包含优点、待改进项、导师讲解建议三部分 mock 文案

  5. **实战项目状态展示**
     - 右栏顶部项目标题条："实战项目：企业客服 Agent 系统" + 副标"第 4 期训练营 · 6 名学员分组完成" + 绿色"● 进行中"状态
     - 横排 4 张智能体角色卡：CTO 架构师（深蓝CT）、产品经理（橙PM）、后端工程师（蓝BE）、测试工程师（紫QA），每张含角色名 + 职责描述

  6. **任务看板状态流转（操作型）**
     - 三列布局：待办（灰点）、进行中（橙点）、已完成（绿点），每列顶部显示任务数
     - 每张任务卡含任务标题 + 角色色点 + 角色名
     - **触发**: 点击任务卡
     - **交互**: 任务状态按 待办→进行中→已完成→待办 循环切换
     - **提交**: `setTasks(prev => prev.map(t => t.id === target.id ? {...t, status: nextStatus(t.status)} : t))`
     - **反馈**: 任务卡位置变更（从原列移到新列） + 颜色点同步变化
     - **数据契约**: `ITask` 必须含 `id, title, role, status: 'todo'|'in_progress'|'done'`

  7. **角色通信消息流**
     - 展示协作消息列表，每条含发送角色名 + 消息内容 + 时间
     - 初始 2 条 mock 消息

---

### 页面：课程体系（CurriculumPage）

- **页面目标**: 浏览全部课程，按三阶段分组，可展开查看章节详情
- **功能点**:

  1. **三阶段课程分组展示**
     - 页面标题"实战课程体系" + 副标"原理到项目实战分阶段递进，代码可复现"
     - 三个阶段分组：Agent 原理入门、多智能体协作架构、工程化落地
     - 每个阶段下展示对应课程卡片

  2. **课程卡片列表**
     - 4 门课程：多智能体 Agent 实战训练营（进行中 58%）、Agent 原理入门（已完成）、多智能体协作架构（未开始）、工程化落地（未开始）
     - 每张卡片含课程名、课次数、学习状态标签、进度条（进行中的课程显示）

  3. **课程章节展开/收起**
     - 点击课程卡片展开章节列表
     - 每章显示：课次序号 + 标题、时长、学习状态徽章（已学/进行中/未开始）、作业图标标识（是否含作业）
     - 再次点击收起

---

### 页面：实战平台（PlatformPage）

- **页面目标**: 浏览全部实战项目，查看项目详情与任务看板，操作任务流转
- **功能点**:

  1. **实战项目列表切换**
     - 3 个项目卡片横排/标签切换：企业客服 Agent 系统（进行中）、多角色内容协作流水线（已完成）、代码审查智能体团队（未开始·待组队）
     - 每张项目卡含项目名、状态、学员数、角色数
     - 默认选中第一个项目

  2. **项目详情展示**
     - 智能体角色分组卡片横排（与工作台右栏一致）
     - 角色通信消息流
     - 数据与工作台右栏共享第一个项目的数据

  3. **任务看板状态流转（操作型）**
     - 三列看板（待办/进行中/已完成），与工作台看板功能一致
     - 点击任务卡切换状态，本地更新
     - **触发**: 任务卡点击
     - **交互**: 状态循环流转，卡片移至目标列
     - **提交**: 更新任务 status 字段
     - **反馈**: 卡片位置变化 + toast 轻提示"已移至<进行中>"
     - **数据契约**: 同 `ITask`

---

### 页面：学员社群（CommunityPage）

- **页面目标**: 社群互动四大功能：助教答疑、学习打卡、同伴互评、阶段复盘
- **功能点**:

  1. **助教答疑话题浏览**
     - 4-5 条话题列表，每条含标题、提问人、回复数、最新时间、标签
     - 点击话题展开/跳转到讨论详情（mock 讨论内容）

  2. **学习打卡提交（操作型）**
     - 展示今日打卡人数、连续打卡天数、本周打卡成员头像列表
     - 打卡输入框 + 提交按钮
     - **触发**: 输入打卡内容后点击提交
     - **交互**: 本地追加一条打卡记录到列表顶部
     - **提交**: `setCheckins(prev => [{id, content, time, user}, ...prev])`
     - **反馈**: toast.success("打卡成功") + 列表首条新增 + 连续天数+1
     - **数据契约**: `ICheckin` 含 `id, userId, userName, content, time`

  3. **同伴互评作业评分（操作型）**
     - 3 条待互评作业列表，含学员头像+姓名、作业名、提交时间
     - 每条有"去评分"入口
     - **触发**: 点击"去评分"按钮
     - **交互**: 弹出评分 Dialog，含评分项（知识点、工程落地，各 1-5 星）+ 评语输入框 + 提交
     - **提交**: `setReviews(prev => prev.map(r => r.id === target.id ? {...r, scored: true, score} : r))`
     - **反馈**: toast.success("评分已提交") + Dialog 关闭 + 列表项状态变更为"已评"
     - **数据契约**: `IPeerReview` 含 `id, studentName, assignmentTitle, submittedAt, status: 'pending'|'scored'`

  4. **阶段复盘展示**
     - 本期复盘帖标题 + 2-3 条精华问答 mock 内容
     - 问答形式：问题 + 导师/助教回答

---

## 数据共享配置

| 存储键名 | 数据说明 | 使用页面 |
|---------|---------|---------|
| `__global_at_tasks` | 当前项目的任务列表，类型为 `ITask[]`；看板状态在工作台与实战平台间共享同步 | 工作台、实战平台 |
| `__global_at_currentProjectId` | 当前选中的实战项目 ID，类型为 `string` | 工作台、实战平台 |
| `__global_at_courseProgress` | 当前课程学习进度，类型为 `ICourseProgress` | 工作台、课程体系 |

```ts
/** 任务看板任务 */
interface ITask {
  id: string;
  title: string;
  roleId: string;        // 关联智能体角色
  roleName: string;      // 角色名，冗余展示用
  roleColor: string;     // 角色色点颜色
  status: 'todo' | 'in_progress' | 'done';
  projectId: string;     // 所属项目
}

/** 智能体角色 */
interface IAgentRole {
  id: string;
  name: string;          // CTO 架构师 / 产品经理 等
  shortCode: string;     // CT / PM / BE / QA
  color: string;         // 角色主色
  description: string;   // 职责描述
}

/** 实战项目 */
interface IProject {
  id: string;
  title: string;
  subtitle: string;
  status: 'ongoing' | 'completed' | 'not_started';
  studentCount: number;
  roleCount: number;
  roles: IAgentRole[];
}

/** 对话消息 */
interface IMessage {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
}

/** 课程 */
interface ICourse {
  id: string;
  title: string;
  lessonCount: number;
  status: 'ongoing' | 'completed' | 'not_started';
  progress: number;      // 0-100
  currentLesson?: number;
  stage: 'foundation' | 'collaboration' | 'engineering';
  chapters: IChapter[];
}

/** 章节 */
interface IChapter {
  id: string;
  lessonNo: number;
  title: string;
  duration: string;
  status: 'learned' | 'learning' | 'not_started';
  hasAssignment: boolean;
}

/** 课程进度 */
interface ICourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  remainingWeeks: number;
}
```

---

## 品牌与视觉规范

- **品牌色板**（必须严格沿用）:
  - 深靛蓝 `#1E3A5F` — 导航栏、导师头像主色、CTO角色
  - 暖橙 `#E87722` — 主按钮、PM角色、学员头像、进行中标识
  - 暖白 `#FAF8F5` — 页面背景
  - 卡片白 `#FFFFFF` — 卡片背景
  - 浅蓝面板 `#EBF1F7` — 导师气泡背景、次级面板
  - 正文深灰 `#2E3440` — 正文文字
  - 次要灰 `#788295` — 次要文字、辅助信息
  - 在线绿 `#2FAE6E` — 在线徽标、进行中状态、已完成状态
  - 紫色 `#8B5CF6` — QA 测试工程师角色色
  - 蓝色 `#3B82F6` — BE 后端工程师角色色

- **设计参考**: 工作台页面优先还原参考图的双区一体结构、卡片圆角与间距、信息层级；其余三页在同一视觉语言下延展

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Exact Reference —— 工作台页面高保真还原参考图的信息层级、卡片分组、双区结构与品牌色板；课程体系、实战平台、学员社群三页沿用同一视觉语言延展。
- **核心情绪 / 应用类型**: AI Agent 培训机构的学习工作台，专业可信（深蓝底色）+ 温暖陪伴（暖橙强调）+ 实战感（看板、角色卡、对话气泡）。
- **独特记忆点**: 深蓝-暖橙渐变圆形导师头像 + 左栏导师/右栏实战平台的「双区一体」布局，把 AI 答疑陪练与多智能体项目实战并置呈现。

## 2. Art Direction

- **方向名**: 暖调实战工作台
- **Design Style**: Flat Design + Soft Blocks —— 卡片式模块化布局，暖白底色营造学习氛围，柔和边界与轻微阴影降低视觉疲劳，角色色点强化实战角色识别。
- **DNA 参数**: 圆角 `rounded-xl`（卡片）/ `rounded-lg`（次级）/ `rounded-full`（头像、徽标、按钮）；阴影 `shadow-sm`（卡片轻投影）；间距 `gap-4 / p-5`（标准卡片密度）；字体方向无衬线偏暖白；装饰手法为角色色点、渐变头像、细边框卡片。
- **应用类型**: Tool / Workflow —— 顶部导航 + 双栏/单栏内容区，高密度信息卡片。

## 3. Color System

**色彩关系**: 深靛蓝主品牌色 + 暖橙强调交互色 + 暖白学习背景 + 浅蓝面板辅助 + 在线绿状态色
**配色设计理由**: 深靛蓝承载品牌专业感与导师角色识别，暖橙承担主行动按钮、学员头像与 AI 状态标签，暖白底色营造低压力学习氛围，浅蓝面板用于对话气泡与次级信息承载，在线绿标识进行中/在线状态。
**主色推导**: 参考图品牌色板深靛蓝 #1E3A5F 为 brand primary，暖橙 #E87722 为 accent/CTA 双角色；严格沿用 BP 既有品牌色板，保证与 VI 一致。
**使用比例**: 60% 暖白中性 / 25% 浅蓝与卡片白 / 10% 深靛蓝品牌 / 5% 暖橙强调；主按钮、tab 激活、icon、边框、链接不同时使用 primary。

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(30 25% 97%) | 暖白页面背景 #FAF8F5 |
| card | `--card` | `bg-card` | hsl(0 0% 100%) | 卡片白 #FFFFFF |
| text | `--foreground` | `text-foreground` | hsl(220 17% 22%) | 正文深灰 #2E3440 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(218 11% 53%) | 次要灰 #788295 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(211 51% 24%) | 深靛蓝品牌 #1E3A5F |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(0 0% 100%) | 品牌色上白字 |
| accent | `--accent` | `bg-accent` | hsl(26 81% 52%) | 暖橙强调 #E87722 |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(0 0% 100%) | 暖橙上白字 |
| border | `--border` | `border-border` | hsl(210 25% 88%) | 浅蓝灰边框 #EBF1F7 偏深 |

**语义色提示**: 
- 成功/在线绿 #2FAE6E → bg: hsl(152 63% 92%) / border: hsl(152 48% 70%) / text: hsl(152 58% 42%)；用于 7×24 在线徽标、进行中状态、已完成任务点。
- 暖橙 #E87722 兼作学员头像与 AI 标签 → bg: hsl(26 81% 92%) / border: hsl(26 75% 70%) / text: hsl(26 81% 52%)；饱和度与 primary 对齐（约 50-80% 区间）。
- 任务看板待办灰 #94A3B8 → bg: hsl(218 11% 95%) / border: hsl(218 11% 85%) / text: hsl(218 11% 53%)；与 textMuted 同源。

## 4. 字体与节奏

- **font-display**: Space Grotesk —— 现代几何无衬线，带科技感但不冰冷，匹配 AI Agent 培训定位；用于品牌名 Logo、大标题、数字统计。
- **font-body**: Noto Sans SC —— 中文正文清晰可读，字重适中，适合长时间学习界面阅读。
- **字号**: H1 text-3xl；H2 text-xl；H3 text-lg；body text-sm（工具界面高密度）~ text-base；muted text-xs ~ text-sm。
- **圆角**: 中大 —— 卡片 xl、次级元素 lg、头像/徽标/按钮 full；参考图一致的柔和圆润气质。

## 5. 全局布局契约

- **Reference Layout Use**: 工作台页面严格还原参考图双区结构（左导师栏 + 右实战平台）、卡片纵向堆叠顺序、角色卡横排、任务看板三列；其余三页沿用相同卡片语言与间距节奏。
- **Page / Section Order**: 顶部导航（工作台/课程体系/实战平台/学员社群）+ 内容主区；默认进入工作台。
- **Standard Content Zone**: 后台 `max-w-[1400px]` + `mx-auto`，适配双栏并置的信息密度。
- **Shell / Frame Alignment**: 内容容器与顶部导航同宽对齐，`px-4 md:px-6 lg:px-8` 统一 padding 节奏。
- **Padding & Rhythm**: `px-4 md:px-6 lg:px-8 py-6`，卡片间距 `gap-4`，纵向区块间距 `gap-5`。
- **Full-bleed Zones**: 顶部导航栏全宽深色背景；内容区均受 Standard Content Zone 约束。
- **Local Narrowing**: 作业详情、课程章节等弹层/展开内容可局部收窄至 `max-w-2xl`。
- **Overflow Strategy**: 任务看板三列、角色卡横排使用 `overflow-x-auto` 保底，桌面端完整展示。
- **Flexibility Boundary**: 允许移动端将双栏改为单栏纵向堆叠、卡片内边距减半；不允许切换主色、圆角系统或阴影语言。

## 6. 视觉与动效

- **装饰**: 角色色点 + 渐变圆形头像 + 细描边卡片
- **阴影/边界**: 轻 —— `shadow-sm` 卡片投影 + `1px border` 结构边界，参考图一致的低对比柔和感
- **动效**: 克制 —— hover 卡片轻微上浮与边框加深；任务看板状态切换有颜色过渡；对话气泡追加有淡入；整体 150-200ms ease。

## 7. 组件原则

- 按钮、输入框、卡片、任务卡必须有 Default / Hover / Active / Focus-visible / Disabled 状态。
- 深靛蓝 primary 用于品牌、导师头像、导航文字、CTO 角色；暖橙 accent 用于主按钮、学员头像、AI 标签、产品经理角色；绿/灰/蓝/紫用于状态与角色区分。
- 加载与空状态延续暖白卡片 + 角色色点语言，不回退默认样式。

## 8. Image Direction

- **Image Role**: 品牌视觉点缀（导师头像渐变）+ 角色卡色块图形，无强制全屏插画需求。
- **Image Art Direction**: 导师头像为深靛蓝到暖橙的径向渐变圆形，中央白色字母 T；角色卡为纯色圆角方块 + 白色缩写字母，材质扁平无渐变（除导师头像）；整体低饱和高对比，暖白背景衬托。
- **Image Prompt Keywords**: 深靛蓝暖橙径向渐变圆形头像、白色几何字母、扁平角色色块图标、暖白背景、柔和圆角、极简科技教育风、无多余装饰
- **Image Avoidance**: 通用 3D 商务人物、赛博霓虹渐变、无意义科技网格、过度拟物图标、卡通手绘风

## 9. Anti-patterns

- **Split personality**: 四个页面各自为政使用不同色板或圆角；全站统一深靛蓝+暖橙+暖白系统。
- **Orange everywhere**: 暖橙同时铺满按钮、tab、icon、边框、链接、头像；把 accent 收回到 CTA 与学员标识，其余角色用深蓝/蓝/紫/绿区分。
- **Default SaaS drift**: 回到默认蓝按钮、通用紫渐变；严格沿用 BP 品牌色板与参考图视觉锚点。
- **Invisible interaction**: hover 做了 focus-visible 丢了；所有可交互卡片、按钮、输入框都要有键盘可见焦点环。
- **Card bloat**: 卡片阴影过重、内边距过大、信息密度过低；保持参考图的紧凑工具感，卡片 `p-5`、间距 `gap-4`。
- **Status color drift**: 状态绿/警告色饱和度远高于主色，视觉跳脱；所有语义色饱和度与深靛蓝 primary 对齐在 50-65% 区间。