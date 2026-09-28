#!/usr/bin/env node
/**
 * Compare Stripe interface method names in @stripe/stripe-js to StripeServiceInterface.
 * Usage: node scripts/check-stripe-drift.mjs
 * Exit 1 if Stripe has methods we do not wrap (excluding known allowlist).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Methods on Stripe that ngx-stripe intentionally does not wrap (or are properties). */
const ALLOW_MISSING = new Set([
  // non-method / not Observable-wrapped surface
]);

function methodNamesFromDts(text) {
  const names = new Set();
  for (const m of text.matchAll(/^\s+([a-zA-Z][a-zA-Z0-9]*)\s*(\??)\s*\(/gm)) {
    names.add(m[1]);
  }
  return names;
}

function findStripeDts() {
  const candidates = [
    path.join(root, 'node_modules/@stripe/stripe-js/dist/stripe-js/stripe.d.ts'),
    path.join(root, 'node_modules/@stripe/stripe-js/types/stripe-js/stripe.d.ts')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Could not find @stripe/stripe-js stripe.d.ts');
}

const stripeDts = fs.readFileSync(findStripeDts(), 'utf8');
// Prefer the `export interface Stripe {` block only
const stripeBlock = stripeDts.match(/export interface Stripe\s*\{([\s\S]*?)\n\}/);
const stripeMethods = methodNamesFromDts(stripeBlock ? stripeBlock[1] : stripeDts);

const ifacePath = path.join(
  root,
  'projects/ngx-stripe/src/lib/interfaces/stripe-instance.interface.ts'
);
const iface = fs.readFileSync(ifacePath, 'utf8');
const ourMethods = methodNamesFromDts(iface);
// getInstance is ngx-stripe specific
ourMethods.delete('getInstance');

const missing = [...stripeMethods].filter((n) => !ourMethods.has(n) && !ALLOW_MISSING.has(n)).sort();
const extra = [...ourMethods]
  .filter((n) => !stripeMethods.has(n) && !n.startsWith('handleCard') && !n.startsWith('confirmPaymentIntent') && !n.startsWith('confirmSetupIntent') && !n.startsWith('handleFpx'))
  .sort();

// Deprecated wrappers we keep while Stripe keeps them
const DEPRECATED_KEPT = new Set([
  'handleCardPayment',
  'confirmPaymentIntent',
  'handleCardSetup',
  'confirmSetupIntent',
  'handleFpxPayment'
]);

console.log(`Stripe methods: ${stripeMethods.size}`);
console.log(`ngx-stripe interface methods: ${ourMethods.size}`);

if (missing.length) {
  console.error('\nMissing wrappers (on Stripe, not on StripeServiceInterface):');
  for (const n of missing) console.error(`  - ${n}`);
}

const unexpectedExtra = extra.filter((n) => !DEPRECATED_KEPT.has(n));
if (unexpectedExtra.length) {
  console.warn('\nExtra interface methods (not on current Stripe type — ok if deprecated):');
  for (const n of unexpectedExtra) console.warn(`  - ${n}`);
}

if (missing.length) {
  process.exit(1);
}

console.log('Stripe drift check OK');
