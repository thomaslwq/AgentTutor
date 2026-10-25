# AgentTutor

**AI Agent 培训机构一体化学员端 Web 应用 —— 学习平台 + 实战平台 + 学员社群。**

> 中文 | [English](README.en.md)

AgentTutor 面向参加训练营的学员，把「AI 数字人导师 7×24 答疑陪练」「多智能体项目实战」「社群打卡互评」整合在一个工作台中：左侧向数字人导师提问、查看课程进度与作业批改，右侧直接跟进多智能体项目的角色分工与任务看板，边学边练。

> 当前版本为**纯前端原型（prototype）**：全部数据来自本地 mock，所有交互在前端本地完成，不接后端、不做登录与持久化。数据结构已按真实接口的字段拆分为独立数据层，便于后续替换为真实 API。

---

## 功能特性

| 模块 | 路由 | 能力 |
| --- | --- | --- |
| 工作台 | `/` | 数字人导师信息与在线状态、课程进度、答疑对话（按关键词规则生成导师回复）、作业批改反馈、实战项目概览、三列任务看板状态流转、角色通信消息流 |
| 课程体系 | `/curriculum` | 三阶段课程分组（Agent 原理入门 / 多智能体协作架构 / 工程化落地）、课程卡片与进度、章节展开收起、作业标识 |
| 实战平台 | `/platform` | 实战项目切换、项目详情（角色卡 + 通信流）、任务看板状态流转与 toast 提示 |
| 学员社群 | `/community` | 助教答疑话题、学习打卡提交、同伴互评评分弹窗、阶段复盘 |

其他能力：

- **任务看板状态循环**：点击任务卡按「待办 → 进行中 → 已完成 → 待办」流转，工作台与实战平台之间共享同一份任务数据。
- **响应式布局**：桌面端顶部导航，移动端自动切换为底部 Tab 导航。
- **统一视觉体系**：深靛蓝 + 暖橙品牌色、角色色点、渐变圆形导师头像。

---

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript 5.9 |
| 构建 | Vite 8（`@lark-apaas/coding-preset-vite-react`） |
| 样式 | Tailwind CSS v4 + `@tailwindcss/typography` |
| UI 组件 | shadcn/ui（Radix UI 封装，`src/components/ui/`） |
| 图标 | lucide-react |
| 路由 | react-router-dom 7 |
| 图表 | echarts-for-react / recharts |
| 动画 | framer-motion / GSAP |
| 提示 | sonner |
| 表单与校验 | react-hook-form + zod |

---

## 目录结构

```
AgentTutor/
└── frontend/                 # 前端应用根目录
    ├── public/               # 静态资源（favicon、icons）
    ├── scripts/              # dev / build / git hooks 脚本
    ├── shared/               # 静态数据与能力配置
    │   ├── capabilities/
    │   └── static/
    ├── src/
    │   ├── index.tsx         # 入口（Provider + Router）
    │   ├── app.tsx           # 路由表
    │   ├── index.css         # 全局样式与主题变量
    │   ├── tailwind-theme.css
    │   ├── typography.css
    │   ├── components/       # 业务组件 + ui/（shadcn/ui）
    │   ├── data/             # mock 数据层（导师、课程、项目、任务、社群等）
    │   ├── hooks/            # 自定义 Hooks
    │   ├── lib/              # 工具函数
    │   └── pages/            # 四个一级页面
    │       ├── DashboardPage/
    │       ├── CurriculumPage/
    │       ├── PlatformPage/
    │       ├── CommunityPage/
    │       └── NotFoundPage/
    ├── AGENTS.md             # 需求拆解与 UI 设计规范
    ├── README.md             # 前端技术规范
    ├── package.json
    └── vite.config.ts
```

页面契约详见 [frontend/AGENTS.md](frontend/AGENTS.md)，工程规范详见 [frontend/README.md](frontend/README.md)。

---

## 快速开始

### 环境要求

- Node.js **20.19+** 或 **22.12+**（Vite 8 要求）
- npm（仓库内 `.npmrc` 默认使用 `registry.npmmirror.com` 镜像）

### 安装与启动

```bash
cd frontend
npm install
npm run dev
```

启动后访问 <http://localhost:8001>。

> **Windows 提示**：`npm run dev` 依赖 `scripts/dev.mjs` 中的 `lsof`，`npm run build` 依赖 `bash`。在 Windows 上建议使用 WSL / Git Bash；也可直接运行 `npx vite --port 8001 --host 0.0.0.0` 启动开发服务器。

### 可用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（默认端口 `8001`，日志写入 `logs/`） |
| `npm run build` | 生产构建，产物输出到 `dist/output`、`dist/output_resource`、`dist/output_static` |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run lint` | 并行执行类型检查与 ESLint |
| `npm run lint:eslint` | 仅执行 ESLint |
| `npm run precommit` | 提交前检查（等同 `npm run lint`） |

---

## 设计规范

| 用途 | 色值 | 说明 |
| --- | --- | --- |
| 深靛蓝 | `#1E3A5F` | 顶部导航、品牌主色、导师头像、CTO 角色 |
| 暖橙 | `#E87722` | 主按钮、学员头像、进行中标识、产品经理角色 |
| 暖白 | `#FAF8F5` | 页面背景 |
| 卡片白 | `#FFFFFF` | 卡片背景 |
| 浅蓝面板 | `#EBF1F7` | 导师气泡、次级面板 |
| 正文深灰 | `#2E3440` | 正文文字 |
| 次要灰 | `#788295` | 次要文字 |
| 在线绿 | `#2FAE6E` | 在线徽标、进行中 / 已完成状态 |
| 紫色 | `#8B5CF6` | QA 测试工程师角色 |
| 蓝色 | `#3B82F6` | BE 后端工程师角色 |

主题变量通过 `src/index.css` 的 `:root` CSS 变量 + `@theme inline` 注册到 Tailwind。字体：标题 `Space Grotesk`，正文 `Noto Sans SC`。

---

## 数据说明

所有业务数据集中在 `frontend/src/data/`，按领域拆分为独立模块：

```ts
import { MOCK_AGENT_ROLES } from '@/data/agent-roles';
import { MOCK_COURSES } from '@/data/courses';
import { MOCK_TASKS } from '@/data/tasks';
```

当前交互（发送答疑、任务流转、打卡、互评评分）均通过 React 本地 state 完成，刷新页面后恢复初始 mock 数据。接入后端时可直接以这些数据模块的字段结构作为接口契约。

---

## Roadmap

- [ ] 接入后端 API 与数据持久化
- [ ] 由真实 LLM 驱动数字人导师答疑与作业批改
- [ ] 登录鉴权与学员档案
- [ ] 生产环境部署与监控

---

## 许可

本项目暂未指定开源许可证。
