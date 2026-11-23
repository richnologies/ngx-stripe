import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Rule, SchematicContext, SchematicsException, Tree, chain, noop } from '@angular-devkit/schematics';
import {
  DependencyType,
  ExistingBehavior,
  addDependency,
  addRootProvider,
  readWorkspace
} from '@schematics/angular/utility';

export interface NgAddOptions {
  project?: string;
  publishableKey?: string;
}

const DOCS = 'https://ngx-stripe.dev/docs';

/**
 * `ng add ngx-stripe`: installs @stripe/stripe-js at the range this release supports and adds
 * provideNgxStripe() to the application's root providers (app.config.ts, or the root NgModule).
 */
export default function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const key = checkPublishableKey(options.publishableKey);
    const project = await resolveApplication(tree, options.project);

    const alreadySetUp = findExistingSetup(tree, project.sourceRoot);
    if (alreadySetUp) {
      context.logger.info(`ngx-stripe is already set up in ${alreadySetUp}; providers left unchanged.`);
    }

    return chain([
      stripeJsDependency(tree, context),
      alreadySetUp
        ? noop()
        : addRootProvider(project.name, ({ code, external }) =>
            key
              ? code`${external('provideNgxStripe', 'ngx-stripe')}('${key}')`
              : code`${external('provideNgxStripe', 'ngx-stripe')}()`
          ),
      () => logNextSteps(context, key, Boolean(alreadySetUp))
    ]);
  };
}

/** Publishable keys only. A secret or restricted key in browser code exposes the Stripe account. */
export function checkPublishableKey(raw: string | undefined): string {
  const key = (raw ?? '').trim();
  if (!key) return '';

  if (/^(sk|rk)_/.test(key)) {
    throw new SchematicsException(
      'That is a secret or restricted key. Those must never be in browser code: anyone could use them to act on ' +
        'your Stripe account. Use your publishable key (pk_test_… or pk_live_…) from https://dashboard.stripe.com/apikeys, ' +
        'and roll the secret key if it was shared anywhere.'
    );
  }

  if (!/^pk_(test|live)_[A-Za-z0-9]+$/.test(key)) {
    throw new SchematicsException(
      `"${key}" is not a Stripe publishable key. They start with pk_test_ or pk_live_: ` +
        'https://dashboard.stripe.com/apikeys'
    );
  }

  return key;
}

async function resolveApplication(tree: Tree, requested?: string): Promise<{ name: string; sourceRoot: string }> {
  const workspace = await readWorkspace(tree);
  const applications = [...workspace.projects.entries()].filter(
    ([, project]) => project.extensions['projectType'] === 'application'
  );

  const name = requested || (applications.length === 1 ? applications[0][0] : undefined);
  if (!name) {
    throw new SchematicsException(
      `Pick the application to set up with --project (one of: ${applications.map(([n]) => n).join(', ')}).`
    );
  }

  const project = workspace.projects.get(name);
  if (!project) {
    throw new SchematicsException(`No project named "${name}" in angular.json.`);
  }
  if (project.extensions['projectType'] !== 'application') {
    throw new SchematicsException(`"${name}" is a library. Run ng add ngx-stripe for the application that takes payments.`);
  }

  return { name, sourceRoot: project.sourceRoot ?? join(project.root, 'src') };
}

