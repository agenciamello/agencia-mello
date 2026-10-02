const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4209').replace(/\/$/, '');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      window.__localOpened = [];
      window.open = url => {
        window.__localOpened.push(String(url));
        return null;
      };
    });

    await page.goto(`${base}/criacao-de-sites-nova-iguacu`, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toContainText('Nova Iguaçu');
    assert.equal(await page.title(), 'Criação de Sites em Nova Iguaçu | Agência Mello');
    await expect(page.locator('.local-quote-form')).toHaveCount(1);
    await expect(page.locator('.local-faq details')).toHaveCount(6);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Local page has no horizontal overflow');

    await page.fill('input[name="nome"]', 'Ana');
    await page.fill('input[name="negocio"]', 'Studio Ana');
    await page.selectOption('select[name="tipo"]', { label: 'Site institucional' });
    await page.fill('textarea[name="projeto"]', 'Quero apresentar serviços e receber contatos pelo WhatsApp.');
    await page.click('.local-form-submit');

    const opened = await page.evaluate(() => window.__localOpened[0]);
    assert.ok(opened, 'Quote form opens WhatsApp');
    const url = new URL(opened);
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.pathname, '/5521971859948');
    assert.match(url.searchParams.get('text') || '', /Nova Iguaçu/);
    assert.match(url.searchParams.get('text') || '', /Studio Ana/);

    await expect(page.locator('.local-featured-project')).toContainText('Animalis Pet');
    await expect(page.locator('.local-featured-project')).toContainText('Nova Iguaçu');
    await expect(page.locator('.local-commercial-grid')).toContainText('Viana Planejados');
    await expect(page.locator('.local-commercial-grid')).toContainText('Du-Rio Planejados');

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await expect(page.locator('.experience-work .section-label')).toContainText('Portfólio de Projetos');
    await expect(page.locator('.experience-work')).toContainText('Animalis Pet');
    await expect(page.locator('.experience-work')).toContainText('Viana Planejados');
    await expect(page.locator('.experience-work')).toContainText('Du-Rio Planejados');
    await expect(page.locator('.service-local-link')).toHaveAttribute('href', '/criacao-de-sites-nova-iguacu');

    console.log('Local SEO: landing page, quote form, local portfolio and internal links passed.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
