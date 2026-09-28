#!/usr/bin/env node
/**
 * Pack the library and verify the tarball exposes the public API consumers need
 * (guards regressions like missing provideNgxStripe — issue #220).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist/ngx-stripe');

console.log('Building library…');
execSync('npm run build:lib', { cwd: root, stdio: 'inherit' });

const pkg = JSON.parse(fs.readFileSync(path.join(distDir, 'package.json'), 'utf8'));
const version = pkg.version;
console.log(`Packing ngx-stripe@${version}…`);
execSync('npm pack', { cwd: distDir, stdio: 'inherit' });

const tarball = path.join(distDir, `ngx-stripe-${version}.tgz`);
if (!fs.existsSync(tarball)) {
  // npm pack may write to cwd with different naming
  const found = fs.readdirSync(distDir).find((f) => f.startsWith('ngx-stripe-') && f.endsWith('.tgz'));
  if (!found) {
    throw new Error(`Tarball not found in ${distDir}`);
  }
}

const tgz = fs.readdirSync(distDir).find((f) => f.startsWith('ngx-stripe-') && f.endsWith('.tgz'));
const tgzPath = path.join(distDir, tgz);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ngx-stripe-pack-'));
console.log(`Installing into ${tmp}…`);
execSync('npm init -y', { cwd: tmp, stdio: 'pipe' });
execSync(`npm install ${JSON.stringify(tgzPath)}`, { cwd: tmp, stdio: 'inherit', shell: true });

const entry = path.join(tmp, 'node_modules/ngx-stripe');
const pkgJson = JSON.parse(fs.readFileSync(path.join(entry, 'package.json'), 'utf8'));
const fesm =
  pkgJson.module ||
  pkgJson.es2020 ||
  pkgJson.fesm2022 ||
  (pkgJson.exports && (pkgJson.exports['.']?.default || pkgJson.exports['.']));

// Resolve a file that should contain provideNgxStripe
const candidates = [
  path.join(entry, 'fesm2022/ngx-stripe.mjs'),
  path.join(entry, 'fesm2020/ngx-stripe.mjs'),
  path.join(entry, 'esm2022/ngx-stripe/public_api.js'),
  path.join(entry, 'public-api.d.ts'),
  path.join(entry, 'index.d.ts')
];

const dts = candidates.find((p) => fs.existsSync(p));
if (!dts) {
  console.error('Could not find package entry among', candidates);
  console.error('package.json keys:', Object.keys(pkgJson));
  process.exit(1);
}

const text = fs.readFileSync(dts, 'utf8');
const required = ['provideNgxStripe', 'StripeService', 'StripePaymentElementComponent'];
const missing = required.filter((name) => !text.includes(name));
if (missing.length) {
  console.error(`Packed API missing: ${missing.join(', ')} (checked ${dts})`);
  process.exit(1);
}

console.log(`Pack smoke OK — ${required.join(', ')} present in ${path.relative(entry, dts) || dts}`);
