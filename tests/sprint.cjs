const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(process.env.SITE_URL||'http://127.0.0.1:4173/');
 await page.locator('.contact-intent').waitFor();
 assert.equal(await page.locator('.hero-project').count(),0);
 assert.equal(await page.locator('.contact-line').count(),3);
 await page.locator('.primary-cta').hover({position:{x:20,y:15}});
 await expect.poll(()=>page.locator('.primary-cta').evaluate(e=>e.style.transform)).not.toBe('');
 await page.setViewportSize({width:390,height:844});
 await expect.poll(()=>page.locator('.primary-cta').evaluate(e=>e.style.transform)).toBe('');
 await page.setViewportSize({width:1440,height:900});
 for(const [key,word] of [['sites','sites e presença'],['identidade','identidade visual'],['conteudo','conteúdo visual']]){
  await page.locator('.intent-options label').filter({has:page.locator(`input[value="${key}"]`)}).click();
  await expect(page.locator(`input[value="${key}"]`)).toBeChecked();
  const href=await page.locator('.intent-send').getAttribute('href');
  const url=new URL(href);
  assert.equal(url.pathname,'/5521971859948');
  assert.ok(url.searchParams.get('text').includes(word));
 }
 await page.locator('input[value="sites"]').focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('input[value="identidade"]')).toBeChecked();
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>page.locator('.contact-line>b').first().evaluate(e=>e.style.transform)).toBe('');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 fs.mkdirSync('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/sprint-confirm-hero.png'});
 await page.setViewportSize({width:390,height:844});
 await page.locator('.contact-intent').scrollIntoViewIfNeeded();
 await page.screenshot({path:'artifacts/sprint-confirm-contact.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('Sprint: hero livre, três mensagens, teclado, breakpoint cleanup e reduced motion verificados.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
