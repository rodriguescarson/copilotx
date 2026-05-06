# copilotx

Agentic frontend playground built on CopilotKit. A gym planner, a generative dashboard, a voice onboarding flow, and a meta-tool that writes `useCopilotAction` definitions while you watch.

## Demo

![Hero](docs/media/hero.png)

| | |
|---|---|
| ![Generative dashboard](docs/media/dashboard.gif) | ![Voice onboarding](docs/media/voice.gif) |
| ![Studio meta-tool](docs/media/studio.gif) | ![Gym buddy](docs/media/gym.gif) |

## Links

- Live: https://copilotx.vercel.app
- Repo: https://github.com/rodriguescarson/copilotx

## What this is

CopilotKit's react-core and react-ui pushed past the basic chat sidebar. Four routes, one shared Copilot runtime, persistent state, and a progress tracker that survives reloads. Idiomatic `useCopilotAction` / `useCopilotReadable` patterns, generative UI via `render`, and AG-UI compatibility against Copilot Cloud.

## Routes

| Route | What it demonstrates |
|---|---|
| `/` | Gym buddy — multi-action planner (`updateGoal`, `setRoutine`, `dietSuggestion`, `sleepTips`) with generative meal/workout cards inline in chat. |
| `/studio/dashboard` | Generative dashboard — the agent picks chart types and assembles widgets at runtime via `render` actions. |
| `/studio/actions` | CopilotKit Studio — a meta-tool that writes `useCopilotAction` definitions live, with hot-reloaded preview. |
| `/studio/voice` | Voice onboarding — speech-driven intake form, streamed transcripts, agent fills fields via actions. |

## Why CopilotKit

- **`useCopilotAction`** drives every interaction — gym buddy uses it for state mutation (`updateGoal`), the dashboard uses it for widget assembly, the voice flow uses it to fill form fields from transcripts.
- **`useCopilotReadable`** exposes user state (goal, schedule, diet prefs, partial form data) to the agent so follow-ups stay in context across routes.
- **`CopilotSidebar`** is the chat surface on every route — no per-page chrome.
- **Generative UI via `render`** — `setRoutine`, `dietSuggestion`, and the dashboard widgets render live React components inside chat, not markdown.
- **AG-UI compatibility** — runs against Copilot Cloud out of the box, no custom backend; the Studio route shows how the same action shape would attach to a Mastra or LangGraph agent.
- **Persistence layer** — actions write through a localStorage adapter so plans, dashboards, and progress survive reloads.

## Setup

```bash
git clone https://github.com/rodriguescarson/copilotx.git
cd copilotx
npm install
```

Environment variables:

```bash
cp .env.example .env.local
```

```env
# required — get from https://cloud.copilotkit.ai
NEXT_PUBLIC_COPILOT_PUBLIC_API_KEY=

# optional — animated exercise demos in gym buddy
GIPHY_API_KEY=
```

Run:

```bash
npm run dev
```

Open http://localhost:3000.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- `@copilotkit/react-core` 1.51
- `@copilotkit/react-ui` 1.51
- TypeScript 5

## Roadmap

- AG-UI agent backend (Mastra) for the Studio route
- Computer-vision form check in gym buddy
- Wearable data ingestion (heart rate, steps)
- Push reminders for workout sessions
- Dashboard export to PNG / shareable link

## Credits

Built with [CopilotKit](https://copilotkit.ai). AI assistance from Cursor and Claude Code during scaffolding, action wiring, and docs.
