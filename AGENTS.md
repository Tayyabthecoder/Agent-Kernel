# Agent Kernel

Universal building blocks for reliable, production-grade AI agent systems.

## Quick Start

Copy **three things** into your project root: the `.agents/` folder, `AGENTS.md`,
and `CLAUDE.md`. AI assistants find the framework through `AGENTS.md` (or
`CLAUDE.md` for Claude Code), so copying `.agents/` alone is not enough.

```
your-project/
├── AGENTS.md      ← entry point read by most AI assistants
├── CLAUDE.md      ← entry point for Claude Code (imports AGENTS.md + always-on rules)
└── .agents/
    ├── agents/    ← agent role definitions
    ├── rules/     ← always-on engineering rules
    ├── skills/    ← task skills loaded on demand
    ├── workflows/ ← step-by-step playbooks
    └── templates/ ← planning document templates
```

**Already have an `AGENTS.md` or `CLAUDE.md`?** Don't overwrite it. Append this
file's contents to your `AGENTS.md`, and add these lines to your `CLAUDE.md`:

```
@AGENTS.md
@.agents/rules/change-safety.md
@.agents/rules/core-workflow.md
@.agents/rules/security.md
```

## Core Framework Agents

These 10 agents form the primary broker architecture. The Primary Agent (you)
orchestrates them — they never delegate to each other directly.

| Agent | Tier | Can Write? | Purpose |
|---|---|---|---|
| `architect-planner` | reasoning | ❌ | Turns requirements into work packages |
| `code-implementer` | fast | ✅ | Executes approved code changes |
| `qa-reviewer` | reasoning | ❌ | Gates quality before changes finalize |
| `security-auditor` | reasoning | ❌ | Audits for vulnerabilities and secrets |
| `diagnostic-debugger` | reasoning | ❌ | Root-cause analysis of defects |
| `accessibility-auditor` | reasoning | ❌ | WCAG and a11y compliance review |
| `docs-auditor` | fast | ❌ | Checks docs match actual code |
| `dependency-auditor` | fast | ❌ | Audits packages for risk and CVEs |
| `release-manager` | reasoning | ❌ | Go/no-go on release readiness |
| `agent-evaluator` | reasoning | ❌ | Scores agent output quality |

> Map `fast` and `reasoning` to your platform's models in [`.agents/model-tiers.md`](.agents/model-tiers.md), and the neutral tool names to real tools in [`.agents/tool-names.md`](.agents/tool-names.md).
>
> `.agents/agents/` also holds 67 extended (ECC) specialist agents. Prefer the core agents above; see [`.agents/agents/README.md`](.agents/agents/README.md#4-core-vs-extended-agents) for when to use an extended one.

## Always-On Rules

Apply these rules to every task. Read them before starting work:

- [`change-safety.md`](.agents/rules/change-safety.md) — minimize change scope, protect user work
- [`core-workflow.md`](.agents/rules/core-workflow.md) — inspect → plan → implement → verify
- [`security.md`](.agents/rules/security.md) — secure-by-default engineering standards

Claude Code loads them automatically through the imports in `CLAUDE.md`. The rules'
`trigger: always_on` frontmatter is honored only by platforms that read rules from
`.agents/rules/`; on any other platform, read the three files above at the start of
each task.

## Full Documentation

See [`README.md`](./README.md) for the complete directory overview.
