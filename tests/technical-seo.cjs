const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4204').replace(/\/$/, '');
const canonicalBase = 'https://www.agenciamello.site';

const indexableRoutes = [
  '/',
  '/site-essencial',
  '/projetos/bellavista',
  '/projetos/solace',
];

const staticFiles = {
  '/': 'dist/index.html',
  '/site-essencial': 'dist/site-essencial/index.html',
  '/projetos/bellavista': 'dist/projetos/bellavista/index.html',
  '/projetos/solace': 'dist/projetos/solace/index.html',
  '/politica-de-privacidade': 'dist/politica-de-privacidade/index.html',
  '/termos-de-uso': 'dist/termos-de-uso/index.html',
};

function graphTypes(jsonLd) {
  return new Set((jsonLd['@graph'] || []).map(item => item['@type']));
}

function readStaticMeta(file) {
  const html = fs.readFileSync(path.resolve(file), 'utf8');
  const value = regex => html.match(regex)?.[1] || '';
  const rawJsonLd = value(/<script type="application\/ld\+json" data-seo-jsonld>(.*?)<\/script>/s);
  return {
    html,
    title: value(/<title>(.*?)<\/title>/s),
    canonical: value(/<link rel="canonical" href="([^"]+)"/),
    robots: value(/<meta name="robots" content="([^"]+)"/),
    ogUrl: value(/<meta property="og:url" content="([^"]+)"/),
    jsonLd: rawJsonLd ? JSON.parse(rawJsonLd) : null,
  };
}

(async () => {
  for (const [route,file] of Object.entries(staticFiles)) {
    assert.ok(fs.existsSync(file), `Static HTML exists for ${route}`);
    const meta = readStaticMeta(file);
    const canonical = `${canonicalBase}${route === '/' ? '/' : route}`;
    assert.equal(meta.canonical, canonical, `Static canonical is correct for ${route}`);
    assert.equal(meta.ogUrl, canonical, `Static OG URL is correct for ${route}`);
    assert.ok(meta.title.includes('Mello') || route === '/site-essencial', `Static title is descriptive for ${route}`);
    assert.ok(meta.jsonLd, `Static JSON-LD exists for ${route}`);
  }

  const homeStatic = readStaticMeta(staticFiles['/']);
  const homeTypes = graphTypes(homeStatic.jsonLd);
  assert.ok(homeTypes.has('Organization'), 'Home schema includes Organization');
  assert.ok(homeTypes.has('WebSite'), 'Home schema includes WebSite');
  assert.ok(homeTypes.has('WebPage'), 'Home schema includes WebPage');
  assert.ok(homeTypes.has('Service'), 'Home schema includes services');

  const serviceStatic = readStaticMeta(staticFiles['/site-essencial']);
  const serviceGraph = serviceStatic.jsonLd['@graph'];
  const service = serviceGraph.find(item => item['@type'] === 'Service' && item.name === 'Site Essencial');
  assert.ok(service, 'Site Essencial schema includes Service');
  assert.equal(service.offers?.price, '500', 'Site Essencial structured price is R$ 500');
  assert.equal(service.offers?.priceCurrency, 'BRL', 'Site Essencial structured currency is BRL');
  assert.ok(graphTypes(serviceStatic.jsonLd).has('BreadcrumbList'), 'Site Essencial schema includes breadcrumbs');

  for (const route of ['/projetos/bellavista','/projetos/solace']) {
    const data = readStaticMeta(staticFiles[route]);
    assert.ok(graphTypes(data.jsonLd).has('CreativeWork'), `${route} schema identifies the conceptual project`);
    assert.ok(data.robots.startsWith('index,follow'), `${route} is indexable`);
  }

  for (const route of ['/politica-de-privacidade','/termos-de-uso']) {
    const data = readStaticMeta(staticFiles[route]);
    assert.ok(data.robots.startsWith('noindex,follow'), `${route} stays out of search results`);
  }

  const notFound = readStaticMeta('dist/404.html');
  assert.equal(notFound.robots, 'noindex,nofollow', '404 static fallback is noindex,nofollow');
  assert.equal(notFound.jsonLd, null, '404 static fallback does not expose structured data');

  const robotsResponse = await fetch(`${base}/robots.txt`);
  assert.equal(robotsResponse.status, 200, 'robots.txt returns 200');
  const robots = await robotsResponse.text();
  assert.match(robots, /User-agent:\s*\*/);
  assert.match(robots, /Allow:\s*\//);
  assert.match(robots, /Sitemap:\s*https:\/\/www\.agenciamello\.site\/sitemap\.xml/);

  const sitemapResponse = await fetch(`${base}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200, 'sitemap.xml returns 200');
  const sitemap = await sitemapResponse.text();
  for (const route of indexableRoutes) {
    const url = `${canonicalBase}${route === '/' ? '/' : route}`;
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `Sitemap contains ${route}`);
  }
  assert.ok(!sitemap.includes('/politica-de-privacidade'), 'Sitemap excludes privacy policy');
  assert.ok(!sitemap.includes('/termos-de-uso'), 'Sitemap excludes terms');

  const manifestResponse = await fetch(`${base}/site.webmanifest`);
  assert.equal(manifestResponse.status, 200, 'Web manifest returns 200');
  const manifest = JSON.parse(await manifestResponse.text());
  assert.equal(manifest.lang, 'pt-BR');
  assert.equal(manifest.theme_color, '#ec4899');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));

  for (const icon of ['/favicon-32x32.png','/apple-touch-icon.png','/icon-192.png','/icon-512.png']) {
    const response = await fetch(`${base}${icon}`);
    assert.equal(response.status, 200, `${icon} returns 200`);
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    for (const route of indexableRoutes) {
      await page.goto(`${base}${route === '/' ? '/' : route}`, { waitUntil: 'networkidle' });
      const canonical = `${canonicalBase}${route === '/' ? '/' : route}`;
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonical);
      assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /^index,follow/);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="pt-BR"]').getAttribute('href'), canonical);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), canonical);
      const jsonLd = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent());
      assert.ok(graphTypes(jsonLd).has('Organization'));
      assert.ok(graphTypes(jsonLd).has('WebPage'));
    }

    await page.goto(`${base}/politica-de-privacidade`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /^noindex,follow/);

    await page.goto(`${base}/pagina-inexistente`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow');
    assert.equal(await page.locator('script[data-seo-jsonld]').count(), 0);
  } finally {
    await browser.close();
  }

  if (/^https:\/\//.test(base)) {
    for (const route of Object.keys(staticFiles)) {
      const response = await fetch(`${base}${route === '/' ? '/' : route}`);
      assert.equal(response.status, 200, `Production raw HTML returns 200 for ${route}`);
      const html = await response.text();
      const staticMeta = readStaticMeta(staticFiles[route]);
      assert.ok(html.includes(`<title>${staticMeta.title}</title>`), `Production raw HTML has route title for ${route}`);
      assert.ok(html.includes(`href="${staticMeta.canonical}"`), `Production raw HTML has route canonical for ${route}`);
    }

    for (const route of ['/politica-de-privacidade','/termos-de-uso']) {
      const response = await fetch(`${base}${route}`);
      assert.match(response.headers.get('x-robots-tag') || '', /noindex/i, `${route} sends X-Robots-Tag noindex`);
    }
  }

  console.log('Technical SEO: static metadata, schema, sitemap, robots, manifest, icons and route controls passed.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
