const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.SITE_URL || 'http://127.0.0.1:3000';
const viewports = [1440, 1024, 768, 390, 360, 320];
const routes = ['/', '/projetos/bellavista', '/projetos/solace', '/site-essencial', '/politica-de-privacidade', '/termos-de-uso', '/pagina-inexistente'];

async function loadPage(page, route = '/') {
  await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  await page.locator('h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
}

async function documentPosition(locator) {
  return locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height };
  });
}

async function expectStableWhileScrolling(page, selectors, description) {
  const before = await Promise.all(selectors.map(selector => documentPosition(page.locator(selector))));
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'instant' }));
  await page.waitForTimeout(700);
  for (const [index, selector] of selectors.entries()) {
    const after = await documentPosition(page.locator(selector));
    for (const dimension of ['x', 'y', 'width', 'height']) {
      assert.ok(Math.abs(after[dimension] - before[index][dimension]) < 1,
        `${description}: ${selector} changed ${dimension} during scroll (${before[index][dimension]} → ${after[dimension]})`);
    }
  }
}

async function expectTransformMotion(page, selector, description) {
  const locator = page.locator(selector);
  const before = await locator.evaluate(element => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const after = await locator.evaluate(element => getComputedStyle(element).transform);
  assert.notEqual(after, 'none', `${description}: transform was not initialized`);
  assert.notEqual(after, before, `${description}: transform did not react to scroll`);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    // Mobile keeps the reading layer stable, while project and service visuals get restrained motion.
    await page.setViewportSize({ width: 390, height: 844 });
    await loadPage(page);
    await page.waitForTimeout(1100);
    await expectStableWhileScrolling(page, ['.hero-message', '.hero-actions'], 'Mobile hero');
    await page.locator('.showcase-image').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    assert.notEqual(await page.locator('.showcase-image img').evaluate(element => element.style.transform), '', 'Mobile project parallax');
    await page.locator('#servico-web .service-visual').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    assert.notEqual(await page.locator('#servico-web .mini-browser').evaluate(element => element.style.transform), '', 'Mobile service motion');

    const results = [];
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await loadPage(page, route);
        await page.locator('img').evaluateAll(async images => Promise.all(images.map(image => {
          image.loading = 'eager';
          return image.decode().catch(() => {});
        })));
        const state = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.src),
          headings: document.querySelectorAll('h1').length,
        }));
        assert.equal(state.overflow, false, `Overflow at ${width} ${route}`);
        assert.deepEqual(state.broken, [], `Images at ${route}`);
        assert.equal(state.headings, 1, `Heading at ${route}`);
        results.push({ width, route, ...state });
      }
    }

    await loadPage(page, '/#%');
    assert.match(await page.locator('h1').innerText(), /Seu negócio/);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    const menu = page.locator('.menu-toggle');
    await menu.focus();
    await menu.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');

    await loadPage(page, '/#projetos');
    await menu.click();
    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('link', { name: 'Ver o estudo Bellavista', exact: true }).click();
    await page.waitForURL('**/projetos/bellavista');
    await page.getByRole('link', { name: '← Todos os projetos' }).click();
    await page.waitForURL('**/#projetos');
    await page.getByRole('link', { name: 'Conheça o Site Essencial' }).click();
    await page.waitForURL('**/site-essencial');
    await page.locator('summary').first().press('Enter');
    await expect(page.locator('details').first()).toHaveAttribute('open', '');
    const whats = await page.locator('a[href*="wa.me"]').evaluateAll(links => links.map(link => link.href));
    assert.ok(whats.length > 0);
    whats.forEach(href => {
      const url = new URL(href);
      assert.equal(url.pathname, '/5521971859948');
      assert.ok(url.searchParams.get('text'));
    });

    const accessibility = [];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/site-essencial', '/projetos/bellavista']) {
        await loadPage(page, route);
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        accessibility.push({ width, route, violations: scan.violations.map(violation => ({
          id: violation.id, impact: violation.impact,
          nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
        })) });
      }
    }

    // Desktop has restrained parallax and scroll choreography, while content remains fully legible.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await loadPage(page);
    await page.waitForTimeout(1000);
    await expectTransformMotion(page, '.hero-art-plane', 'Desktop hero symbol');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expectTransformMotion(page, '.hero-message', 'Desktop hero copy');
    await page.locator('.scroll-story-title').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    const lines = await page.locator('.scroll-story-title > span').evaluateAll(elements => elements.map(element => {
      const style = getComputedStyle(element);
      return { opacity: Number(style.opacity), filter: style.filter, visibility: style.visibility };
    }));
    assert.ok(lines.length > 0);
    lines.forEach(line => {
      assert.ok(line.opacity >= .55, 'Portfolio title remains legible during motion');
      assert.equal(line.filter, 'none', 'Portfolio title is never blurred');
      assert.equal(line.visibility, 'visible');
    });
    await page.locator('.capability-ribbon').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.capability-ribbon').getAttribute('data-playing'), 'true', 'Ribbon plays only while visible');
    await page.locator('#servico-marca').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(page.locator('[data-service-nav="1"]')).toHaveAttribute('aria-current', 'true');

    // Preference changes clean up running motion without a reload.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(200);
    await expectStableWhileScrolling(page, ['.hero-art-plane', '.hero-message', '.hero-actions'], 'Reduced motion');
    assert.equal(await page.locator('.hero-art-plane').evaluate(element => element.style.transform), '', 'Reduced motion cleanup');
    if (await page.locator('.ribbon-track').count()) {
      assert.equal(await page.locator('.ribbon-track').evaluate(element => getComputedStyle(element).animationName), 'none');
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.getByRole('link', { name: 'Ver o estudo Solace' }).click();
    await page.waitForURL('**/projetos/solace');
    await page.getByRole('link', { name: '← Todos os projetos' }).click();
    await page.waitForURL('**/#projetos');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1000);
    const resizedHero = ['.hero-message', '.hero-actions'];
    if (await page.locator('.hero-art-plane').isVisible()) resizedHero.push('.hero-art-plane');
    await expectStableWhileScrolling(page, resizedHero, 'Resize to mobile');

    assert.deepEqual(errors, []);
    const report = { results, accessibility, errors, motion: 'passed', interactions: 'passed' };
    fs.mkdirSync('artifacts', { recursive: true });
    fs.writeFileSync('artifacts/experience-verification.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ viewports: viewports.length, routes: routes.length, interactions: 'passed', motion: 'passed', errors, accessibility }, null, 2));
    assert.equal(accessibility.reduce((count, result) => count + result.violations.length, 0), 0, 'Accessibility violations');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
