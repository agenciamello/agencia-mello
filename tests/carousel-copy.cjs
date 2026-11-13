const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const output = process.env.CAROUSEL_ARTIFACTS || 'artifacts/carousel-copy';

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no horizontal page overflow`);
}

async function stageInView(page) {
  const stage = page.locator('.event-stage');
  await stage.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur());
  return stage;
}

async function stableScroll(stage, label) {
  const before = await stage.evaluate(element => element.scrollLeft);
  await stage.page().waitForTimeout(450);
  const after = await stage.evaluate(element => element.scrollLeft);
  assert.ok(Math.abs(after - before) < 1.5, `${label}: carousel remains still (${before} → ${after})`);
}

async function backgroundState(page, hidden) {
  // Simulate the browser's visibility notification without navigating away or destroying state.
  await page.evaluate(value => {
    for (const [key, next] of [['hidden', value], ['visibilityState', value ? 'hidden' : 'visible']]) {
      Object.defineProperty(document, key, { configurable: true, value: next });
    }
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}

async function tapSwipe(page, cdp, horizontal) {
  const box = await page.locator('.event-stage').boundingBox();
  const x = Math.round(box.x + box.width * .76);
  const y = Math.round(Math.max(140, Math.min(570, box.y + box.height * .48)));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 10; step++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
      x: horizontal ? x - Math.round(180 * step / 10) : x,
      y: horizontal ? y : y - Math.round(230 * step / 10),
    }] });
    await page.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  const evidence = [];
  try {
    for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 740]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      await expect(page.locator('#site-chapter-heading')).toHaveAccessibleName('Apresente seus serviços. Facilite o pedido de orçamento com um site próprio!');
      await expect(page.locator('#servico-web .solution-chapter-heading > p')).toHaveText('Seu negócio aparecendo nas pesquisas com um site próprio, informações claras, versão para celular e WhatsApp em destaque.');
      await expect(page.locator('.social-service-details .micro').first()).toHaveText('Artes para o dia a dia da sua marca nas redes sociais');
      await expect(page.locator('#brand-chapter-heading')).toHaveAccessibleName('Tenha Uma marca que seu cliente reconhece.');

      for (const [name, intent] of [['Quero minha prévia grátis', /297|prévia/i], ['Pedir artes para minhas redes', /artes para redes sociais/i]]) {
        const cta = page.getByRole('link', { name, exact: true });
        const href = new URL(await cta.getAttribute('href'));
        assert.equal(href.origin, 'https://wa.me');
        assert.equal(href.pathname, '/5521971859948');
        assert.match(href.searchParams.get('text'), intent);
        const appearance = await cta.evaluate(element => {
          const style = getComputedStyle(element);
          const channels = value => value.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => {
            const c = channel / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
          });
          const luminance = value => channels(value).reduce((sum, c, index) => sum + c * [.2126, .7152, .0722][index], 0);
          const a = luminance(style.color), b = luminance(style.backgroundColor);
          return { background: style.backgroundColor, height: element.getBoundingClientRect().height, contrast: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
        });
        assert.ok(appearance.height >= 48 && appearance.contrast >= 4.5, `${name}: prominent, readable touch target ${JSON.stringify(appearance)}`);
      }

      const stage = await stageInView(page);
      await expect(stage.locator('.event-open')).toHaveCount(6);
      await expect(page.locator('.event-stage-carousel')).toHaveCount(0);
      for (const button of await stage.locator('.event-open').all()) {
        await button.focus();
        const expectedSrc = await button.locator('img').getAttribute('src');
        await button.press('Enter');
        await expect(page.getByRole('dialog')).toBeVisible();
        const image = page.locator('.event-artwork-expanded img');
        await image.evaluate(element => element.decode());
        await expect(image).toHaveAttribute('src', expectedSrc);
        await page.keyboard.press('Escape');
        await expect(button).toBeFocused();
      }
      await noOverflow(page, `Reduced gallery at ${width}`);
      const axe = await new AxeBuilder({ page }).include('#eventos').analyze();
      assert.deepEqual(axe.violations.map(item => item.id), [], `Event controls/gallery accessibility at ${width}`);
      await stage.screenshot({ path: `${output}/reduced-gallery-${width}.png` });
      evidence.push({ width, reduced: 'six full artworks; keyboard/modal/focus; CTA contrast and messages', errors: [] });
      await context.close();
    }

    for (const [width, height] of [[1440, 900], [390, 844], [320, 740]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      const stage = page.locator('.event-stage');
      await page.getByRole('link', { name: 'Ver todas as artes', exact: true }).click();
      await expect(page.locator('#eventos-galeria')).toBeInViewport();
      await expect.poll(() => page.locator('.event-gallery-controls').evaluate(element => {
        const rect = element.getBoundingClientRect();
        const header = document.querySelector('.studio-header').getBoundingClientRect();
        return rect.top >= header.bottom + 1 && rect.bottom <= innerHeight;
      }), { message: 'The tunnel shortcut exposes every gallery control below the fixed header' }).toBe(true);
      await page.mouse.move(0, 0);
      await expect(stage).toHaveClass(/event-stage-carousel/);
      await expect(stage.locator('.event-open')).toHaveCount(6);
      await expect(stage).toHaveAttribute('data-playing', 'true');
      await stage.evaluate(element => { element.scrollLeft = 0; });
      await expect(stage).toHaveAttribute('data-playing', 'true');
      const before = await stage.evaluate(element => element.scrollLeft);
      await page.waitForTimeout(1250);
      const after = await stage.evaluate(element => element.scrollLeft);
      assert.ok(after - before > 8 && after - before < 90, `Slow native autoplay at ${width}: ${after - before}px`);

      await page.getByRole('button', { name: 'Pausar carrossel', exact: true }).click();
      await expect(stage).toHaveAttribute('data-playing', 'false');
      await stableScroll(stage, 'Explicit pause');
      await page.locator('h1').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await stageInView(page);
      await expect(stage).toHaveAttribute('data-playing', 'false');
      await stableScroll(stage, 'Manual pause survives leaving and returning');

      await page.getByRole('button', { name: 'Próxima arte', exact: true }).click();
      await expect.poll(() => stage.evaluate(element => element.scrollLeft)).toBeGreaterThan(after + 40);
      const next = await stage.evaluate(element => element.scrollLeft);
      await page.getByRole('button', { name: 'Arte anterior', exact: true }).click();
      await expect.poll(() => stage.evaluate(element => element.scrollLeft)).toBeLessThan(next - 40);

      // Focusing a card must bring its controls into the scroller and stop autoplay.
      const last = stage.locator('.event-open').last();
      await last.focus();
      await expect(stage).toHaveAttribute('data-playing', 'false');
      const visible = await last.evaluate(element => {
        const frame = element.closest('.event-stage').getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        return rect.left >= frame.left - 2 && rect.right <= frame.right + 2;
      });
      assert.ok(visible, 'Keyboard-focused artwork is not clipped out of the horizontal viewport');
      await stableScroll(stage, 'Focus pause');

      await page.getByRole('button', { name: 'Reproduzir carrossel', exact: true }).click();
      await page.mouse.move(0, 0); await page.evaluate(() => document.activeElement?.blur());
      await expect(stage).toHaveAttribute('data-playing', 'true');
      await backgroundState(page, true);
      await expect(stage).toHaveAttribute('data-playing', 'false');
      await stableScroll(stage, 'Background visibility notification');
      await backgroundState(page, false);
      await expect(stage).toHaveAttribute('data-playing', 'true');

      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect(stage).toHaveAttribute('data-playing', 'false');
      await stableScroll(stage, 'Outside viewport');
      await stageInView(page);
      await expect(stage).toHaveAttribute('data-playing', 'true');
      const box = await stage.boundingBox();
      await page.mouse.move(box.x + 40, box.y + 100);
      await expect(stage).toHaveAttribute('data-playing', 'false');
      await stableScroll(stage, 'Hover');
      await page.mouse.move(0, 0);

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(stage).not.toHaveClass(/event-stage-carousel/);
      await expect(stage.locator('.event-open')).toHaveCount(6);
      await stableScroll(stage, 'Dynamic reduced motion');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(stage).toHaveClass(/event-stage-carousel/);
      await noOverflow(page, `Animated carousel at ${width}`);
      await page.screenshot({ path: `${output}/carousel-${width}.png` });
      evidence.push({ width, height, shortcut: 'all gallery controls visible below header; root anchor focus permits autoplay', normal: 'slow autoplay; manual/hover/focus/offscreen/background pauses; controls; live reduced motion' });
      await page.close();
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const touch = await context.newPage();
    const cdp = await context.newCDPSession(touch);
    touch.on('pageerror', error => errors.push(error.message));
    await touch.goto(base, { waitUntil: 'networkidle' });
    const stage = await stageInView(touch);
    await stage.evaluate(element => { element.scrollLeft = 0; });
    await tapSwipe(touch, cdp, true);
    await expect.poll(() => stage.evaluate(element => element.scrollLeft)).toBeGreaterThan(60);
    await expect(stage).toHaveAttribute('data-playing', 'false');
    const top = await touch.evaluate(() => scrollY);
    await tapSwipe(touch, cdp, false);
    await expect.poll(() => touch.evaluate(() => scrollY)).toBeGreaterThan(top + 50);
    await noOverflow(touch, 'Native touch gestures');
    evidence.push({ width: 390, touch: 'native horizontal swipe, free vertical scrolling, interaction pauses autoplay' });
    await context.close();

    assert.deepEqual(errors, [], 'No page errors in exercised flows');
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ base, evidence, errors, limits: 'Chrome/responsive and touch emulation; hidden-tab notification simulated; no physical-device or Safari acceptance.' }, null, 2));
    console.log('Carousel/copy: exact copy, prominent CTAs, six artworks, motion controls, native touch, keyboard/modal/focus, live reduced motion and no overflow passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
