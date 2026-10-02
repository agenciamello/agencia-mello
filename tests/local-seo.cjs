const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4209').replace(/\/$/, '');

const cities = [
  {
    route: '/criacao-de-sites-nova-iguacu',
    city: 'Nova Iguaçu',
    title: 'Criação de Sites em Nova Iguaçu | Agência Mello',
    featured: 'Animalis Pet',
    placeSignal: 'Comendador Soares',
  },
  {
    route: '/criacao-de-sites-belford-roxo',
    city: 'Belford Roxo',
    title: 'Criação de Sites em Belford Roxo | Agência Mello',
    featured: 'Viana Planejados',
    placeSignal: 'Heliópolis',
  },
  {
    route: '/criacao-de-sites-duque-de-caxias',
    city: 'Duque de Caxias',
    title: 'Criação de Sites em Duque de Caxias | Agência Mello',
    featured: 'Du-Rio Planejados',
    placeSignal: 'Jardim 25 de Agosto',
  },
];

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

    for (const city of cities) {
      await page.goto(`${base}${city.route}`, { waitUntil: 'networkidle' });
      await expect(page.locator('h1')).toContainText(city.city);
      assert.equal(await page.title(), city.title);
      await expect(page.locator('.local-quote-form')).toHaveCount(1);
      await expect(page.locator('.local-faq details')).toHaveCount(6);
      await expect(page.locator('.local-featured-project')).toContainText(city.featured);
      await expect(page.locator('.local-place-context')).toContainText(city.placeSignal);
      await expect(page.locator('.local-cluster-inner nav a')).toHaveCount(3);
      await expect(page.locator(`.local-cluster-inner nav a[href="${city.route}"]`)).toHaveAttribute('aria-current', 'page');
      await expect(page.locator('.local-commercial-grid article')).toHaveCount(2);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${city.city} page has no horizontal overflow`);

      await page.fill('input[name="nome"]', 'Ana');
      await page.fill('input[name="negocio"]', 'Studio Ana');
      await page.selectOption('select[name="tipo"]', { label: 'Site institucional' });
      await page.fill('textarea[name="projeto"]', 'Quero apresentar serviços e receber contatos pelo WhatsApp.');
      await page.click('.local-form-submit');

      const opened = await page.evaluate(() => window.__localOpened[0]);
      assert.ok(opened, `${city.city} quote form opens WhatsApp`);
      const url = new URL(opened);
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, '/5521971859948');
      assert.match(url.searchParams.get('text') || '', new RegExp(city.city));
      assert.match(url.searchParams.get('text') || '', /Studio Ana/);
    }

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await expect(page.locator('.experience-work .section-label')).toContainText('Portfólio de Projetos');
    await expect(page.locator('.experience-work')).toContainText('Animalis Pet');
    await expect(page.locator('.experience-work')).toContainText('Viana Planejados');
    await expect(page.locator('.experience-work')).toContainText('Du-Rio Planejados');
    await expect(page.locator('.service-local-links .service-local-link')).toHaveCount(3);
    for (const city of cities) {
      await expect(page.locator(`.service-local-links a[href="${city.route}"]`)).toContainText(city.city);
    }

    console.log('Local SEO Cluster V1: three unique city pages, local projects, cross-links and WhatsApp forms passed.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
