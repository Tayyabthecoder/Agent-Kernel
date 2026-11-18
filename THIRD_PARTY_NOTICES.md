# Third-Party Notices

This framework includes material adapted from the following third-party projects.

## ecc-universal (ECC)

- **Package**: `ecc-universal` v2.2.3 (npm)
- **Source**: https://github.com/affaan-m/ECC
- **License**: MIT
- **Material used**:
  - Language-specific rules in `.agents/rules/` (files carrying `source: ecc-universal@2.2.3` in their frontmatter), with frontmatter converted to dual Antigravity / Claude Code format and cross-references re-pointed to this framework's rules.
  - Guidance merged from ECC `common/*` rules into this framework's `coding-standards.md` (Section 15), `testing.md` (Section 22), `security.md` (Section 19), and `git-workflow.md` (Section 7).
  - The "Prompt Defense Baseline" section in `.agents/agents/*.md`.
  - Content merged into `.agents/skills/git-workflow/SKILL.md`.
  - 27 skills converted from ECC agents (16 `*-review`, 11 `*-build-fix`), each marked `origin: ECC (...)` in its frontmatter metadata.
  - 9 workflows in `.agents/workflows/` (marked `source: ecc-universal@2.2.3`), with artifact paths, agent references, and safety gates adapted to this framework.
  - Sections merged into `architecture-design` (ADR practice, from `architecture-decision-records`), `end-to-end-testing` (flakiness and Playwright conventions, from `e2e-testing`), and `testing-qa` (Section 11, from `tdd-workflow` and `verification-loop`).

### License text

```
MIT License

Copyright (c) 2026 Affaan Mustafa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## UI/UX Pro Max

- **Package**: `ui-ux-pro-max-skill` v2.6.0 (commit `ed766d3`)
- **Source**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **License**: MIT
- **Material used**:
  - `.agents/skills/ui-ux-pro-max/` (`SKILL.md`, `scripts/`, `data/`, `references/`), copied from upstream `.claude/skills/ui-ux-pro-max/`. Changes: script paths re-pointed from `${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/` to `.agents/skills/ui-ux-pro-max/`, the path note reworded to match, `license`/`metadata.origin` added to the frontmatter, and upstream repository tests (`scripts/tests/`) omitted.

### License text

```
MIT License

Copyright (c) 2024 Next Level Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
