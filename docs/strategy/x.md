# X (Twitter) Content Strategy — CopilotKit Re-Approach

Author: Carson Rodrigues
Window: 14 days starting 2026-05-07 (day after re-engagement email)
Audience: CopilotKit team (Atai, Markus, Tyler, Travis, Nathan, Eli) + the broader AG-UI / agentic-UX dev crowd that watches them.

## Objective

Be visibly good in public on the exact thing CopilotKit cares about, so that when someone on the team checks Carson's profile after the re-engagement email, the timeline reads "this person already does the work" — not "this person wants the job."

The audience is small and specific. We are not trying to go viral. We are trying to make ~6 people see ~10 posts that confirm Carson belongs in their orbit.

## Narrative thread (chosen)

**"Rebuilding the same agent across every AG-UI framework — Mastra, LangGraph, PydanticAI, Agno."**

### Why this one over the alternatives

- **(a) Multi-framework AG-UI rebuild — chosen.** Matches CopilotKit's positioning ("the UI layer for any agent framework"), so doing it publicly is free validation of their thesis. Forces real depth: you can't fake shipping the same agent in four frameworks.
- (b) "One CopilotKit demo a day" — too thin. Reads as content-marketing churn. The through-line becomes "I am posting a lot," which is not the signal we want.
- (c) AG-UI protocol deep-dive — strong but narrow. Carson hasn't lived in the protocol guts long enough to write about it without risking a correction from someone like Markus. Sprinkle this *inside* (a) where it comes up naturally.

The thread name on the timeline becomes: **"AG-UI Rebuild Log"** (or just no formal name — the consistency does the work).

**Honest flag:** 4 frameworks in 14 days is aggressive. If Carson can only credibly hit 2 (e.g. CopilotKit Direct-to-LLM + one of Mastra/LangGraph), the posts pivot to "first two of four, here's what's different" and the narrative still holds. Better to ship 2 honestly than 4 thinly — faking depth is the failure mode.

## The agent we're rebuilding

The reference agent is the one already in this repo: **AI Gym Buddy** — a small assistant with `updateGoal`, `setRoutine`, `dietSuggestion`, and `sleepTips` actions, plus generative UI for weekly plans and meal cards. Small enough to port. Real enough to expose framework differences (state handoff, tool-call streaming, generative UI ergonomics).

## Posting cadence (14 days)

| Day | Date       | Post # | Type                    | Topic                                                           |
| --- | ---------- | ------ | ----------------------- | --------------------------------------------------------------- |
| 1   | 2026-05-07 | 1      | Build-in-public momentum | Kickoff: framing the rebuild experiment                         |
| 2   | 2026-05-08 | 2      | Technical deep-dive      | CopilotKit Direct-to-LLM baseline — what generative UI costs    |
| 4   | 2026-05-10 | 3      | Take / opinion           | Why "agentic UX" is a frontend problem, not an LLM problem      |
| 5   | 2026-05-11 | 4      | Demo announcement        | B2 demo #1 ships (link)                                         |
| 7   | 2026-05-13 | 5      | Technical deep-dive      | Porting to Mastra: state handoff and tool streaming differences |
| 8   | 2026-05-14 | 6      | Build-in-public momentum | Mid-experiment retro: what's surprised me                       |
| 10  | 2026-05-16 | 7      | Technical deep-dive      | LangGraph port: where the AG-UI abstraction earns its keep      |
| 11  | 2026-05-17 | 8      | Take / opinion           | Tool-call streaming UX is underrated                            |
| 13  | 2026-05-19 | 9      | Demo announcement        | B2 demo #2 ships (link)                                         |
| 14  | 2026-05-20 | 10     | Build-in-public momentum | Wrap-up: side-by-side comparison + repo                         |

Days 3, 6, 9, 12 are intentionally empty. Dead air is fine. Spacing prevents the "guy posting all day" vibe that kills credibility with senior engineers.

Time of day: post between 9–11am ET on weekdays. That's when CopilotKit (NYC-based) and most of dev-Twitter are active.

---

## Post drafts

### Post 1: Kickoff — framing the rebuild experiment

**When:** Day 1
**Type:** Build-in-public momentum
**Hook:** "Rebuilding the same agent in 4 different agent frameworks to see which one actually feels good to ship."

