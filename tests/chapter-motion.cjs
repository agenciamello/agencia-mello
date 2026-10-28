const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const base=process.env.SITE_URL||'http://127.0.0.1:4176';

async function measure(page) {
 return page.evaluate(async()=>{
  const resource=performance.getEntriesByType('resource').find(item=>/\/assets\/ScrollTrigger-[^/]+\.js/.test(item.name));
  const {ScrollTrigger}=await import(resource.name);
  return {aboutY:document.querySelector('#sobre').getBoundingClientRect().top+scrollY,starts:ScrollTrigger.getAll().filter(item=>item.trigger?.closest?.('#sobre')).map(item=>item.start)};
 });
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   await page.goto(base,{waitUntil:'networkidle'});
   await page.waitForTimeout(1200);
   const initial=await measure(page);
   assert.ok(initial.starts.length>0,'Há animações ativas para verificar');
   for(const selector of ['#outros-pacotes','#processo','#condicoes-pacotes','.conceptual-sites']) {
    const before=await measure(page);
    await page.locator(selector).evaluate(el=>el.open=true);
    await expect.poll(async()=>{
     const after=await measure(page);
     const delta=after.aboutY-before.aboutY;
     return delta>50 && after.starts.length===before.starts.length && after.starts.every((start,index)=>Math.abs(start-before.starts[index]-delta)<3);
    },{message:'Expandir detalhes deve deslocar as animações junto com o conteúdo'}).toBe(true);
    const open=await measure(page);
    await page.locator(selector).evaluate(el=>el.open=false);
    await expect.poll(async()=>{
     const closed=await measure(page);
     const delta=closed.aboutY-open.aboutY;
     return delta< -50 && closed.starts.every((start,index)=>Math.abs(start-open.starts[index]-delta)<3);
    },{message:'Fechar detalhes deve restaurar os pontos das animações'}).toBe(true);
   }
   await page.emulateMedia({reducedMotion:'reduce'});
   await expect.poll(async()=>(await measure(page)).starts.length).toBe(0);
   await page.locator('#processo').evaluate(el=>el.open=true);
   await expect(page.locator('#processo ol')).toBeVisible();
   await page.emulateMedia({reducedMotion:'no-preference'});
   await expect.poll(async()=>(await measure(page)).starts.length).toBe(initial.starts.length);
  }
  console.log('Capítulos/motion: abrir e fechar detalhes atualiza posições em desktop/mobile; reduced motion limpa e restaura as animações.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
