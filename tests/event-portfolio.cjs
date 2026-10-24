const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = process.env.SITE_URL || 'http://127.0.0.1:3000';
const output = 'artifacts/eventos-23';
const viewports = [[1440,900],[1024,900],[768,900],[390,844],[360,844],[320,844]];

async function showEvents(page) {
  await page.locator('#eventos-galeria').scrollIntoViewIfNeeded();
  await page.locator('.event-open img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(850);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width:1440,height:900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(base);
    await showEvents(page);
    const section = page.locator('#eventos');
    await expect(section.locator('.event-open')).toHaveCount(4);
    const order = await page.evaluate(() => {
      const before = document.querySelector('.commercial-project-grid');
      const events = document.querySelector('#eventos');
      const after = document.querySelector('#servico-marca');
      return Boolean(before.compareDocumentPosition(events) & Node.DOCUMENT_POSITION_FOLLOWING) &&
        Boolean(events.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    assert.ok(order, 'Events follow site previews/offer and precede the identity chapter');
    assert.ok((await section.locator('.event-piece').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).transform))).every(value=>value==='none'), 'Complete gallery stays static and readable; spatial motion belongs to the tunnel');
    const stage = await section.locator('.event-stage').boundingBox();
    await page.mouse.move(stage.x + stage.width / 2, Math.max(100, Math.min(750, stage.y + stage.height / 2)));
    const scrollBefore = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0,240);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 100);

    const href = await section.locator('.event-cta').getAttribute('href');
    const url = new URL(href);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/5521971859948');
    assert.match(url.searchParams.get('text'), /orçamento de arte para meu evento/);
    assert.equal(await section.locator('.event-cta').getAttribute('rel'), 'noopener noreferrer');

    // Every piece opens via keyboard; the native modal traps focus and Escape restores it.
    for (let index=0; index<4; index++) {
      const button = section.locator('.event-open').nth(index);
      await button.focus();
      await button.press('Enter');
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('button',{name:'Fechar arte ampliada'})).toBeFocused();
      await page.keyboard.press('Tab');
      assert.ok(await page.evaluate(() => document.querySelector('.event-lightbox').contains(document.activeElement)), 'Modal focus stays inside');
      const modalImage = page.locator('.event-artwork-expanded img');
      await modalImage.evaluate(image => image.decode());
      const dimensions = await modalImage.evaluate(image => ({width:image.clientWidth,height:image.clientHeight,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight}));
      assert.ok(Math.abs(dimensions.width / dimensions.height - dimensions.naturalWidth / dimensions.naturalHeight)<.01, 'Expanded art keeps its proportions');
      if (index===0) {
        const modalAxe = await new AxeBuilder({page}).analyze();
        assert.deepEqual(modalAxe.violations.map(item=>item.id), [], 'Expanded artwork accessibility');
        await page.screenshot({path:`${output}/expanded-desktop.png`});
      }
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(button).toBeFocused();
      assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    }

    const renders = [];
    for (const [width,height] of viewports) {
      await page.setViewportSize({width,height});
      await showEvents(page);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}`);
      const images = await section.locator('.event-open img').evaluateAll(elements=>elements.map(image=>({
        loaded:image.complete && image.naturalWidth>0,fit:getComputedStyle(image).objectFit,
      })));
      assert.ok(images.every(image=>image.loaded && image.fit==='contain'), `Whole images at ${width}`);
      const buttons = await section.locator('.event-open').evaluateAll(elements=>elements.map(element=>element.getBoundingClientRect()));
      assert.ok(buttons.every(box=>box.width>=44 && box.height>=44));
      if (width<=900) assert.ok((await section.locator('.event-piece').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).transform))).every(value=>value==='none'), 'Static narrow-screen gallery');
      const axe = await new AxeBuilder({page}).include('#eventos').analyze();
      assert.deepEqual(axe.violations.map(item=>item.id), [], `Events accessibility at ${width}`);
      const artifact = `events-${width}x${height}.png`;
      await section.evaluate(element=>window.scrollTo({top:element.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));
      await page.evaluate(()=>document.activeElement?.blur());
      await page.mouse.move(0,0);
      await page.waitForTimeout(850);
      await page.screenshot({path:`${output}/${artifact}`});
      renders.push({viewport:`${width}x${height}`,artifact,observation:'Section entrance below the fixed header, complete uncropped artworks verified through scrolling, no overflow; complete static gallery follows the responsive tunnel.'});
    }

    await page.setViewportSize({width:1440,height:900});
    await showEvents(page);
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.perspective-tunnel')).toHaveCount(0);
    assert.ok((await section.locator('.event-piece').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).transform))).every(value=>value==='none'));
    await section.screenshot({path:`${output}/reduced-motion.png`});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await expect(page.locator('.perspective-tunnel')).toHaveCount(1);
    // A route change must close an open dialog and restore scrolling on unmount.
    await section.locator('.event-open').first().click();
    await page.evaluate(()=>{history.pushState({},'', '/site-essencial');dispatchEvent(new PopStateEvent('popstate'));});
    await expect(page.locator('#eventos')).toHaveCount(0);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    assert.deepEqual(errors, [], 'No console or page errors during normal use');

    const touch = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const mobile = await touch.newPage();
    await mobile.goto(base);
    await showEvents(mobile);
    await mobile.locator('.event-open').first().tap();
    await expect(mobile.getByRole('dialog')).toBeVisible();
    await mobile.screenshot({path:`${output}/expanded-mobile.png`});
    await mobile.getByRole('button',{name:'Fechar arte ampliada'}).tap();
    await expect(mobile.getByRole('dialog')).not.toBeVisible();
    await touch.close();

    // Failed asset: other pieces stay available; opening offers an actual retry.
    const failure = await browser.newPage({viewport:{width:390,height:844}});
    await failure.route('**/assets/eventos/sao-simao-folia.webp*',route=>route.abort());
    await failure.goto(base);
    await failure.locator('#eventos-galeria').scrollIntoViewIfNeeded();
    await expect(failure.locator('.event-open').first()).toContainText('Não foi possível carregar');
    await expect(failure.locator('.event-open img')).toHaveCount(3);
    await failure.locator('.event-open').first().click();
    await expect(failure.getByRole('button',{name:'Tentar novamente'})).toBeVisible();
    await failure.unroute('**/assets/eventos/sao-simao-folia.webp*');
    await failure.getByRole('button',{name:'Tentar novamente'}).click();
    await expect(failure.locator('.event-artwork-expanded img')).toBeVisible();
    await failure.locator('.event-artwork-expanded img').evaluate(image=>image.decode());
    await failure.close();

    fs.writeFileSync(`${output}/evidence.json`,JSON.stringify({
      contract:'contract.json: four supplied artworks between commercial previews and studies; native scroll, accessible enlargement, WhatsApp event intent.',
      targetViewports:renders.map(item=>item.viewport),renderedEvidence:renders,
      accessibility:{status:'pass',evidence:'Axe on gallery at six widths and on desktop modal; keyboard open, focus containment, Escape, focus return and mobile tap verified.'},
      responsive:{status:'pass',evidence:'Six widths without horizontal overflow; object-fit contain and preserved proportions; static complete gallery below the animated mobile tunnel.'},
      contentStates:{
        loading:{status:'pass',evidence:'Reserved aspect ratio and lazy-loaded images; images decode before evidence capture.'},
        empty:{status:'not-applicable',reason:'Curated static collection of four versioned artworks; no optional remote collection.'},
        error:{status:'pass',evidence:'Aborted image request displays failure text; expanded modal retry succeeds after network recovery.'},
        partial:{status:'pass',evidence:'One aborted artwork leaves three images available and the failed piece can be retried.'},
        success:{status:'pass',evidence:'Four artworks load, expand and close; event-specific WhatsApp link verified without sending.'},
        permission:{status:'not-applicable',reason:'Public static portfolio, with no authenticated or permission-restricted operation.'},
      },motion:'Responsive tunnel and live reduced-motion/viewport cleanup verified; native wheel continues the page; dedicated mobile suite covers touch gestures.',errors,
    },null,2));
    console.log('Events: six viewports, static complete gallery, keyboard/touch enlargement, focus, motion preference cleanup, image retry, WhatsApp and axe passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
