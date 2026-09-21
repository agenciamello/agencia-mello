const {chromium}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:3000';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];const routes=['/','/projetos/bellavista','/projetos/solace','/site-essencial','/politica-de-privacidade','/termos-de-uso','/pagina-inexistente'];
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   await page.goto(base+route);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode().catch(()=>{})})));
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),headings:document.querySelectorAll('h1').length}));
   assert.equal(state.overflow,false,`Overflow at ${width} ${route}`);assert.deepEqual(state.broken,[],`Images at ${route}`);assert.equal(state.headings,1,`Heading at ${route}`);results.push({width,route,...state});
  }
 }
 await page.goto(base+'/#%');await page.locator('h1').waitFor();assert.match(await page.locator('h1').innerText(),/Bom de verdade/);
 await page.goto(base+'/#projetos');await page.getByRole('button',{name:'Menu +'}).click();await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Projetos',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Menu +'}).getAttribute('aria-expanded'),'false');
 await page.getByRole('link',{name:'Explorar estudo Bellavista',exact:true}).click();await page.waitForURL('**/projetos/bellavista');await page.getByRole('link',{name:'← Todos os projetos'}).click();await page.waitForURL('**/#projetos');
 await page.getByRole('link',{name:'Conheça o Site Essencial'}).click();await page.waitForURL('**/site-essencial');await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');
 const whats=await page.locator('a[href*="wa.me"]').evaluateAll(links=>links.map(a=>a.href));assert.ok(whats.length>0);whats.forEach(href=>{const u=new URL(href);assert.equal(u.pathname,'/5521971859948');assert.ok(u.searchParams.get('text'));});
 const accessibility=[];
 for(const route of ['/','/site-essencial','/projetos/bellavista']){await page.goto(base+route);const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();accessibility.push({route,violations:scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 // Runtime motion preference, scroll effects and cleanup across route changes.
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'/');await page.waitForTimeout(1700);
 await page.evaluate(()=>window.scrollTo({top:400,behavior:'instant'}));await page.waitForTimeout(1100);const heroTransform=await page.locator('.hero-art-plane').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(heroTransform,'none');
 await page.locator('#servico-marca').scrollIntoViewIfNeeded();await page.waitForTimeout(150);assert.equal(await page.locator('[data-service-nav="1"]').getAttribute('aria-current'),'true');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);assert.equal(await page.locator('.hero-art-plane').evaluate(e=>e.style.transform),'');assert.equal(await page.locator('.ribbon-track').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(300);await page.getByRole('link',{name:'Explorar estudo Solace'}).click();await page.waitForURL('**/projetos/solace');await page.getByRole('link',{name:'← Todos os projetos'}).click();await page.waitForURL('**/#projetos');await page.waitForTimeout(400);
 assert.deepEqual(errors,[]);fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/experience-verification.json',JSON.stringify({results,accessibility,errors,motion:'passed',interactions:'passed'},null,2));
 console.log(JSON.stringify({viewports:4,routes:routes.length,interactions:'passed',motion:'passed',errors,accessibility},null,2));
 await browser.close();assert.equal(accessibility.reduce((n,r)=>n+r.violations.length,0),0,'Accessibility violations');
})().catch(e=>{console.error(e);process.exit(1)});
