const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4207').replace(/\/$/, '');
const words = text => (text || '').trim().split(/\s+/).filter(Boolean).length;

async function wordCount(page, selector) {
  const locator = page.locator(selector);
  assert.ok(await locator.count(), `Missing selector: ${selector}`);
  return words(await locator.innerText());
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const home = {
      main: await wordCount(page, 'main'),
      portfolio: await wordCount(page, '.experience-work'),
      services: await wordCount(page, '.experience-services'),
      about: await wordCount(page, '.about-studio'),
      process: await wordCount(page, '.process-studio'),
      teaser: await wordCount(page, '.essential-teaser'),
    };

    assert.ok(home.main <= 750, `Home copy budget exceeded: ${home.main} words`);
    assert.ok(home.portfolio <= 270, `Portfolio copy budget exceeded: ${home.portfolio} words`);
    assert.ok(home.services <= 210, `Services copy budget exceeded: ${home.services} words`);
    assert.ok(home.about <= 65, `About copy budget exceeded: ${home.about} words`);
    assert.ok(home.process <= 70, `Process copy budget exceeded: ${home.process} words`);
    assert.ok(home.teaser <= 55, `Site Essencial teaser copy budget exceeded: ${home.teaser} words`);

    await page.goto(`${base}/site-essencial`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(700);
    const essential = {
      main: await wordCount(page, 'main'),
      hero: await wordCount(page, '.essential-hero'),
      scope: await wordCount(page, '.essential-scope'),
      process: await wordCount(page, '.essential-process'),
      faq: await wordCount(page, '.essential-faq'),
    };

    assert.ok(essential.main <= 275, `Site Essencial copy budget exceeded: ${essential.main} words`);
    assert.ok(essential.hero <= 70, `Site Essencial hero copy budget exceeded: ${essential.hero} words`);
    assert.ok(essential.scope <= 75, `Site Essencial scope copy budget exceeded: ${essential.scope} words`);
    assert.ok(essential.process <= 70, `Site Essencial process copy budget exceeded: ${essential.process} words`);
    assert.ok(essential.faq <= 55, `Site Essencial FAQ labels budget exceeded: ${essential.faq} words`);

    const localRoutes = [
      ['/criacao-de-sites-nova-iguacu', 'Nova Iguaçu'],
      ['/criacao-de-sites-belford-roxo', 'Belford Roxo'],
      ['/criacao-de-sites-duque-de-caxias', 'Duque de Caxias'],
    ];
    const locals = {};
    for (const [route,city] of localRoutes) {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(700);
      const local = {
        main: await wordCount(page, 'main'),
        hero: await wordCount(page, '.local-hero'),
        solutions: await wordCount(page, '.local-solutions'),
        process: await wordCount(page, '.local-process'),
        portfolio: await wordCount(page, '.local-portfolio'),
        business: await wordCount(page, '.local-business'),
        quote: await wordCount(page, '.local-quote'),
        faq: await wordCount(page, '.local-faq'),
      };
      locals[city] = local;

      assert.ok(local.main <= 820, `${city} page copy budget exceeded: ${local.main} words`);
      assert.ok(local.hero <= 100, `${city} hero copy budget exceeded: ${local.hero} words`);
      assert.ok(local.solutions <= 140, `${city} solutions copy budget exceeded: ${local.solutions} words`);
      assert.ok(local.process <= 110, `${city} process copy budget exceeded: ${local.process} words`);
      assert.ok(local.portfolio <= 210, `${city} portfolio copy budget exceeded: ${local.portfolio} words`);
      assert.ok(local.business <= 180, `${city} business copy budget exceeded: ${local.business} words`);
      assert.ok(local.quote <= 180, `${city} quote form copy budget exceeded: ${local.quote} words`);
      assert.ok(local.faq <= 210, `${city} FAQ copy budget exceeded: ${local.faq} words`);
    }

    console.log(JSON.stringify({ home, essential, locals }));
    console.log('Copy density: approved word budgets for home, Site Essencial and Local SEO Cluster V1.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
