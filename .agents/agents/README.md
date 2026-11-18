# Subagent Architecture & Operating Fleet

This directory defines the specialized subagents operating within the AI Agent Engineering Framework, enforcing the Primary Agent Broker Pattern and least-privilege security boundaries.

---

## 1. Operating Principles & Least Privilege
To enforce defense-in-depth and avoid unauthorized mutations:
- **Strict Read-Only Posture for Auditors & Planners**: Eight of the ten core subagents (`architect-planner`, `diagnostic-debugger`, `qa-reviewer`, `security-auditor`, `accessibility-auditor`, `docs-auditor`, `dependency-auditor`, `release-manager`) declare `commandExecutionPolicy: off` and possess only read tools: `[read_file, send_message, manage_task]`.
- **Single Mutation Subagent**: Only `code-implementer` possesses filesystem mutation tools: `[read_file, write_file, edit_file, run_command, send_message, manage_task]`.
- **Evaluator Exception**: `agent-evaluator` has no write tools but does hold `run_command` (to re-run checks when scoring). Run it sandboxed; see [`../tool-names.md`](../tool-names.md) for which tools count as mutating.
- **Tool names are neutral**: map them to your platform with [`../tool-names.md`](../tool-names.md), and map `tier:` with [`../model-tiers.md`](../model-tiers.md).
- **Environment & MCP Isolation**: All subagents declare `subagent: true`, `inheritMcp: false` (to isolate ambient tool catalogs), and `inheritCustomizations: true` (to inherit project rules and skills). A subagent receives an MCP tool only through an explicit `mcpPolicy.agentGrants` entry in `framework.config.json`; read-only agents may only be granted tools the project attested as read-only. No grants are configured by default.

---

## 2. Subagent Fleet Matrix

| Subagent | Definition File | Tier | Command Policy | Permitted Tools | Core Focus |
|---|---|---|---|---|---|
| **architect-planner** | [`architect-planner.md`](architect-planner.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | Requirements analysis, system topology, specifications, task work packages. |
| **code-implementer** | [`code-implementer.md`](code-implementer.md) | `fast` | `sandbox` | `read_file`, `write_file`, `edit_file`, `run_command`, `send_message`, `manage_task` | Surgical code implementation, bug fixes, refactoring, database migrations. |
| **diagnostic-debugger** | [`diagnostic-debugger.md`](diagnostic-debugger.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | Reproduction specification, root-cause isolation, stack trace analysis (commands run by the Primary Agent). |
| **qa-reviewer** | [`qa-reviewer.md`](qa-reviewer.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | Test evidence review, git diff auditing, static-analysis review, quality gate issuance. |
| **security-auditor** | [`security-auditor.md`](security-auditor.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | Threat modeling, OWASP vulnerability audits, credential exposure detection. |
| **accessibility-auditor** | [`accessibility-auditor.md`](accessibility-auditor.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | WCAG 2.1 AA audits, screen-reader compatibility, keyboard navigation checks. |
| **docs-auditor** | [`docs-auditor.md`](docs-auditor.md) | `fast` | `off` | `read_file`, `send_message`, `manage_task` | Documentation vs code accuracy audits, broken references, unverified claims. Reports only; corrections go to `code-implementer`. |
| **dependency-auditor** | [`dependency-auditor.md`](dependency-auditor.md) | `fast` | `off` | `read_file`, `send_message`, `manage_task` | Manifest and lockfile hygiene, version drift, redundancy, licenses, upgrade risk. Security findings are handed to `security-auditor`. |
| **release-manager** | [`release-manager.md`](release-manager.md) | `reasoning` | `off` | `read_file`, `send_message`, `manage_task` | Release readiness from supplied evidence, version and changelog consistency, release notes drafts, go or no-go. Never tags, publishes, or deploys. |
| **agent-evaluator** | [`agent-evaluator.md`](agent-evaluator.md) | `reasoning` | `sandbox` (recommended) | `view_file`, `grep_search`, `find_by_name`, `run_command` | Scores agent output on a 5-axis rubric (accuracy, completeness, clarity, actionability, conciseness). Never edits files. |

---

## 3. Primary Agent Broker Protocol
As codified in Section 12 of [`.agents/rules/core-workflow.md`](../rules/core-workflow.md):
1. **Primary Agent Leadership**: The Primary Agent coordinates the workflow, decomposes goals into work packages, and delegates tasks to specialized subagents.
2. **Telemetry Brokering**: The Primary Agent executes automated tests, linters, and verification commands, sanitizing command outputs before brokering them to `qa-reviewer` or `diagnostic-debugger`.
3. **Mandatory Credential Redaction**: All secrets, tokens, or keys discovered during agent execution must be redacted as `[REDACTED_SECRET: TYPE]`.

---

## 4. Core vs. Extended Agents

This folder holds two sets of agents:

- **Core (10):** the agents in the table above. They follow the broker protocol, use the core tool names, and are the **default choice**.
- **Extended (67):** agents adapted from the upstream ECC project (see [`../../THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)). They are specialists for specific languages, stacks, or domains. Use one only when no core agent covers the task, or when you need its language- or stack-specific depth.

### Overlapping Roles

Where a core and an extended agent cover the same ground, prefer the core agent:

| Need | Use (core) | Instead of (extended) |
|---|---|---|
| Planning and architecture | `architect-planner` | `planner`, `architect`, `code-architect` |
| General code review / quality gate | `qa-reviewer` | `code-reviewer` |
| Security review | `security-auditor` | `security-reviewer` |
| Accessibility review | `accessibility-auditor` | `a11y-architect` |
| Documentation accuracy | `docs-auditor` | `doc-updater` (it writes; route its fixes through `code-implementer`) |
| Root-cause analysis | `diagnostic-debugger` | `build-error-resolver` (use the language-specific `*-build-resolver` only for build failures in that stack) |
| Scoring agent output | `agent-evaluator` | `gan-evaluator` (only inside the `gan-*` generate/evaluate loop) |

Language-specific reviewers (`python-reviewer`, `rust-reviewer`, …) have no core equivalent; use them alongside `qa-reviewer` when a change is in that language.
