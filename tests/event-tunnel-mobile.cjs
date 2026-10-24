const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:4176';
const output=process.env.TUNNEL_ARTIFACTS||'artifacts/event-tunnel-mobile';

async function travel(page,progress){
 await page.locator('.perspective-tunnel').evaluate((element,p)=>{
  const stage=element.querySelector('.tunnel-viewport');
  const top=element.getBoundingClientRect().top+scrollY;
  window.scrollTo({top:top-parseFloat(getComputedStyle(stage).top)+p*(element.clientHeight-stage.clientHeight),behavior:'instant'});
 },progress);
 await page.waitForTimeout(900);
}
async function cardState(page){
 return page.locator('.tunnel-card').first().evaluate(el=>{
  const matrix=new DOMMatrix(getComputedStyle(el).transform);
  return {z:matrix.m43,x:matrix.m41,opacity:Number(getComputedStyle(el).opacity),width:el.getBoundingClientRect().width};
 });
}
async function swipe(page,session,width,height){
  const x=Math.round(width*.45),start=Math.round(height*.75),end=Math.round(height*.3);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start}]});
  for(let step=1;step<=10;step++){
   await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:Math.round(start+(end-start)*step/10)}]});
   await page.waitForTimeout(20);
  }
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}

(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[];
 try{
  const context=await browser.newContext({hasTouch:true,isMobile:true,viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const page=await context.newPage();
  // A sessão CDP precisa permanecer aberta: detach limpa a emulação de toque do Chrome.
  const touchSession=await context.newCDPSession(page);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  if(process.env.SITE_ACCESS_URL)await page.goto(process.env.SITE_ACCESS_URL,{waitUntil:'networkidle'});
  for(const [width,height] of [[390,844],[360,800],[320,740],[844,390],[768,1024]]){
   await page.setViewportSize({width,height});
   await page.goto(base,{waitUntil:'networkidle'});
   await expect(page.locator('.perspective-tunnel'),'O celular também deve montar o efeito espacial').toHaveCount(1);
   await expect(page.locator('.tunnel-card'),`Composição compacta em ${width}x${height}`).toHaveCount(4);
   await expect(page.locator('.perspective-tunnel')).toBeVisible();
   await travel(page,.14);
   const initial=await cardState(page);
   const initialStage=await page.locator('.tunnel-viewport').boundingBox();
   await travel(page,.43);
   const middle=await cardState(page);
   const stage=await page.locator('.tunnel-viewport').boundingBox();
   assert.ok(middle.z-initial.z>900,'Artes avançam em profundidade com a rolagem');
   assert.ok(middle.width>initial.width*1.6,'A perspectiva amplia a arte');
   assert.ok(Math.abs(initialStage.y-stage.y)<2,'Palco permanece fixo durante a passagem');
   assert.ok(stage.y>=70 && stage.y+stage.height<=height+2,'Palco cabe na tela, inclusive em paisagem');
   assert.ok(await page.locator('.tunnel-card').evaluateAll(elements=>elements.some(el=>Number(getComputedStyle(el).opacity)>.7)),'Há arte visível na passagem');
   const scrollBefore=await page.evaluate(()=>scrollY);
   await swipe(page,touchSession,width,height);
   await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(scrollBefore+60);
   await page.waitForTimeout(900);
   const afterSwipe=await cardState(page);
   assert.ok(Math.abs(afterSwipe.x-middle.x)<2,'Toque não provoca paralaxe lateral de mouse');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Sem overflow horizontal');
   await travel(page,.43);
   await page.locator('.tunnel-card img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
   await page.screenshot({path:`${output}/${width}x${height}-middle.png`});
   const skip=await page.getByRole('link',{name:'Ver todas as artes'}).boundingBox();
   const float=await page.locator('.whatsapp-float').boundingBox();
   assert.ok(skip.x+skip.width<float.x-4,'Atalho da galeria fica livre do WhatsApp flutuante');
   await page.getByRole('link',{name:'Ver todas as artes'}).tap();
   await expect(page.locator('#eventos-galeria')).toBeInViewport();
   await page.locator('.event-open').first().tap();
   await expect(page.getByRole('dialog')).toBeVisible();
   await page.getByRole('button',{name:'Fechar arte ampliada'}).tap();
   await expect(page.getByRole('dialog')).not.toBeVisible();
   await page.emulateMedia({reducedMotion:'reduce'});
   await expect(page.locator('.perspective-tunnel')).toHaveCount(0);
   await expect(page.locator('.event-tunnel-loading')).toHaveCount(0);
   await expect(page.locator('.event-open')).toHaveCount(4);
   await page.emulateMedia({reducedMotion:'no-preference'});
   await expect(page.locator('.perspective-tunnel')).toHaveCount(1);
   results.push({width,height,initial,middle,afterSwipe,nativeTouch:true,reducedMotion:true});
  }
  // Rotação no mesmo documento, sem recarregar nem remontar a página.
  for(const [width,height] of [[390,844],[844,390],[844,320]]){
   await page.setViewportSize({width,height});
   await expect(page.locator('.perspective-tunnel')).toHaveAttribute('data-compact','true');
   await expect(page.locator('.tunnel-card')).toHaveCount(4);
   await travel(page,.43);
   const stage=await page.locator('.tunnel-viewport').boundingBox();
   assert.ok(stage.y>=70 && stage.y+stage.height<=height+2,'Rotação mantém o palco dentro da tela');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Rotação sem overflow');
   await page.screenshot({path:`${output}/rotation-${width}x${height}.png`});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`${output}/verification.json`,JSON.stringify({base,results,errors},null,2));
  console.log('Túnel mobile: 320/360/390, paisagem e tablet; profundidade real, gesto de toque nativo, galeria/modal e reduced motion passaram.');
  await touchSession.detach();
  await context.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
