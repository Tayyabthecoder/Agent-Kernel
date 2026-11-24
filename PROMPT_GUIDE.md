# Prompt Guide

Ready-to-use prompts that take you from an idea to working software with
Agent Kernel. Copy a prompt, replace the `[placeholders]`, and paste it into
your AI assistant.

This guide is written for developers of every level, including vibe coders who
build mainly by prompting. Each prompt tells your assistant exactly which
rules, skills, agents, and templates to use, so you do not need to memorize
the framework.

> **Before you start:** install Agent Kernel in your project by following the
> [Setup Guide](SETUP_GUIDE.md).

## Table of Contents

- [The Three-Prompt Workflow](#the-three-prompt-workflow)
- [Prompt 1: Define the Project and Create the Docs](#prompt-1-define-the-project-and-create-the-docs)
- [Prompt 2: Create the Implementation Plan](#prompt-2-create-the-implementation-plan)
- [Prompt 3: Implement a Phase with a Progress Tracker](#prompt-3-implement-a-phase-with-a-progress-tracker)
- [Resuming Work in a New Session](#resuming-work-in-a-new-session)
- [Supporting Prompts](#supporting-prompts)
- [Tips and Common Mistakes](#tips-and-common-mistakes)

## The Three-Prompt Workflow

Building with an AI assistant works best in three stages. Each stage produces
files that the next stage reads, so nothing depends on the assistant's memory.

```text
 Prompt 1                    Prompt 2                    Prompt 3
 Define & document    ──▶    Plan in phases      ──▶     Implement a phase
 ─────────────────           ──────────────              ─────────────────
 You describe the idea       Agent analyzes docs/        Agent analyzes the phase,
 Agent asks questions        Agent writes a phased       creates a tracker, builds,
 You answer                  plan and recommends         verifies, and updates the
 Agent writes docs/          where to start              tracker as it goes
```

By the end, your project contains:

```text
docs/
├── README.md                  # Index of all project documents
├── prd.md                     # Product requirements
├── srs.md                     # Software requirements specification
├── architecture.md            # System architecture
├── ...                        # Other documents the project needs
├── implementation-plan.md     # Phased plan (Prompt 2)
└── progress-tracker.md        # Live progress (Prompt 3)
```

**Ground rules for best results:**

- Run each prompt in a **new chat session**. The files carry the context forward.
- Review each output before moving on. Correct the docs before planning, and
  correct the plan before implementing.
- Commit your work after each prompt, so you can always roll back.

## Prompt 1: Define the Project and Create the Docs

**Purpose:** turn your idea into a complete set of project documents. You
describe what you want, the assistant asks clarifying questions, and your
answers become the documents in `docs/`.

**How to use it:** fill in the "My project" section as best you can. Short,
rough answers are fine; the assistant's questions fill the gaps.

```text
I want to build a new project. Act as a product manager and software
architect. Follow AGENTS.md and the always-on rules in .agents/rules/.

## My project

- What I want to build: [describe the app in a few sentences]
- Who it is for: [target users]
- The problem it solves: [the main problem]
- Main features: [list the key features]
- Tech stack: [e.g. Next.js, TypeScript, PostgreSQL — or "please recommend one"]
- Platform: [web / mobile / desktop / API / other]
- Anything else: [deadlines, budget, integrations, examples you like]

## Step 1: Ask me questions

Use the requirements-analysis skill. Based on my description, ask me the
questions you need to fully understand the project: users and roles, core
user flows, features and priorities, data, integrations, authentication,
non-functional needs (performance, security, scale), and constraints.

- Ask in rounds of no more than 10 questions, grouped by topic and numbered.
- For each question, suggest a sensible default answer I can accept.
- After each round, wait for my answers. Ask follow-up rounds only if
  something important is still unclear.
- Tell me when you have enough information to write the documents.

Do not create any files during this step.

## Step 2: Create the documents

When I confirm, create the documents in a folder named docs/ at the project
root. Use the matching skill and template for each one:

| File                      | Skill                         | Template                                                     |
|---------------------------|-------------------------------|--------------------------------------------------------------|
| docs/prd.md               | prd-writing                   | .agents/templates/prd/prd-template.md                        |
| docs/srs.md               | srs-writing                   | .agents/templates/srs/srs-template.md                        |
| docs/requirements.md      | requirements-analysis         | .agents/templates/requirements-analysis/requirements-spec-template.md |
| docs/architecture.md      | architecture-design           | .agents/templates/architecture/architecture-spec-template.md |
| docs/adr/                 | architecture-decision-records | .agents/templates/architecture/adr-template.md               |
| docs/database-schema.md   | database-design               | .agents/templates/database/schema-template.md                |
| docs/api-spec.md          | api-documentation             | .agents/templates/api/api-spec-template.md                   |
| docs/test-plan.md         | testing-qa                    | .agents/templates/testing/test-plan-template.md              |

- Create only the documents this project actually needs. For example, skip
  docs/api-spec.md if there is no API, or docs/database-schema.md if there is
  no database. Tell me which ones you skipped and why.
- Write one ADR in docs/adr/ for each major technology decision.
- Base every document on my answers. Where you had to assume something,
  mark it clearly as "Assumption" so I can review it.
- Keep the documents consistent with each other: the same feature names,
  user roles, and data entities everywhere.
- Create docs/README.md listing every document with a one-line description.

Do not write any application code. When you finish, summarize what you
created and list all assumptions and open questions for me to review.
```

**What you get:** a `docs/` folder with the project documents, an index, and a
list of assumptions to confirm. Read the documents, fix anything wrong, and
commit them before moving on.

## Prompt 2: Create the Implementation Plan

**Purpose:** turn the documents into a step-by-step implementation plan,
divided into phases and sub-phases, with a recommendation on where to start.

```text
Follow AGENTS.md and the always-on rules in .agents/rules/. Follow
.agents/workflows/plan.md, use the project-planning skill, and use the
architect-planner agent for the analysis.

## Step 1: Analyze the documents

Read every document in docs/ thoroughly, starting with docs/README.md.
Then report:

1. A short summary of what we are building.
2. All features and requirements, grouped by area.
3. Dependencies between features (what must exist before what).
4. Technical risks and unknowns.
5. Any gaps, contradictions, or inconsistencies between the documents.

If you find contradictions or critical gaps, list them and ask me to resolve
them before you continue.

## Step 2: Write the implementation plan

Create docs/implementation-plan.md, using
.agents/templates/project-planning/project-plan-template.md as a guide.

Divide the work into phases, and each phase into sub-phases:

- Phase 1, Phase 2, ... each with a clear goal and deliverable.
- Sub-phases numbered 1.1, 1.2, ... each small enough to finish and verify
  in one working session.

For every sub-phase, include:

- Goal: what it delivers.
- Tasks: a checklist of concrete tasks.
- Files and areas: what will be created or changed.
- Depends on: which earlier sub-phases must be complete.
- Requirements covered: references to the relevant sections in docs/.
- Rules, skills, and agents: which files in .agents/rules/, .agents/skills/,
  and .agents/agents/ apply.
- Acceptance criteria: how we know it is done.
- Verification: the tests, checks, or manual steps that prove it works.

Order the phases so that each one builds on working software: project setup
and foundations first, then core features, then secondary features, then
hardening, testing, and deployment.

Add a table at the top of the plan summarizing all phases and sub-phases.

## Step 3: Recommend where to start

End the plan with a "Recommended Starting Point" section that states which
phase and sub-phases to implement first, why, and what I need to prepare
beforehand (accounts, API keys, tools to install).

Do not write any application code. When you finish, summarize the plan and
your recommendation.
```

**What you get:** `docs/implementation-plan.md` with every phase broken into
small, verifiable sub-phases, and a clear recommendation for the first phase.
Review the order and scope, adjust anything you disagree with, and commit it.

## Prompt 3: Implement a Phase with a Progress Tracker

**Purpose:** implement a specific phase. The assistant first analyzes what
needs to be built, then creates a tracker file that it keeps updated, so you
can monitor progress at any time.

**How to use it:** replace `[X]` with the phase number and list the
sub-phases you want implemented. Run one phase per session.

```text
Follow AGENTS.md and the always-on rules in .agents/rules/. Follow
.agents/workflows/feature-dev.md.

Implement Phase [X], sub-phases [X.1, X.2, X.3] from
docs/implementation-plan.md.

## Step 1: Analyze before building

Read docs/implementation-plan.md, docs/progress-tracker.md (if it exists),
and the documents in docs/ that these sub-phases reference. Inspect the
current code. Then give me an analysis:

1. What will be built, in plain language.
2. The files that will be created or changed.
3. The rules, skills, and agents you will use.
4. Anything from earlier phases that is missing or incomplete.
5. Risks, open questions, and anything you need from me (such as API keys
   or accounts — never ask me to paste secrets into the chat; tell me which
   environment variable to set instead).

Wait for my approval before writing any code.

## Step 2: Create or update the progress tracker

Create docs/progress-tracker.md if it does not exist, or update it if it
does. It must contain:

- Overview: the current phase, overall status, and last updated date.
- Phase summary: a table of all phases with status
  (Not started / In progress / Done / Blocked).
- Current phase: every sub-phase and task from the plan as a checklist,
  with status.
- Work log: dated entries describing what was done.
- Verification: the commands run and their results.
- Blockers and decisions: open issues, decisions made, and deviations from
  the plan with reasons.
- Next steps: what should happen next.

## Step 3: Implement

Work through the sub-phases in order. For each sub-phase:

1. Mark it "In progress" in the tracker.
2. Implement the tasks. Use the code-implementer agent for code changes and
   follow the rules and skills listed in the plan.
3. Verify it against its acceptance criteria: run the tests, linter, and
   build, and fix any failures at the root cause. Never skip or disable
   checks to make them pass.
4. Update the tracker immediately: tick off completed tasks, mark the
   sub-phase "Done", and add a work log entry with the verification results.
5. If you get blocked, mark it "Blocked" in the tracker, explain why, and
   ask me before continuing.

Only implement the sub-phases I listed. If you discover work outside this
scope, add it to the tracker's "Next steps" instead of doing it.

## Step 4: Finish the phase

When all listed sub-phases are done:

1. Use the qa-reviewer agent to review the changes in this phase.
2. Update the tracker with the final status and the recommended next
   sub-phase or phase.
3. Give me a summary: what was built, files changed, verification results,
   how I can see or test it myself, and what comes next.
```

**What you get:** working, verified code for the phase, and
`docs/progress-tracker.md` showing exactly what is done, what was verified,
and what comes next. Open the tracker at any time to check progress. Test the
result yourself, then commit before starting the next phase.

## Resuming Work in a New Session

Because progress lives in `docs/progress-tracker.md`, you can stop at any time
and continue later, even with a different assistant.

```text
Follow AGENTS.md and the always-on rules in .agents/rules/.

Read docs/progress-tracker.md and docs/implementation-plan.md. Tell me where
the project stands: what is done, what is in progress, and any blockers.
Then continue with the next incomplete sub-phase, following the same process
as before: analyze first, wait for my approval, implement, verify, and
update the tracker after each sub-phase.
```

## Supporting Prompts

Use these alongside the three-prompt workflow.

### Verify the setup

Run once after installing, or whenever the assistant seems to ignore the
framework.

```text
Read AGENTS.md and the always-on rules in .agents/rules/ (change-safety.md,
core-workflow.md, security.md). Confirm which rules you will apply to every
task and list the 10 core agents and what each does. Do not change any files.
```

### Start from an existing project

If you already have code, run this instead of Prompt 1. It creates the docs
from your code, so you can continue with Prompt 2.

```text
Follow .agents/workflows/onboard-repo.md and use the codebase-onboarding and
project-context-analysis skills. Analyze this repository, then create docs/
describing the project as it exists today: docs/README.md, docs/prd.md,
docs/architecture.md, and any other documents from .agents/templates/ that
fit. Mark anything you inferred rather than confirmed as "Assumption".
Do not change any code.
```

### Change the requirements

```text
I want to change the requirements: [describe the change]. Update every
affected document in docs/, then update docs/implementation-plan.md and
docs/progress-tracker.md to reflect it. Tell me which completed work is
affected. Do not change any code yet.
```

### Fix a bug

```text
Follow .agents/workflows/triage-bug.md and use the diagnostic-debugger agent.

What happens: [actual behavior]
What should happen: [expected behavior]
How to reproduce: [steps]
Error message: [paste the full error]

Explain the root cause before changing code. Fix it with the smallest change,
add a test that would have caught it, and log the fix in
docs/progress-tracker.md.
```

### Review security before release

```text
Use the security-auditor agent and the security-review skill. Audit the
project against .agents/rules/security.md and rank findings by severity.
Redact any secrets you find. Do not change any code yet.
```

### Prepare a release

```text
Follow .agents/workflows/release.md and use the release-manager agent. Check
docs/progress-tracker.md, the tests, and open risks, and give me a go or
no-go decision for release.
```

## Tips and Common Mistakes

| Do | Avoid |
|---|---|
| Fill in the project context in Prompt 1, even roughly | Starting with "build me an app" and nothing else |
| Review and correct the docs before planning | Planning from documents you have not read |
| Implement one phase per session | Asking for the whole app in one prompt |
| Approve the analysis before code is written | Letting the assistant code before you agree on scope |
| Check the tracker and test the result yourself | Accepting "it should work now" without evidence |
| Commit after each prompt and each phase | Building several phases before committing |
| Paste the complete error message when something breaks | Paraphrasing errors from memory |

**If the assistant ignores the framework**, remind it:

```text
Re-read AGENTS.md and the always-on rules in .agents/rules/ before
continuing, and follow them for the rest of this session.
```

**If the assistant changes more than it should**, remind it:

```text
Follow .agents/rules/change-safety.md: undo changes unrelated to the current
sub-phase and keep the diff minimal.
```

**If the assistant forgets to update the tracker**, remind it:

```text
Update docs/progress-tracker.md now with everything completed and verified
so far, then continue.
```

For the full list of agents, rules, skills, and workflows, see the
[README](README.md#what-is-included).
