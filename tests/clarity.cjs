const {chromium, expect} = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.SITE_URL || 'http://127.0.0.1:4176').replace(/\/$/, '');
const folder = 'artifacts/sprint-clareza';

(async () => {
  fs.mkdirSync(folder, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const results = [];
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440,1024,768,390,360,320]) {
      await page.setViewportSize({width,height:width>700?900:844});
      await page.goto(`${base}/`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.hero-description')).toHaveText('Criamos sites, identidade visual e artes para redes sociais e eventos.');
      const offer = page.locator('#oferta-site-essencial');
      await expect(offer).toHaveCount(1);
      await expect(offer).toContainText('De R$ 500,00');
      await expect(offer).toContainText('Por somenteR$ 297,00');
      await expect(offer).toContainText('em até 3x de R$ 99,00');
      const position = await page.evaluate(() => {
        const y = selector => document.querySelector(selector).getBoundingClientRect().top + scrollY;
        const priceNode=Array.from(document.querySelector('.teaser-price>span').childNodes).find(node=>node.nodeType===Node.TEXT_NODE && node.textContent.includes('297,00'));
        const range=document.createRange();
        range.selectNode(priceNode);
        const price=range.getBoundingClientRect();
        return {offer:y('#oferta-site-essencial'),price:price.top+scrollY,priceBottom:price.bottom+scrollY,portfolio:y('#projetos'),height:innerHeight};
      });
      assert.ok(position.offer < position.portfolio, 'Oferta antes do portfólio');
      assert.ok(position.priceBottom < position.height*2, `Preço inteiro nas primeiras duas telas em ${width}px: ${position.priceBottom}`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false,`Sem overflow em ${width}px`);
      results.push({width,...position});
      if ([1440,390,320].includes(width)) {
        await page.screenshot({path:`${folder}/hero-${width}.png`});
        await offer.scrollIntoViewIfNeeded();
        await page.screenshot({path:`${folder}/oferta-${width}.png`});
        await page.locator('#contato').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${folder}/contato-${width}.png`});
      }
      await expect(page.locator('.contact-composition h2')).toHaveText('Vamos criarseu próximoprojeto?');
      await expect(page.locator('.contact-intent input')).toHaveCount(4);
      assert.equal(await page.locator('.contact-intent input:checked').count(),0);
      const generic = new URL(await page.locator('.intent-send').getAttribute('href')).searchParams.get('text');
      assert.match(generic,/conversar sobre um projeto/);
      assert.doesNotMatch(generic,/meu site/);
      for (const [key,phrase] of [['sites','um site pro meu negócio'],['identidade','identidade visual'],['conteudo','artes para redes sociais'],['eventos','arte para meu evento']]) {
        await page.locator(`.intent-options label:has(input[value="${key}"])`).click();
        await expect(page.locator(`input[value="${key}"]`)).toBeChecked();
        const url = new URL(await page.locator('.intent-send').getAttribute('href'));
        assert.equal(url.pathname,'/5521971859948');
        assert.ok(url.searchParams.get('text').includes(phrase));
      }
      await page.locator('input[value="conteudo"]').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('input[value="eventos"]')).toBeChecked();
    }
    for (const route of ['/','/site-essencial','/criacao-de-sites-nova-iguacu','/criacao-de-sites-belford-roxo','/criacao-de-sites-duque-de-caxias','/termos-de-uso']) {
      await page.goto(base+route,{waitUntil:'networkidle'});
      if (route.includes('criacao-de-sites')) {
        for (const details of await page.locator('details').all()) await details.evaluate(el => el.open=true);
      }
      const text=await page.locator('body').innerText();
      assert.match(text,/R\$ 297,00/,`Preço vigente em ${route}`);
      // O valor antigo só pode permanecer na referência anterior identificada.
      assert.doesNotMatch(text.replaceAll('De R$ 500,00',''),/R\$\s?500/);
      for (const anchor of await page.locator('a[href*="wa.me"]').all()) {
        const message=new URL(await anchor.getAttribute('href')).searchParams.get('text');
        assert.doesNotMatch(message || '',/R\$\s?500/);
      }
      if (route==='/site-essencial') {
        assert.match(await page.title(),/R\$ 297,00/);
        assert.match(await page.locator('meta[name="description"]').getAttribute('content'),/R\$ 297,00/);
        const graph=JSON.parse(await page.locator('script[data-seo-jsonld]').textContent())['@graph'];
        assert.equal(graph.find(item=>item.name==='Site Essencial').offers.price,'297');
        assert.equal(graph.find(item=>item.name==='Site Essencial').offers.priceCurrency,'BRL');
        await page.screenshot({path:`${folder}/essencial-320.png`});
      }
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(`${folder}/clarity-results.json`,JSON.stringify({base,results,errors},null,2));
    console.log('Clareza: oferta antes dos projetos e preço nas primeiras 2 telas em 6 larguras; 4 intenções/teclado; preço, WhatsApp e SEO consistentes em 6 rotas.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
