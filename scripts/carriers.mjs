// @ts-check
// Regenerates the carriers table in index.html from open-parcels-rules' data/carriers.yaml.
// Usage: node scripts/carriers.mjs <path-to-open-parcels-rules>
// Needs the rules checkout's own node_modules (the `yaml` package): run `npm ci` there first.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const rules = process.argv[2];
if (!rules) throw new Error("usage: node scripts/carriers.mjs <path-to-open-parcels-rules>");
const { parse } = createRequire(path.join(path.resolve(rules), "package.json"))("yaml");
/** @type {{ carriers: { name: string, countries?: string[] }[] }} */
const { carriers } = parse(readFileSync(path.join(rules, "data", "carriers.yaml"), "utf8"));

/** @param {unknown} s */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rows = carriers
  .map((c) => ({ name: c.name, countries: (c.countries ?? []).join(", ") || "international" }))
  .sort((a, b) => a.name.localeCompare(b.name, "en"))
  .map((c) => `          <li><span>${esc(c.name)}</span><small>${esc(c.countries)}</small></li>`)
  .join("\n");

const file = new URL("../index.html", import.meta.url);
const html = readFileSync(file, "utf8");
const start = "<!-- carriers:start -->";
const end = "<!-- carriers:end -->";
const startIndex = html.indexOf(start);
const endIndex = html.indexOf(end);
if (startIndex < 0 || endIndex < startIndex) throw new Error("carrier markers not found in index.html");
const countPattern = /<span id="carrier-count">\d*<\/span>/;
if (!countPattern.test(html)) throw new Error('<span id="carrier-count"> not found in index.html');
const out =
  html.slice(0, startIndex + start.length) +
  `\n        <ul class="carriers">\n${rows}\n        </ul>\n        ` +
  html.slice(endIndex);
writeFileSync(file, out.replace(countPattern, `<span id="carrier-count">${carriers.length}</span>`));
console.log(`${carriers.length} carriers written`);
