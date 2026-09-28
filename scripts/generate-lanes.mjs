#!/usr/bin/env node
/**
 * Generate version tables from lanes.json into README.md and the docs
 * installation page. Usage:
 *   node scripts/generate-lanes.mjs
 *   node scripts/generate-lanes.mjs --check   # exit 1 if files would change
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const lanesPath = path.join(root, 'lanes.json');
const readmePath = path.join(root, 'README.md');
const installPath = path.join(
  root,
  'projects/ngx-stripe-docs/src/app/docs/installation/installation.component.html'
);

const START = '<!-- lanes:table:start -->';
const END = '<!-- lanes:table:end -->';

const check = process.argv.includes('--check');
const data = JSON.parse(fs.readFileSync(lanesPath, 'utf8'));

function stripeLabel(stripeJs) {
  const train = data.stripeTrains[String(stripeJs)];
  return train ? train.label : String(stripeJs);
}

function markdownTable() {
  const rows = [
    '| Angular | StripeJS | ngx-stripe |',
    '| ------- | -------- | ---------- |',
  ];
  for (const lane of data.lanes) {
    rows.push(`| ${lane.angular} | ${stripeLabel(lane.stripeJs)} | ${lane.range} |`);
  }
  for (const lane of data.legacy) {
    rows.push(`| ${lane.angular} | | ${lane.range} |`);
  }
  return rows.join('\n');
}

function htmlTableBody() {
  const rows = [];
  for (const lane of data.lanes) {
    rows.push(`        <tr>
          <td>${lane.angular}</td>
          <td>${escapeHtml(stripeLabel(lane.stripeJs))}</td>
          <td>${escapeHtml(lane.range)}</td>
        </tr>`);
  }
  for (const lane of data.legacy) {
    rows.push(`        <tr>
          <td>${lane.angular}</td>
          <td></td>
          <td>${escapeHtml(lane.range)}</td>
        </tr>`);
  }
  return rows.join('\n');
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceMarked(content, replacement, fileLabel) {
  const start = content.indexOf(START);
  const end = content.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing ${START} / ${END} markers in ${fileLabel}`);
  }
  return content.slice(0, start + START.length) + '\n' + replacement + '\n' + content.slice(end);
}

function writeOrCheck(filePath, next) {
  const prev = fs.readFileSync(filePath, 'utf8');
  if (prev === next) {
    console.log(`ok (unchanged): ${path.relative(root, filePath)}`);
    return false;
  }
  if (check) {
    console.error(`out of date: ${path.relative(root, filePath)} — run npm run generate:lanes`);
    return true;
  }
  fs.writeFileSync(filePath, next);
  console.log(`updated: ${path.relative(root, filePath)}`);
  return false;
}

let dirty = false;

const readme = fs.readFileSync(readmePath, 'utf8');
dirty = writeOrCheck(readmePath, replaceMarked(readme, markdownTable(), 'README.md')) || dirty;

const install = fs.readFileSync(installPath, 'utf8');
const htmlInner = `      <thead>
        <tr>
          <th>Angular</th>
          <th>StripeJS</th>
          <th>ngx-stripe</th>
        </tr>
      </thead>
      <tbody>
${htmlTableBody()}
      </tbody>`;
dirty =
  writeOrCheck(installPath, replaceMarked(install, htmlInner, 'installation.component.html')) ||
  dirty;

if (check && dirty) {
  process.exit(1);
}
