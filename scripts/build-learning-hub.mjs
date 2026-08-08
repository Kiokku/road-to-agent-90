import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");
const escapeHtml = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const stripMarkdown = (value = "") => value
  .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1")
  .replace(/[`*]/g, "")
  .trim();
const toUrl = (file) => file.split("/").map(encodeURIComponent).join("/");

function parseSection(markdown, heading) {
  const marker = `## ${heading}`;
  const start = markdown.indexOf(marker);
  if (start === -1) return "";
  const contentStart = start + marker.length;
  const nextHeading = markdown.indexOf("\n## ", contentStart);
  return markdown.slice(contentStart, nextHeading === -1 ? undefined : nextHeading).trim();
}

function parseRoadmap(markdown) {
  const matches = [...markdown.matchAll(/^## Week (\d{2}) · (.+)$/gm)];
  return matches.map((match, index) => {
    const sectionStart = match.index + match[0].length;
    const sectionEnd = matches[index + 1]?.index ?? markdown.indexOf("## 每个 Week 的建议节奏");
    const section = markdown.slice(sectionStart, sectionEnd > sectionStart ? sectionEnd : undefined);
    const get = (key) => section.match(new RegExp(`^- ${key}: (.+)$`, "m"))?.[1].trim() ?? "";
    return {
      number: match[1],
      title: match[2].trim(),
      outcome: get("Outcome"),
      build: get("Build"),
      verify: get("Verify"),
      explain: get("Explain"),
      interview: get("Interview"),
    };
  });
}

function parseRecords() {
  return readdirSync(join(root, "learning-records"))
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const markdown = read(`learning-records/${file}`);
      const title = markdown.match(/^# (.+)$/m)?.[1] ?? file;
      const summary = markdown
        .replace(/^# .+$/m, "")
        .split(/^## /m)[0]
        .trim()
        .replace(/\s+/g, " ");
      return { file, title, summary };
    });
}

function parseLessons() {
  return readdirSync(join(root, "lessons"))
    .filter((file) => file.endsWith(".html"))
    .sort()
    .map((file) => {
      const html = read(`lessons/${file}`);
      const title = html.match(/<title>(.*?)<\/title>/i)?.[1]
        ?? html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]
        ?? file;
      return { file, title: stripMarkdown(title.replace(/<[^>]+>/g, "")) };
    });
}

function parseEvidence() {
  return readdirSync(join(root, "evidence"))
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const markdown = read(`evidence/${file}`);
      return {
        file,
        title: markdown.match(/^# (.+)$/m)?.[1] ?? file,
        result: markdown.match(/^- Result:\s*(.+)$/mi)?.[1]?.trim().toLowerCase() ?? "incomplete",
      };
    });
}

function parseGlossary(markdown) {
  const matches = [...markdown.matchAll(/^\*\*(.+?)\*\*：\s*$/gm)];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index;
    const definition = markdown.slice(start, end).split(/^_Avoid_/m)[0].trim().replace(/\s+/g, " ");
    return { term: match[1], definition };
  });
}

function parseResources(markdown) {
  const entries = [];
  const lines = markdown.split("\n");
  let group = "Knowledge";
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].startsWith("## ")) group = lines[index].slice(3).trim();
    const match = lines[index].match(/^- \[([^\]]+)]\(([^)]+)\)(.*)$/);
    if (!match) continue;
    const annotation = lines[index + 1]?.startsWith("  ") ? lines[index + 1].trim() : "";
    entries.push({ group, label: match[1], url: match[2], suffix: match[3].trim(), annotation });
  }
  return entries;
}

const roadmap = parseRoadmap(read("docs/12-week-roadmap.md"));
const records = parseRecords();
const lessons = parseLessons();
const evidence = parseEvidence();
const glossary = parseGlossary(read("CONTEXT.md"));
const resources = parseResources(read("RESOURCES.md"));
const mission = read("MISSION.md");
const why = stripMarkdown(parseSection(mission, "Why"));
const successItems = parseSection(mission, "Success looks like")
  .split("\n")
  .filter((line) => line.startsWith("- "))
  .map((line) => stripMarkdown(line.slice(2)));
const verifiedEvidence = evidence.filter((item) => item.result === "verified");
const completedWeeks = new Set(verifiedEvidence.map((item) => item.file.match(/week-(\d{2})/i)?.[1]).filter(Boolean));
const current = roadmap.find((week) => !completedWeeks.has(week.number)) ?? roadmap.at(-1);

