#!/usr/bin/env node
/**
 * Generate AI + docs inventory files from elements-inventory.json. Usage:
 *   node scripts/generate-elements.mjs
 *   node scripts/generate-elements.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');

const inventoryPath = path.join(root, 'elements-inventory.json');
const componentsDir = path.join(root, 'projects/ngx-stripe/src/lib/components');
const dataPath = path.join(
  root,
  'projects/ngx-stripe-docs/src/app/core/elements/elements.data.ts'
);
const llmsPath = path.join(root, 'projects/ngx-stripe-docs/src/assets/llms.txt');
const llmsFullPath = path.join(root, 'projects/ngx-stripe-docs/src/assets/llms-full.txt');
const llmsRootPath = path.join(root, 'projects/ngx-stripe-docs/src/llms.txt');
const llmsFullRootPath = path.join(root, 'projects/ngx-stripe-docs/src/llms-full.txt');
const skillElementsPath = path.join(root, 'skills/ngx-stripe/elements.md');
const sitemapPath = path.join(root, 'projects/ngx-stripe-docs/src/sitemap.xml');

const CORE_DOC_PATHS = [
  '/',
  '/docs/introduction',
  '/docs/installation',
  '/docs/versioning',
  '/docs/setup-application',
  '/docs/first-payment',
  '/docs/elements',
  '/docs/checkout',
  '/docs/identity',
  '/docs/service',
  '/docs/styling',
  '/docs/reference-instance',
  '/docs/manually-mount-your-element',
  '/docs/faqs',
  '/docs/csp',
  '/docs/support',
  '/docs/examples',
  '/docs/migration',
  '/docs/payment-request-button',
  '/llms.txt',
  '/llms-full.txt'
];

const data = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const site = data.site || 'https://ngx-stripe.dev';

function assertInventoryComplete() {
  const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.component.ts') && !f.endsWith('.spec.ts'));
  const selectors = [];
  for (const file of files) {
    const src = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    const m = src.match(/selector:\s*'([^']+)'/);
    if (m) selectors.push(m[1]);
  }
  const inventoried = new Set(data.elements.map((e) => e.selector));
  const missing = selectors.filter((s) => !inventoried.has(s));
  const extra = [...inventoried].filter((s) => !selectors.includes(s));
  if (missing.length || extra.length) {
    throw new Error(
      `elements-inventory.json drift.\n  missing: ${missing.join(', ') || '—'}\n  extra: ${extra.join(', ') || '—'}`
    );
  }

  const api = fs.readFileSync(path.join(root, 'projects/ngx-stripe/src/public_api.ts'), 'utf8');
  const missingExports = data.elements.filter((e) => !api.includes(`export { ${e.export} }`));
  if (missingExports.length) {
    throw new Error(
      `elements-inventory.json exports missing from public_api.ts: ${missingExports.map((e) => e.export).join(', ')}`
    );
  }
}

function padLines(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n');
}

function snippetHtml(el) {
  const opts = el.optionsInit ? ' [options]="options"' : '';
  const group = `<ngx-stripe-elements
  [stripe]="stripe"
  [elementsOptions]="elementsOptions"
>
  <${el.selector}${opts} />
</ngx-stripe-elements>`;
  if (el.needsClientSecret) {
    return `
@if (elementsOptions.clientSecret) {
${padLines(group, 2)}
}
`;
  }
  return `\n${group}\n`;
}

function snippetTs(el) {
  const optionsBlock = el.optionsInit
    ? `
      options: ${el.optionsType} = ${el.optionsInit};`
    : '';
  const typeImport = el.optionsInit ? `StripeElementsOptions, ${el.optionsType}` : 'StripeElementsOptions';
  const secretComment = el.needsClientSecret
    ? `
          clientSecret: '{{CLIENT_SECRET}}'`
    : '';
  return `
    import { Component } from '@angular/core';

    import { ${typeImport} } from '@stripe/stripe-js';
    import {
      injectStripe,
      StripeElementsDirective,
      ${el.export}
    } from 'ngx-stripe';

    @Component({
      selector: 'app-checkout',
      templateUrl: './checkout.component.html',
      standalone: true,
      imports: [StripeElementsDirective, ${el.export}]
    })
    export class CheckoutComponent {
      stripe = injectStripe('{{YOUR_PUBLISHABLE_KEY}}');
      elementsOptions: StripeElementsOptions = {
        locale: 'en'${secretComment}
      };${optionsBlock}
    }
  `;
}

function writeIfNeeded(filePath, contents) {
  const next = contents.endsWith('\n') ? contents : `${contents}\n`;
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (prev === next) return false;
  if (check) {
    throw new Error(`Generated file out of date: ${path.relative(root, filePath)}`);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next);
  return true;
}

function dataTs() {
  const payload = {
    site,
    elements: data.elements.map((el) => ({
      ...el,
      snippetHtml: snippetHtml(el),
      snippetTs: snippetTs(el)
    }))
  };
  return `/* eslint-disable */
// Generated by scripts/generate-elements.mjs — do not edit by hand.
import { NgStrElementEntry } from './elements.model';

export const NGSTR_DOCS_SITE = ${JSON.stringify(payload.site)};

export const NGSTR_ELEMENTS: NgStrElementEntry[] = ${JSON.stringify(payload.elements, null, 2)};

export function ngStrElementById(id: string): NgStrElementEntry | undefined {
  return NGSTR_ELEMENTS.find((el) => el.id === id);
}