/** Running ng add twice must not register ngx-stripe twice. */
function findExistingSetup(tree: Tree, sourceRoot: string): string | null {
  let found: string | null = null;
  tree.getDir(sourceRoot).visit((path) => {
    if (found || !path.endsWith('.ts') || path.endsWith('.spec.ts')) return;
    const text = stripComments(tree.readText(path));
    if (/provideNgxStripe\s*\(|NgxStripeModule\s*\.\s*forRoot\s*\(/.test(text)) {
      found = path.replace(/^\//, '');
    }
  });
  return found;
}

/** A commented-out `provideNgxStripe(...)` is not a setup. URLs such as `https://…` are left alone. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
}

interface StripeJsPeer {
  /** The peer range as declared, e.g. `>=10.3.0 <11.0.0`. */
  range: string;
  /** The lowest supported version, as [major, minor, patch]. */
  floor: [number, number, number];
}

/** The @stripe/stripe-js peer this ngx-stripe release declares. */
function stripeJsPeer(): StripeJsPeer {
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
  const range: string = pkg.peerDependencies?.['@stripe/stripe-js'] ?? '';
  const min = /(\d+)\.(\d+)\.(\d+)/.exec(range);
  if (!min) {
    throw new SchematicsException('ngx-stripe package.json declares no @stripe/stripe-js peer dependency.');
  }
  return { range, floor: [Number(min[1]), Number(min[2]), Number(min[3])] };
}

/**
 * Adds @stripe/stripe-js at the supported range. A version the app already has is kept, unless it
 * can never satisfy this release's peer (an older major, or a pin below the floor): that one is
 * replaced, because ngx-stripe's typings need the supported version.
 */
function stripeJsDependency(tree: Tree, context: SchematicContext): Rule {
  const peer = stripeJsPeer();
  const wanted = `^${peer.floor.join('.')}`;

  const manifest = tree.readJson('/package.json') as Record<string, Record<string, string> | undefined>;
  const type = manifest[DependencyType.Default]?.['@stripe/stripe-js']
    ? DependencyType.Default
    : manifest[DependencyType.Dev]?.['@stripe/stripe-js']
      ? DependencyType.Dev
      : DependencyType.Default;
  const existing = manifest[type]?.['@stripe/stripe-js'];

  if (!existing || canSatisfy(existing, peer.floor) !== false) {
    return addDependency('@stripe/stripe-js', wanted, { type, existing: ExistingBehavior.Skip });
  }

  context.logger.info(
    `This ngx-stripe needs @stripe/stripe-js ${peer.range}, so "${existing}" is updated to "${wanted}".`
  );
  return addDependency('@stripe/stripe-js', wanted, { type, existing: ExistingBehavior.Replace });
}

/**
 * Whether a package.json specifier can resolve to a version at or above `floor` within its major.
 * Returns null for specifiers this does not try to understand (ranges, tags, URLs), which are left alone.
 */
export function canSatisfy(specifier: string, floor: [number, number, number]): boolean | null {
  const match = /^\s*(\^|~|=|v)?\s*(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?\s*$/i.exec(specifier);
  if (!match) return null;

  const [, operator, majorText, minorText, patchText] = match;
  const major = Number(majorText);
  if (major !== floor[0]) return false;

  const minor = minorText === undefined || /x|\*/i.test(minorText) ? null : Number(minorText);
  const patch = patchText === undefined || /x|\*/i.test(patchText) ? null : Number(patchText);

  // `^10.1.0`, `10`, `10.x`: any later version of the major is allowed.
  if (operator === '^' || minor === null) return true;
  // `~10.1.0`, `10.1`, `10.1.x`: only later patches of that minor.
  if (operator === '~' || patch === null) return minor >= floor[1];
  // An exact version.
  return minor > floor[1] || (minor === floor[1] && patch >= floor[2]);
}

function logNextSteps(context: SchematicContext, key: string, alreadySetUp: boolean): void {
  if (!alreadySetUp) {
    context.logger.info(`Added provideNgxStripe(${key ? `'${key}'` : ''}) to your application providers.`);
  }
  if (!alreadySetUp && !key) {
    context.logger.warn(
      "No publishable key yet: pass it to provideNgxStripe('pk_test_…') before using injectStripe(). " +
        `See ${DOCS}/setup-application`
    );
  }
  if (key.startsWith('pk_live_')) {
    context.logger.warn('That is a live key: real cards will be charged. Use a pk_test_ key while you develop.');
  }
  context.logger.info(
    `Next: create a PaymentIntent on your server and render <ngx-stripe-payment>. ${DOCS}/first-payment`
  );
}
