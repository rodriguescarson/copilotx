# copilotx — mobile

Native React Native + Expo client for the copilotx CopilotKit demo. Demonstrates that the same agent backend that powers the web demos can drive a native mobile experience — the "All UI will be AI" thesis going beyond the browser.

> Companion to the web app at [`copilotx-chi.vercel.app`](https://copilotx-chi.vercel.app). Full repo: [github.com/rodriguescarson/copilotx](https://github.com/rodriguescarson/copilotx).

## What this is

A two-tab Expo Router app:

- **Chat** — `<Thread />` from `@assistant-ui/react-native` powered by `@assistant-ui/react-ag-ui`, talking to any AG-UI compatible agent over SSE.
- **Profile** — mirrors the web `/studio/voice` ProfileCard. Tools shown to the assistant (`set_goal`, `set_schedule`, `set_diet_pref`, `set_sleep_hours`) update a local fitness profile that fills in as the user chats.

## Why no CopilotKit Cloud direct connect

CopilotKit's web SDK (`@copilotkit/react-core`) connects to **CopilotKit Cloud's GraphQL runtime**, not the raw AG-UI protocol. The mobile app uses the wire-only `@ag-ui/client` instead, so it needs an **AG-UI compatible agent endpoint** — the GraphQL runtime is not directly compatible.

Three ways to provide that endpoint:

1. **Self-host an AG-UI agent** — any of the supported frameworks (Mastra, LangGraph, PydanticAI, Agno, Google ADK, AWS Bedrock Agents, etc.) exposes an AG-UI endpoint. Point the mobile app at it.
2. **Run the CopilotKit Runtime locally / on a server** with an `AG-UI` adapter (the runtime ships AG-UI compatibility — see [docs.copilotkit.ai](https://docs.copilotkit.ai/reference/runtime)). Use that endpoint.
3. **Wait for `@copilotkit/react-native`** — feature request: [CopilotKit#1892](https://github.com/CopilotKit/CopilotKit/issues/1892). When it lands, drop in for native CopilotKit Cloud auth.

## Path taken

**Path A — `@assistant-ui/react-native` + `@assistant-ui/react-ag-ui`.**
The other paths considered (and rejected) for this scaffold:
- **Path B** — `@copilotkit/react-core` headless in RN with `expo/fetch` polyfill. Works for chat hooks but you rebuild every chat view from scratch (`react-ui` is DOM-only).
- **Path C** — WebView around the Next.js deploy. Cheap but iOS WebView SSE is flaky and you lose native gestures, push, biometrics. Skipped.

## Project layout

```
mobile/
├── app/
│   ├── _layout.tsx              # root stack
│   └── (tabs)/
│       ├── _layout.tsx          # tab nav
│       ├── index.tsx            # Chat tab → ChatThread
│       └── profile.tsx          # Profile tab → ProfileCard
├── components/
│   ├── ChatThread.tsx           # @assistant-ui Thread primitives
│   ├── ProfileCard.tsx          # 4-field profile card (Goal/Schedule/Diet/Sleep)
│   ├── ProfileTools.tsx         # registers AG-UI tools to fill the profile
│   ├── CinematicBackground.tsx  # cyan + purple gradient on near-black
│   └── Footer.tsx               # "built by carsonrodrigues.com"
├── lib/
│   ├── agui.ts                  # HttpAgent factory + env var reader
│   ├── profileStore.ts          # local pub/sub store for the profile
│   └── theme.ts                 # design tokens (colors, spacing, typography)
└── docs/
    └── screenshots/             # drop screenshots here for the PR / X posts
```

## Setup

```bash
cd mobile
npm install
```

Create `mobile/.env`:

```
EXPO_PUBLIC_AGUI_URL=https://your-agent-endpoint.example.com/agui
EXPO_PUBLIC_AGUI_API_KEY=optional-bearer-key
```

`.env` is gitignored. `EXPO_PUBLIC_*` env vars are inlined into the bundle by Expo at build time — that's intended for non-secret config.

## Run

```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Expo Go on a physical device
npx expo start
```

If you launch without `EXPO_PUBLIC_AGUI_URL` set, the chat tab shows a "no endpoint configured" empty state with copy-pastable setup instructions. You can still navigate and inspect the UI.

## Type check

```bash
npx tsc --noEmit
```

CI just runs this — no Jest/RN test suite is wired up because the demo's runtime depends on a live AG-UI endpoint that varies per setup.

## Current limitations

- **Voice in mobile is stubbed.** The web `/studio/voice` route uses the browser Web Speech API. RN equivalents (`expo-speech-recognition`, `@react-native-voice/voice`) have unreliable cross-platform support as of 2026-05; a deliberate choice to skip rather than ship something flaky. The Chat tab achieves the same profile-building outcome via typed input.
- **No CopilotKit Cloud direct path.** See "Why no CopilotKit Cloud direct connect" above.
- **No push / background handling.** The bundle ships nothing related to `expo-notifications` or background execution. Add when CopilotKit RN gets first-class agent presence.
- **Bundle size unaudited.** Type checks and runs locally; no Sentry / production bundle analysis yet.

## Credit

Built by [carsonrodrigues.com](https://www.carsonrodrigues.com) — companion artifact to the [copilotx web demos](https://copilotx-chi.vercel.app) for an Applied AI Engineer application to CopilotKit.
