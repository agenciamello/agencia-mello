const {chromium, expect} = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const base = (process.env.SITE_URL || 'http://127.0.0.1:4176').replace(/\/$/, '');
const output = process.env.COMMERCIAL_ARTIFACTS || 'artifacts/sprint-vendas';
const offers = [
  {id:'essencial', name:'Site Essencial', price:'297', display:'R$ 297,00', cta:'Quero minha prévia grátis'},
  {id:'divulgacao', name:'Site + Divulgação', price:'697', display:'R$ 697,00', cta:'Quero meu site com divulgação'},
  {id:'campanha', name:'Site para Campanha', price:'1297', display:'R$ 1.297,00', cta:'Planejar minha campanha'},
];

// Accept both Service.offers and OfferCatalog shapes, while verifying the public contract.
function structuredPrices(value, result = []) {
  if (!value || typeof value !== 'object') return result;
  if (value.offers && !Array.isArray(value.offers) && value.offers.price !== undefined) {
    result.push({name:value.name, price:String(value.offers.price), currency:value.offers.priceCurrency});
  }
  if (value['@type'] === 'Offer' && value.price !== undefined) {
    result.push({name:value.itemOffered?.name || value.name, price:String(value.price), currency:value.priceCurrency});
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(item => structuredPrices(item, result));
    else if (child && typeof child === 'object') structuredPrices(child, result);
  }
  return result;
}

async function toggleByKeyboard(page, selector, open) {
  const details = page.locator(selector);
  const summary = details.locator('summary');
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => details.evaluate(element => element.open)).toBe(open);
}

