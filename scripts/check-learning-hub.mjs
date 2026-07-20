import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const html = readFileSync(join(root, "learning-hub.html"), "utf8");
const js = readFileSync(join(root, "assets/hub.js"), "utf8");
const records = readdirSync(join(root, "learning-records")).filter((file) => file.endsWith(".md"));
const checks = [
  ["12 curriculum weeks", (html.match(/class=\"week-row\"/g) ?? []).length === 12],
  ["all Learning Records", (html.match(/class=\"ledger-index\">R\d{2}/g) ?? []).length === records.length],
  ["current focus", html.includes("Current focus") && html.includes("data-current-week=")],
  ["evidence contract", html.includes("Build · Test · Demo · Explain")],
  ["required landmarks", ["curriculum", "evidence", "glossary", "resources", "after"].every((id) => html.includes(`id=\"${id}\"`))],
  ["repository-backed output", !html.includes("progress-data.json")],
  ["no progress state in browser", !/localStorage\.(setItem|getItem)\([^)]*(progress|week|lesson|evidence)/i.test(js)],
  ["theme-only local storage", [...js.matchAll(/localStorage\.(?:setItem|getItem)\(([^,)]+)/g)].every((match) => match[1].includes("THEME_KEY"))],
];

let failed = false;
for (const [label, passed] of checks) {
  console.log(`${passed ? "PASS" : "FAIL"}  ${label}`);
  failed ||= !passed;
}

if (failed) process.exit(1);
