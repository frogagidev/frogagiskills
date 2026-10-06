#!/usr/bin/env node
// Repo consistency check: `npm run check` (also run in CI). Zero dependencies.
// Exits 1 with a list of problems, 0 when everything holds. See AGENTS.md for the rules it enforces.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMOTED = ["engineering", "productivity", "workbench"];
const ALL_BUCKETS = [...PROMOTED, "misc", "in-progress", "deprecated"];
const EXTERNAL_SKILLS = new Set(["impeccable"]); // optional vendor skills a skill may call when installed
const problems = [];
const fail = (msg) => problems.push(msg);
const read = (p) => readFileSync(join(repo, p), "utf8");
const rel = (p) => relative(repo, p).replace(/\\/g, "/");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? (name === "node_modules" || name === ".git" ? [] : walk(p)) : [p];
  });
}

function frontmatter(text, file) {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) { fail(`${file}: missing frontmatter`); return {}; }
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return meta;
}

// 1. Skills: frontmatter, names, metadata, invocation pairs
const skills = new Map(); // name -> { bucket, userInvoked, dir }
for (const bucket of ALL_BUCKETS) {
  const bdir = join(repo, "skills", bucket);
  if (!existsSync(bdir)) continue;
  for (const name of readdirSync(bdir)) {
    const dir = join(bdir, name);
    const skillFile = join(dir, "SKILL.md");
    if (!statSync(dir).isDirectory() || !existsSync(skillFile)) continue;
    const meta = frontmatter(readFileSync(skillFile, "utf8"), rel(skillFile));
    if (meta.name !== name) fail(`${rel(skillFile)}: name "${meta.name}" does not match folder "${name}"`);
    if (!meta.description) fail(`${rel(skillFile)}: missing description`);
    if (skills.has(name)) fail(`duplicate skill name "${name}" in ${bucket} and ${skills.get(name).bucket}`);
    const userInvoked = meta["disable-model-invocation"] === "true";
    const yamlPath = join(dir, "agents", "openai.yaml");
    if (!existsSync(yamlPath)) fail(`${rel(dir)}: missing agents/openai.yaml`);
    else {
      const yaml = readFileSync(yamlPath, "utf8");
      const implicitOff = /allow_implicit_invocation:\s*false/.test(yaml);
      if (userInvoked !== implicitOff) fail(`${rel(dir)}: SKILL.md and agents/openai.yaml disagree on invocation`);
      if (!/display_name:/.test(yaml)) fail(`${rel(yamlPath)}: missing display_name`);
    }
    if (userInvoked && /\bUse when\b/.test(meta.description || "")) fail(`${rel(skillFile)}: user-invoked description should be a human summary, not trigger phrases`);
    skills.set(name, { bucket, userInvoked, dir });
  }
}
const promoted = [...skills].filter(([, s]) => PROMOTED.includes(s.bucket)).map(([n]) => n);

// 2. Promoted lists: README, bucket READMEs, plugin.json, docs pages
const readme = read("README.md");
const plugin = JSON.parse(read(".claude-plugin/plugin.json"));
const pluginSet = new Set(plugin.skills);
for (const [name, s] of skills) {
  const path = `./skills/${s.bucket}/${name}`;
  const inReadme = readme.includes(`(${path}/SKILL.md)`);
  const isPromoted = PROMOTED.includes(s.bucket);
  if (isPromoted && !inReadme) fail(`README.md does not list ${name}`);
  if (!isPromoted && inReadme) fail(`README.md lists non-promoted ${name}`);
  if (isPromoted && !pluginSet.has(path)) fail(`plugin.json is missing ${path}`);
  if (!isPromoted && pluginSet.has(path)) fail(`plugin.json ships non-promoted ${path}`);
  const bucketReadme = join(repo, "skills", s.bucket, "README.md");
  if (existsSync(bucketReadme) && !readFileSync(bucketReadme, "utf8").includes(`(./${name}/SKILL.md)`)) fail(`skills/${s.bucket}/README.md does not list ${name}`);
  if (isPromoted && !existsSync(join(repo, "docs", s.bucket, `${name}.md`))) fail(`missing docs page docs/${s.bucket}/${name}.md`);
}
for (const p of plugin.skills) if (!existsSync(join(repo, p, "SKILL.md"))) fail(`plugin.json lists missing ${p}`);
const pkg = JSON.parse(read("package.json"));
if (pkg.version !== plugin.version) fail(`plugin.json version ${plugin.version} != package.json ${pkg.version}`);

