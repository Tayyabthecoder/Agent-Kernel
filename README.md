# Agent Kernel

[![lint](https://github.com/Tayyabthecoder/Agent-Kernel/actions/workflows/lint.yml/badge.svg)](https://github.com/Tayyabthecoder/Agent-Kernel/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Universal building blocks for reliable, production-grade AI agent systems.**

Agent Kernel is a portable framework of agents, engineering rules, skills,
workflows, and templates that equips AI coding assistants with consistent,
high-quality engineering standards. It is written entirely in plain Markdown,
works with any assistant that reads project instruction files, and requires no
runtime, package, or build step.

## Table of Contents

- [Why Agent Kernel](#why-agent-kernel)
- [Quick Start](#quick-start)
- [What Is Included](#what-is-included)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Platform Compatibility](#platform-compatibility)
- [Design Principles](#design-principles)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Why Agent Kernel

AI coding assistants are capable but inconsistent: without guidance, they may
make broad unrequested changes, skip verification, or overlook security. Agent
Kernel addresses this by giving every assistant in your project the same:

- **Always-on safeguards** that enforce minimal, verified, secure changes and
  protect uncommitted work.
- **Specialized agents** with clearly bounded, least-privilege responsibilities.
- **Reusable skills and workflows** that encode proven engineering practices.
- **Standard templates** for planning and architecture documents.

## Quick Start

Copy three items from this repository into your project root:

```text
your-project/
├── AGENTS.md      # Entry point read by most AI assistants
├── CLAUDE.md      # Entry point for Claude Code
└── .agents/       # Framework content
```

```bash
git clone --depth 1 https://github.com/Tayyabthecoder/Agent-Kernel.git /tmp/agent-kernel
cp -R /tmp/agent-kernel/.agents /tmp/agent-kernel/AGENTS.md /tmp/agent-kernel/CLAUDE.md /path/to/your-project/
```

Your assistant discovers the framework automatically on its next session. If
your project already has an `AGENTS.md` or `CLAUDE.md`, merge rather than
overwrite them.

See the **[Setup Guide](SETUP_GUIDE.md)** for Windows instructions, merging
existing files, platform configuration, verification, and usage examples.

## What Is Included

| Component | Count | Description |
|---|---:|---|
| [Agents](.agents/agents/) | 77 | 10 core framework agents and 67 extended specialist agents |
| [Rules](.agents/rules/) | 126 | 15 core workflow and domain standards and 111 language and stack rules |
| [Skills](.agents/skills/) | 129 | On-demand engineering, review, process, and design skills |
| [Workflows](.agents/workflows/) | 15 | Step-by-step engineering playbooks |
| [Templates](.agents/templates/) | 9 | Planning, requirements, and architecture document templates |

### Agents

The **10 core agents** form the primary architecture and are the default choice:

| Agent | Purpose |
|---|---|
| `architect-planner` | Turns requirements into work packages |
| `code-implementer` | Executes approved code changes (the only core agent with write access) |
| `qa-reviewer` | Gates quality before changes are finalized |
| `security-auditor` | Audits for vulnerabilities and exposed secrets |
| `diagnostic-debugger` | Performs root-cause analysis of defects |
| `accessibility-auditor` | Reviews WCAG and accessibility compliance |
| `docs-auditor` | Verifies documentation matches the code |
| `dependency-auditor` | Audits packages for risk and known vulnerabilities |
| `release-manager` | Issues go/no-go decisions on release readiness |
| `agent-evaluator` | Scores the quality of agent output |

The **67 extended agents**, adapted from the upstream ECC project, provide
language-, stack-, and domain-specific expertise. See the
[agents guide](.agents/agents/README.md) for when to use them.

### Rules

- **Always-on rules** applied to every task:
  [change safety](.agents/rules/change-safety.md),
  [core workflow](.agents/rules/core-workflow.md), and
  [security](.agents/rules/security.md).
- **Domain standards** for architecture, backend, frontend, databases, API
  design, testing, performance, accessibility, and Git workflow.
- **Language and stack rules** for TypeScript, React, Python, Go, Rust, Java,
  C#, Dart/Flutter, Swift, Vue, Angular, Nuxt, PHP, and more.

### Skills

- **Core engineering skills** covering backend and frontend development,
  database design, authentication, CI/CD, observability, load testing, and
  debugging.
- **Language review and build-fix skills** such as `python-review`,
  `go-review`, `react-build-fix`, and `rust-build-fix`.
- **Process and utility skills** such as `council`, `context-budget`,
  `intent-driven-development`, and `e2e-testing`.
- **UI/UX Pro Max**, a third-party design intelligence skill with searchable
  styles, palettes, font pairings, and UX guidelines (requires Python 3).

### Workflows

| Area | Workflows |
|---|---|
| Planning | `plan.md`, `plan-prd.md` |
| Development | `feature-dev.md`, `refactor-clean.md`, `migrate.md` |
| Quality | `code-review.md`, `pr.md`, `test-coverage.md` |
| Defects and incidents | `triage-bug.md`, `build-fix.md`, `incident.md`, `retro.md` |
| Release and maintenance | `release.md`, `update-docs.md`, `onboard-repo.md` |

### Templates

API design, architecture, database, deployment, PRD, project planning,
requirements analysis, SRS, and testing strategy.

## Architecture

Agent Kernel follows a **Primary Agent Broker** pattern. Your AI assistant acts
as the Primary Agent: it orchestrates the specialized agents, runs all
verification commands, and brokers results between them. Agents never delegate
to each other directly.

```text
                      ┌────────────────────┐
                      │   Primary Agent    │
                      │  (your assistant)  │
                      └─────────┬──────────┘
        ┌───────────────┬───────┴───────┬────────────────┐
        ▼               ▼               ▼                ▼
 architect-planner  code-implementer  qa-reviewer  security-auditor  ...
   (read-only)        (read/write)    (read-only)     (read-only)
```

This design enforces **least privilege**: only `code-implementer` among the core
agents can modify files, while planning, review, and audit agents are strictly
read-only. Agents declare platform-neutral model tiers and tool names, which you
map to your platform once using [model-tiers.md](.agents/model-tiers.md) and
[tool-names.md](.agents/tool-names.md).

## Repository Structure

```text
Agent-Kernel/
├── .agents/
│   ├── agents/       # 77 Agent role definitions (core and extended)
│   ├── rules/        # 126 Engineering rules (core standards and language rules)
│   ├── skills/       # 129 Engineering and task skills
│   ├── templates/    # 9 Planning and architecture templates
│   ├── workflows/    # 15 Engineering playbooks
│   ├── model-tiers.md       # Maps fast/reasoning tiers to platform models
│   └── tool-names.md        # Maps neutral tool names to platform tools
├── .github/workflows/lint.yml  # Continuous integration checks
├── scripts/
│   └── lint.mjs             # Repository consistency checks
├── AGENTS.md                # Entry point for AI assistants
├── CLAUDE.md                # Entry point for Claude Code
├── CODE_OF_CONDUCT.md       # Community standards
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── README.md                # Project overview
├── SETUP_GUIDE.md           # Installation and usage guide
└── THIRD_PARTY_NOTICES.md   # Third-party attributions
```

## Platform Compatibility

Agent Kernel is platform-neutral. It works with any AI coding assistant that
reads project instruction files, including Claude Code, OpenAI Codex, Cursor,
Gemini CLI, and GitHub Copilot. Claude Code is supported out of the box through
`CLAUDE.md`; other assistants discover the framework through `AGENTS.md`. See
[Platform Configuration](SETUP_GUIDE.md#platform-configuration) for details.

## Design Principles

- **Portable**: plain Markdown and self-contained scripts, usable in any
  AI-assisted development environment.
- **No adapters**: no platform-specific sync directories such as `.claude/`,
  `.gemini/`, `.codex/`, or `.cursor/`.
- **No runtime overhead**: no lifecycle hooks, test gates, or background
  runners required.
- **Least privilege**: agents receive only the tools their role requires.
- **Safe by default**: always-on rules protect user work and enforce secure,
  verified changes.

## Documentation

| Document | Description |
|---|---|
| [Setup Guide](SETUP_GUIDE.md) | Installation, configuration, and usage |
| [AGENTS.md](AGENTS.md) | Framework entry point and core agent roster |
| [Agents Guide](.agents/agents/README.md) | Agent architecture, permissions, and core vs. extended agents |
| [Model Tiers](.agents/model-tiers.md) | Mapping tiers to platform models |
| [Tool Names](.agents/tool-names.md) | Mapping neutral tool names to platform tools |

## Contributing

Contributions are welcome. Please read the
[Contributing Guidelines](CONTRIBUTING.md) before opening an issue or pull
request, and follow the [Code of Conduct](CODE_OF_CONDUCT.md). All changes must
pass `node scripts/lint.mjs`, which also runs in CI.

## License

Agent Kernel is released under the [MIT License](LICENSE). It includes material
adapted from third-party projects; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attributions.
