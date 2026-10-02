const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage();
  await page.goto(process.env.SITE_URL || 'http://127.0.0.1:4187');
  await page.locator('h1').waitFor();
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://www.agenciamello.site/');
  await page.locator('.studio-nav a[href="/site-essencial"]').click();
  await page.waitForURL('**/site-essencial');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content','https://www.agenciamello.site/site-essencial');
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'),/Site profissional/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/^index,follow/);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href','https://www.agenciamello.site/site-essencial');

  await page.goto((process.env.SITE_URL || 'http://127.0.0.1:4187')+'/criacao-de-sites-nova-iguacu');
  await page.locator('h1').waitFor();
  assert.equal(await page.title(),'Criação de Sites em Nova Iguaçu | Agência Mello');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.agenciamello.site/criacao-de-sites-nova-iguacu');
  assert.match(await page.locator('meta[name="description"]').getAttribute('content'),/Nova Iguaçu/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/^index,follow/);

  for(const route of ['/politica-de-privacidade','/termos-de-uso']) {
   await page.locator(`.footer-links a[href="${route}"]`).click();
   await page.waitForURL(`**${route}`);
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.agenciamello.site${route}`);
   await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://www.agenciamello.site${route}`);
  }
  await page.goto((process.env.SITE_URL || 'http://127.0.0.1:4187')+'/pagina-inexistente');
  await page.locator('h1').waitFor();
  assert.match(await page.locator('meta[property="og:title"]').getAttribute('content'),/Página não encontrada/);
  console.log('SEO: canonical, metadados por rota e navegação do menu aprovados.');
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