// 3. Router covers every promoted user-invoked skill
const router = read("skills/engineering/ask-workbench/SKILL.md");
for (const name of promoted) {
  const s = skills.get(name);
  if (s.userInvoked && name !== "ask-workbench" && !new RegExp("[/`]" + name + "\\b").test(router)) fail(`ask-workbench does not route to ${name}`);
}

// 4. Skill-tool references resolve
const skillFiles = walk(join(repo, "skills")).filter((f) => f.endsWith(".md"));
for (const f of skillFiles) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/Call the Skill tool (?:twice, )?(?:with|for)([^.\n]*)/gi)) {
    for (const q of m[1].matchAll(/[`"]([a-z0-9-]+)[`"]/g)) {
      if (!skills.has(q[1]) && !EXTERNAL_SKILLS.has(q[1])) fail(`${rel(f)}: Skill-tool reference to unknown skill "${q[1]}"`);
    }
  }
}

// 5. Branding leftovers and em-dashes in Workbench-facing prose
const proseFiles = [
  ...["README.md", "AGENTS.md", "GLOSSARY.md"].map((p) => join(repo, p)),
  ...walk(join(repo, "docs")),
  ...PROMOTED.flatMap((b) => walk(join(repo, "skills", b))),
  ...["misc"].flatMap((b) => walk(join(repo, "skills", b))),
].filter((f) => /\.(md|yaml)$/.test(f));
const BRAND = /\bask-matt\b|setup-matt-pocock|mattpocock-skills|aihero\.dev\/skills-|\bMatt\b|skills\.sh\/mattpocock/;
const brandAllowed = new Set(["README.md", "AGENTS.md", "GLOSSARY.md"]); // credits and upstream pointers live here
for (const f of proseFiles) {
  const text = readFileSync(f, "utf8");
  const name = rel(f);
  if (!brandAllowed.has(name)) {
    const hit = text.match(BRAND);
    if (hit) fail(`${name}: upstream branding "${hit[0]}"`);
  }
  if (text.includes("—")) fail(`${name}: contains an em-dash`);
}
for (const f of walk(join(repo, ".agents"))) {
  if (f.endsWith(".md") && readFileSync(f, "utf8").includes("—")) fail(`${rel(f)}: contains an em-dash`);
}

// 6. Upstream map: valid, and every mapped target exists
const map = JSON.parse(read("upstream-map.json"));
if (!/^[0-9a-f]{7,40}$/.test(map.last_synced_sha || "")) fail("upstream-map.json: missing or invalid last_synced_sha");
for (const [up, local] of Object.entries(map.paths || {})) {
  if (typeof local !== "string") { fail(`upstream-map.json: bad entry for ${up}`); continue; }
  if (local === "dropped" || local.startsWith("merged-into:")) {
    if (local.startsWith("merged-into:") && !skills.has(local.slice(12))) fail(`upstream-map.json: ${up} merged into unknown skill ${local.slice(12)}`);
    continue;
  }
  if (!existsSync(join(repo, local))) fail(`upstream-map.json: ${up} -> ${local} does not exist`);
}

if (problems.length) {
  console.error(problems.map((p) => `  x ${p}`).join("\n"));
  console.error(`\ncheck failed: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`check passed: ${skills.size} skills (${promoted.length} promoted), plugin ${plugin.version}`);
