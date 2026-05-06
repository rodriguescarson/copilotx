# CopilotKit OSS contribution roadmap

## Why this matters for the hire

Re-approaching CopilotKit after a March rejection means showing, not telling. A merged PR
in `CopilotKit/CopilotKit` or `ag-ui-protocol/ag-ui` puts Carson's GitHub handle in front of
the same maintainers who'll review his next application — Nathan Tarbert, Tyler Slaton,
Markus Ecker — through the channel they actually pay attention to (their issue tracker and
PR review queue). Each contribution is a low-risk, high-signal artefact: it demonstrates he
can navigate their codebase, follow their contribution conventions, and ship work the team
already wants done. The goal of this roadmap is not to land five PRs — it's to land one
clean, visible PR fast, then build a small streak around it.

All issue numbers and assignment states below were verified on 2026-05-06 against the live
GitHub API. Anything noted as "unassigned" was open and unclaimed at that time.

---

## Prioritized opportunities

### 1. Refresh `llms-full.txt` and ship `/llms.txt` parity

- **Repo**: `CopilotKit/CopilotKit`
- **Tracking issues**: [#2111](https://github.com/CopilotKit/CopilotKit/issues/2111),
  [#3385](https://github.com/CopilotKit/CopilotKit/issues/3385)
- **Estimated effort**: 4–8 hrs
- **Priority**: high

**What it is**: CopilotKit's `docs.copilotkit.ai/llms.txt` and `llms-full.txt` are out of
sync with the live docs. Issue #2111 has been open since July 2025; in December 2025
maintainer Nathan Tarbert publicly confirmed "the llm.txt file is out of date and out of
sync with our current code base. We are planning to fix this and keep it up to date." Issue
#3385 (March 2026) reports the V2 migration content is missing from `llms-full.txt`
entirely. The docs source lives in `docs/content/docs/` as MDX, so the fix is a generation
script (or an update to whatever script already exists) plus a one-time regeneration.

**Why it matters to them**: It's a public maintainer-acknowledged debt that hurts every
LLM-powered tool reading their docs (Cursor, Continue, Claude). They want it fixed and
haven't found time. CopilotKit's whole value prop is "we build for the AI-native era" —
broken `llms.txt` is bad optics.

**Why it matters for the hire**: Highest-visibility, lowest-risk PR in the org. Two
maintainers have publicly committed to wanting this. Carson has spent the last week deep in
their docs to build the demo, so he already knows the structure. A successful PR here puts
his name in a very visible thread.

**Concrete first step**: Comment on #2111 saying he's prepared to take it, link to the
demo repo as evidence of familiarity with the docs, then look for an existing
`scripts/generate-llms-txt.*` (or equivalent) before scaffolding a new one. Open the PR as
a draft early to get sync feedback on the approach before grinding through every page.

---

### 2. Build the `n8n` AG-UI integration

- **Repo**: `ag-ui-protocol/ag-ui`
- **Tracking issue**: [#369](https://github.com/ag-ui-protocol/ag-ui/issues/369)
- **Estimated effort**: 16–30 hrs
- **Priority**: high (highest signal, but biggest scope)

**What it is**: AG-UI ships first-party integrations for LangGraph, CrewAI, Mastra, Agno,
LlamaIndex, Pydantic AI, AG2, AWS Strands, Microsoft Agent Framework, Google ADK, A2A,
Claude Agent SDK, and Langroid (verified by listing
`ag-ui-protocol/ag-ui/integrations/`). It's labelled `help wanted` + `Roadmap` and is
unassigned. Langflow (#366) and Flowise (#367) are already claimed; n8n is the
highest-traffic agent platform in that batch still up for grabs. AgentScope (#365) and
Bedrock AgentCore (#296) are also unassigned but less popular.

**Why it matters to them**: n8n is the biggest open-source workflow / agent platform on
GitHub right now. Adding an AG-UI integration unblocks a large user segment that doesn't
want LangGraph or CrewAI. CopilotKit's growth strategy is "AG-UI everywhere" — every
framework adapter is a direct revenue lever for the hosted product.

**Why it matters for the hire**: This is the strongest possible proof of "I can ship in
your stack." A new integration touches the protocol contract, the dojo (their feature
checklist), and example apps — exactly the surface area an Applied AI Engineer would own.
It's also a citable artefact in the re-application: "I shipped the n8n adapter for AG-UI."

**Concrete first step**: Open a proposal comment on #369 first — explain the planned
transport (n8n's webhook / SSE story) and which AG-UI events map to which n8n workflow
events. Wait for a maintainer reply (Markus Ecker / Nathan Tarbert) before forking. Use
`integrations/mastra/` as the template — it's the most recently-merged adapter and the
closest in shape.

---

### 3. Documentation patch for the missing Remote Backend Integration page

- **Repo**: `CopilotKit/CopilotKit`
- **Tracking issue**: [#2112](https://github.com/CopilotKit/CopilotKit/issues/2112)
- **Estimated effort**: 3–5 hrs
- **Priority**: medium

**What it is**: The URL `docs.copilotkit.ai/guides/backend-actions/remote-backend-endpoint`
(linked from elsewhere in the docs) returns 404. The issue has been open since July 2025
and nobody has been assigned. The fix is either restoring the page (the V1 content is in
git history) or writing a new page that explains the AG-UI replacement path — which is
arguably what users actually want now. Same comment thread on #2111 includes a great
user-written "what should this page say" template from Frederik Hendrix.

**Why it matters to them**: Every week this 404 stays up they lose users at the exact
moment they're trying to wire CopilotKit into a custom backend. There is direct evidence
in the comment threads of users bouncing because of it.

**Why it matters for the hire**: Low scope, ship-able in an afternoon, and the resulting
page will be a permanent piece of CopilotKit documentation under Carson's commit. It also
demonstrates he understands the V1 → V2 / AG-UI architecture transition — a topic the team
clearly cares about.

**Concrete first step**: Read git history for the deleted `remote-backend-endpoint.mdx`,
draft a new page that links to the AG-UI server-starter integration, and include a runnable
Next.js snippet. Submit as a normal PR and reference #2112 + #2111 in the body.

---

### 4. CLI: detect existing Next.js apps in `npx copilotkit init`

- **Repo**: `CopilotKit/CopilotKit`
- **Tracking issue**: [#2525](https://github.com/CopilotKit/CopilotKit/issues/2525)
- **Estimated effort**: 4–6 hrs
- **Priority**: medium

**What it is**: `npx copilotkit@latest init` claims (in their docs) to bootstrap an
existing Next.js app, but actually only creates new projects — it always prompts for a new
project name. Maintainer Tyler Slaton acknowledged the bug in October 2025 and said
"We will update the docs" but flagged that they want `init` to actually work in existing
projects when re-introduced.

**What's the right scope here**: A docs-only PR is the conservative version (remove the
"if you have a NextJS application…" claim from the quickstart). A code PR that *implements*
the existing-app detection — read `package.json`, look for `next` in dependencies, switch
to a non-creating install flow — is the higher-impact version. The latter is a real
contribution to the CLI tool and is bounded enough to be one PR.

**Why it matters to them**: The CLI is the first thing every new user touches. Fixing this
removes a documented foot-gun and matches what their docs already promise.

**Why it matters for the hire**: A merged code PR (not just docs) in the CLI package
demonstrates Carson can read their TypeScript and ship in it. Good complement to a
docs-only PR.

**Concrete first step**: Comment on #2525 confirming Tyler is OK with the implementation
approach (vs. just docs). Find the CLI source under `packages/copilotkit-cli/` (or
wherever the `inquirer.prompt` lives), branch, add a `detectExistingApp()` helper, and
short-circuit the project-name prompt when found.

---

### 5. (Lower priority, but easy) `ImageMessage` URL input support

- **Repo**: `CopilotKit/CopilotKit`
- **Tracking issue**: [#1967](https://github.com/CopilotKit/CopilotKit/issues/1967)
- **Estimated effort**: 3–4 hrs
- **Priority**: low

**What it is**: `ImageMessage` currently only accepts base64 data; users want to pass image
URLs directly (the Vercel AI SDK reference implementation is linked in the issue). It's
labelled `help wanted` + `feature request` and is unassigned.

**Why it matters to them**: Closes a feature-request issue, brings parity with Vercel's AI
SDK, and removes a friction point for any user passing images from object storage.

**Why it matters for the hire**: Touches the runtime + the React layer in one small PR.
Smallest "real code" contribution on this list.

**Concrete first step**: Look at the linked Vercel converter
(`packages/openai/src/convert-to-openai-chat-messages.ts`) and mirror that approach for
CopilotKit's own `ImageMessage` type. Check `runtime/` and `react-core/` for the type
definition first.

---

## Recommended sequencing

1. **Ship #1 first** (`llms.txt` refresh). It's the highest visibility per hour of work,
   maintainer-blessed, and doesn't compete with anyone — the people who commented "I am
   interested" never sent a PR. This is the unblock.
2. **In parallel, comment on #2** (n8n) to claim it. Even if Carson doesn't ship n8n in
   week one, having an in-flight integration claim with a posted approach gets the
   maintainers reading his name across two threads.
3. **Use #3 or #4 as the second visible PR** while #2 is incubating — ideally #4 because
   it's a code PR, not a doc PR, and the CLI is a clean small surface.
4. **Treat #5 as a "if there's time" warmup** — useful on the resume, lower visibility.

Skip the React Native AG-UI client (#510 in `ag-ui-protocol/ag-ui`): it's actively claimed
by `@habasefa` and there's a third-party library (`@assistant-ui/react-ag-ui`) already
solving the same problem. Skip the Turborepo → Nx docs PR (#3508 / PR #3509): that PR has
been open since March 2026 and unmerged, suggesting either contention or staleness — not a
good first target. Skip the Docker Model Runner LLM (#2530): already assigned.

---

## How to introduce yourself in the PR

The PR description should sound like a contributor, not a candidate. Lead with the
technical change. Mention the demo work in passing, only if it's load-bearing context.

> Closes #XXXX.
>
> **What changed**
>
> _(2-3 sentences on the actual diff: what file, what behaviour, before/after.)_
>
> **Why**
>
> _(1-2 sentences referencing the original issue's user request and any maintainer comment
> you're acting on. e.g. "Nathan flagged in #2111 that the llm.txt file was out of sync with
> the current codebase; this PR regenerates it from the live MDX sources and adds a
> generation script the team can re-run on each release.")_
>
> **Testing**
>
> _(How you verified — commands run, screenshots if UI, output diffs if generated content.)_
>
> **Notes**
>
> Happy to iterate on the approach. I've been building with CopilotKit + AG-UI on a
> personal demo (link) and noticed this while wiring up the runtime — let me know if there's
> a different direction the team would prefer.

Three rules:

1. Don't mention the rejection. Don't mention being a candidate. The PR has to stand on
   the diff.
2. Only link the demo repo if it's directly relevant to *why* you noticed the issue.
   Otherwise it reads as self-promotion.
3. Tag the maintainer who commented on the issue ("cc @NathanTarbert per the comment
   thread") only after the bot/CI checks pass — don't waste a maintainer ping on a red CI.