export function ngStrNavElements(): NgStrElementEntry[] {
  return NGSTR_ELEMENTS.filter((el) => el.showInNav);
}

export function ngStrContractElements(): NgStrElementEntry[] {
  return NGSTR_ELEMENTS.filter((el) => el.page === 'contract');
}
`;
}

function llmsTxt() {
  const rows = data.elements
    .map((el) => `- [${el.name}](${site}${el.docsPath}): \`${el.selector}\``)
    .join('\n');
  return `# ngx-stripe

> Angular wrapper around Stripe.js: Observable StripeService, provideNgxStripe / injectStripe, and standalone Elements hosts.

ngx-stripe does not own payment types or Element appearance. Types come from \`@stripe/stripe-js\`. Styling, payment methods, and PCI are Stripe.

Version = \`{angularMajor}.{stripeJsMajor}.{patch}\` (e.g. 22.10.x = Angular 22 + Stripe.js v10 endive).

## Install

\`\`\`bash
npm install ngx-stripe @stripe/stripe-js
\`\`\`

\`\`\`ts
import { provideNgxStripe } from 'ngx-stripe';
export const appConfig = { providers: [provideNgxStripe('pk_test_…')] };
\`\`\`

\`injectStripe()\` uses the default key. Service methods are Observables, not Promises.
Nested Elements: set \`clientSecret\` on \`ngx-stripe-elements\` before create; wrap in \`@if\`.
Split Card fields need \`ngx-stripe-card-group\`. Payment Request Button is gone on Stripe.js v10 / \`*.10\`.

## Docs

- [Introduction](${site}/docs/introduction)
- [Installation / lanes](${site}/docs/installation)
- [Setup](${site}/docs/setup-application)
- [First payment](${site}/docs/first-payment)
- [Elements parent + catalog](${site}/docs/elements)
- [Stripe Service](${site}/docs/service)
- [CSP](${site}/docs/csp)
- [Checkout](${site}/docs/checkout)
- [Identity](${site}/docs/identity)
- [Migration](${site}/docs/migration)
- [llms-full.txt](${site}/llms-full.txt)

## Elements

${rows}

## Skill

Agent Skill (\`SKILL.md\`), editor-agnostic:

\`\`\`bash
npx skills add richnologies/ngx-stripe
\`\`\`

Source: https://github.com/richnologies/ngx-stripe/tree/main/skills/ngx-stripe
`;
}

function llmsFull() {
  const blocks = data.elements.map((el) => {
    const html = snippetHtml(el).trim();
    return `### ${el.name}

- Export: \`${el.export}\`
- Selector: \`${el.selector}\`
- Stripe type: \`${el.stripeType}\`
- Docs: ${site}${el.docsPath}
- Stripe.js: ${el.stripeDocs}
- Since: ${el.since}
- clientSecret on parent Elements: ${el.needsClientSecret ? 'yes' : 'no'}
- ${el.summary}
- ${el.notes}

\`\`\`html
${html}
\`\`\`
`;
  });
  return `# ngx-stripe (full)

${llmsTxt()}

## Setup

\`\`\`ts
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig = {
  providers: [provideNgxStripe('pk_live_...')]
};
\`\`\`

\`injectStripe()\` uses the default key. Pass a key or \`StripeInstance\` for Connect / second accounts.

Nested Elements: create the parent \`ngx-stripe-elements\` once with \`clientSecret\` set. Do not patch clientSecret after create. Use \`@if (elementsOptions.clientSecret)\`.

Split card number / expiry / CVC must sit in \`ngx-stripe-card-group\`. Directives: \`StripeElementsDirective\`, \`StripeCardGroupDirective\`, \`NgxStripeElementLoadingTemplateDirective\`.

## Element contract pages

${blocks.join('\n')}
`;
}

function skillElements() {
  const table = [
    '| Element | Selector | Docs |',
    '| --- | --- | --- |',
    ...data.elements.map((el) => `| ${el.name} | \`${el.selector}\` | ${el.docsPath} |`)
  ].join('\n');
  const contracts = data.elements
    .filter((el) => el.page === 'contract')
    .map((el) => `### ${el.name}

\`${el.selector}\` — ${el.summary}

${el.notes}

\`\`\`html
${snippetHtml(el).trim()}
\`\`\`
`)
    .join('\n');
  return `<!-- Generated by scripts/generate-elements.mjs — do not edit by hand. -->

# ngx-stripe Elements

${table}

## Contract snippets (pages generated from inventory)

${contracts}
`;
}

function sitemapXml() {
  const paths = [...new Set([...CORE_DOC_PATHS, ...data.elements.map((el) => el.docsPath)])];
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${site}${p === '/' ? '/' : p}</loc>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

assertInventoryComplete();

const changed = [
  writeIfNeeded(dataPath, dataTs()),
  writeIfNeeded(llmsPath, llmsTxt()),
  writeIfNeeded(llmsFullPath, llmsFull()),
  writeIfNeeded(llmsRootPath, llmsTxt()),
  writeIfNeeded(llmsFullRootPath, llmsFull()),
  writeIfNeeded(skillElementsPath, skillElements()),
  writeIfNeeded(sitemapPath, sitemapXml())
].some(Boolean);

if (check) {
  process.stdout.write('elements inventory generated files are up to date\n');
} else if (changed) {
  process.stdout.write('updated generated element docs / AI files\n');
} else {
  process.stdout.write('no element generated-file changes\n');
}
