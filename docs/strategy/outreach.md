# Outreach Templates

Three templates and a do-not-send list for the CopilotKit re-engagement push. Each one is artifact-driven — a shipped demo, a merged PR, a post with real metrics. Time alone never triggers a send.

The re-engagement email went out on 2026-05-06. From here, no artifact means no message.

---

## Template A — Follow-up to Nathan (decision-maker)

**Recipient:** Nathan Tarbert. Cc Eli only if Eli was on the original interview thread and the artifact is technical.

**Trigger:** A NEW public artifact Nathan has not seen — a B2 demo at a real URL, a PR merged into a CopilotKit repo, an X post with > 500 impressions. Time is not a trigger. Interest is not a trigger.

**Goal:** 15-minute call. The artifact is the hook.

**Constraint:** 90 words max. Subject under 50 characters. No "any updates," no "still interested."

### Email text

> Subject: Generative Dashboard demo — built on CopilotKit
>
> Nathan,
>
> Shipped a generative dashboard on CopilotKit Cloud over the weekend — agents render charts and tables on the fly from a natural-language brief. Live: copilotx.dev/studio/dashboard. Source: github.com/rodriguescarson/copilotx.
>
> Two more demos land this week (a meta-tool that generates CopilotKit actions, and voice onboarding). If any of this is useful as a reference build for the team, happy to walk Eli through the architecture on a 15.
>
> — Carson

### Why this works

- First sentence is the artifact. Nathan can forward to Eli without reading further.
- "Reference build" reframes the ask — Carson is offering work, not requesting consideration.
- 15 minutes is a low-cost yes.

### Variations

**Warmer (if Nathan replied to 05-06):**

> Nathan — quick one. The studio build I mentioned is live: copilotx.dev/studio/dashboard. Two more demos this week. If Eli wants the architecture walkthrough, I can do 15 minutes whenever fits.

**Cooler (if 05-06 got no reply):**

> Nathan — built a generative dashboard on CopilotKit Cloud: copilotx.dev/studio/dashboard. Source on GitHub. Sharing in case it is useful as a reference for the team.

### DO NOT

- "Following up" or "circling back." Lead with the artifact.
- Ask if the role is still open. The demo surfaces it; the question does not change the answer.
- Attach a resume. The GitHub link is the resume.
- Email Nathan and Eli separately the same week — they compare notes.

---

## Template B — LinkedIn announcement post (one per B2 demo)

~150 words each, posted the day the demo deploys. Tag @CopilotKit. Close with a question that engineers will argue about.

### B1. Generative Dashboard launch

**Trigger:** /studio/dashboard live on a public URL with CopilotKit Cloud working end-to-end.

> Generative dashboards: typed a brief, got back a working chart layout.
>
> Built a CopilotKit agent that takes a natural-language brief ("show me Q1 revenue by region, bar chart, then a table of top 10 accounts") and renders the dashboard at runtime. The agent picks chart type, axes, and ordering. The user can drag, edit, and re-prompt — every change feeds back into the agent's state.
>
> What surprised me: most of the work was not the LLM. It was making the agent's tool calls idempotent so re-prompts do not duplicate components. CopilotKit's state sync handled the rest.
>
> Live: copilotx.dev/studio/dashboard
> Source: github.com/rodriguescarson/copilotx
>
> @CopilotKit
>
> Curious how others handle component-level state for generative UIs — do you let the agent own the tree, or keep a parent reducer?

### B2. CopilotKit Studio (meta-tool) launch

**Trigger:** /studio/actions live; a user can describe a tool in natural language and get working CopilotKit action code.

> Built a CopilotKit action that writes CopilotKit actions.
>
> Describe what you want the agent to do — "let users export the dashboard as PDF" — and Studio generates the action signature, the handler stub, and a typed schema. Paste it into your project and the agent can call it immediately.
>
> The interesting part was constraining the generation. The agent has to produce code that compiles against the CopilotKit runtime, not arbitrary TypeScript. I gave it the type definitions as context and let it use the existing action registry as few-shot examples.
>
> Live: copilotx.dev/studio/actions
> Source: github.com/rodriguescarson/copilotx
>
> @CopilotKit
>
> For the agent-tooling people: how are you handling the generation-vs-validation loop? Static checks pre-execution, or trust the runtime?

