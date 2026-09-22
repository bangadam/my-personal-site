#!/usr/bin/env node
/**
 * Builds public/cv/<file>.pdf from src/data/cv.json.
 *
 * The CV data and the site share one source file, so the PDF can never drift
 * from the roles and skills shown on the homepage. Layout is HTML/CSS rendered
 * by a local Chrome (headless, print-to-pdf), which keeps the typography under
 * version control instead of hand-drawing a PDF.
 *
 * Usage: npm run cv:pdf   (set CHROME_BIN to override the browser path)
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cv = JSON.parse(readFileSync(path.join(root, "src/data/cv.json"), "utf8"));

const escapeHtml = value =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fontDataUri = relative => {
  const file = path.join(root, "node_modules", relative);
  if (!existsSync(file)) {
    throw new Error(
      `Missing font ${relative}. Run "npm install" before building the CV.`
    );
  }
  return `data:font/woff2;base64,${readFileSync(file).toString("base64")}`;
};

const fontFaces = [
  ["Geist", 400, "geist-sans/files/geist-sans-latin-400-normal.woff2"],
  ["Geist", 500, "geist-sans/files/geist-sans-latin-500-normal.woff2"],
  ["Geist", 600, "geist-sans/files/geist-sans-latin-600-normal.woff2"],
  ["Geist", 700, "geist-sans/files/geist-sans-latin-700-normal.woff2"],
  ["Geist Mono", 400, "geist-mono/files/geist-mono-latin-400-normal.woff2"],
  ["Geist Mono", 500, "geist-mono/files/geist-mono-latin-500-normal.woff2"],
]
  .map(
    ([family, weight, file]) =>
      `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url(${fontDataUri(
        `@fontsource/${file}`
      )}) format("woff2")}`
  )
  .join("\n");

const contactLine = cv.contacts
  .map(
    contact =>
      `<a href="${escapeHtml(contact.href)}">${escapeHtml(contact.value)}</a>`
  )
  .join('<span class="dot">·</span>');

const experience = cv.roles
  .map(role => {
    const metaParts = [escapeHtml(role.location)];
    if (role.tags?.length) metaParts.push(role.tags.map(escapeHtml).join('<span class="dot">·</span>'));
    return `
    <article class="entry">
      <div class="when">${escapeHtml(role.period)}</div>
      <div class="what">
        <h3>${escapeHtml(role.role)}<span class="sep">·</span><span class="company">${escapeHtml(
          role.company
        )}</span></h3>
        <p class="meta">${metaParts.join('<span class="dot">·</span>')}</p>
        ${
          role.bullets?.length
            ? `<ul>${role.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>`
            : ""
        }
      </div>
    </article>`;
  })
  .join("");

const skills = cv.skillGroups
  .map(group => {
    const byLevel = ["Expert", "Advanced"]
      .map(level => {
        const names = group.skills
          .filter(skill => skill.level === level)
          .map(skill => escapeHtml(skill.name));
        if (!names.length) return "";
        return `<div class="level-row"><span class="level">${level}</span><span class="names">${names.join(
          '<span class="dot">·</span>'
        )}</span></div>`;
      })
      .filter(Boolean)
      .join("");
    return `<div class="group"><h3>${escapeHtml(
      group.title
    )}</h3>${byLevel}</div>`;
  })
  .join("");

const summaryRows = cv.details
  .filter(detail => detail.label !== "Based in") // the header already states the location
  .map(
    detail =>
      `<div class="row"><span class="label">${escapeHtml(detail.label)}</span><span class="value">${escapeHtml(
        detail.value
      )}</span></div>`
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(cv.profile.name)} - CV</title>
<style>
${fontFaces}
@page { size: A4; margin: 13mm 14mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  margin: 0;
  font-family: "Geist", ui-sans-serif, system-ui, sans-serif;
  font-size: 9.3pt;
  line-height: 1.36;
  color: #0a0a0a;
  font-feature-settings: "ss01", "cv11";
}
a { color: inherit; text-decoration: none; }
h1, h2, h3 { margin: 0; font-weight: 600; letter-spacing: -0.01em; }
p { margin: 0; orphans: 2; widows: 2; }
.mono, .when, .meta, .label, .level, .contact, .header-meta {
  font-family: "Geist Mono", ui-monospace, monospace;
}
.dot { color: #b8b8b8; padding: 0 0.4em; }

header { border-bottom: 1.5px solid #0a0a0a; padding-bottom: 3mm; }
h1 { font-size: 20pt; letter-spacing: -0.025em; }
.header-meta { font-size: 8.5pt; color: #737373; margin-top: 1.1mm; }
.contact { font-size: 8.5pt; color: #404040; margin-top: 2.2mm; }

.summary { margin-top: 3.4mm; font-size: 10pt; line-height: 1.46; color: #1a1a1a; }

section { margin-top: 5mm; }
h2 {
  font-size: 8.2pt;
  font-family: "Geist Mono", ui-monospace, monospace;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #737373;
  padding-bottom: 1.4mm;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 2.4mm;
}

.entry { display: flex; gap: 5.4mm; padding: 2.1mm 0; border-bottom: 1px solid #f0f0f0; break-inside: avoid; }
.entry:last-child { border-bottom: 0; padding-bottom: 0; }
.when { width: 33mm; flex: none; font-size: 7.4pt; color: #737373; padding-top: 0.6mm; }
.what { flex: 1; min-width: 0; }
.what h3 { font-size: 10.2pt; }
.sep { color: #b8b8b8; padding: 0 0.45em; }
.company { font-weight: 400; color: #525252; }
.meta { font-size: 8.1pt; color: #737373; margin-top: 0.6mm; }
ul { margin: 1.3mm 0 0; padding-left: 3.4mm; }
li { margin-bottom: 0.5mm; color: #303030; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.8mm 8mm; }
.group { break-inside: avoid; }
.group h3 { font-size: 9.2pt; margin-bottom: 0.9mm; }
.level-row { display: grid; grid-template-columns: 15mm 1fr; align-items: baseline; font-size: 8.6pt; color: #303030; }
.level { font-size: 7.3pt; text-transform: uppercase; letter-spacing: 0.1em; color: #8a8a8a; }

.rows { display: flex; flex-direction: column; }
.row { display: flex; gap: 5.4mm; padding: 1.3mm 0; border-bottom: 1px solid #f0f0f0; break-inside: avoid; }
.row:last-child { border-bottom: 0; }
.label { width: 26mm; flex: none; font-size: 7.9pt; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; }
.value { flex: 1; font-size: 8.7pt; color: #303030; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(cv.profile.name)}</h1>
    <p class="header-meta">${escapeHtml(cv.profile.title)} · ${escapeHtml(cv.profile.location)}</p>
    <p class="contact">${contactLine}</p>
  </header>

  <p class="summary">${escapeHtml(cv.profile.summary)}</p>

  <section>
    <h2>Experience</h2>
    ${experience}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="grid">${skills}</div>
  </section>

  <section>
    <h2>Availability</h2>
    <div class="rows">${summaryRows}</div>
  </section>
</body>
</html>
`;

const candidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = candidates.find(candidate => existsSync(candidate));
if (!chrome) {
  console.error(
    "No Chrome/Chromium found. Install one or set CHROME_BIN to its executable path."
  );
  process.exit(1);
}

const outFile = path.join(root, cv.pdf.file);
mkdirSync(path.dirname(outFile), { recursive: true });

const workDir = mkdtempSync(path.join(tmpdir(), "cv-pdf-"));
const htmlFile = path.join(workDir, "cv.html");
writeFileSync(htmlFile, html);

try {
  execFileSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--no-sandbox",
      `--print-to-pdf=${outFile}`,
      `file://${htmlFile}`,
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

const kb = (statSync(outFile).size / 1024).toFixed(0);
console.log(`Wrote ${path.relative(root, outFile)} (${kb} KB)`);