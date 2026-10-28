const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:4176';
const output=process.env.TEXT_REVEAL_ARTIFACTS||'artifacts/text-reveal';
const targets=[['.scroll-story-title','Negócios diferentes. Soluções diferentes.'],['#site-chapter-heading','Apresente seus serviços. Facilite o pedido de orçamento.'],['.project-thesis','Serviços, localização e contato no mesmo lugar.']];

async function words(locator){return locator.locator('[data-text-segment]').evaluateAll(items=>items.map(el=>({opacity:Number(getComputedStyle(el).opacity),filter:getComputedStyle(el).filter,transform:getComputedStyle(el).transform})));}
async function position(locator){return locator.evaluate(el=>el.getBoundingClientRect().top+scrollY);}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 try{
  const page=await browser.newPage({reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(process.env.SITE_ACCESS_URL) await page.goto(process.env.SITE_ACCESS_URL,{waitUntil:'networkidle'});
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:width>700?900:844});
   await page.goto(base,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('.text-reveal')).toHaveCount(3);
   for(const [selector,text] of targets){
    const title=page.locator(selector);
    await expect(title).toHaveAccessibleName(text);
    const y=await position(title);
    await page.evaluate(y=>window.scrollTo({top:Math.max(0,y-innerHeight-50),behavior:'instant'}),y);
    const before=await words(title);
    assert.ok(before.length>1 && before.every(item=>item.opacity===0),'Palavras aguardam a entrada na viewport');
    await page.evaluate(y=>window.scrollTo({top:Math.max(0,y-innerHeight*.55),behavior:'instant'}),y);
    await expect(title).toHaveAttribute('data-reveal-state',/revealing|complete/);
    await expect.poll(async()=>{const state=await words(title);return state.some(item=>item.opacity>.15)&&state.some(item=>item.opacity<.85);},{intervals:[20,40,60]}).toBe(true);
    await expect(title).toHaveAttribute('data-reveal-state','complete');
    const after=await words(title);
    assert.ok(after.every(item=>item.opacity>.99 && (item.filter==='none'||item.filter==='blur(0px)')),'Texto termina nítido e legível');
    await page.screenshot({path:`${output}/${selector.replace(/[^a-z]/gi,'')}-${width}.png`});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.evaluate(y=>window.scrollTo({top:y-innerHeight*.55,behavior:'instant'}),y);
    assert.ok((await words(title)).every(item=>item.opacity>.99),'Revelação não reinicia ao voltar a rolagem');
   }
   for(const row of await page.locator('.project-context>div').all()){
    await row.scrollIntoViewIfNeeded();
    await expect.poll(()=>row.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.99);
   }
   await page.emulateMedia({reducedMotion:'reduce'});
   await expect(page.locator('.text-reveal [data-text-segment]')).toHaveCount(0);
   for(const [selector,text] of targets){await expect(page.locator(selector)).toHaveAccessibleName(text);await expect(page.locator(selector)).toHaveAttribute('data-reveal-state','static');}
   await page.locator('.project-detail-link').first().focus();
   await expect(page.locator('.project-detail-link').first()).toBeFocused();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.emulateMedia({reducedMotion:'no-preference'});
   await expect(page.locator('.text-reveal')).toHaveCount(3);
   results.push({width,headings:3,once:true,reducedMotion:true,keyboard:true});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${output}/verification.json`,JSON.stringify({base,results,errors},null,2));
  console.log('Text reveal: três títulos animam na entrada, terminam legíveis e não repetem; contexto, nomes acessíveis, teclado e reduced motion dinâmico passaram em desktop/mobile.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
