#!/usr/bin/env node
// Consistency checks for the .agents/ framework. No dependencies.
// Usage: node scripts/lint.mjs
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const A = join(root, ".agents");
const errors = [];
const err = (file, msg) => errors.push(`${relative(root, file).replaceAll("\\", "/")}: ${msg}`);

const KNOWN_TOOLS = new Set([
  "read_file", "write_file", "edit_file", "run_command", "send_message", "manage_task",
  "view_file", "grep_search", "find_by_name", "write_to_file", "replace_file_content",
  "search_web", "read_url_content",
]);
const TIERS = new Set(["fast", "reasoning"]);

function frontmatter(text) {
  const m = text.replace(/^﻿/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) { key = kv[1]; fm[key] = kv[2].trim() === "" ? [] : kv[2].trim().replace(/^["']|["']$/g, ""); continue; }
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && key && Array.isArray(fm[key])) fm[key].push(item[1].trim());
  }
  return fm;
}

// 1. Agent frontmatter
const agentFiles = readdirSync(join(A, "agents")).filter((f) => f.endsWith(".md") && f !== "README.md");
for (const f of agentFiles) {
  const p = join(A, "agents", f);
  const fm = frontmatter(readFileSync(p, "utf8"));
  if (!fm) { err(p, "missing frontmatter"); continue; }
  if (fm.name !== f.replace(/\.md$/, "")) err(p, `name "${fm.name}" does not match filename`);
  if (!fm.description) err(p, "missing description");
  if (!TIERS.has(fm.tier)) err(p, `tier must be fast|reasoning, got "${fm.tier ?? ""}"`);
  if (!Array.isArray(fm.tools) || fm.tools.length === 0) err(p, "missing tools list");
  else for (const t of fm.tools) if (!KNOWN_TOOLS.has(t)) err(p, `unknown tool "${t}" (add it to .agents/tool-names.md and this script)`);
}

// 2. Skills have SKILL.md
const skillDirs = readdirSync(join(A, "skills")).filter((d) => statSync(join(A, "skills", d)).isDirectory());
for (const d of skillDirs) if (!existsSync(join(A, "skills", d, "SKILL.md"))) err(join(A, "skills", d), "missing SKILL.md");

// 3. README counts
const count = (dir) => readdirSync(join(A, dir)).filter((f) => f !== "README.md").length;
const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
for (const dir of ["agents", "rules", "skills", "templates", "workflows"]) {
  const m = readme.match(new RegExp(`${dir}/\\s+#\\s+(\\d+)`));
  const actual = dir === "agents" ? agentFiles.length : count(dir);
  if (!m) err(readmePath, `no count found for ${dir}/ in directory tree`);
  else if (Number(m[1]) !== actual) err(readmePath, `${dir}/ count is ${m[1]}, actual ${actual}`);
}

// 4. Relative links in Markdown resolve
function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (e.name.endsWith(".md")) yield p;
  }
}
for (const p of walk(root)) {
  const raw = readFileSync(p, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) err(p, "starts with a UTF-8 BOM (breaks some frontmatter parsers)");
  const text = raw.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const file = decodeURIComponent(target.split("#")[0]);
    if (!file) continue;
    const abs = resolve(dirname(p), file);
    // Links into <project>/docs/ point at the consuming project's own docs, not this repo.
    if (!relative(root, abs).startsWith("..") && relative(root, abs).split(/[\\/]/)[0] === "docs") continue;
    if (!existsSync(abs)) err(p, `broken link -> ${target}`);
  }
}

// 5. Named references in inline code (`skills/x`, `agents/x.md`, `rules/x.md`, ...)
// Code blocks are skipped: they hold example output and upstream (ECC) paths.
const KINDS = {
  skills: (n) => existsSync(join(A, "skills", n.replace(/\/.*$/, ""))),
  agents: (n) => existsSync(join(A, "agents", n)),
  rules: (n) => existsSync(join(A, "rules", n)),
  workflows: (n) => existsSync(join(A, "workflows", n)),
  templates: (n) => existsSync(join(A, "templates", n)),
};
for (const p of walk(A)) {
  const text = readFileSync(p, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const [, span] of text.matchAll(/`([^`\n]+)`/g)) {
    if (/[~<*]|\.claude|^https?:/.test(span)) continue;
    const m = span.match(/^(?:\.agents\/)?(skills|agents|rules|workflows|templates)\/([A-Za-z0-9_.\/-]+?)\/?$/);
    if (m && !KINDS[m[1]](m[2])) err(p, `reference to missing ${m[1]}: \`${span}\``);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`OK: ${agentFiles.length} agents, ${skillDirs.length} skills checked.`);
