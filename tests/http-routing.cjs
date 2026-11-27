const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, expect } = require('@playwright/test');

// Run against a Vercel preview/production URL: Vite's dev server uses SPA fallback.
assert.ok(process.env.SITE_URL, 'Set SITE_URL to the deployment being tested');
const target = new URL(process.env.SITE_URL);
const base = target.origin;
function deploymentUrl(route) {
  const url = new URL(route, base);
  for (const [key, value] of target.searchParams) url.searchParams.set(key, value);
  return url.href;
}

const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
  : {};

async function request(route, method = 'GET') {
  const response = await fetch(deploymentUrl(route), { method, headers, signal: AbortSignal.timeout(30000) });
  const html = await response.text();
  return { response, html };
}

function attribute(html, pattern) {
  return html.match(pattern)?.[1];
}

(async () => {
  const { SEO_ROUTES, SEO_SITE } = await import('../src/data/seoRoutes.js');
  const unknownRoutes = [
    '/pagina-inexistente-revisao-17',
    '/nao-existe-issue-21/',
    '/projetos/nao-existe-issue-21',
    '/blog/nao-existe-issue-21?origem=teste',
    '/assets/nao-existe-issue-21.css',
  ];

  for (const route of unknownRoutes) {
    const { response, html } = await request(route);
    assert.equal(response.status, 404, `${route}: real HTTP 404`);
    assert.match(response.headers.get('content-type'), /text\/html/, `${route}: custom HTML`);
    assert.match(html, /<title>Página não encontrada \| Agência Mello<\/title>/);
    for (const name of ['robots', 'googlebot']) {
      assert.match(html, new RegExp(`<meta name="${name}" content="noindex,nofollow"`));
    }
    assert.doesNotMatch(html, /<link rel="(?:canonical|alternate)"|<meta property="og:url"/);
    assert.doesNotMatch(html, /data-seo-jsonld/);
    assert.equal((await request(route, 'HEAD')).response.status, 404, `${route}: HEAD 404`);
  }

  for (const [route, seo] of Object.entries(SEO_ROUTES)) {
    for (const variant of new Set([route, route === '/' ? '/' : `${route}/`])) {
      const { response, html } = await request(variant);
      assert.equal(response.status, 200, `${variant}: HTTP 200`);
      assert.equal(attribute(html, /<meta name="robots" content="([^"]+)"/), seo.robots, `${variant}: robots`);
      assert.equal(attribute(html, /<link rel="canonical" href="([^"]+)"/), `${SEO_SITE.url}${route}`, `${variant}: canonical`);
      const file = path.join(__dirname, '../dist', route, 'index.html');
      const expectedTitle = attribute(fs.readFileSync(file, 'utf8'), /<title>(.*?)<\/title>/s);
      assert.equal(attribute(html, /<title>(.*?)<\/title>/s), expectedTitle, `${variant}: title`);
    }
  }

  const home = await request('/');
  const script = attribute(home.html, /<script[^>]*src="([^"]+)"/);
  const style = attribute(home.html, /<link[^>]*href="([^"]+\.css)"/);
  for (const asset of [script, style, '/assets/agencia-mello-logo.png', '/robots.txt', '/sitemap.xml']) {
    assert.ok(asset, 'Build includes JavaScript and CSS');
    assert.equal((await request(asset)).response.status, 200, `${asset}: available`);
  }
  console.log(`HTTP routing: ${unknownRoutes.length} unknown URLs (GET + HEAD), ${Object.keys(SEO_ROUTES).length} known routes with/without trailing slash, and assets passed.`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', extraHTTPHeaders: headers });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(deploymentUrl(unknownRoutes[0]), { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 404);
      await expect(page.getByRole('heading', { name: 'Página não encontrada', exact: true })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No horizontal overflow');
      await page.evaluate(() => { window.__httpRoutingMarker = true; });
      await page.getByRole('link', { name: 'Voltar pro início' }).click();
      await expect(page).toHaveURL(`${base}/`);
      await expect(page.locator('main h1')).toBeVisible();
      assert.equal(await page.evaluate(() => window.__httpRoutingMarker), true, 'Return link preserves SPA navigation');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', SEO_ROUTES['/'].robots);
      assert.deepEqual(errors, [], 'No JavaScript errors');
      await page.close();
    }
    console.log('404 browser: desktop/mobile, return to home, SPA metadata and console passed.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
