# AgentTutor

[简体中文](README.md) · [**English**](README.en.md)

**An all-in-one learner-facing web app for an AI Agent training institution — learning platform, hands-on platform, and student community.**

AgentTutor is built for students enrolled in the training camp. It brings a 24/7 AI digital tutor, multi-agent project practice, and community check-ins & peer review into a single workspace: on the left, students ask the AI tutor questions, track course progress, and review assignment feedback; on the right, they follow role assignments and the task board of a multi-agent project — learning while building.

> This is currently a **frontend-only prototype**: all data comes from local mocks, and every interaction happens client-side. There is no backend, no authentication, and no persistence. The mock data is split into a dedicated data layer with API-shaped fields, so it can be replaced by real endpoints later.

---

## Features

| Module | Route | Capabilities |
| --- | --- | --- |
| Workspace | `/` | AI tutor profile and online status, course progress, Q&A chat (keyword-rule based tutor replies), assignment feedback, project overview, three-column task board with status transitions, agent communication feed |
| Curriculum | `/curriculum` | Three-stage course grouping (Agent fundamentals / Multi-agent collaboration / Engineering in production), course cards with progress, expandable chapters, assignment badges |
| Practice Platform | `/platform` | Project switcher, project details (agent role cards + communication feed), task board status transitions with toast hints |
| Community | `/community` | TA Q&A topics, study check-ins, peer review scoring dialog, stage retrospectives |

More highlights:

- **Task board transitions**: click a task card to cycle through `to-do → in progress → done → to-do`. The workspace and the practice platform share the same task data.
- **Responsive layout**: top navigation on desktop, automatically switches to bottom tab navigation on mobile.
- **Unified visual system**: deep indigo + warm orange brand colors, role color dots, and a gradient circular tutor avatar.

---

## Tech Stack

| Category | Choice |
| --- | --- |
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 (`@lark-apaas/coding-preset-vite-react`) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| UI components | shadcn/ui (Radix UI based, under `src/components/ui/`) |
| Icons | lucide-react |
| Routing | react-router-dom 7 |
| Charts | echarts-for-react / recharts |
| Animation | framer-motion / GSAP |
| Toasts | sonner |
| Forms & validation | react-hook-form + zod |

---

## Project Structure

```
AgentTutor/
└── frontend/                 # Frontend application root
    ├── public/               # Static assets (favicon, icons)
    ├── scripts/              # dev / build / git hooks scripts
    ├── shared/               # Static data and capability configs
    │   ├── capabilities/
    │   └── static/
    ├── src/
    │   ├── index.tsx         # Entry (providers + router)
    │   ├── app.tsx           # Route table
    │   ├── index.css         # Global styles and theme variables
    │   ├── tailwind-theme.css
    │   ├── typography.css
    │   ├── components/       # Business components + ui/ (shadcn/ui)
    │   ├── data/             # Mock data layer (tutor, courses, projects, tasks, community...)
    │   ├── hooks/            # Custom hooks
    │   ├── lib/              # Utilities
    │   └── pages/            # Four top-level pages
    │       ├── DashboardPage/
    │       ├── CurriculumPage/
    │       ├── PlatformPage/
    │       ├── CommunityPage/
    │       └── NotFoundPage/
    ├── AGENTS.md             # Requirements breakdown and UI design spec
    ├── README.md             # Frontend technical conventions
    ├── package.json
    └── vite.config.ts
```

Page contracts are documented in [frontend/AGENTS.md](frontend/AGENTS.md); engineering conventions are documented in [frontend/README.md](frontend/README.md).

---

## Getting Started

### Requirements

- Node.js **20.19+** or **22.12+** (required by Vite 8)
- npm (the bundled `.npmrc` points to the `registry.npmmirror.com` mirror)

### Install and Run

```bash
cd frontend
npm install
npm run dev
```

Then open <http://localhost:8001>.

> **Windows note**: `npm run dev` relies on `lsof` inside `scripts/dev.mjs`, and `npm run build` relies on `bash`. On Windows, use WSL / Git Bash, or start the dev server directly with `npx vite --port 8001 --host 0.0.0.0`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (port `8001`, logs under `logs/`) |
| `npm run build` | Production build to `dist/output`, `dist/output_resource`, `dist/output_static` |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | Run type checking and ESLint in parallel |
| `npm run lint:eslint` | Run ESLint only |
| `npm run precommit` | Pre-commit check (same as `npm run lint`) |

---

## Design System

| Usage | Color | Notes |
| --- | --- | --- |
| Deep indigo | `#1E3A5F` | Top navigation, brand primary, tutor avatar, CTO role |
| Warm orange | `#E87722` | Primary buttons, student avatar, in-progress markers, PM role |
| Warm white | `#FAF8F5` | Page background |
| Card white | `#FFFFFF` | Card background |
| Light blue panel | `#EBF1F7` | Tutor bubbles, secondary panels |
| Body text | `#2E3440` | Main text |
| Muted text | `#788295` | Secondary text |
| Online green | `#2FAE6E` | Online badge, in-progress / done states |
| Purple | `#8B5CF6` | QA engineer role |
| Blue | `#3B82F6` | BE engineer role |

Theme variables are registered in `src/index.css` via `:root` CSS variables and `@theme inline`. Fonts: `Space Grotesk` for headings, `Noto Sans SC` for body text.

---

## Data

All business data lives under `frontend/src/data/`, split by domain:

```ts
import { MOCK_AGENT_ROLES } from '@/data/agent-roles';
import { MOCK_COURSES } from '@/data/courses';
import { MOCK_TASKS } from '@/data/tasks';
```

Current interactions (asking the tutor, task transitions, check-ins, peer review scoring) are handled by local React state; refreshing the page restores the initial mock data. When wiring up a backend, these data modules can serve directly as the API contract.

---

## Roadmap

- [ ] Backend API and data persistence
- [ ] Real LLM-powered tutor Q&A and assignment grading
- [ ] Authentication and student profiles
- [ ] Production deployment and monitoring

---

## License

No open-source license has been specified for this project yet.
