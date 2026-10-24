const {chromium,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.SITE_URL||'http://127.0.0.1:4175';
const output='artifacts/eventos-23/tunnel';

async function travel(page,progress){
  await page.locator('.perspective-tunnel').evaluate((element,p)=>{
    const top=element.getBoundingClientRect().top+scrollY;
    const height=element.getBoundingClientRect().height;
    const stage=element.querySelector('.tunnel-viewport');
    window.scrollTo({top:top-88+p*(height-stage.clientHeight),behavior:'instant'});
  },progress);
  await page.waitForTimeout(1200);
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base);
    // Regression: an animated row of inclined images is not the supplied tunnel.
    await expect(page.locator('.perspective-tunnel'),'Reference requires a spatial tunnel, not just a tilted gallery').toHaveCount(1);
    await expect(page.locator('.tunnel-card')).toHaveCount(8);
    await page.evaluate(()=>document.fonts.ready);
    await travel(page,.15);
    const initial=await page.locator('.tunnel-card').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m43);
    const initialWidth=(await page.locator('.tunnel-card').first().boundingBox()).width;
    const firstStage=await page.locator('.tunnel-viewport').boundingBox();
    await page.screenshot({path:`${output}/desktop-start.png`});
    await travel(page,.5);
    const middle=await page.locator('.tunnel-card').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m43);
    const middleWidth=(await page.locator('.tunnel-card').first().boundingBox()).width;
    const middleStage=await page.locator('.tunnel-viewport').boundingBox();
    assert.ok(Math.abs(firstStage.y-middleStage.y)<2,'Viewport stays in place while flying through the tunnel');
    assert.ok(initial < -900 && middle-initial>900,'Cards must travel a large distance toward the camera');
    assert.ok(middleWidth>initialWidth*1.8,'Perspective must visibly enlarge the art approaching the camera');
    const visible=await page.locator('.tunnel-card').evaluateAll(elements=>elements.map(el=>Number(getComputedStyle(el).opacity)));
    assert.ok(visible.some(value=>value>.7),'At least one artwork is visible in the middle of the tunnel');
    await page.screenshot({path:`${output}/desktop-middle.png`});
    const pointerBefore=await page.locator('.tunnel-card').nth(3).evaluate(el=>getComputedStyle(el).transform);
    await page.mouse.move(200,200);await page.waitForTimeout(650);
    const pointerAfter=await page.locator('.tunnel-card').nth(3).evaluate(el=>getComputedStyle(el).transform);
    assert.notEqual(pointerBefore,pointerAfter,'Reference camera parallax reacts to pointer movement');
    await travel(page,.83);
    const last=await page.locator('.tunnel-card').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m43);
    const lastOpacity=await page.locator('.tunnel-card').first().evaluate(el=>Number(getComputedStyle(el).opacity));
    assert.ok(last>450 && lastOpacity<.1,'Cards pass the camera and fade out');
    await page.screenshot({path:`${output}/desktop-end.png`});
    await travel(page,.4);
    const scrollBefore=await page.evaluate(()=>scrollY);
    await page.mouse.move(720,500);await page.mouse.wheel(0,250);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(scrollBefore+100);
    // Keyboard users can skip the decorative passage directly to the complete artworks.
    await page.getByRole('link',{name:'Ver todas as artes'}).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#eventos-galeria')).toBeInViewport();
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.perspective-tunnel')).toHaveCount(0);
    await expect(page.locator('.event-open')).toHaveCount(4);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await expect(page.locator('.perspective-tunnel')).toHaveCount(1);
    await page.setViewportSize({width:390,height:844});
    await expect(page.locator('.perspective-tunnel')).toHaveCount(0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
    fs.writeFileSync(`${output}/verification.json`,JSON.stringify({initialZ:initial,middleZ:middle,lastZ:last,lastOpacity,sticky:true,pointer:true,nativeWheel:true,reducedMotion:true,mobileFallback:true,errors},null,2));
    console.log('Tunnel: long Z travel, staggered visibility, sticky viewport, pointer parallax, native scroll, keyboard skip, reduced motion and mobile fallback passed.');
    await context.close();
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
