# AI Gym Buddy

An AI-powered fitness assistant that helps you plan personalized workout routines, diet recommendations, and sleep/recovery tips based on your goals, schedule, and preferences.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd copilotx
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your `NEXT_PUBLIC_COPILOT_PUBLIC_API_KEY` from [CopilotKit Cloud](https://cloud.copilotkit.ai)
   - (Optional) Add `GIPHY_API_KEY` from [GIPHY Developers](https://developers.giphy.com) for animated exercise GIFs in the workout plan
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your keys
   ```

3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## What You Built

- **AI Gym Buddy**: A CopilotKit assistant that creates:
  - Personalized workout routines based on goals (fat loss, muscle gain, endurance) and available time
  - Diet plan suggestions based on calories and preferences (vegetarian, vegan, etc.)
  - Sleep and recovery tips based on sleep hours

- **One meaningful interaction**: State update via `updateGoal` — when you say "Set my goal to muscle gain", the AI calls the action, updates your state, and the UI reflects it. The state is also exposed to the AI via `useCopilotReadable` for personalized follow-up responses.

- **Generative UI**: `setRoutine` and `dietSuggestion` actions render custom UI (weekly plan cards, meal cards) inline in the chat when the AI generates plans.

- **Animated exercise GIFs**: Each exercise in the workout plan displays a moving GIF demonstrating the movement (via GIPHY API when configured).

- **Additional actions**: `sleepTips` for recovery advice, `updateGoal` and `setRoutine` for persisting user preferences in React state.

## How AI & CopilotKit Was Used

- **CopilotKit chat UI** (`CopilotSidebar`) for the conversational interface
- **`useCopilotAction`** to define tools the AI can call: `updateGoal`, `setRoutine`, `dietSuggestion`, `sleepTips`
- **`useCopilotReadable`** to expose user state (goal, schedule, diet prefs, calories) as context to the AI
- **AG-UI protocol** via CopilotKit's Direct-to-LLM / Copilot Cloud — no custom backend required
- **Generative UI** via `render` functions on actions to display workout plans and meal suggestions

## What You'd Improve With More Time

- Computer vision for form correction (posture detection during exercises)
- Wearable data integration (heart rate, steps)
- Persistence (localStorage or backend) for saving plans across sessions
- Push notifications for workout reminders
- AG-UI agent framework backend (e.g. Mastra, LangGraph) for more complex agent logic

## AI Coding Tools

This project was built with assistance from **Cursor** (AI coding assistant) for scaffolding, CopilotKit integration, component structure, and documentation.
