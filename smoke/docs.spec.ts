import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const lanes = JSON.parse(fs.readFileSync(path.join(__dirname, '../lanes.json'), 'utf8'));
const latest = lanes.latest as string;
const older =
  (lanes.ci?.nightly as string[] | undefined)?.find((id) => id.startsWith('21.')) ||
  (lanes.ci?.nightly as string[] | undefined)?.find((id) => id !== latest) ||
  '21.8';

test.describe('docs smoke (latest lane)', () => {
  test('boots introduction', async ({ page }) => {
    await page.goto('/docs/introduction');
    await expect(page.getByRole('heading', { name: /introduction/i })).toBeVisible();
    await expect(page.getByTestId('version-picker')).toBeVisible();
  });

  test('installation shows lane install command and table', async ({ page }) => {
    await page.goto('/docs/installation');
    await expect(page.getByTestId('install-lane-command')).toBeVisible();
    await expect(page.getByRole('heading', { name: /release matrix/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /ai agents/i })).toBeVisible();
    await expect(page.getByText('npx skills add richnologies/ngx-stripe')).toBeVisible();
    await expect(page.getByRole('table')).toContainText('22');
    await expect(page.getByTestId('ownership-callout')).toBeVisible();
  });

  test('element catalog and a generated contract page load', async ({ page }) => {
    await page.goto('/docs/elements');
    await expect(page.getByRole('heading', { name: /^elements$/i })).toBeVisible();
    await expect(page.getByRole('tabpanel', { name: 'Overview' }).getByRole('link', { name: 'Tax Id Element' })).toBeVisible();

    await page.goto('/docs/tax-id-element');
    await expect(page.getByRole('heading', { name: /tax id/i })).toBeVisible();
    await expect(page.getByTestId('ownership-callout')).toBeVisible();
    await expect(page.getByText('ngx-stripe-tax-id').first()).toBeVisible();
  });

  test('removed Payment Request Button page does not teach the old selector', async ({ page }) => {
    await page.goto('/docs/payment-request-button');
    await expect(page.getByRole('heading', { name: /payment request button/i })).toBeVisible();
    await expect(page.getByText(/removed on stripe\.js v10/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /express checkout/i }).first()).toBeVisible();
  });

  test('llms.txt is served', async ({ page }) => {
    // ng serve exposes the file under /assets; production also copies it to /llms.txt
    const res = await page.request.get('/assets/llms.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('ngx-stripe');
    expect(body).toContain('ngx-stripe-payment');
    expect(body).toContain('provideNgxStripe');
    expect(body).toContain('npx skills add richnologies/ngx-stripe');
  });

  test('versioning, csp, and support pages load', async ({ page }) => {
    await page.goto('/docs/versioning');
    await expect(page.getByRole('heading', { name: /pick your lane/i })).toBeVisible();
    await expect(page.getByTestId('lane-install-command')).toBeVisible();

    await page.goto('/docs/csp');
    await expect(page.getByRole('heading', { name: /content security policy/i })).toBeVisible();
    await expect(page.getByText(/js\.stripe\.com/i).first()).toBeVisible();

    await page.goto('/docs/support');
    await expect(page.getByRole('heading', { name: /support policy/i })).toBeVisible();
  });

  test('core nav pages return content', async ({ page }) => {
    for (const pathName of ['/docs/payment-element', '/docs/service', '/docs/setup-application', '/docs/styling']) {
      await page.goto(pathName);
      await expect(page.locator('ngstr-header, h1').first()).toBeVisible();
    }
  });

  test('internal docs links on installation are not dead', async ({ page }) => {
    await page.goto('/docs/installation');
    const hrefs = await page.locator('a[href^="/docs/"]').evaluateAll((as) =>
      [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href')).filter(Boolean))]
    );
    for (const href of hrefs.slice(0, 12)) {
      const res = await page.request.get(href!);
      expect(res.status(), href!).toBeLessThan(400);
    }
  });
});

test.describe('docs smoke (older lane overlay)', () => {
  test(`picker selects ${older} and shows StackBlitz link`, async ({ page }) => {
    await page.goto(`/docs/versioning?lane=${older}`);
    await expect(page.getByTestId('lane-banner')).toBeVisible();
    await expect(page.getByTestId('stackblitz-link')).toBeVisible();
    const href = await page.getByTestId('stackblitz-link').getAttribute('href');
    expect(href).toContain(`playground/lanes/${older}`);
    await expect(page.getByTestId('lane-install-command')).toContainText('npm install');
    // Install command should not be the bare latest default when older lane is selected
    const text = await page.getByTestId('lane-install-command').innerText();
    expect(text).toMatch(/ngx-stripe@/);
  });
});
