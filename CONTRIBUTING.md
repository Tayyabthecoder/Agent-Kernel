# Contributing to Agent Kernel

Thank you for your interest in contributing to Agent Kernel. This document
describes how to propose changes, the standards contributions are expected to
meet, and the process by which they are reviewed and merged.

## Table of Contents

- [Scope of Contributions](#scope-of-contributions)
- [Reporting Issues](#reporting-issues)
- [Reporting Security Vulnerabilities](#reporting-security-vulnerabilities)
- [Development Setup](#development-setup)
- [Repository Structure](#repository-structure)
- [Authoring Standards](#authoring-standards)
- [Validation](#validation)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Licensing](#licensing)

## Scope of Contributions

Agent Kernel is a portable, platform-neutral framework of Markdown agents,
rules, skills, workflows, and templates. Contributions are welcome in the
following areas:

| Type | Examples |
|---|---|
| **Corrections** | Broken links, invalid references, factual errors, typos |
| **Improvements** | Clearer guidance, tighter scope, better trigger descriptions |
| **Additions** | New agents, rules, skills, workflows, or templates of broad, cross-project value |
| **Tooling** | Enhancements to `scripts/lint.mjs` or the CI workflow |

Content specific to a single codebase, organization, or proprietary tool is out
of scope. For substantial additions or structural changes, please open an issue
to discuss the proposal before investing significant effort.

## Reporting Issues

Before opening an issue, search [existing issues](https://github.com/Tayyabthecoder/Agent-Kernel/issues)
to avoid duplicates. A good report includes:

- **Summary**: a concise description of the problem.
- **Location**: the affected file path(s) and, where relevant, line numbers.
- **Expected vs. actual behavior**: what the guidance should say or do, and what it does instead.
- **Environment** (if applicable): the AI assistant or platform in use.

## Reporting Security Vulnerabilities

Do **not** report security vulnerabilities through public issues. Use GitHub's
[private vulnerability reporting](https://github.com/Tayyabthecoder/Agent-Kernel/security/advisories/new)
instead. Include a description of the issue, its potential impact, and steps to
reproduce. Never include live secrets or credentials in any report.

## Development Setup

**Prerequisites**

- Git
- Node.js 20 or later (required for validation)
- Python 3.12 or later (required only when modifying `ui-ux-pro-max`)

**Setup**

1. Fork the repository on GitHub.
2. Clone your fork and create a topic branch:

   ```bash
   git clone https://github.com/<your-username>/Agent-Kernel.git
   cd Agent-Kernel
   git checkout -b fix/short-description
   ```

3. Confirm the baseline passes validation:

   ```bash
   node scripts/lint.mjs
   ```

No dependency installation or build step is required.

## Repository Structure

| Path | Purpose |
|---|---|
| `.agents/agents/` | Agent role definitions, one Markdown file per agent |
| `.agents/rules/` | Engineering rules, either always-on or applied by model decision |
| `.agents/skills/` | Task skills, one directory per skill containing `SKILL.md` |
| `.agents/workflows/` | Step-by-step engineering playbooks |
| `.agents/templates/` | Planning and architecture document templates |
| `.agents/model-tiers.md` | Mapping of `fast` / `reasoning` tiers to platform models |
| `.agents/tool-names.md` | Mapping of neutral tool names to platform tools |
| `scripts/lint.mjs` | Repository consistency checks |

Refer to [README.md](README.md) for a complete overview and to
[AGENTS.md](AGENTS.md) for how AI assistants discover the framework.

## Authoring Standards

### General Requirements

- **Platform neutrality**: write guidance that applies across AI assistants.
  Use the neutral tool names defined in `.agents/tool-names.md`.
- **Clarity**: use direct, imperative language. Prefer specific, actionable
  instructions over general advice.
- **Encoding**: save all files as UTF-8 **without** a byte order mark (BOM).
- **Links**: use relative links for repository files; every link must resolve.
- **References**: inline-code references such as `skills/<name>` or
  `agents/<name>.md` must point to existing files.
- **Secrets**: never include real keys, tokens, passwords, or credentials,
  including in examples. Use clearly marked placeholders.
- **Attribution**: when adapting third-party material, preserve its license
  terms and record the attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

### Agents

Each agent is a single file at `.agents/agents/<name>.md` with the following
required frontmatter:

```yaml
---
name: example-agent          # must match the filename
description: "One sentence stating the agent's purpose and when to use it."
tier: reasoning              # fast | reasoning
tools:                       # neutral tool names only
  - read_file
  - send_message
---
```

- Apply the principle of least privilege. Among the core agents, only
  `code-implementer` holds write access; review and audit agents must remain
  read-only.
- Introducing a new tool name requires updating both `.agents/tool-names.md`
  and the `KNOWN_TOOLS` set in `scripts/lint.mjs`.
- Prefer extending an existing core agent over adding a new one. See
  [.agents/agents/README.md](.agents/agents/README.md) for guidance on core
  versus extended agents.

### Skills

- Each skill resides in `.agents/skills/<name>/` and must contain a `SKILL.md`
  with `name` (matching the directory) and `description` frontmatter.
- The `description` determines when a skill is loaded. State what the skill
  does, when to use it, and, where applicable, which related skill to use instead.
- Keep `SKILL.md` focused. Place extended reference material in supporting
  files within the same directory and link to them.

### Rules

- Rules declare a `trigger` (`always_on` or `model_decision`) and a
  `description`; `paths` globs are optional.
- `always_on` rules are loaded for every task on every consuming project. New
  always-on rules require clear justification and prior discussion in an issue.

### Workflows and Templates

- Workflows must consist of ordered, actionable steps with clear completion criteria.
- Templates must use explicit, clearly marked placeholders.

## Validation

All contributions must pass validation before review:

```bash
node scripts/lint.mjs
```

The validator checks that:

- Agent frontmatter is complete, `name` matches the filename, `tier` is valid,
  and all tools are recognized.
- Every skill directory contains a `SKILL.md`.
- Component counts in the `README.md` directory tree match the files on disk.
- All relative Markdown links resolve.
- No Markdown file begins with a UTF-8 BOM.
- Inline references to skills, agents, rules, workflows, and templates exist.

If you add or remove a component, update the corresponding counts in the
`README.md` directory tree and, where relevant, the "What is Included" section.

Changes to `ui-ux-pro-max` must additionally pass:

```bash
python .agents/skills/ui-ux-pro-max/scripts/validate_data.py
python .agents/skills/ui-ux-pro-max/scripts/search.py "saas dashboard" --domain style
```

These checks run automatically on every push and pull request via
[.github/workflows/lint.yml](.github/workflows/lint.yml).

## Commit Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```text
<type>: <concise summary in the imperative mood>
```

| Type | Use for |
|---|---|
| `feat` | New agents, rules, skills, workflows, templates, or capabilities |
| `fix` | Corrections to existing content or tooling |
| `docs` | Documentation-only changes |
| `refactor` | Restructuring without changing behavior or guidance |
| `chore` | Maintenance, CI, and repository housekeeping |

Keep each commit focused on a single logical change.

## Pull Request Process

1. Ensure your branch is up to date with `main` and that validation passes locally.
2. Open a pull request against `main` with a clear title following the commit
   conventions above.
3. In the description, include:
   - **Summary**: what changed and why.
   - **Related issue**: link any issue the pull request resolves.
   - **Verification**: the commands you ran and their results.
4. Keep the pull request scoped to one concern. Avoid unrelated formatting or
   refactoring changes.
5. Address review feedback with additional commits; maintainers may squash on merge.

A pull request is ready to merge when CI passes and a maintainer has approved it.

### Pull Request Checklist

- [ ] `node scripts/lint.mjs` passes
- [ ] README counts and listings are updated, if components were added or removed
- [ ] New or changed content is platform-neutral and contains no secrets
- [ ] Third-party material is attributed in `THIRD_PARTY_NOTICES.md`
- [ ] Commit messages follow Conventional Commits

## Licensing

By submitting a contribution, you agree that it will be licensed under the
terms of the project's [LICENSE](LICENSE).
