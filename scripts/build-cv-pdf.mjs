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
  [contactLink("Email"), contactLink("WhatsApp"), escapeHtml(cv.profile.location)],
  [contactLink("LinkedIn"), contactLink("GitHub")],
]
  .map(line => `<p class="contact">${line.filter(Boolean).join(" | ")}</p>`)
  .join("");

const dash = value => escapeHtml(String(value).replace(/ - /g, " \u2013 "));

const skills = cv.skillGroups
  .map(group => `<p><strong>${escapeHtml(group.title)}:</strong> ${group.skills.map(skill => `<span class="skill">${escapeHtml(skill.name.replace(/^([^:]{1,40}): (.+)$/, "$1 ($2)"))}</span>`).join(", ")}</p>`)
  .join("");

const experience = cv.roles
  .map(role => `<article class="entry">
    <div class="row"><span class="org">${escapeHtml(role.company)}</span><span class="meta">${dash(role.period)}</span></div>
    <div class="row"><span class="role">${escapeHtml(role.role)}</span><span class="meta">${escapeHtml(role.location)}</span></div>
    ${role.bullets?.length ? `<ul>${role.bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
  </article>`)
  .join("");

const education = cv.education?.length
  ? `<section><h2>EDUCATION</h2>${cv.education.map(entry => `<article class="entry">
    <div class="row"><span class="org">${escapeHtml(entry.school)}</span><span class="meta">${dash(entry.period)}</span></div>
    <div class="row"><span class="role">${escapeHtml(entry.degree)}</span><span class="meta">${escapeHtml(entry.location)}</span></div>
    ${(entry.details ?? []).map(detail => `<p>${escapeHtml(detail)}</p>`).join("")}
  </article>`).join("")}</section>`
  : "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(cv.profile.name)} - CV</title>
<style>
@page { size: A4; margin: 15mm 17mm; }
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Times New Roman", Times, "Liberation Serif", serif;
  font-size: 10.5pt;
  line-height: 1.22;
  color: #000;
}
h1, h2, h3, p, ul { margin: 0; }
a { color: inherit; text-decoration: none; }
header { text-align: center; }
h1 { font-size: 17pt; font-weight: bold; letter-spacing: 1.2pt; text-transform: uppercase; }
.title { margin-top: 1.5pt; }
.contact { margin-top: 1.5pt; font-size: 10pt; }
h2 {
  font-size: 10.5pt;
  font-weight: bold;
  letter-spacing: 0.8pt;
  text-transform: uppercase;
  border-bottom: 1px solid #000;
  padding-bottom: 1.5pt;
  margin-bottom: 4pt;
  break-after: avoid;
}
section { margin-top: 8pt; }
.entry { margin-top: 5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 8pt; }
.org { font-weight: bold; }
.role { font-style: italic; }
.meta { text-align: right; white-space: nowrap; }
ul { margin-top: 2pt; }
li { list-style: none; padding-left: 10pt; text-indent: -10pt; }
li::before { content: "•"; display: inline-block; width: 10pt; }
.skill { white-space: nowrap; }
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