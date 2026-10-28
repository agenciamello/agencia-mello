const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.SITE_URL || 'http://127.0.0.1:3000';
const viewports = [1440, 1024, 768, 390, 360, 320];
const routes = ['/', '/projetos/animalis-pet', '/projetos/viana-planejados', '/projetos/durio-planejados', '/projetos/bellavista', '/projetos/solace', '/site-essencial', '/criacao-de-sites-nova-iguacu', '/criacao-de-sites-belford-roxo', '/criacao-de-sites-duque-de-caxias', '/politica-de-privacidade', '/termos-de-uso', '/pagina-inexistente'];

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
    await thesis.scrollIntoViewIfNeeded();
    await expect(thesis).toHaveAttribute('data-reveal-state','complete');
    await expect(thesis).toHaveAccessibleName('Serviços, localização e contato no mesmo lugar.');
    assert.ok(await thesis.locator('[data-text-segment]').evaluateAll(elements=>elements.every(el=>Number(getComputedStyle(el).opacity)>.99)), 'Portfolio thesis finishes fully readable');
    assert.equal(Number(await thesis.evaluate(el=>getComputedStyle(el).getPropertyValue('--thesis-line'))),1,'Portfolio thesis accent completes');

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
    // Capítulos substituem a antiga seção repetida de serviços.
    for (const [index,id] of ['servico-web','servico-conteudo','servico-marca'].entries()) {
      await page.locator('.home-service-links a').nth(index).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id} .solution-chapter-heading h3`)).toBeInViewport();
    }
    await loadPage(page);
    await page.waitForTimeout(1000);
    const aboutSection = page.locator('[data-about-cinematic]');
    const aboutPosition = await documentPosition(aboutSection);
    const aboutStart = Math.max(0, aboutPosition.y - 844 * .90);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 100), behavior: 'instant' }), aboutStart);
    await page.waitForTimeout(180);
    assert.ok((await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Mobile portrait waits before cinematic reveal');
    await page.evaluate(y => window.scrollTo({ top: y + 70, behavior: 'instant' }), aboutStart);
    await page.waitForTimeout(1050);
    assert.ok(!(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Mobile portrait opens as section enters');
    assert.ok(Number(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).opacity)) > .99, 'Mobile portrait finishes visible');

    const aboutTitle = page.locator('.about-title');
    const aboutTitleY = (await documentPosition(aboutTitle)).y;
    const aboutTitleTrigger = Math.max(0, aboutTitleY - 844 * .88);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 90), behavior: 'instant' }), aboutTitleTrigger);
    await page.waitForTimeout(160);
    const aboutTitleBefore = await page.locator('.about-title-line').first().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    assert.ok(aboutTitleBefore.opacity < .2 && aboutTitleBefore.filter.includes('blur'), 'Mobile about title starts soft');
    await page.evaluate(y => window.scrollTo({ top: y + 70, behavior: 'instant' }), aboutTitleTrigger);
    await page.waitForTimeout(1250);
    assert.ok(await page.locator('.about-title-line').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) > .99 && getComputedStyle(element).filter === 'blur(0px)')), 'Mobile about title resolves in three beats');
    assert.ok(Number(await page.locator('.about-title-dot').evaluate(element => getComputedStyle(element).opacity)) > .99, 'Mobile Mello dot pops in');

    const firstAboutCopy = page.locator('[data-about-copy]').first();
    const aboutCopyY = (await documentPosition(firstAboutCopy)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 844 * .86), behavior: 'instant' }), aboutCopyY);
    await page.waitForTimeout(1150);
    assert.ok(await page.locator('[data-about-copy]').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) > .99)), 'Mobile about copy cascades into view');

    const aboutCta = page.locator('.about-cta');
    const aboutCtaY = (await documentPosition(aboutCta)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 844 * .86), behavior: 'instant' }), aboutCtaY);
    await page.waitForTimeout(850);
    assert.ok(Number(await aboutCta.evaluate(element => getComputedStyle(element).getPropertyValue('--about-cta-line'))) > .95, 'Mobile about CTA finishes with pink accent');
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 844 * .72), behavior: 'instant' }), aboutPosition.y);
    await page.waitForTimeout(260);
    assert.ok(Number(await page.locator('.about-title-line').last().evaluate(element => getComputedStyle(element).opacity)) > .99, 'Mobile about reveal stays settled when scrolling back');
    assert.ok(!(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Mobile portrait stays revealed when scrolling back');

    const processDetails=page.locator('#processo');
    await processDetails.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(processDetails).toHaveAttribute('open','');
    await expect(processDetails.locator('ol li')).toHaveCount(4);
    await expect(processDetails.locator('ol')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(processDetails).not.toHaveAttribute('open','');
    const contactPosition = await documentPosition(page.locator('.studio-contact'));
    await page.evaluate(y => window.scrollTo({ top: y + 80, behavior: 'instant' }), contactPosition.y);
    await page.waitForTimeout(420);
    assert.equal(await whatsappFloat.evaluate(element => getComputedStyle(element).visibility), 'hidden', 'Floating WhatsApp hides over the contact section');

    const results = [];
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(180);
    await expect(page.locator('.project-thesis')).toHaveAttribute('data-reveal-state','static');
    await expect(page.locator('.project-thesis [data-text-segment]')).toHaveCount(0);
    assert.equal(Number(await page.locator('.project-thesis').evaluate(element => getComputedStyle(element).getPropertyValue('--thesis-line'))), 1, 'Reduced motion keeps thesis accent visible');
    assert.equal(await page.locator('.copy-bridge-word').first().evaluate(element => element.style.transform), '', 'Reduced motion removes copy bridge transforms');
    assert.equal(await page.locator('.about-title-line').first().evaluate(element => element.style.transform), '', 'Reduced motion removes about title transforms');
    assert.equal(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath), 'none', 'Reduced motion keeps portrait fully revealed');
    assert.equal(Number(await page.locator('.about-cta').evaluate(element => getComputedStyle(element).getPropertyValue('--about-cta-line'))), 1, 'Reduced motion keeps about CTA accent visible');
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
    await expect(page.locator('h1')).toHaveAccessibleName('Sites e design para transformar interesse em VENDAS.');
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
    await page.locator('.conceptual-sites summary').click();
    await page.getByRole('link', { name: 'Ver o estudo Bellavista', exact: true }).click();
    await page.waitForURL('**/projetos/bellavista');
    await page.getByRole('link', { name: '← Todos os projetos' }).click();
    await page.waitForURL('**/#projetos');
    const essentialDetailsLink = page.locator('.package-details-link');
    await expect(essentialDetailsLink).toHaveAccessibleName(/Ver tudo que está incluído/);
    await essentialDetailsLink.click();
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
      for (const route of ['/', '/site-essencial', '/criacao-de-sites-nova-iguacu', '/criacao-de-sites-belford-roxo', '/criacao-de-sites-duque-de-caxias', '/projetos/animalis-pet', '/projetos/bellavista']) {
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
    await expect(page.locator('.scroll-story-title')).toHaveAttribute('data-reveal-state','complete');
    const words=await page.locator('.scroll-story-title [data-text-segment]').evaluateAll(elements=>elements.map(el=>({opacity:Number(getComputedStyle(el).opacity),filter:getComputedStyle(el).filter})));
    assert.ok(words.length>0 && words.every(word=>word.opacity>.99 && (word.filter==='none'||word.filter==='blur(0px)')),'Portfolio title ends crisp and fully readable');
    await page.locator('.capability-ribbon').scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.capability-ribbon').getAttribute('data-playing'), 'true', 'Ribbon plays only while visible');

    const socialVisual=page.locator('.social-service-details .service-visual');
    const socialY=(await documentPosition(socialVisual)).y;
    await page.evaluate(y=>window.scrollTo({top:Math.max(0,y-900*.7),behavior:'instant'}),socialY);
    await page.waitForTimeout(620);
    assert.notEqual(await socialVisual.locator('.sheet-one').evaluate(element=>element.style.transform),'','Desktop social artwork motion remains active');
    await page.locator('#servico-marca').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));
    await expect(page.locator('[data-service-nav="2"]')).toHaveAttribute('aria-current','true');
    // Isolar o estado inicial do retrato das verificações anteriores de rolagem.
    await loadPage(page);
    await page.waitForTimeout(1000);
    const desktopAbout = page.locator('[data-about-cinematic]');
    const desktopAboutPosition = await documentPosition(desktopAbout);
    const desktopAboutStart = Math.max(0, desktopAboutPosition.y - 900 * .82);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 100), behavior: 'instant' }), desktopAboutStart);
    await page.waitForTimeout(180);
    assert.ok((await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Desktop portrait waits before reveal');
    await page.evaluate(y => window.scrollTo({ top: y + 80, behavior: 'instant' }), desktopAboutStart);
    await page.waitForTimeout(1200);
    assert.ok(!(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Desktop portrait opens cinematically');
    assert.ok(Number(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).opacity)) > .99, 'Desktop portrait finishes visible');

    const desktopAboutTitle = page.locator('.about-title');
    const desktopAboutTitleY = (await documentPosition(desktopAboutTitle)).y;
    const desktopAboutTitleTrigger = Math.max(0, desktopAboutTitleY - 900 * .82);
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 90), behavior: 'instant' }), desktopAboutTitleTrigger);
    await page.waitForTimeout(160);
    const desktopAboutBefore = await page.locator('.about-title-line').first().evaluate(element => ({
      opacity: Number(getComputedStyle(element).opacity),
      filter: getComputedStyle(element).filter,
    }));
    assert.ok(desktopAboutBefore.opacity < .2 && desktopAboutBefore.filter.includes('blur'), 'Desktop about title starts soft');
    await page.evaluate(y => window.scrollTo({ top: y + 70, behavior: 'instant' }), desktopAboutTitleTrigger);
    await page.waitForTimeout(1350);
    assert.ok(await page.locator('.about-title-line').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) > .99 && getComputedStyle(element).filter === 'blur(0px)')), 'Desktop about title resolves in three beats');
    assert.ok(Number(await page.locator('.about-title-dot').evaluate(element => getComputedStyle(element).opacity)) > .99, 'Desktop Mello dot pops in');

    const desktopAboutCopy = page.locator('[data-about-copy]').first();
    const desktopAboutCopyY = (await documentPosition(desktopAboutCopy)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 900 * .82), behavior: 'instant' }), desktopAboutCopyY);
    await page.waitForTimeout(1200);
    assert.ok(await page.locator('[data-about-copy]').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) > .99)), 'Desktop about copy cascades into view');

    const desktopAboutCta = page.locator('.about-cta');
    const desktopAboutCtaY = (await documentPosition(desktopAboutCta)).y;
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 900 * .84), behavior: 'instant' }), desktopAboutCtaY);
    await page.waitForTimeout(850);
    assert.ok(Number(await desktopAboutCta.evaluate(element => getComputedStyle(element).getPropertyValue('--about-cta-line'))) > .95, 'Desktop about CTA finishes with pink accent');
    await page.evaluate(y => window.scrollTo({ top: Math.max(0, y - 900 * .70), behavior: 'instant' }), desktopAboutPosition.y);
    await page.waitForTimeout(260);
    assert.ok(Number(await page.locator('.about-title-line').last().evaluate(element => getComputedStyle(element).opacity)) > .99, 'Desktop about reveal stays settled when scrolling back');
    assert.ok(!(await page.locator('.portrait-window').evaluate(element => getComputedStyle(element).clipPath)).includes('100%'), 'Desktop portrait stays revealed when scrolling back');

    await page.locator('#processo summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#processo ol')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#processo')).not.toHaveAttribute('open','');

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