### B3. Voice onboarding launch

**Trigger:** /studio/voice live; a user completes onboarding by voice without touching the form.

> Voice onboarding that actually completes the form.
>
> Most voice UIs read a prompt and capture a sentence. This one runs the full onboarding flow — name, role, use case, integration choices — and fills the form fields as you speak. CopilotKit handles the agent state; the voice layer just streams transcripts in and field updates out.
>
> The unlock was treating each form field as a CopilotKit action with its own validation. The agent decides which field to fill next based on what it has, and the user can correct any field by saying "actually, my role is engineering manager."
>
> Live: copilotx.dev/studio/voice
> Source: github.com/rodriguescarson/copilotx
>
> @CopilotKit
>
> Voice-first form flows: do you route through a single agent that owns the whole form, or one agent per field group?

### Why these work

- Lead with the result, not the stack.
- "What surprised me" signals real engineering, not a tutorial follow.
- Closing question is technical and answerable — engineers argue, reach follows.

### DO NOT

- Tag Nathan, Eli, or Travis personally. @CopilotKit only.
- Write "hire me" or "open to work." LinkedIn already shows that signal.
- Post all three the same day. Space 3-5 days apart.
- Edit after engagement starts — LinkedIn down-ranks edited posts.

---

## Template C — X DM / quote-tweet to non-decision-maker engineers

The riskiest channel. A cold DM from someone the company rejected reads as a tell unless it is 100% about the engineer's work.

**Recipients:** Travis or any active CopilotKit engineer on X. Not Nathan. Not Eli.

**Trigger:** The engineer posted something Carson has a real, specific reaction to — not a generic "great post."

**Length:** 1-3 sentences.

### Variant 1 — Genuine technical question (DM)

> Travis — saw your thread on action-level state in CopilotKit. Question: when an action mutates shared state, do you debounce at the agent level or the React layer? Hit a re-render storm on my generative dashboard build last week and ended up doing it agent-side, but curious if that is the canonical pattern.

### Variant 2 — Quote-tweet adding value

> Quote-tweeting Travis on streaming agent responses:
>
> > This matches what I saw building voice onboarding on CopilotKit — the per-token stream is the easy part; the hard part is collapsing partial tool calls so the UI does not flicker mid-action. Solved it by buffering until the action signature was complete.

### Why this works

- Variant 1 shows Carson did the work and hit a real problem. Two-sentence answer makes a reply likely.
- Variant 2 puts technical content on Travis's timeline. Carson's name now reads as a contributor, not a job seeker.
- Neither variant mentions the role, the rejection, or the demos. The demos sit on Carson's profile if Travis looks.

### DO NOT

- Pitch the demos in the DM. Pinned profile is enough.
- Ask Travis to refer Carson. He cannot, and the ask is awkward.
- DM more than one CopilotKit engineer per week.
- Follow up on a silent DM. Silence is the answer.

---

## DO NOT SEND list

1. **"Any updates on the role?"** — Updates exist when they exist. Asking signals nothing has changed on Carson's side.
2. **"Still very interested in joining the team!"** — Interest is not new information. Send work, not affirmations.
3. **Same message to multiple team members in one week.** Nathan, Eli, and Travis compare inboxes. One recipient per artifact.
4. **Reply on a 2-month-old thread with no new content.** A reply with nothing attached makes the original silence louder.
5. **Anything sent after 8pm Pacific.** Late-night sends look needy. Send 9am-4pm Pacific, Tue-Thu.
6. **LinkedIn connection request with a sales note.** Plain request or no request. A pitch from someone the company rejected reads as a chase.
7. **More than one follow-up per artifact.** One demo, one outbound. Next message requires next artifact.
8. **DMing Nathan on X or LinkedIn.** Recruiters live in their ATS and email. X DMs to recruiters get muted on sight.

---

## Send-decision flow

Before sending, walk this:

1. New artifact since last message to this person? If no, stop.
2. Public and linkable? If no, ship first.
3. Right recipient for this artifact? (Decision-maker for demos; engineer for technical posts.) If no, switch.
4. Under the word limit and lead with the artifact? If no, cut.
5. 9am-4pm Pacific, Tue-Thu? If no, schedule.

All five yes — send. Otherwise, do not.
