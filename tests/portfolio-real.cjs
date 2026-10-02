const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4210').replace(/\/$/, '');
const commercialRoutes = [
  ['/projetos/animalis-pet', 'Animalis Pet', 'proposta de presença digital'],
  ['/projetos/viana-planejados', 'Viana Planejados', 'em negociação'],
  ['/projetos/durio-planejados', 'Du-Rio Planejados', 'proposta de presença digital'],
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await expect(page.locator('.showcase-commercial')).toContainText('Animalis Pet');
    await expect(page.locator('.commercial-project-grid')).toContainText('Viana Planejados');
    await expect(page.locator('.commercial-project-grid')).toContainText('Du-Rio Planejados');
    await expect(page.locator('.conceptual-introduction')).toContainText('Estudos autorais');
    await expect(page.locator('.home-service-orientation')).toContainText('Sites e landing pages');
    await expect(page.locator('.home-service-orientation')).toContainText('Identidade visual');
    await expect(page.locator('.home-service-orientation')).toContainText('Design para redes sociais');
    await expect(page.locator('.showcase-commercial')).toContainText('proposta desenvolvida');
    await expect(page.locator('.showcase-commercial')).not.toContainText('não contratado');
    await expect(page.locator('.copy-bridge')).toContainText('Gostou de algum desses projetos?');
    await expect(page.locator('.copy-bridge')).toContainText('Quero uma prévia');
    assert.equal(await page.locator('.conceptual-project-grid').count(), 1, 'Authored studies remain secondary but accessible');

    for (const [route,name,statusText] of commercialRoutes) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await expect(page.locator('h1')).toHaveText(name);
      await expect(page.locator('.commercial-case-head')).toContainText('Prévia comercial');
      await expect(page.locator('.commercial-case-note')).toContainText(/Transparência/);
      await expect(page.locator('.commercial-case-note')).toContainText(new RegExp(statusText, 'i'));
      await expect(page.locator('.commercial-case-note a[target="_blank"]')).toHaveAttribute('href', /^https:\/\//);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name} has no horizontal overflow`);
    }

    await page.goto(`${base}/criacao-de-sites-nova-iguacu`, { waitUntil: 'networkidle' });
    await expect(page.locator('.local-featured-project')).toContainText('Animalis Pet');
    await expect(page.locator('.local-featured-image')).toHaveAttribute('href', '/projetos/animalis-pet');
    await expect(page.locator('.local-commercial-grid')).toContainText('Viana Planejados');
    await expect(page.locator('.local-commercial-grid')).toContainText('Du-Rio Planejados');

    console.log('Clarity V3: offer orientation, commercial previews, transparency and mobile hierarchy passed.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
