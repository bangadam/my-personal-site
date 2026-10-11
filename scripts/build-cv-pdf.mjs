#!/usr/bin/env node
/**
 * Builds public/cv/<file>.pdf from src/data/cv.json.
 *
 * The site and this Harvard-style, single-column ATS-readable PDF share one
 * data source. Local headless Chrome prints standard-serif HTML to A4.
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

const contactLink = label => {
  const contact = cv.contacts.find(item => item.label === label);
  return contact ? `<a href="${escapeHtml(contact.href)}">${escapeHtml(contact.value)}</a>` : "";
};
const contactLines = [
  [escapeHtml(cv.profile.location), contactLink("WhatsApp"), contactLink("Email")],
  [contactLink("LinkedIn"), contactLink("GitHub")],
]
  .map(line => `<p>${line.filter(Boolean).join(" | ")}</p>`)
  .join("");

const skills = cv.skillGroups
  .map(group => `<p><strong>${escapeHtml(group.title)}:</strong> ${group.skills.map(skill => `<span class="skill">${escapeHtml(skill.name.replace(/^([^:]{1,40}): (.+)$/, "$1 ($2)"))}</span>`).join(", ")}</p>`)
  .join("");

const experience = cv.roles
  .map(role => `<article class="entry">
    <h3>${escapeHtml(role.company)}</h3>
    <p>${[role.role, role.location, role.period].map(escapeHtml).join(" | ")}</p>
    ${role.tags?.length ? `<p><strong>Tech:</strong> ${role.tags.map(escapeHtml).join(", ")}</p>` : ""}
    ${role.bullets?.length ? `<ul>${role.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
  </article>`)
  .join("");

const education = cv.education?.length
  ? `<section><h2>EDUCATION</h2>${cv.education.map(entry => `<article class="entry">
    <h3>${escapeHtml(entry.school)}</h3>
    <p>${[entry.degree, entry.location, entry.period].map(escapeHtml).join(" | ")}</p>
    ${(entry.details ?? []).map(detail => `<p>${escapeHtml(detail)}</p>`).join("")}
  </article>`).join("")}</section>`
  : "";

const additional = cv.details
  .filter(detail => detail.label !== "Based in")
  .map(detail => `<p><strong>${escapeHtml(detail.label)}:</strong> ${escapeHtml(detail.value).replace(/\s*·\s*/g, ", ")}</p>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(cv.profile.name)} - CV</title>
<style>
@page { size: A4; margin: 25.4mm; }
body {
  margin: 0;
  font-family: "Times New Roman", Times, "Liberation Serif", serif;
  font-size: 10.5pt;
  line-height: 1.15;
}
h1, h2, h3, p { margin: 0; }
a { color: inherit; text-decoration: none; }
header { text-align: center; }
h1 { font-size: 18pt; font-weight: bold; margin-bottom: 1mm; }
.title { font-size: 11pt; }
h2 { font-size: 10.5pt; font-weight: bold; break-after: avoid; margin-bottom: 1mm; }
h3 { font-size: 10.5pt; font-weight: bold; }
section { margin-top: 3mm; }
.skill { white-space: nowrap; }
.entry { margin-top: 1.6mm; break-inside: avoid; }
ul { margin: 0.6mm 0 0; padding-left: 5mm; }
li { margin: 0; list-style: none; }
li::before { content: "- "; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(cv.profile.name)}</h1>
    <p class="title">${escapeHtml(cv.profile.title)}</p>
    ${contactLines}
  </header>
  <section>
    <h2>PROFESSIONAL SUMMARY</h2>
    <p>${escapeHtml(cv.profile.summary)}</p>
  </section>
  <section>
    <h2>TECHNICAL SKILLS</h2>
    ${skills}
  </section>
  <section>
    <h2>PROFESSIONAL EXPERIENCE</h2>
    ${experience}
  </section>
  ${education}
  <section>
    <h2>ADDITIONAL</h2>
    ${additional}
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