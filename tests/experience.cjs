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

    const whatsappFloat = page.locator('.whatsapp-float');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(180);
    const floatAtTop = await whatsappFloat.evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      visibility: getComputedStyle(element).visibility,
      pointerEvents: getComputedStyle(element).pointerEvents,
    }));
    assert.equal(floatAtTop.opacity, 0, 'Floating WhatsApp stays hidden in the hero');
    assert.equal(floatAtTop.visibility, 'hidden', 'Floating WhatsApp is not focusable while hidden');
    const heroPosition = await documentPosition(page.locator('.experience-hero'));
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), heroPosition.y + heroPosition.height + 60);
    await page.waitForTimeout(480);
    const floatAfterHero = await whatsappFloat.evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      visibility: getComputedStyle(element).visibility,
      pointerEvents: getComputedStyle(element).pointerEvents,
      href: element.getAttribute('href'),
    }));
    assert.ok(floatAfterHero.opacity > .95, 'Floating WhatsApp appears after the hero');
    assert.equal(floatAfterHero.visibility, 'visible', 'Floating WhatsApp becomes visible after the hero');
    assert.equal(floatAfterHero.pointerEvents, 'auto', 'Floating WhatsApp becomes interactive');
    assert.match(floatAfterHero.href || '', /^https:\/\/wa\.me\//, 'Floating WhatsApp points to WhatsApp');
    const thesis = page.locator('.project-thesis');
    const thesisY = (await documentPosition(thesis)).y;
    const thesisTrigger = Math.max(0, thesisY - 844 * .86);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 120), behavior: 'instant' }), thesisTrigger);
    await page.waitForTimeout(180);
    const thesisBefore = await page.locator('.project-thesis-word').first().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    const thesisLineBefore = Number(await page.locator('.project-thesis-end').evaluate(element => getComputedStyle(element).getPropertyValue('--thesis-line')));
    assert.ok(thesisBefore.opacity < .3 && thesisBefore.filter.includes('blur'), 'Portfolio thesis starts blurred before reveal');
    assert.ok(thesisLineBefore < .05, 'Portfolio thesis accent starts hidden');
    await page.evaluate(y => window.scrollTo({ top: y + 80, behavior: 'instant' }), thesisTrigger);
    await page.waitForTimeout(1450);
    const thesisAfter = await page.locator('.project-thesis-word').last().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    const thesisLineAfter = Number(await page.locator('.project-thesis-end').evaluate(element => getComputedStyle(element).getPropertyValue('--thesis-line')));
    assert.ok(thesisAfter.opacity > .99 && thesisAfter.filter === 'blur(0px)', 'Portfolio thesis finishes fully sharp');
    assert.ok(thesisLineAfter > .95, 'Portfolio thesis accent completes after the reveal');

    const bridgeReveal = page.locator('.copy-bridge-reveal');
    const bridgeY = (await documentPosition(bridgeReveal)).y;
    const bridgeTrigger = Math.max(0, bridgeY - 844 * .88);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 110), behavior: 'instant' }), bridgeTrigger);
    await page.waitForTimeout(160);
    const bridgeBefore = await page.locator('.copy-bridge-word').first().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    assert.ok(bridgeBefore.opacity < .3 && bridgeBefore.filter.includes('blur'), 'Copy bridge starts blurred before reveal');
    await page.evaluate(y => window.scrollTo({ top: y + 70, behavior: 'instant' }), bridgeTrigger);
    await page.waitForTimeout(1450);
    const bridgeAfter = await page.locator('.copy-bridge-word').last().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    assert.ok(bridgeAfter.opacity > .99 && bridgeAfter.filter === 'blur(0px)', 'Copy bridge finishes fully sharp');

    await page.locator('.showcase-image').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    assert.notEqual(await page.locator('.showcase-image img').evaluate(element => element.style.transform), '', 'Mobile project parallax');
    const serviceIntro = page.locator('[data-service-intro]');
    const introY = (await documentPosition(serviceIntro)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - innerHeight * .88), behavior: 'instant' }), introY);
    await page.waitForTimeout(350);
    const introStart = await page.locator('.service-title-line').first().evaluate(element => getComputedStyle(element).transform);
    await page.evaluate(y => window.scrollTo({ top: y + 360, behavior: 'instant' }), Math.max(0, introY - 844 * .88));
    await page.waitForTimeout(550);
    const introAfter = await page.locator('.service-title-line').first().evaluate(element => getComputedStyle(element).transform);
    assert.notEqual(introStart, introAfter, 'Mobile services title reacts to scroll');
    assert.ok(Number(await serviceIntro.evaluate(element => getComputedStyle(element).getPropertyValue('--service-accent'))) > .15, 'Mobile services accent line progresses with scroll');

    const serviceVisual = page.locator('#servico-web .service-visual');
    const visualY = (await documentPosition(serviceVisual)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - innerHeight * .68), behavior: 'instant' }), visualY);
    await page.waitForTimeout(550);
    assert.notEqual(await page.locator('#servico-web .mini-browser').evaluate(element => element.style.transform), '', 'Mobile service motion');
    assert.notEqual(await serviceVisual.evaluate(element => getComputedStyle(element).transform), 'none', 'Mobile service frame motion');
    assert.notEqual(await serviceVisual.locator('.service-scan-line').evaluate(element => getComputedStyle(element).transform), 'none', 'Mobile service scan follows scroll');

    const contactPosition = await documentPosition(page.locator('.studio-contact'));
    await page.evaluate(y => window.scrollTo({ top: y + 80, behavior: 'instant' }), contactPosition.y);
    await page.waitForTimeout(420);
    assert.equal(await whatsappFloat.evaluate(element => getComputedStyle(element).visibility), 'hidden', 'Floating WhatsApp hides over the contact section');

    const results = [];
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(180);
    assert.equal(await page.locator('.project-thesis-word').first().evaluate(element => element.style.transform), '', 'Reduced motion removes thesis transforms');
    assert.equal(Number(await page.locator('.project-thesis-end').evaluate(element => getComputedStyle(element).getPropertyValue('--thesis-line'))), 1, 'Reduced motion keeps thesis accent visible');
    assert.equal(await page.locator('.copy-bridge-word').first().evaluate(element => element.style.transform), '', 'Reduced motion removes copy bridge transforms');
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
    const desktopHeroVideo = await page.locator('.brand-sculpture-video').boundingBox();
    assert.ok(desktopHeroVideo && desktopHeroVideo.width >= 680, 'Desktop hero video has cinematic scale');
    assert.ok(desktopHeroVideo && desktopHeroVideo.x < 1440 * .55, 'Desktop hero video stays inside the right composition instead of drifting to the edge');
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

    const desktopServiceIntro = page.locator('[data-service-intro]');
    const desktopIntroY = (await documentPosition(desktopServiceIntro)).y;
    const desktopIntroStartY = Math.max(0, desktopIntroY - 900 * .82);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 100), behavior: 'instant' }), desktopIntroStartY);
    await page.waitForTimeout(260);
    const desktopIntroBefore = await page.locator('.service-title-line').first().evaluate(element => getComputedStyle(element).transform);
    await page.evaluate(y => window.scrollTo({ top: y + 430, behavior: 'instant' }), desktopIntroStartY);
    await page.waitForTimeout(620);
    const desktopIntroAfter = await page.locator('.service-title-line').first().evaluate(element => getComputedStyle(element).transform);
    assert.notEqual(desktopIntroBefore, desktopIntroAfter, 'Desktop services title reacts to scroll');
    assert.ok(Number(await desktopServiceIntro.evaluate(element => getComputedStyle(element).getPropertyValue('--service-accent'))) > .25, 'Desktop service accent progresses with scroll');

    const desktopServiceVisual = page.locator('#servico-web .service-visual');
    const desktopVisualY = (await documentPosition(desktopServiceVisual)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 900 * .66), behavior: 'instant' }), desktopVisualY);
    await page.waitForTimeout(620);
    assert.notEqual(await desktopServiceVisual.evaluate(element => getComputedStyle(element).transform), 'none', 'Desktop service frame has scroll choreography');
    assert.notEqual(await page.locator('#servico-web .mini-browser').evaluate(element => element.style.transform), '', 'Desktop service visual internals animate');
    assert.notEqual(await desktopServiceVisual.locator('.service-scan-line').evaluate(element => getComputedStyle(element).transform), 'none', 'Desktop service scan follows scroll');

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
