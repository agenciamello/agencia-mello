const {chromium,expect}=require('@playwright/test');
const {buildSync}=require('esbuild');
const assert=require('node:assert/strict');
const fs=require('node:fs');

// Isolated browser fixture uses the real component, not a duplicate implementation.
const bundle=buildSync({stdin:{contents:`
import React from 'react';
import {createRoot} from 'react-dom/client';
import {TextReveal} from './src/components/ui/text-reveal';
const root=createRoot(document.getElementById('root'));
window.revealCalls={start:0,complete:0};
window.renderReveal=props=>root.render(<TextReveal {...props} onAnimationStart={()=>window.revealCalls.start++} onAnimationComplete={()=>window.revealCalls.complete++}/>);
`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',loader:{'.css':'empty'},define:{'process.env.NODE_ENV':'"production"'}}).outputFiles[0].text;

(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'no-preference'});
  await page.setContent('<main id="root"></main>');
  await page.addStyleTag({content:fs.readFileSync('src/components/ui/text-reveal.css','utf8')});
  await page.addScriptTag({content:bundle});
  const text='Ação 💜 de marca\nSegunda linha';
  for(const per of ['word','char','line']){
   await page.evaluate(({per,text})=>window.renderReveal({as:'h2',per,preset:'fade-in-blur',startOnView:false,children:text}),{per,text});
   const heading=page.getByRole('heading',{name:'Ação 💜 de marca Segunda linha'});
   await expect(heading).toBeVisible();
   await expect.poll(()=>heading.locator('[data-text-segment]').evaluateAll(els=>els.some(el=>{const opacity=Number(getComputedStyle(el).opacity);return opacity>.01 && opacity<.99;})),{intervals:[20,40,60]}).toBe(true);
   await expect(heading).toHaveAttribute('data-reveal-state','complete');
   await expect(heading.locator('.text-reveal-accessible')).toHaveCount(1);
   await expect(heading.locator('.text-reveal-visual')).toHaveAttribute('aria-hidden','true');
   if(per==='line') await expect(heading.locator('[data-text-segment]')).toHaveCount(2);
   if(per==='char') assert.equal(await heading.locator('[data-text-segment]').allTextContents().then(items=>items.filter(x=>x==='💜').length),1);
   await page.evaluate(({per,text})=>window.renderReveal({as:'h2',per,preset:'fade-in-blur',startOnView:false,children:text,trigger:false}),{per,text});
   await expect(page.locator('.text-reveal')).toHaveCount(0);
  }
  for(const preset of ['blur','fade','slide','scale','fade-in-blur']){
   await page.evaluate(preset=>window.renderReveal({as:'h2',preset,startOnView:false,children:'Prévia acessível',speedReveal:0,speedSegment:0}),preset);
   await expect(page.locator('.text-reveal')).toHaveAttribute('data-reveal-state','complete');
   await page.evaluate(preset=>window.renderReveal({as:'h2',preset,startOnView:false,children:'Prévia acessível',trigger:false}),preset);
   await expect(page.locator('.text-reveal')).toHaveCount(0);
  }
  assert.ok(await page.evaluate(()=>window.revealCalls.start>=8 && window.revealCalls.complete>=8),'Callbacks acompanham as entradas reais');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>window.renderReveal({as:'h2',per:'char',children:'Texto estático'}));
  await expect(page.getByRole('heading',{name:'Texto estático'})).toHaveAttribute('data-reveal-state','static');
  await expect(page.locator('[data-text-segment]')).toHaveCount(0);
  console.log('TextReveal API: word/char/line, emoji, nomes acessíveis, cinco presets, trigger/callbacks e reduced motion passaram no componente real.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