**Text (266 chars):**
```
Rebuilding the same agent in 4 different agent frameworks to see which one actually feels good to ship.

Same UI. Same tools. Same generative components. Different backends: CopilotKit Direct-to-LLM, Mastra, LangGraph, PydanticAI.

Posting the diffs as I go.
```

**Attached media:** [ATTACH: a single screenshot of the AI Gym Buddy UI mid-conversation, with a tool-call rendering inline. No annotations. Just clean product.]

**Reply hook / CTA:** None. The post is a frame; let day 2 carry the technical weight.

**@-mentions:** None. Tagging the CopilotKit team on a kickoff post reads as "look at me." Let them find it.

---

### Post 2: CopilotKit Direct-to-LLM baseline

**When:** Day 2
**Type:** Technical deep-dive
**Hook:** "The thing CopilotKit gets right that I didn't appreciate until I tried to write the alternative: `useCopilotAction` makes a tool call and the rendered result the same primitive."

**Text (278 chars):**
```
The thing CopilotKit gets right that I didn't appreciate until I tried to write the alternative:

useCopilotAction makes the tool call and the rendered result the same primitive.

You don't have a tool layer and a UI layer. You have one component that knows both.
```

**Attached media:** [ATTACH: code screenshot of a `useCopilotAction` call in the gym buddy repo (the `setRoutine` one), with the inline `render` function highlighted. Dark theme, no IDE chrome.]

**Reply hook / CTA:** None needed — the post is the argument.

**@-mentions:** None.

---

### Post 3: Take — agentic UX is a frontend problem

**When:** Day 4
**Type:** Take / opinion
**Hook:** "Most 'agent quality' problems I see in demos aren't model problems. They're UI problems pretending to be model problems."

**Text (279 chars):**
```
Most "agent quality" problems I see in demos aren't model problems. They're UI problems pretending to be model problems.

The model picked the right tool. It just streamed back as a JSON blob in a chat bubble instead of becoming a thing on the page.

That's a frontend bug.
```

**Attached media:** [ATTACH: side-by-side screenshot — left: raw JSON tool-call output in a generic chat UI; right: the same call rendered as a meal card from the gym buddy repo.]

**Reply hook / CTA:** "What's a recent agent demo where the UI was carrying the LLM?" — invites people to share examples without forcing engagement.

**@-mentions:** None. This is the post most likely to get a like or quote from CopilotKit because it's their thesis stated cleanly. Don't tag them — let them come to it.

---

### Post 4: B2 demo #1 announcement

**When:** Day 5
**Type:** Demo announcement
**Hook:** "Shipped: [demo name]. Built on CopilotKit + AG-UI. Source + live link below."

**Text (placeholder, ~250 chars — fill in actual demo name and one-line value prop from the B2 unit):**
```
Shipped: [DEMO_NAME].

[ONE_LINE_VALUE_PROP — what it does, who it's for]

Built on CopilotKit + AG-UI, ~[N] LOC of agent code. The interesting bit is [SPECIFIC_TECHNICAL_THING].

Live: [URL]
Source: [GH_URL]
```

