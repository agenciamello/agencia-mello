const {chromium, expect} = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.SITE_URL || 'http://127.0.0.1:4176').replace(/\/$/, '');
const folder = process.env.CLARITY_ARTIFACTS || 'artifacts/sprint-clareza';

(async () => {
  fs.mkdirSync(folder, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const results = [];
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (process.env.SITE_ACCESS_URL) await page.goto(process.env.SITE_ACCESS_URL,{waitUntil:'networkidle'});
    for (const width of [1440,1024,768,390,360,320]) {
      await page.setViewportSize({width,height:width>700?900:844});
      await page.goto(`${base}/`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.hero-description')).toHaveText('Criamos sites, identidade visual e artes para redes sociais e eventos.');
      const offer = page.locator('#oferta-site-essencial');
      await expect(offer).toHaveCount(1);
      await expect(offer).toContainText(/De\s*R\$\s*500,00/);
      await expect(offer).toContainText(/Por somente/);
      await expect(offer).toContainText(/R\$\s*297,00/);
      await expect(offer).toContainText('em até 3x de R$ 99,00');
      await expect(page.locator('.experience-services')).toHaveCount(0);
      await expect(page.locator('#servico-web .commercial-project-grid')).toContainText('Viana Planejados');
      await expect(page.locator('#servico-web .commercial-project-grid')).toContainText('Du-Rio Planejados');
      await expect(page.locator('#servico-marca')).toContainText('Estudo conceitual');
      await expect(page.locator('#servico-conteudo')).toContainText('Design para eventos');
      assert.ok(await page.locator('.project-thesis').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=28),'Tese do projeto mantém tamanho de título após ajuste da hierarquia');
      const position = await page.evaluate(() => {
        const y = selector => document.querySelector(selector).getBoundingClientRect().top + scrollY;
        const bottom = selector => document.querySelector(selector).getBoundingClientRect().bottom + scrollY;
        return {intro:y('#projetos'),sites:y('#servico-web'),animalis:y('.showcase-commercial'),otherPreviewsBottom:bottom('.commercial-project-grid'),offer:y('#oferta-site-essencial'),offerBottom:bottom('#oferta-site-essencial'),artes:y('#servico-conteudo'),brand:y('#servico-marca'),about:y('#sobre')};
      });
      assert.ok(position.intro < position.sites && position.sites < position.animalis,'Abertura e capítulo de sites antes das prévias');
      assert.ok(position.otherPreviewsBottom < position.offer,'Três prévias comerciais antes do preço');
      assert.ok(position.offerBottom < position.artes && position.artes < position.brand && position.brand < position.about,'Oferta → artes → identidade → Matheus');
      for (const [index,id] of ['servico-web','servico-conteudo','servico-marca'].entries()) {
        const link=page.locator('.home-service-links a').nth(index);
        await expect(link).toHaveAttribute('href',`#${id}`);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        const rect=await page.locator(`#${id}`).boundingBox();
        assert.ok(rect.y>=0 && rect.y<200,`Atalho chega ao capítulo ${id}`);
        if ([1440,390].includes(width)) {
          await page.locator(`#${id} img`).evaluateAll(images=>Promise.allSettled(images.filter(img=>{
            const rect=img.getBoundingClientRect();
            return img.checkVisibility() && rect.top<innerHeight && rect.bottom>0;
          }).map(img=>img.decode())));
          await page.screenshot({path:`${folder}/${id}-${width}.png`});
        }
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false,`Sem overflow em ${width}px`);
      results.push({width,...position});
      if ([1440,390,320].includes(width)) {
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`${folder}/hero-${width}.png`});
        await offer.scrollIntoViewIfNeeded();
        await page.screenshot({path:`${folder}/oferta-${width}.png`});
        await page.locator('#contato').scrollIntoViewIfNeeded();
        await page.screenshot({path:`${folder}/contato-${width}.png`});
      }
      await expect(page.locator('.contact-composition h2')).toHaveAccessibleName('Site, identidade ou artes: vamos conversar.');
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
    console.log('Clareza: capítulos sites → artes → identidade; três prévias antes do preço; atalhos em 6 larguras; 4 intenções/teclado e preço/SEO em 6 rotas.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
