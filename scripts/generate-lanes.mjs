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
const lanesDataPath = path.join(
  root,
  'projects/ngx-stripe-docs/src/app/core/lanes/lanes.data.ts'
);

const START = '<!-- lanes:table:start -->';
const END = '<!-- lanes:table:end -->';

const check = process.argv.includes('--check');
const data = JSON.parse(fs.readFileSync(lanesPath, 'utf8'));

/** Stripe.js majors high → low for matrix columns */
function stripeColumns() {
  return Object.keys(data.stripeTrains)
    .map(Number)
    .sort((a, b) => b - a)
    .map((major) => ({
      major,
      label: data.stripeTrains[String(major)].label
    }));
}

function angularRows() {
  const byAngular = new Map();
  for (const lane of data.lanes) {
    if (!byAngular.has(lane.angular)) byAngular.set(lane.angular, new Map());
    byAngular.get(lane.angular).set(lane.stripeJs, lane.range);
  }
  const majors = [...byAngular.keys()].sort((a, b) => b - a);
  return {
    majors: majors.map((angular) => ({
      angular,
      cells: byAngular.get(angular)
    })),
    legacy: data.legacy
  };
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function markdownMatrix() {
  const cols = stripeColumns();
  const { majors, legacy } = angularRows();
  const header = ['Angular', ...cols.map((c) => c.label)];
  const sep = header.map(() => '---');
  const rows = [
    `| ${header.join(' | ')} |`,
    `| ${sep.join(' | ')} |`
  ];
  for (const row of majors) {
    const cells = cols.map((c) => row.cells.get(c.major) ?? '—');
    rows.push(`| ${row.angular} | ${cells.join(' | ')} |`);
  }
  for (const lane of legacy) {
    const pad = cols.map(() => '—');
    pad[0] = lane.range;
    rows.push(`| ${lane.angular} | ${pad.join(' | ')} |`);
  }
  return rows.join('\n');
}

function htmlMatrix() {
  const cols = stripeColumns();
  const { majors, legacy } = angularRows();
  const head = cols
    .map((c) => `          <th>${escapeHtml(c.label)}</th>`)
    .join('\n');
  const bodyRows = [];
  for (const row of majors) {
    const cells = cols
      .map((c) => {
        const range = row.cells.get(c.major);
        return `          <td>${range ? escapeHtml(range) : '—'}</td>`;
      })
      .join('\n');
    bodyRows.push(`        <tr>
          <th scope="row">${row.angular}</th>
${cells}
        </tr>`);
  }
  for (const lane of legacy) {
    const cells = cols
      .map((c, i) => {
        // Legacy lines are not train-split; show the package range once under the newest train column.
        if (i === 0) return `          <td>${escapeHtml(lane.range)}</td>`;
        return `          <td>—</td>`;
      })
      .join('\n');
    bodyRows.push(`        <tr>
          <th scope="row">${lane.angular}</th>
${cells}
        </tr>`);
  }
  return `      <thead>
        <tr>
          <th scope="col">Angular \\ Stripe.js</th>
${head}
        </tr>
      </thead>
      <tbody>
${bodyRows.join('\n')}
      </tbody>`;
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
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (prev === next) {
    console.log(`ok (unchanged): ${path.relative(root, filePath)}`);
    return false;
  }
  if (check) {
    console.error(`out of date: ${path.relative(root, filePath)} — run npm run generate:lanes`);
    return true;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next);
  console.log(`updated: ${path.relative(root, filePath)}`);
  return false;
}

let dirty = false;

const readme = fs.readFileSync(readmePath, 'utf8');
dirty = writeOrCheck(readmePath, replaceMarked(readme, markdownMatrix(), 'README.md')) || dirty;

const install = fs.readFileSync(installPath, 'utf8');
dirty =
  writeOrCheck(installPath, replaceMarked(install, htmlMatrix(), 'installation.component.html')) ||
  dirty;

function lanesDataTs() {
  const trains = data.stripeTrains;
  const active = data.lanes.filter((l) => l.support === 'active');
  const lines = [
    '/* eslint-disable */',
    '// Generated by scripts/generate-lanes.mjs — do not edit by hand.',
    "import { NgStrLanesData } from './lanes.model';",
    '',
    'export const NGSTR_LANES: NgStrLanesData = ' +
      JSON.stringify(
        {
          latest: data.latest,
          stripeTrains: trains,
          lanes: data.lanes,
          activeLanes: active,
          legacy: data.legacy,
          ci: data.ci
        },
        null,
        2
      ) +
      ' as NgStrLanesData;',
    ''
  ];
  return lines.join('\n');
}

dirty = writeOrCheck(lanesDataPath, lanesDataTs(), 'lanes.data.ts') || dirty;

if (check && dirty) {
  process.exit(1);
}
