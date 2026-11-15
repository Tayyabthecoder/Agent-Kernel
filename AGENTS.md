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

| Agent | Model | Can Write? | Purpose |
|---|---|---|---|
| `architect-planner` | pro | ❌ | Turns requirements into work packages |
| `code-implementer` | flash | ✅ | Executes approved code changes |
| `qa-reviewer` | pro | ❌ | Gates quality before changes finalize |
| `security-auditor` | pro | ❌ | Audits for vulnerabilities and secrets |
| `diagnostic-debugger` | pro | ❌ | Root-cause analysis of defects |
| `accessibility-auditor` | — | ❌ | WCAG and a11y compliance review |
| `docs-auditor` | — | ❌ | Checks docs match actual code |
| `dependency-auditor` | — | ❌ | Audits packages for risk and CVEs |
| `release-manager` | pro | ❌ | Go/no-go on release readiness |
| `agent-evaluator` | — | ❌ | Scores agent output quality |

## Always-On Rules

These rules are automatically applied to every task:

- `change-safety.md` — minimize change scope, protect user work
- `core-workflow.md` — inspect → plan → implement → verify
- `security.md` — secure-by-default engineering standards

## Full Documentation

See [`README.md`](./README.md) for the complete directory overview.
