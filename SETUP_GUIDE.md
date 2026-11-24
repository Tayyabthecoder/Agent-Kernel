# Setup Guide

This guide explains how to install Agent Kernel into your own project, configure
it for your AI coding assistant, and use it in day-to-day development.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Projects with an Existing AGENTS.md or CLAUDE.md](#projects-with-an-existing-agentsmd-or-claudemd)
- [Platform Configuration](#platform-configuration)
- [Verifying the Installation](#verifying-the-installation)
- [Using Agent Kernel](#using-agent-kernel)
- [Customization](#customization)
- [Updating](#updating)
- [Uninstalling](#uninstalling)
- [Troubleshooting](#troubleshooting)

## Overview

Agent Kernel is a set of plain Markdown files: agents, rules, skills, workflows,
and templates. It has no runtime, package, or build step. Your AI assistant
reads the files directly from your project.

Discovery works through two entry points at your project root:

| File | Read by |
|---|---|
| `AGENTS.md` | Most AI coding assistants that support the `AGENTS.md` convention |
| `CLAUDE.md` | Claude Code, which imports `AGENTS.md` and the always-on rules |

Both point the assistant to the `.agents/` directory, which holds the framework
content.

## Prerequisites

- An AI coding assistant that reads project instruction files (for example,
  Claude Code, OpenAI Codex, Cursor, Gemini CLI, or GitHub Copilot).
- Git, to obtain the framework.
- **Optional:** Python 3 if you intend to use the `ui-ux-pro-max` skill.

## Installation

You need to copy **three items** into your project root:

1. The `.agents/` directory
2. `AGENTS.md`
3. `CLAUDE.md`

Copying `.agents/` alone is not sufficient; without the entry-point files, your
assistant will not discover the framework.

> The repository's `scripts/`, `.github/`, `README.md`, and `CONTRIBUTING.md`
> are for maintaining Agent Kernel itself and do not need to be copied.

### macOS and Linux

```bash
git clone --depth 1 https://github.com/Tayyabthecoder/Agent-Kernel.git /tmp/agent-kernel
cd /path/to/your-project
cp -R /tmp/agent-kernel/.agents .
cp /tmp/agent-kernel/AGENTS.md /tmp/agent-kernel/CLAUDE.md .
rm -rf /tmp/agent-kernel
```

### Windows (PowerShell)

```powershell
git clone --depth 1 https://github.com/Tayyabthecoder/Agent-Kernel.git "$env:TEMP\agent-kernel"
Set-Location C:\path\to\your-project
Copy-Item -Recurse "$env:TEMP\agent-kernel\.agents" .
Copy-Item "$env:TEMP\agent-kernel\AGENTS.md", "$env:TEMP\agent-kernel\CLAUDE.md" .
Remove-Item -Recurse -Force "$env:TEMP\agent-kernel"
```

> **Caution:** these commands overwrite any existing `AGENTS.md` or `CLAUDE.md`.
> If your project already has either file, follow the next section instead.

After copying, your project should look like this:

```text
your-project/
├── AGENTS.md
├── CLAUDE.md
├── .agents/
│   ├── agents/
│   ├── rules/
│   ├── skills/
│   ├── templates/
│   ├── workflows/
│   ├── model-tiers.md
│   └── tool-names.md
└── ... your existing files
```

Commit these files so every contributor and assistant working on the project
uses the same framework.

## Projects with an Existing AGENTS.md or CLAUDE.md

Do not overwrite your existing files. Copy only `.agents/`, then merge the entry
points manually:

1. **`AGENTS.md`**: append the contents of Agent Kernel's `AGENTS.md` to the end
   of your existing file.
2. **`CLAUDE.md`**: add the following lines:

   ```text
   @AGENTS.md
   @.agents/rules/change-safety.md
   @.agents/rules/core-workflow.md
   @.agents/rules/security.md
   ```

Review the merged result for conflicting instructions between your existing
guidance and Agent Kernel's rules, and resolve them explicitly.

## Platform Configuration

### Instruction Discovery

| Platform | How it finds Agent Kernel |
|---|---|
| **Claude Code** | Reads `CLAUDE.md`, which imports `AGENTS.md` and the three always-on rules. No further setup is required. |
| **Assistants supporting `AGENTS.md`** | Read `AGENTS.md` from the project root. |
| **Other assistants** | Configure the assistant to load `AGENTS.md` as a project instruction or context file, or reference it at the start of a session. |

Platform support for `AGENTS.md` changes between releases. Consult your
assistant's documentation for its current instruction-file behavior.

### Always-On Rules

Three rules apply to every task:

- `.agents/rules/change-safety.md`
- `.agents/rules/core-workflow.md`
- `.agents/rules/security.md`

Claude Code loads them automatically through `CLAUDE.md`. Platforms that read
rules from `.agents/rules/` honor their `trigger: always_on` frontmatter. On any
other platform, ensure these three files are loaded at the start of each task,
for example by referencing them in your assistant's project instructions.

### Model Tiers

Agents declare a platform-neutral `tier` of `fast` or `reasoning` instead of a
model name. Map each tier to a model on your platform using
[`.agents/model-tiers.md`](.agents/model-tiers.md). In most cases this is set
once in your platform's settings rather than in individual agent files.

### Tool Names

Agents list tools using neutral names such as `read_file` and `run_command`.
Map them to your platform's actual tools using
[`.agents/tool-names.md`](.agents/tool-names.md). Preserve the read-only
restrictions on review and audit agents when doing so.

## Verifying the Installation

Start a new session with your assistant in the project and ask:

```text
Which framework rules and agents are you following in this project?
```

A correctly configured assistant should reference Agent Kernel, the three
always-on rules, and the core agents listed in `AGENTS.md`. If it does not, see
[Troubleshooting](#troubleshooting).

## Using Agent Kernel

### Always-On Behavior

Once installed, the always-on rules guide every task automatically: the
assistant inspects before changing code, keeps changes minimal, protects
uncommitted work, verifies results, and applies secure-by-default practices.

### Workflows

Workflows in `.agents/workflows/` are step-by-step playbooks. Invoke one by
naming it in your request:

```text
Follow .agents/workflows/feature-dev.md to add CSV export to the reports page.
```

| Workflow | Purpose |
|---|---|
| `plan.md`, `plan-prd.md` | Plan a change or produce a product requirements document |
| `feature-dev.md` | Implement a feature end to end |
| `triage-bug.md`, `build-fix.md` | Diagnose a defect or fix a failing build |
| `code-review.md`, `pr.md` | Review changes and prepare a pull request |
| `test-coverage.md` | Improve test coverage |
| `refactor-clean.md` | Refactor safely |
| `migrate.md` | Plan and execute a migration |
| `release.md` | Prepare a release |
| `incident.md`, `retro.md` | Respond to an incident and run a retrospective |
| `update-docs.md` | Bring documentation in line with code |
| `onboard-repo.md` | Orient in an unfamiliar repository |

### Agents

The Primary Agent (your assistant) orchestrates ten core agents, such as
`architect-planner`, `code-implementer`, `qa-reviewer`, and `security-auditor`.
Request one by name:

```text
Use the security-auditor agent to review the authentication changes.
```

Prefer the core agents. The 67 extended agents are specialists for specific
languages and stacks; see [`.agents/agents/README.md`](.agents/agents/README.md)
for when to use them.

### Skills

Skills in `.agents/skills/` are loaded on demand when a task matches their
description. You can also request one explicitly:

```text
Use the accessibility skill while building the signup form.
```

### Templates

Templates in `.agents/templates/` provide standard structures for planning
documents such as ADRs, PRDs, and test strategies:

```text
Draft an ADR for moving to PostgreSQL using the ADR template in .agents/templates/.
```

## Customization

- **Remove what you do not need.** Unused language rules, skills, or extended
  agents can be deleted. Keep `AGENTS.md`, `CLAUDE.md`, the three always-on
  rules, and any files they reference.
- **Add project-specific guidance** to your `AGENTS.md` or to new files in
  `.agents/rules/`. Keep reusable framework content separate from
  project-specific documentation (for example, in `docs/`).
- **Fill in the "Your platform" columns** in `model-tiers.md` and
  `tool-names.md` to document your team's configuration.

## Updating

1. Note any local changes you made to files under `.agents/`.
2. Obtain the latest version using the [installation](#installation) steps,
   copying into a temporary location first.
3. Compare the new files with your copy (for example, with `git diff --no-index`)
   and apply updates while preserving your customizations.
4. Review the diff before committing.

## Uninstalling

Delete the `.agents/` directory, then remove `AGENTS.md` and `CLAUDE.md`, or,
if you merged them into existing files, remove only the lines that Agent Kernel
added.

## Troubleshooting

| Symptom | Resolution |
|---|---|
| The assistant does not mention Agent Kernel | Confirm `AGENTS.md` and `CLAUDE.md` are in the project root, not inside `.agents/`. Start a new session after installing. |
| Always-on rules are not applied | Ensure your platform loads the three always-on rule files; see [Always-On Rules](#always-on-rules). |
| The assistant cannot find a referenced agent or skill | Confirm the entire `.agents/` directory was copied, including hidden-directory contents. |
| Agents request tools your platform does not have | Map neutral tool names using `.agents/tool-names.md`. |
| `ui-ux-pro-max` scripts fail | Install Python 3 and ensure `python` is on your `PATH`. |

For ready-to-use prompts covering every stage of development, see the
[Prompt Guide](PROMPT_GUIDE.md).

For other problems, open an issue on the
[Agent Kernel repository](https://github.com/Tayyabthecoder/Agent-Kernel/issues).
To contribute improvements, see [CONTRIBUTING.md](CONTRIBUTING.md).
