const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

const base = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

(async () => {
  const { SEO_ROUTES, SEO_SITE } = await import('../src/data/seoRoutes.js');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });

    async function checkMetadata(route) {
      const expected = SEO_ROUTES[route];
      const canonical = `${SEO_SITE.url}${route}`;
      const image = expected.projectImage || SEO_SITE.defaultImage;

      await expect(page).toHaveTitle(expected.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', expected.description);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', expected.robots);
      await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content', expected.robots);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', canonical);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', image);
      await expect(page.locator('meta[property="og:image:secure_url"]')).toHaveAttribute('content', image);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', image);
      await expect(page.locator('script[data-seo-jsonld]')).toHaveCount(1);

      const jsonLd = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent());
      const webpage = jsonLd['@graph'].find(item => item['@type'] === 'WebPage');
      assert.equal(webpage.url, canonical, `Structured URL is canonical for ${route}`);
    }

    // Route content and metadata must agree even when a shared URL ends in '/'.
    for (const route of Object.keys(SEO_ROUTES)) {
      const trailingPath = route === '/' ? '/' : `${route}/`;
      await page.goto(`${base}${trailingPath}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('main h1')).toBeVisible();
      await checkMetadata(route);
    }

    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toBeVisible();
    await checkMetadata('/');
    await page.evaluate(() => { window.__seoNavigationMarker = 'same-document'; });

    // Use actual React links so a full document reload cannot hide stale metadata.
    const transitions = [
      ['.project-heading a[href="/projetos/animalis-pet"]', '/projetos/animalis-pet'],
      ['.commercial-case-note a[href="/projetos/viana-planejados"]', '/projetos/viana-planejados'],
      ['.commercial-case-note a[href="/projetos/durio-planejados"]', '/projetos/durio-planejados'],
      ['.case-head a[href="/#projetos"]', '/'],
      ['.studio-nav a[href="/site-essencial"]', '/site-essencial'],
    ];
    for (const [selector, route] of transitions) {
      await page.locator(selector).click();
      await expect(page).toHaveURL(url => url.pathname === route);
      await checkMetadata(route);
      assert.equal(await page.evaluate(() => window.__seoNavigationMarker), 'same-document', `${route} navigation stays in the SPA`);
    }

    console.log(`SEO navigation: ${Object.keys(SEO_ROUTES).length} trailing-slash routes and ${transitions.length} SPA transitions passed.`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