(async () => {
  const source = await import(pathToFileURL(path.resolve(__dirname, '../src/data/commercialOffers.js')).href);
  assert.deepEqual(source.COMMERCIAL_OFFERS.divulgacao, {name:'Site + Divulgação',price:697,creativeCount:3,fileCount:6,supportDays:0});
  assert.deepEqual(source.COMMERCIAL_OFFERS.campanha, {name:'Site para Campanha',price:1297,creativeCount:5,fileCount:10,supportDays:30});
  assert.equal(source.formatOfferPrice(1297), 'R$ 1.297,00');

  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const errors = [];
  const measurementRequests = [];
  const results = [];
  try {
    const context = await browser.newContext({reducedMotion:'reduce'});
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (/google-analytics\.com\/(?:g\/)?collect|googletagmanager\.com\/(?:gtag\/js|gtm\.js)|connect\.facebook\.net\/.*fbevents|facebook\.com\/tr\//i.test(request.url())) measurementRequests.push(request.url());
    });
    if (process.env.SITE_ACCESS_URL) await page.goto(process.env.SITE_ACCESS_URL,{waitUntil:'networkidle'});

    for (const width of [1440,1024,768,390,360,320]) {
      await page.setViewportSize({width,height:width>700?900:844});
      await page.goto(base,{waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveAccessibleName('Sites e design para transformar interesse em VENDAS.');
      await expect(page.locator('.hero-message .line-mask')).toHaveCount(4);
      await expect(page.locator('.site-offers .package-card')).toHaveCount(3);
      assert.ok(await page.locator('.home-service-links strong').evaluateAll(labels=>labels.length===3 && labels.every(label=>parseFloat(getComputedStyle(label).fontSize)>=12)),'Os três serviços mantêm rótulos legíveis de pelo menos 12px');
      await expect(page.locator('#events-heading')).toHaveAccessibleName('Artes para divulgar seu evento e vender mais ingressos.');
      await expect(page.locator('#arts-chapter-heading')).toHaveAccessibleName('Sua divulgação precisa chamar atenção e gerar interesse.');

      const messages = [];
      for (const offer of offers) {
        const card = page.locator(`.package-card[data-offer="${offer.id}"]`);
        await expect(card.getByRole('heading',{name:offer.name,exact:true})).toBeVisible();
        await expect(card).toContainText(offer.display);
        const cta = card.locator('.package-cta');
        await expect(cta).toHaveAccessibleName(new RegExp(offer.cta,'i'));
        await expect(cta).toHaveAttribute('target','_blank');
        assert.match(await cta.getAttribute('rel'), /noopener/);
        await cta.focus();
        await expect(cta).toBeFocused();
        const url = new URL(await cta.getAttribute('href'));
        assert.equal(url.origin,'https://wa.me');
        assert.equal(url.pathname,'/5521971859948');
        const message = url.searchParams.get('text');
        assert.ok(message.includes(offer.name),`${offer.name}: conversa identifica o pacote`);
        assert.ok(message.includes(offer.display),`${offer.name}: conversa mantém o preço`);
        messages.push(message);

        if (offer.id === 'essencial') {
          await expect(card).toContainText(/prévia privada e gratuita/i);
          await expect(card).toContainText(/pagamento após aprovação/i);
          await expect(card).toContainText(/3x de R\$ 99,00/);
          await expect(card).toContainText(/De R\$ 500,00/);
          await expect(card).not.toContainText('50%');
        } else {
          await expect(card).toContainText('50% para iniciar e 50% antes da publicação');
          await expect(card).not.toContainText(/prévia grátis|prévia gratuita|só pague se aprovar|3x de R\$ 99,00/i);
        }
      }
      assert.equal(new Set(messages).size,3,'Cada oferta produz uma conversa identificável sem envio automático');
      await expect(page.locator('[data-offer="divulgacao"]')).toContainText(/3 criativos.*6 arquivos finais/s);
      await expect(page.locator('[data-offer="campanha"]')).toContainText(/5 criativos.*10 arquivos finais/s);
      await expect(page.locator('[data-offer="campanha"]')).toContainText(/30 dias.*correções.*falhas técnicas/s);
      await expect(page.locator('[data-offer="divulgacao"]')).not.toContainText(/30 dias/);

      for (const selector of ['.primary-cta','.nav-contact']) {
        const message = new URL(await page.locator(selector).getAttribute('href')).searchParams.get('text');
        assert.doesNotMatch(message,/prévia|grátis|gratuita/i,'Contato geral não estende promessa do Essencial');
      }
      await expect(page.locator('.contact-intent input')).toHaveCount(4);

      const positions = await page.evaluate(() => {
        const rect = selector => document.querySelector(selector).getBoundingClientRect();
        return {previewsBottom:rect('.commercial-project-grid').bottom+scrollY, cards:[...document.querySelectorAll('.package-card')].map(element=>({top:element.getBoundingClientRect().top+scrollY,bottom:element.getBoundingClientRect().bottom+scrollY})),artsTop:rect('#servico-conteudo').top+scrollY};
      });
      assert.ok(positions.cards.every(card=>card.top>positions.previewsBottom && card.bottom<positions.artsTop),'Todas as ofertas ficam depois das três prévias e antes de artes');

      for (const selector of ['#processo','#condicoes-pacotes']) await toggleByKeyboard(page,selector,true);
      const conditions = page.locator('#condicoes-pacotes');
      await expect(conditions).toContainText(/prévia gratuita.*exclusiva do Site Essencial/i);
      await expect(conditions).toContainText(/duas rodadas.*página.*uma rodada.*artes/i);
      await expect(conditions).toContainText(/Feed e Stories/);
      await expect(conditions).toContainText(/30 dias após a publicação/);
      await expect(conditions).toContainText(/clique não comprova conversa ou venda/i);
      await expect(conditions).toContainText(/CRM/);
      await expect(conditions).toContainText(/plano gratuito.*limites/s);
      await expect(conditions.getByRole('link',{name:/Ler todas as condições/})).toHaveAttribute('href','/termos-de-uso');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Detalhes abertos sem overflow em ${width}px`);
      for (const selector of ['#processo','#condicoes-pacotes']) await toggleByKeyboard(page,selector,false);

      const graph = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent());
      const publicPrices = structuredPrices(graph);
      for (const offer of offers) assert.ok(publicPrices.some(item=>item.name===offer.name && item.price===offer.price && item.currency==='BRL'),`${offer.name}: JSON-LD tem preço/currency coerente com o card`);
      if ([1440,390,320].includes(width)) {
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
        await page.screenshot({path:`${output}/hero-${width}.png`});
        for (const offer of offers) {
          await page.locator(`[data-offer="${offer.id}"]`).scrollIntoViewIfNeeded();
          await page.screenshot({path:`${output}/oferta-${offer.id}-${width}.png`});
        }
      }
      // The pre-existing public anchor must still land below the sticky header.
      await page.goto(`${base}/#oferta-site-essencial`,{waitUntil:'networkidle'});
      await expect.poll(()=>page.locator('#essential-offer-heading').evaluate(element=>{
        return element.getBoundingClientRect().top-document.querySelector('.studio-header').getBoundingClientRect().bottom;
      }),{message:`Âncora do Essencial mantém o título livre do cabeçalho em ${width}px`}).toBeGreaterThanOrEqual(-1);
      results.push({width,offers:3,keyboard:true,scope:true,structuredPrices:true,legacyAnchor:true,messages});
    }

    await page.goto(`${base}/termos-de-uso`,{waitUntil:'networkidle'});
    const terms = await page.locator('main').innerText();
    for (const offer of offers) {assert.ok(terms.includes(offer.name));assert.ok(terms.includes(offer.display));}
    assert.match(terms,/50%.*50%/s);
    assert.match(terms,/30 dias/);
    assert.match(terms,/falhas técnicas/i);
    assert.match(terms,/uma rodada consolidada nas artes/i);
    assert.match(terms,/Feed e Stories/);

    await page.goto(`${base}/site-essencial`,{waitUntil:'networkidle'});
    const essentialPrices = structuredPrices(JSON.parse(await page.locator('script[data-seo-jsonld]').textContent()));
    assert.ok(essentialPrices.some(item=>item.name==='Site Essencial' && item.price==='297' && item.currency==='BRL'));
    assert.equal(essentialPrices.some(item=>item.price==='697' || item.price==='1297'),false,'Página Essencial não atribui outros preços ao produto');

    assert.deepEqual(errors,[]);
    assert.deepEqual(measurementRequests,[],'Descrever Analytics/Pixel do pacote não instala rastreadores na agência');
    fs.writeFileSync(`${output}/commercial-offers-results.json`,JSON.stringify({base,results,errors,measurementRequests},null,2));
    console.log('Sprint Vendas: três ofertas após as prévias; preços/condições/JSON-LD e mensagens distintos; teclado e detalhes sem overflow em seis larguras; termos e Essencial coerentes.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
