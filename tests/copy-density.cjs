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

    assert.ok(home.main <= 650, `Home copy budget exceeded: ${home.main} words`);
    assert.ok(home.portfolio <= 180, `Portfolio copy budget exceeded: ${home.portfolio} words`);
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

    console.log(JSON.stringify({ home, essential }));
    console.log('Copy density: approved word budgets for home and Site Essencial.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
