#!/usr/bin/env node
/**
 * Freeze public_api.ts export names. Update the snapshot intentionally when the public API changes.
 *   node scripts/check-public-api.mjs          # compare
 *   node scripts/check-public-api.mjs --update # rewrite snapshot
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiPath = path.join(root, 'projects/ngx-stripe/src/public_api.ts');
const snapPath = path.join(root, 'projects/ngx-stripe/public-api.snapshot.json');

const text = fs.readFileSync(apiPath, 'utf8');
const exports = [...text.matchAll(/export\s*\{([^}]+)\}/g)]
  .flatMap((m) =>
    m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/\s+as\s+\w+$/, '').trim())
  )
  .sort();

const unique = [...new Set(exports)];
const update = process.argv.includes('--update');

if (update || !fs.existsSync(snapPath)) {
  fs.writeFileSync(snapPath, JSON.stringify({ exports: unique }, null, 2) + '\n');
  console.log(`wrote ${path.relative(root, snapPath)} (${unique.length} exports)`);
  process.exit(0);
}

const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
const prev = snap.exports || [];
const missing = prev.filter((n) => !unique.includes(n));
const added = unique.filter((n) => !prev.includes(n));

if (missing.length || added.length) {
  console.error('public_api.ts changed vs public-api.snapshot.json');
  if (missing.length) console.error('  removed:', missing.join(', '));
  if (added.length) console.error('  added:', added.join(', '));
  console.error('If intentional, run: node scripts/check-public-api.mjs --update');
  process.exit(1);
}

console.log(`public API snapshot OK (${unique.length} exports)`);
