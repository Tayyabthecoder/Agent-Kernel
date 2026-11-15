# Model Tiers — Platform Mapping Reference

Agent definitions in this framework use two **platform-neutral capability tiers** instead of model-specific names.
Fill in the right column for your platform and you're done.

---

## Tiers

| Tier | Intent | When Used |
|---|---|---|
| `tier: fast` | Lightweight, fast, low-cost | Routine tasks — doc updates, simple file edits, dependency checks |
| `tier: reasoning` | Deep analysis, strong reasoning | Architecture, security audits, root cause analysis, code review |

---

## Platform Mapping

| Platform | `tier: fast` → | `tier: reasoning` → |
|---|---|---|
| **Anthropic Claude** | `claude-haiku` / `claude-3-5-haiku` | `claude-sonnet` / `claude-opus` |
| **Google Gemini** | `gemini-2.0-flash` | `gemini-2.5-pro` |
| **OpenAI / Codex** | `gpt-4o-mini` | `o3` / `gpt-4o` |
| **Cursor** | Fast model (set in Cursor settings) | Slow / reasoning model (set in Cursor settings) |
| **Kimi (Moonshot)** | `moonshot-v1-8k` | `moonshot-v1-128k` |
| **DeepSeek** | `deepseek-chat` | `deepseek-reasoner` |
| **Mistral** | `mistral-small` | `mistral-large` |
| **Your custom setup** | _(fill in)_ | _(fill in)_ |

---

## How to Apply

Most AI harnesses that support `AGENTS.md` or agent definition files let you override the model at the
platform level (global config, settings file, or environment variable). You do **not** need to edit
individual agent files — set your mapping once at the platform level.

### Example: Claude Code (`~/.claude/settings.json`)
```json
{
  "modelAliases": {
    "fast": "claude-3-5-haiku-20241022",
    "reasoning": "claude-sonnet-4-5"
  }
}
```

### Example: Environment variable (any harness)
```bash
AGENT_TIER_FAST=gpt-4o-mini
AGENT_TIER_REASONING=o3
```

### Example: Cursor
Set "Fast model" and "Slow model" in **Cursor → Settings → Models**.
The `tier:` field serves as documentation — Cursor picks the model from its own settings.

---

## Agents by Tier

### `tier: fast` (9 agents)
Routine, high-frequency tasks where speed matters more than depth.

| Agent | Why fast is enough |
|---|---|
| `code-implementer` | Executes well-scoped, approved work packages |
| `comment-analyzer` | Pattern matching over code comments |
| `conversation-analyzer` | Transcript scanning |
| `dependency-auditor` | Structured CVE lookup and report parsing |
| `doc-updater` | Documentation sync from code |
| `docs-auditor` | Diff-based doc accuracy check |
| `docs-lookup` | Retrieval and summarization |
| `opensource-forker` | File copying and secret stripping |
| `opensource-packager` | Template generation |

### `tier: reasoning` (68 agents)
Complex judgment, multi-file analysis, security and architecture decisions.

Includes: `architect-planner`, `qa-reviewer`, `security-auditor`, `diagnostic-debugger`,
`release-manager`, all language reviewers, all build resolvers, and all specialized domain agents.

---

> [!TIP]
> When in doubt, assign the **reasoning** tier. The fast tier is an optimization, not a default.
