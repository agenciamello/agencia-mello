const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const output = process.env.SULSIGN_ARTIFACT_DIR || 'artifacts/sulsign/qa';
const canonical = 'https://www.agenciamello.site/projetos/sulsign';
const viewports = [[1440, 900], [768, 1024], [390, 844], [320, 740]];

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no horizontal overflow`);
}

async function wholeImages(scope, label) {
  const images = scope.locator('img[src*="/assets/sulsign/"]');
  assert.ok(await images.count() > 0, `${label}: SulSign artwork exists`);
  let checked = 0;
  for (const image of await images.all()) {
    if (!await image.isVisible()) continue;
    checked++;
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    const rendered = await image.evaluate(element => {
      const style = getComputedStyle(element);
      return {
        loaded: element.complete && element.naturalWidth > 0,
        fit: style.objectFit,
        ratio: element.clientWidth / element.clientHeight,
        naturalRatio: element.naturalWidth / element.naturalHeight,
        alt: element.alt,
      };
    });
    assert.ok(rendered.loaded && rendered.alt.trim(), `${label}: artwork loads and has descriptive alternative text`);
    assert.ok(rendered.fit === 'contain' || Math.abs(rendered.ratio - rendered.naturalRatio) < .025,
      `${label}: artwork keeps its full proportions (${JSON.stringify(rendered)})`);
  }
  assert.ok(checked > 0, `${label}: at least one complete artwork is displayed`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const evidence = [];
  const errors = [];
  try {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

      await page.goto(`${base}/`, { waitUntil: 'networkidle' });
      const brand = page.locator('#servico-marca');
      const social = page.locator('.social-service-details');
      const brandLink = brand.locator('a[href="/projetos/sulsign"]').first();
      const socialLink = social.locator('a[href="/projetos/sulsign"]').first();
      await expect(brandLink).toHaveCount(1);
      await expect(socialLink).toHaveCount(1);
      await expect(brand).toContainText('SulSign');
      await expect(brand).toContainText('Solace');
      const solaceLink = brand.getByRole('link', { name: 'Ver o estudo Solace', exact: true });
      await expect(solaceLink).toHaveAttribute('href', '/projetos/solace');
      assert.ok(await brandLink.evaluate((element) => Boolean(element.compareDocumentPosition(document.querySelector('#servico-marca a[href="/projetos/solace"]')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'Client project precedes the authorial study');
      await wholeImages(social, `Home social at ${width}`);
      await wholeImages(brand, `Home brand at ${width}`);
      await noOverflow(page, `Home at ${width}`);
      await brand.screenshot({ path: path.join(output, `home-brand-${width}.png`) });
      await social.screenshot({ path: path.join(output, `home-social-${width}.png`) });

      // Open through the real link by keyboard; metadata must change in the same document.
      await page.evaluate(() => { window.__sulsignNavigation = 'same-document'; });
      await brandLink.focus();
      await brandLink.press('Enter');
      await expect(page).toHaveURL(`${base}/projetos/sulsign`);
      await expect(page.locator('main h1')).toHaveText(/^SulSign\.?$/);
      assert.equal(await page.evaluate(() => window.__sulsignNavigation), 'same-document', 'Client project uses SPA navigation');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      await expect(page).toHaveTitle(/SulSign.*Mello/);
      const graph = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent())['@graph'];
      assert.ok(graph.some(item => item['@type'] === 'CreativeWork' && item.name === 'SulSign'), 'Project schema identifies the client work');
      assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'), 'Project schema includes navigation context');

      const manual = page.locator('.sulsign-manual-details');
      assert.ok(await manual.count() === 1, 'Manual excerpts are available on demand');
      const summary = manual.locator('summary');
      await summary.focus();
      await summary.press('Enter');
      await expect(manual).toHaveAttribute('open', '');
      await expect(summary).toBeFocused();
      await wholeImages(page.locator('main'), `Project at ${width}`);
      await noOverflow(page, `Project at ${width}`);
      const accessibility = await new AxeBuilder({ page }).include('.sulsign-project').analyze();
      assert.deepEqual(accessibility.violations.map(item => item.id), [], `Project accessibility checks at ${width}`);
      await page.locator('main h1').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `project-${width}.png`) });

      const pdfLink = page.locator('main a[href$=".pdf"]').first();
      const pdfHref = await pdfLink.getAttribute('href');
      assert.ok(pdfHref, 'Manual PDF is linked');
      const pdf = await context.request.get(new URL(pdfHref, base).href);
      assert.equal(pdf.status(), 200, 'Manual PDF responds successfully');
      assert.equal((await pdf.body()).subarray(0, 5).toString(), '%PDF-', 'Manual link serves a PDF rather than the SPA fallback');

      // The route must also survive a fresh load and a trailing slash.
      await page.goto(`${base}/projetos/sulsign/`, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toHaveText(/^SulSign\.?$/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      const contactLinks = page.locator('main a[href^="https://wa.me/"]');
      assert.ok(await contactLinks.count() >= 1, 'The client project offers an actual contact action');
      assert.ok((await contactLinks.evaluateAll(elements => elements.map(element => decodeURIComponent(element.href)))).some(href => /identidade|redes|artes/i.test(href)), 'Contact carries a relevant service intention');
      await noOverflow(page, `Direct project at ${width}`);
      evidence.push({ width, height, navigation: 'keyboard + direct + trailing slash', images: 'decoded with full proportions', manual: 'keyboard disclosure + PDF response', reducedMotion: 'readable' });
      await context.close();
    }

    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.locator('#servico-marca').scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(async () => page.locator('#servico-marca [data-editorial-reveal]').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) >= .99))).toBe(true);
    await noOverflow(page, 'Dynamic reduced-motion preference');
    await page.close();

    const sitemap = await fetch(`${base}/sitemap.xml`);
    assert.equal(sitemap.status, 200, 'Sitemap responds successfully');
    assert.ok((await sitemap.text()).includes(`<loc>${canonical}</loc>`), 'Sitemap includes the client project');
    assert.deepEqual(errors, [], 'No application or console errors on the exercised flow');
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ base, evidence, errors, limits: 'Chrome desktop and responsive emulation; no physical-device or Safari acceptance.' }, null, 2));
    console.log('SulSign: four widths, keyboard/SPA/direct navigation, full artwork proportions, manual/PDF, SEO, reduced motion, contact and overflow passed.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
