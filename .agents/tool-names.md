# Tool Names — Platform Mapping Reference

Agent definitions list tools under `tools:` using **neutral names**. Two vocabularies
exist in this repository:

- **Core framework agents** (the 10 in `AGENTS.md`): `read_file`, `write_file`, `edit_file`, `run_command`, `send_message`, `manage_task`
- **Extended (ECC) agents**: `view_file`, `grep_search`, `find_by_name`, `write_to_file`, `replace_file_content`, `run_command`, `search_web`, `read_url_content`

Both are neutral names. Map them to your platform's real tools with the table below,
the same way [`model-tiers.md`](model-tiers.md) maps `tier:` to models.

---

## Mapping

| Neutral name | Capability | Claude Code | Gemini CLI | Your platform |
|---|---|---|---|---|
| `read_file` / `view_file` | Read a file | `Read` | `read_file` | _(fill in)_ |
| `grep_search` | Search file contents | `Grep` | `search_file_content` | _(fill in)_ |
| `find_by_name` | Find files by pattern | `Glob` | `glob` | _(fill in)_ |
| `write_file` / `write_to_file` | Create or overwrite a file | `Write` | `write_file` | _(fill in)_ |
| `edit_file` / `replace_file_content` | Edit part of a file | `Edit` | `replace` | _(fill in)_ |
| `run_command` | Run a shell command | `Bash` | `run_shell_command` | _(fill in)_ |
| `search_web` | Web search | `WebSearch` | `google_web_search` | _(fill in)_ |
| `read_url_content` | Fetch a URL | `WebFetch` | `web_fetch` | _(fill in)_ |
| `send_message` | Report back to the Primary Agent | Final response of the subagent | Final response | _(fill in)_ |
| `manage_task` | Track work items | Task / todo tools | — | _(fill in)_ |

> Tool names change between platform releases. Check your platform's current tool list
> when filling in or verifying a column.

---

## Write and Command Access

Treat these as **mutating** when enforcing least privilege:

- Write: `write_file`, `write_to_file`, `edit_file`, `replace_file_content`
- Command execution: `run_command` (a shell can modify files, so it is mutating unless sandboxed)

An agent marked read-only must not be granted any of the above.