const weekRows = roadmap.map((week) => {
  const isCurrent = week.number === current.number;
  const status = completedWeeks.has(week.number) ? "Verified" : isCurrent ? "Current" : "Upcoming";
  return `
    <details class="week-row" data-week="${week.number}" ${isCurrent ? "open" : ""}>
      <summary>
        <span class="week-index">${week.number}</span>
        <span class="week-heading"><strong>${escapeHtml(week.title)}</strong><small>Sequential capability ${week.number} of ${roadmap.length}</small></span>
        <span class="week-status week-status--${status.toLowerCase()}">${status}</span>
        <span class="disclosure" aria-hidden="true"></span>
      </summary>
      <div class="week-body">
        <dl>
          <div><dt>Outcome</dt><dd>${escapeHtml(stripMarkdown(week.outcome))}</dd></div>
          <div><dt>Build</dt><dd>${escapeHtml(stripMarkdown(week.build))}</dd></div>
          <div><dt>Verify</dt><dd>${escapeHtml(stripMarkdown(week.verify))}</dd></div>
          <div><dt>Explain</dt><dd>${escapeHtml(stripMarkdown(week.explain))}</dd></div>
          <div><dt>Interview</dt><dd>${escapeHtml(stripMarkdown(week.interview))}</dd></div>
        </dl>
      </div>
    </details>`;
}).join("");

const recordRows = records.map((record, index) => `
  <a class="ledger-row" href="${toUrl(`learning-records/${record.file}`)}">
    <span class="ledger-index">R${String(index + 1).padStart(2, "0")}</span>
    <span><strong>${escapeHtml(record.title)}</strong><small>${escapeHtml(stripMarkdown(record.summary))}</small></span>
    <span class="row-arrow" aria-hidden="true">↗</span>
  </a>`).join("");

const lessonRows = lessons.length
  ? lessons.map((lesson, index) => `
    <a class="ledger-row" href="${toUrl(`lessons/${lesson.file}`)}">
      <span class="ledger-index">L${String(index + 1).padStart(2, "0")}</span>
      <span><strong>${escapeHtml(lesson.title)}</strong><small>Interactive lesson</small></span>
      <span class="row-arrow" aria-hidden="true">↗</span>
    </a>`).join("")
  : `<div class="empty-row"><span>Lessons</span><p>No Lesson yet. Start Week ${current.number} with <code>teach</code>.</p></div>`;

const evidenceRows = evidence.length
  ? evidence.map((item, index) => `
    <a class="ledger-row" href="${toUrl(`evidence/${item.file}`)}">
      <span class="ledger-index">E${String(index + 1).padStart(2, "0")}</span>
      <span><strong>${escapeHtml(item.title)}</strong><small>Result · ${escapeHtml(item.result)}</small></span>
      <span class="row-arrow" aria-hidden="true">↗</span>
    </a>`).join("")
  : `<div class="empty-row"><span>Evidence</span><p>No verified weekly evidence yet. Reading alone does not count.</p></div>`;

const glossaryRows = glossary.map((entry, index) => `
  <div class="glossary-entry">
    <span>${String(index + 1).padStart(2, "0")}</span>
    <dt>${escapeHtml(entry.term)}</dt>
    <dd>${escapeHtml(entry.definition)}</dd>
  </div>`).join("");

const resourceRows = resources.map((resource, index) => `
  <a class="resource-row" href="${escapeHtml(resource.url)}" ${resource.url.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
    <span>${String(index + 1).padStart(2, "0")}</span>
    <span><strong>${escapeHtml(resource.label)}${resource.suffix ? ` ${escapeHtml(resource.suffix)}` : ""}</strong><small>${escapeHtml(resource.annotation)}</small></span>
    <em>${escapeHtml(resource.group)}</em>
  </a>`).join("");

const capabilityRows = roadmap.map((week) => `
  <li class="capability-item ${week.number === current.number ? "is-current" : ""}">
    <span>${week.number}</span><strong>${escapeHtml(week.title)}</strong>
  </li>`).join("");

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="A repository-backed learning hub for becoming a frontend Agent engineer through 12 sequential Weeks.">
  <title>Agent Learning Hub · Road to Agent 90</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23a4492d'/%3E%3Cpath d='M18 45 30 16h5l12 29h-7l-3-8H27l-3 8Zm11-14h6l-3-8Z' fill='%23f3f0e9'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="assets/course.css">
  <link rel="stylesheet" href="assets/hub.css">
  <script src="assets/hub.js" defer></script>
