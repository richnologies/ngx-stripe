#!/usr/bin/env node
/**
 * Generate StackBlitz-ready playground folders per active lane from lanes.json.
 * Source of truth for the app lives in playground/template/; each lane gets
 * playground/lanes/{angular}.{stripeJs}/ with pinned package.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lanes = JSON.parse(fs.readFileSync(path.join(root, 'lanes.json'), 'utf8'));
const templateDir = path.join(root, 'playground/template');
const outRoot = path.join(root, 'playground/lanes');

const TEST_PK =
  'pk_test_51Ii5RpH2XTJohkGafOSn3aoFFDjfCE4G9jmW48Byd8OS0u2707YHusT5PojHOwWAys9HbvNylw7qDk0KkMZomdG600TJYNYj20';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function packageJson(lane) {
  const train = lanes.stripeTrains[String(lane.stripeJs)];
  const angular = `^${lane.angular}.0.0`;
  const ngx =
    lane.npmTag === 'latest'
      ? `^${lane.angular}.${lane.stripeJs}.0`
      : lane.npmTag
        ? lane.npmTag.startsWith('v')
          ? // dist-tag as version range fallback for StackBlitz — pin range
            `^${lane.angular}.${lane.stripeJs}.0`
          : `^${lane.angular}.${lane.stripeJs}.0`
        : `^${lane.angular}.${lane.stripeJs}.0`;

  return {
    name: `ngx-stripe-playground-${lane.angular}-${lane.stripeJs}`,
    private: true,
    version: '0.0.0',
    scripts: {
      start: 'ng serve',
      build: 'ng build'
    },
    dependencies: {
      '@angular/animations': angular,
      '@angular/common': angular,
      '@angular/compiler': angular,
      '@angular/core': angular,
      '@angular/forms': angular,
      '@angular/platform-browser': angular,
      '@angular/platform-browser-dynamic': angular,
      '@angular/router': angular,
      '@stripe/stripe-js': `^${train.packageMajor}.0.0`,
      'ngx-stripe': ngx,
      rxjs: '~7.8.0',
      tslib: '^2.3.0',
      'zone.js': '~0.15.0'
    },
    devDependencies: {
      '@angular/build': angular,
      '@angular/cli': angular,
      '@angular/compiler-cli': angular,
      typescript: '~5.8.0'
    }
  };
}

const readme = `# ngx-stripe playground (generated)

Open via StackBlitz GitHub import from this folder. Pins come from \`lanes.json\`.
Do not hand-edit lane folders — run \`npm run generate:playground\`.

Test publishable key only.
`;

if (!fs.existsSync(templateDir)) {
  console.error('Missing playground/template — create the template first');
  process.exit(1);
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const active = lanes.lanes.filter((l) => l.support === 'active');
for (const lane of active) {
  const id = `${lane.angular}.${lane.stripeJs}`;
  const dest = path.join(outRoot, id);
  copyDir(templateDir, dest);
  fs.writeFileSync(path.join(dest, 'package.json'), JSON.stringify(packageJson(lane), null, 2) + '\n');
  fs.writeFileSync(path.join(dest, 'README.md'), readme);
  // Bake test key into main if template uses placeholder
  const mainPath = path.join(dest, 'src/main.ts');
  if (fs.existsSync(mainPath)) {
    let main = fs.readFileSync(mainPath, 'utf8');
    main = main.replace(/pk_test_REPLACE/g, TEST_PK);
    const train = lanes.stripeTrains[String(lane.stripeJs)];
    main = main.replace(/__CDN_NAME__/g, train.cdn);
    main = main.replace(/__LANE_ID__/g, id);
    fs.writeFileSync(mainPath, main);
  }
  console.log(`wrote playground/lanes/${id}`);
}

console.log(`Generated ${active.length} playground lanes`);
