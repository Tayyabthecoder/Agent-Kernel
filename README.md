# Agent-Kernel
Universal building blocks for reliable, production-grade AI agent systems. Equips autonomous agents with deep engineering standards, modular skills, and robust playbooks.

---

## Directory Overview

```text
Agent-Kernel/
├── .agents/
│   ├── agents/       # 77 Agent role definitions (Core sub-agents + full ECC agent roster)
│   ├── rules/        # 126 Engineering rules (Core workflow/safety + ECC language standards)
│   ├── skills/       # 129 Engineering & task skills (Core skills + ECC skills & review packs)
│   ├── templates/    # 9 Standard software planning & architecture templates
│   ├── workflows/    # 15 Core engineering playbooks & workflow checklists
│   ├── model-tiers.md  # Maps fast/reasoning tiers to platform models
│   └── tool-names.md   # Maps neutral tool names to platform tools
├── scripts/
│   └── lint.mjs  # Consistency checks (run: node scripts/lint.mjs)
├── .github/workflows/lint.yml  # Runs the lint on push and PR
├── AGENTS.md     # Entry point auto-discovered by AI assistants
├── CLAUDE.md     # Points Claude Code to AGENTS.md
├── CONTRIBUTING.md  # How to contribute
├── LICENSE
├── THIRD_PARTY_NOTICES.md  # MIT License notice and third-party attribution
└── README.md     # Documentation and usage guide
```

---

## What is Included

### 1. `agents/` (77 Agents)
- **10 Core Framework Sub-Agents:** Bounded engineering roles (`architect-planner`, `code-implementer`, `diagnostic-debugger`, `qa-reviewer`, `security-auditor`, `accessibility-auditor`, `docs-auditor`, `dependency-auditor`, `release-manager`, `agent-evaluator`).
- **67 ECC Agents:** The complete upstream ECC agent suite (`planner`, `architect`, `code-reviewer`, `marketing-agent`, `seo-specialist`, `network-architect`, `gan-generator`, `type-design-analyzer`, `spec-miner`, `homelab-architect`, and all language-specific resolvers/reviewers).

### 2. `rules/` (126 Rules)
- **15 Core Workflow & Domain Standards:** Change safety, security, core workflow, architecture, backend, frontend, database, API design, testing, performance, accessibility, and git workflow.
- **111 Language & Stack Rules:** Comprehensive guidelines for TypeScript, React, Python, Go, Rust, Java, C#, Dart/Flutter, Swift, Vue, Angular, Nuxt, PHP, and more.

### 3. `skills/` (129 Skills)
- **Core Engineering Skills:** Full lifecycle skills for backend development, frontend development, database design, load testing, observability, debugging, CI/CD, and auth.
- **ECC Language Review & Fix Skills:** Specialized skills adapted from ECC (`python-review`, `react-build-fix`, `go-review`, `rust-build-fix`, etc.).
- **ECC Process & Utility Skills:** Upstream ECC tools (`council`, `santa-method`, `continuous-learning`, `agent-sort`, `context-budget`, `intent-driven-development`, `e2e-testing`, `windows-desktop-e2e`, etc.).
- **UI/UX Pro Max:** Third-party design intelligence skill (`ui-ux-pro-max`): searchable styles, palettes, font pairings, UX guidelines, and stack-specific UI rules. Requires Python 3. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

### 4. `templates/` (9 Templates)
- Architecture Decision Records (ADRs)
- Product Requirements Documents (PRDs)
- Software Requirements Specifications (SRSs)
- Database Schemas, Testing Strategies, and Feature Plans

### 5. `workflows/` (15 Workflows)
- Step-by-step playbooks for standard development procedures:
  - `plan.md` & `plan-prd.md`
  - `feature-dev.md`
  - `code-review.md` & `pr.md`
  - `build-fix.md` & `test-coverage.md`
  - `refactor-clean.md`
  - `triage-bug.md` & `incident.md`
  - `release.md`, `update-docs.md`, `migrate.md`, `onboard-repo.md`, `retro.md`

---

## Key Design Principles
- **No Complex Adapters:** Free from `.claude/`, `.gemini/`, `.codex/`, and `.cursor/` sync clutter.
- **No Hook / Runner Overhead:** Does not require automated lifecycle hooks, test gates, or fingerprint runners.
- **Pure & Portable:** Plain Markdown and self-contained scripts that can be used directly in any AI-assisted coding environment.
