import { join } from 'node:path';

import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { describe, expect, it } from 'vitest';

// The built schematic in dist/ is what `ng add` runs, and the test runner can only load compiled JS.
// `npm run test:schematics` builds the library first.
const collection = join(__dirname, '..', '..', '..', '..', 'dist', 'ngx-stripe', 'schematics', 'collection.json');
const runner = new SchematicTestRunner('ngx-stripe', collection);

async function workspace(standalone: boolean): Promise<UnitTestTree> {
  const tree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '22.0.0'
  });
  return runner.runExternalSchematic('@schematics/angular', 'application', { name: 'shop', standalone }, tree);
}

function file(tree: UnitTestTree, ending: string): string {
  const path = tree.files.find((f) => f.endsWith(ending));
  if (!path) throw new Error(`no ${ending} in tree`);
  return tree.readContent(path);
}

describe('ng add ngx-stripe', () => {
  it('adds provideNgxStripe(key) to a standalone app config', async () => {
    const tree = await runner.runSchematic('ng-add', { publishableKey: 'pk_test_abc123' }, await workspace(true));
    const config = file(tree, 'shop/src/app/app.config.ts');

    expect(config).toContain("import { provideNgxStripe } from 'ngx-stripe';");
    expect(config).toContain("provideNgxStripe('pk_test_abc123')");
  });

  it('adds provideNgxStripe to the root NgModule of a module app', async () => {
    const tree = await runner.runSchematic('ng-add', { publishableKey: 'pk_test_abc123' }, await workspace(false));
    const module = file(tree, 'shop/src/app/app-module.ts');

    expect(module).toContain("import { provideNgxStripe } from 'ngx-stripe';");
    expect(module).toContain("provideNgxStripe('pk_test_abc123')");
  });

  it('installs @stripe/stripe-js at the range this release supports', async () => {
    const tree = await runner.runSchematic('ng-add', { publishableKey: 'pk_test_abc123' }, await workspace(true));
    const pkg = JSON.parse(tree.readContent('/package.json'));
    const ownPeer: string = require('../../package.json').peerDependencies['@stripe/stripe-js'];

    expect(pkg.dependencies['@stripe/stripe-js']).toBe(`^${/(\d+\.\d+\.\d+)/.exec(ownPeer)![1]}`);
    expect(runner.tasks.some((t) => t.name === 'node-package')).toBe(true);
  });

  it('keeps an @stripe/stripe-js version the app already has', async () => {
    const base = await workspace(true);
    const pkg = JSON.parse(base.readContent('/package.json'));
    pkg.dependencies['@stripe/stripe-js'] = '10.3.0';
    base.overwrite('/package.json', JSON.stringify(pkg));

    const tree = await runner.runSchematic('ng-add', {}, base);
    expect(JSON.parse(tree.readContent('/package.json')).dependencies['@stripe/stripe-js']).toBe('10.3.0');
  });

  it('adds provideNgxStripe() without a key when none is given', async () => {
    const tree = await runner.runSchematic('ng-add', { publishableKey: '' }, await workspace(true));
    expect(file(tree, 'shop/src/app/app.config.ts')).toContain('provideNgxStripe()');
  });

  it('does not register ngx-stripe twice', async () => {
    const once = await runner.runSchematic('ng-add', { publishableKey: 'pk_test_abc123' }, await workspace(true));
    const twice = await runner.runSchematic('ng-add', { publishableKey: 'pk_test_other' }, once);
    const config = file(twice, 'shop/src/app/app.config.ts');

    expect(config.match(/provideNgxStripe\(/g)).toHaveLength(1);
    expect(config).not.toContain('pk_test_other');
  });

  it.each(['sk_test_not_a_real_key', 'sk_live_not_a_real_key', 'rk_live_not_a_real_key'])('refuses the secret or restricted key %s', async (key) => {
    const tree = await workspace(true);
    await expect(runner.runSchematic('ng-add', { publishableKey: key }, tree)).rejects.toThrow(/never be in browser code/);
    expect(file(tree, 'shop/src/app/app.config.ts')).not.toContain(key);
  });

  it('refuses something that is not a publishable key', async () => {
    await expect(
      runner.runSchematic('ng-add', { publishableKey: "pk_test_x'); alert(1); ('" }, await workspace(true))
    ).rejects.toThrow(/not a Stripe publishable key/);
  });

  it('refuses a library project', async () => {
    const tree = await workspace(true);
    const lib = await runner.runExternalSchematic('@schematics/angular', 'library', { name: 'ui' }, tree);
    await expect(runner.runSchematic('ng-add', { project: 'ui' }, lib)).rejects.toThrow(/is a library/);
  });
});