**Attached media:** [ATTACH: 15-30s screen recording of the demo's most-impressive interaction. No narration. Caption the key moment with a single sentence overlay.]

**Reply hook / CTA:** None — let the demo speak. If anyone asks how it works, that's the technical thread.

**@-mentions:** None on the main post. If a CopilotKit primitive or recent feature is load-bearing in the demo, credit it in a reply: "the [feature] from the recent CopilotKit release made [specific thing] trivial — would've been a weekend of plumbing otherwise." That reply can naturally @ the person who shipped it if you know who that was.

---

### Post 5: Porting to Mastra — what changes

**When:** Day 7
**Type:** Technical deep-dive
**Hook:** "Day 7 of rebuilding the same agent everywhere. Mastra port done. Two things broke that I didn't expect."

**Text (~280 chars):**
```
Day 7 of rebuilding the same agent everywhere. Mastra port done.

Two things broke that I didn't expect:
1. Tool-call streaming model — Mastra emits steps, CopilotKit emits a stream. The UI has to debounce differently.
2. Where state lives — server vs client by default.

Diff in replies.
```

**Attached media:** [ATTACH: split-screen code diff — left: CopilotKit Direct-to-LLM tool definition; right: same tool wired through Mastra. Highlight 2-3 lines that show the streaming-model difference.]

**Reply hook / CTA:** First reply contains the actual diff or a link to the PR/branch. This makes the main post a teaser and the reply a payoff — good engagement pattern.

**@-mentions:** None in main post. If someone from Mastra (or CopilotKit's AG-UI side) replies with a correction, accept it gracefully and credit them in the reply. That's the natural moment for a real interaction.

---

### Post 6: Mid-experiment retro

**When:** Day 8
**Type:** Build-in-public momentum
**Hook:** "Halfway through the 4-framework rebuild. The thing I was sure I'd find is not what I'm finding."

**Text (~270 chars):**
```
Halfway through the 4-framework rebuild. The thing I was sure I'd find is not what I'm finding.

Going in I assumed the agent code would dominate. It doesn't. The frontend integration layer is where 80% of the framework's personality lives.

Updating my mental model.
```

**Attached media:** [ATTACH: a rough hand-drawn or whiteboard-style diagram showing "agent code" as a small box and "frontend integration layer" as a big box, with the four frameworks plotted on it.]

**Reply hook / CTA:** None. This is a credibility post — it shows Carson updates beliefs in public, which is the trait the team is selecting for.

**@-mentions:** None.

---

### Post 7: LangGraph port — the AG-UI abstraction

**When:** Day 10
**Type:** Technical deep-dive
**Hook:** "LangGraph port: this is where the AG-UI protocol earns its keep."

**Text (~280 chars):**
```
LangGraph port: this is where the AG-UI protocol earns its keep.

LangGraph's native event stream is verbose and graph-shaped. The frontend doesn't want graph events, it wants UI state transitions.

AG-UI is the layer that does that translation. Without it you write it yourself. I've now written it myself.
```

**Attached media:** [ATTACH: terminal screenshot showing the raw LangGraph event stream (verbose), next to the cleaned AG-UI event stream the frontend actually consumes. Annotate one event pair.]

**Reply hook / CTA:** "Anyone running LangGraph in production frontends — how are you handling this if you're not on AG-UI?" Genuine question, invites real engineers, filters out replyguys.

**@-mentions:** This is the one post where tagging is natural. If the question is genuinely technical and you've read Markus's or Atai's writing on this, an "@markus curious if my read here matches the design intent" is fine — but only if the question is real. If you're just trying to get them to see the post, don't.

---

### Post 8: Take — tool-call streaming UX

**When:** Day 11
**Type:** Take / opinion
**Hook:** "Tool-call streaming is the most underrated UX surface in agent products right now."

**Text (~278 chars):**
```
Tool-call streaming is the most underrated UX surface in agent products right now.

Every framework has solved "the model can call a tool."

Almost none have solved "the user knows what's happening between the call starting and the result rendering."

That gap is where products feel slow.
```

**Attached media:** [ATTACH: short clip (5-8s) of the gym buddy generating a workout plan with the tool call visibly streaming — the partial state rendering progressively. This is the post's whole argument.]

**Reply hook / CTA:** None. The clip is the argument.

**@-mentions:** None.

---

### Post 9: B2 demo #2 announcement

**When:** Day 13
**Type:** Demo announcement
**Hook:** "Second demo from the rebuild experiment. This one's the one I learned the most from."

**Text (placeholder, ~260 chars):**
```
Second demo from the rebuild experiment.

[DEMO_NAME] — [ONE_LINE_VALUE_PROP]

The interesting part: [SPECIFIC_TECHNICAL_DETAIL — e.g. "this one runs on LangGraph with the AG-UI bridge, so you can compare it side-by-side with the CopilotKit Direct-to-LLM version from day 5"].

Live: [URL]
Source: [GH_URL]
```

**Attached media:** [ATTACH: screen recording of the demo, plus a still image of the side-by-side comparison repo structure if relevant.]

**Reply hook / CTA:** None. If the comparison is interesting, link to the README of the comparison branch in a reply.

**@-mentions:** None in main post. Same rule as Post 4 — credit specific primitives in replies if they're load-bearing.

---

### Post 10: Wrap-up

**When:** Day 14
**Type:** Build-in-public momentum
**Hook:** "Two weeks. Same agent, [N] frameworks. Here's the side-by-side, the repo, and the one thing I'd tell anyone starting an agent product today."

**Text (~290 chars — likely needs trimming or accept as a 4000-char premium post if Carson has it):**
```
Two weeks. Same agent, [N] frameworks. Here's what I learned.

The repo: [URL]

One thing I'd tell anyone starting an agent product today: pick the framework based on the frontend story, not the agent story. The agent code is small. The integration is where you live.
```

**Attached media:** [ATTACH: a single comparison table image — frameworks as rows, criteria as columns (state model, streaming model, generative UI ergonomics, frontend LOC, time-to-first-tool-call). Make it readable on mobile.]

**Reply hook / CTA:** Link the repo in a reply. Mention specifically what you'd build next if you were extending this. That naturally invites a "we'd hire someone who thinks this way" response without asking for it.

**@-mentions:** None. The wrap-up is the moment Carson is most tempted to tag the team. Don't. The whole point of the 14 days was to make tagging unnecessary.

---

## Engagement playbook

In a small-audience play, reply and quote-tweet behavior matters more than original posts. The first thing the team will see on Carson's profile is recent activity. Make it look like an engineer who reads, not a fan who lurks.

**Rules of engagement when CopilotKit team members (Atai, Markus, Tyler, Travis, Nathan, Eli) post:**

- **Like** anything substantive about AG-UI, agent UX, or shipping. Like sparingly on anything else. A profile that's liked every CopilotKit post for a month looks like a stalker.
- **Reply only when you have something specific to add.** Specific = a code observation, a framing they didn't include, a counter-example you actually built. Not "great post!" Not "this." Not a thread of your own work disguised as a reply.
- **Quote-tweet only to extend the thought**, not to redirect attention to yourself. If Markus posts about tool streaming and Carson has a working example of the exact thing, a quote-tweet with the demo clip and one sentence ("the tool-streaming case from your post — here it is running") is fine. A quote-tweet that says "great take, also check out my project" is not.
- **Never DM.** The re-engagement email is the channel. X is for showing, not asking.
- **Don't reply to every post.** Pick one or two per week. Be the person whose replies they remember, not the person whose replies they scroll past.

**Good reply example (under a hypothetical Markus post on tool-call streaming):**
> "The debounce window matters more than people realize — I had a generative UI flicker on every partial token until I batched on tool-name boundaries instead of time. Repo here if useful: [link]"

**Cringe reply (do not send):**
> "100%! Great thread. I've been thinking about this exact problem — I'd love to chat sometime!"

The first is an engineer adding signal. The second is networking, and senior engineers can smell it from orbit.

**Quoting / amplifying CopilotKit announcements:** if CopilotKit ships a new feature during the 14 days, a quote-tweet with a 30-second clip of Carson using it on the gym buddy app within 24 hours of ship is the strongest possible move. It's the exact thing a good DA does. Caption: "Tried the [feature] release — [one specific observation]. [clip]." No tag needed.

## @-mention rules

- **Tag only when the post would be incomplete without the tag** — i.e., crediting an idea, asking a real technical question, or correcting your own previous take in light of someone's feedback.
- **Do not tag in announcement posts**, demo launches, or anything self-promotional. That includes posts 1, 4, 6, 9, and 10.
- **The @ in Post 7** (LangGraph) is the only pre-planned tag, and only fires if the question is genuine. If on the day Carson can't write a question he actually has, drop the tag.

## Do not post

These are the failure modes that would actively damage the re-approach. Hard rules:

1. **No "looking for opportunities" / "open to work" posts.** The whole strategy is to look hired-already. One desperate post undoes 14 days.
2. **No content about the rejection.** Not as a "lessons learned" post, not as a humble-brag, not in a reply, not even subtweeted. The team will remember the rejection. Carson's job is to give them a reason to override it, not to remind them of it.
3. **No AI-generated thread spam.** No "🧵 1/12" walls. No emoji-bulleted "10 things I learned about LangGraph" lists. The audience can tell. CopilotKit specifically can tell.
4. **No tagging the CopilotKit team in self-promotional posts.** Tagging Atai under a demo announcement is a tell.
5. **No commentary on competitors** (Vercel AI SDK, LangChain UI bits, etc.) that reads as taking sides. Be neutral-technical. CopilotKit has to coexist with that ecosystem; Carson shouldn't pick fights on their behalf.
6. **No subtweets of anyone, ever.** Not other applicants, not other frameworks, not the previous rejection process. Visible bitterness disqualifies.

## Success signal

The point of this isn't likes. It's that one of the six people, sometime in the next 14 days, sees a post and thinks "wait, this is the guy who emailed us." If that happens once, the strategy worked. Everything else is noise.
