#!/usr/bin/env node
/**
 * After npm pack, list tarball paths and fail if unexpected files appear
 * (keeps logos intentional; blocks accidental docs bloat).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist/ngx-stripe');

if (!fs.existsSync(path.join(distDir, 'package.json'))) {
  execSync('npm run build:lib', { cwd: root, stdio: 'inherit' });
}

execSync('npm run copy:skill', { cwd: root, stdio: 'inherit' });
execSync('npm pack --silent', { cwd: distDir, stdio: 'pipe' });
const tgz = fs.readdirSync(distDir).find((f) => f.endsWith('.tgz'));
const listing = execSync(`tar -tzf ${JSON.stringify(tgz)}`, { cwd: distDir, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .map((l) => l.replace(/^package\//, ''))
  .filter((f) => !f.endsWith('.tgz'))
  .sort();

const allowedPrefixes = ['fesm2022/', 'types/', 'LICENSE', 'README', 'package.json', 'skills/'];
const allowedExact = new Set(['LICENSE.md', 'README.md', 'package.json']);
const required = ['skills/ngx-stripe/SKILL.md', 'skills/ngx-stripe/elements.md'];

const unexpected = listing.filter((f) => {
  if (allowedExact.has(f)) return false;
  return !allowedPrefixes.some((p) => f === p.replace(/\/$/, '') || f.startsWith(p));
});

console.log('Tarball contents:');
for (const f of listing) console.log(`  ${f}`);

if (unexpected.length) {
  console.error('\nUnexpected packaged paths:');
  for (const f of unexpected) console.error(`  - ${f}`);
  process.exit(1);
}

const missing = required.filter((f) => !listing.includes(f));
if (missing.length) {
  console.error('\nMissing packaged paths:');
  for (const f of missing) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('Pack allowlist OK');