</head>
<body data-current-week="${current.number}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="masthead">
    <a class="brand" href="#top"><span>AGENT</span><i>/</i><span>LEARNING HUB</span></a>
    <nav aria-label="Primary">
      <a href="#curriculum">Curriculum</a>
      <a href="#evidence">Evidence</a>
      <a href="#glossary">Glossary</a>
      <a href="#resources">Resources</a>
    </nav>
    <div class="nav-actions">
      <a class="repo-link" href="https://github.com/Kiokku/road-to-agent-90" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <button class="theme-toggle" type="button" aria-label="Toggle color theme" aria-pressed="false"><span aria-hidden="true">◐</span><span class="theme-label">Theme</span></button>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="eyebrow"><span>FIELD NOTES / SEQUENTIAL</span><span>Frontend → Agent</span></div>
      <div class="hero-grid">
        <div>
          <p class="kicker">A practical transformation, documented in public</p>
          <h1 id="hero-title">From Frontend<br>to Agent Engineer</h1>
          <p class="commitment">12 Weeks <i>·</i> 12 verified slices <i>·</i> one Web Creation Agent</p>
        </div>
        <div class="mission-copy">
          <p>${escapeHtml(why)}</p>
          <ul>${successItems.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="current-rail" id="current">
        <div class="current-label"><span class="pulse" aria-hidden="true"></span>Current focus</div>
        <div class="current-number">W${current.number}</div>
        <div class="current-copy">
          <h2>${escapeHtml(current.title)}</h2>
          <p>${escapeHtml(stripMarkdown(current.outcome))}</p>
        </div>
        <a class="primary-action" href="#week-${current.number}" data-current-link>Continue Week ${current.number}<span aria-hidden="true">↓</span></a>
      </div>
    </section>

    <section class="section curriculum" id="curriculum" aria-labelledby="curriculum-title">
      <header class="section-heading">
        <p>01 / Curriculum</p>
        <h2 id="curriculum-title">Twelve verified vertical slices.</h2>
        <span>${completedWeeks.size} of 12 weeks verified</span>
      </header>
      <div class="week-list">${weekRows.replace(`data-week="${current.number}"`, `id="week-${current.number}" data-week="${current.number}"`)}</div>
    </section>

    <section class="build-section" aria-labelledby="build-title">
      <div class="section-heading section-heading--inverse">
        <p>02 / What you’ll build</p>
        <h2 id="build-title">One product.<br>Twelve capabilities.</h2>
        <span>Web Creation Agent Workbench</span>
      </div>
      <ol class="capability-track">${capabilityRows}</ol>
    </section>

    <section class="section" id="evidence" aria-labelledby="evidence-title">
      <header class="section-heading">
        <p>03 / Learning evidence</p>
        <h2 id="evidence-title">Claims require artifacts.</h2>
        <span>${lessons.length} Lessons · ${verifiedEvidence.length} verified weeks · ${records.length} Records</span>
      </header>
      <div class="evidence-grid">
        <div>
          <div class="subheading"><span>Lessons</span><small>Interactive teaching artifacts</small></div>
          ${lessonRows.trimStart()}
          <div class="subheading subheading--spaced"><span>Weekly evidence</span><small>Build · Test · Demo · Explain</small></div>
          ${evidenceRows.trimStart()}
        </div>
        <div>
          <div class="subheading"><span>Learning Records</span><small>Prior knowledge and confirmed decisions</small></div>${recordRows}
        </div>
      </div>
    </section>

    <section class="section reference-section" id="glossary" aria-labelledby="glossary-title">
      <header class="section-heading">
        <p>04 / Shared language</p>
        <h2 id="glossary-title">Glossary.</h2>
        <span>${glossary.length} project-specific definitions</span>
      </header>
      <dl class="glossary-list">${glossaryRows}</dl>
    </section>

    <section class="section" id="resources" aria-labelledby="resources-title">
      <header class="section-heading">
        <p>05 / Source library</p>
        <h2 id="resources-title">Read close to the source.</h2>
        <span>${resources.length} annotated references</span>
      </header>
      <div class="resource-list">${resourceRows}</div>
    </section>

    <section class="section after-section" id="after">
      <details class="after-details">
        <summary>
          <span>06 / After Week 12</span>
          <strong>Full-stack Agent application engineering</strong>
          <span class="disclosure" aria-hidden="true"></span>
        </summary>
        <div class="after-body">
          <p>Long-term study begins only after the short-term interview goal is complete.</p>
          <a href="docs/long-term-roadmap.md">Open the long-term route <span aria-hidden="true">↗</span></a>
        </div>
      </details>
    </section>
  </main>

  <footer>
    <a class="brand" href="#top"><span>AGENT</span><i>/</i><span>LEARNING HUB</span></a>
    <p>Week 01 → Week 12<br>Built from repository evidence</p>
    <a href="docs/agent-learning-hub.md">How this Hub works ↗</a>
  </footer>
</body>
</html>`;

writeFileSync(join(root, "learning-hub.html"), html);
console.log(`Built learning-hub.html: ${roadmap.length} weeks, ${lessons.length} lessons, ${verifiedEvidence.length} verified weeks, ${records.length} records.`);
