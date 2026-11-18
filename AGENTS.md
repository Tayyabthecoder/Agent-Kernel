# Agent Kernel

Universal building blocks for reliable, production-grade AI agent systems.

## Quick Start

Copy the `.agents/` folder into your project root. AI assistants that support
`AGENTS.md` or `CLAUDE.md` will automatically discover the agents, rules, and skills.

```
your-project/
└── .agents/
    ├── agents/    ← agent role definitions
    ├── rules/     ← always-on engineering rules
    ├── skills/    ← task skills loaded on demand
    ├── workflows/ ← step-by-step playbooks
    └── templates/ ← planning document templates
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

These rules are automatically applied to every task:

- `change-safety.md` — minimize change scope, protect user work
- `core-workflow.md` — inspect → plan → implement → verify
- `security.md` — secure-by-default engineering standards

## Full Documentation

See [`README.md`](./README.md) for the complete directory overview.
