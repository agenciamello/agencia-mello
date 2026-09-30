import { RefObject, useEffect } from 'react';

export const MOTION = { micro: .22, reveal: .8, section: 1.15, stagger: .11, ease: 'power3.out' } as const;

export function useStudioMotion(root: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const scope=root.current;
    if(!scope)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let disposeMotion=()=>{};
    let generation=0;
    let destroyed=false;
    let frame=0;
    const serviceLinks: HTMLElement[]=Array.from(scope.querySelectorAll('[data-service-nav]'));
    const servicePanels: HTMLElement[]=Array.from(scope.querySelectorAll('[data-service-index]'));
    const update=()=>{
      frame=0;
      const max=document.documentElement.scrollHeight-innerHeight;
      scope.style.setProperty('--reading-progress',String(max>0?Math.min(1,scrollY/max):0));
      let active=0;
      servicePanels.forEach((panel,index)=>{if(panel.getBoundingClientRect().top<innerHeight*.58)active=index;});
      serviceLinks.forEach((link,index)=>{if(index===active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();

    const setup=async()=>{
      const ticket=++generation;disposeMotion();disposeMotion=()=>{};
      if(reduced.matches){
        scope.querySelectorAll<HTMLElement>('.hero-art,.hero-message,.hero-art-plane,.hero-eyebrow,.hero-description,.hero-actions,.project-image-mask,.project-image-mask>img,.project-heading,.project-open,.mini-browser,.brand-specimen,.brand-swatches i,.sheet-one,.sheet-two,.about-image img,.portrait-mark,.portrait-caption,.contact-mark,[data-scroll-text]>span').forEach(element=>{
          element.style.removeProperty('transform');element.style.removeProperty('opacity');element.style.removeProperty('clip-path');element.style.removeProperty('color');element.style.removeProperty('translate');element.style.removeProperty('scale');
        });
        scope.querySelectorAll<HTMLElement>('[data-project-story]').forEach(element=>element.style.removeProperty('--story-progress'));
        scope.querySelectorAll<HTMLElement>('.project-image-mask').forEach(element=>element.style.removeProperty('--story-shift'));
        scope.querySelector<HTMLElement>('.process-grid')?.style.removeProperty('--process-progress');
        return;
      }
      const [{gsap},{ScrollTrigger}]=await Promise.all([import('gsap'),import('gsap/ScrollTrigger')]);
      if(destroyed||ticket!==generation)return;
      gsap.registerPlugin(ScrollTrigger);
      const disposers:(()=>void)[]=[];
      const context=gsap.context(()=>{
        const media=gsap.matchMedia();
        media.add('(min-width: 901px)',()=>{
          if(scope.querySelector('.experience-hero')){
            gsap.to('.hero-art-plane',{y:65,scale:1.08,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom top',scrub:1}});
            gsap.fromTo('.plane-front',{rotation:-12,scale:.8},{rotation:12,scale:1.8,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom 15%',scrub:.8}});
            gsap.fromTo('.plane-back',{rotation:10},{rotation:-16,scale:1.4,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom 15%',scrub:1}});
            gsap.to('.hero-message',{y:-36,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom top',scrub:.7}});
            gsap.to('.hero-eyebrow',{y:-14,opacity:.55,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'65% top',scrub:.8}});
            gsap.to('.hero-description',{y:-18,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom top',scrub:.9}});
            gsap.to('.hero-actions',{y:-24,ease:'none',scrollTrigger:{trigger:'.experience-hero',start:'top top',end:'bottom top',scrub:1}});
          }
          scope.querySelectorAll<HTMLElement>('[data-scroll-text]').forEach(title=>{
            const lines=title.querySelectorAll(':scope > span');
            if(!lines.length)return;
            gsap.timeline({scrollTrigger:{trigger:title,start:'top 88%',end:'bottom 42%',scrub:.65}})
              .fromTo(lines,{x:-24,opacity:.18,color:'rgba(20,18,23,.24)'},{x:0,opacity:1,color:'#141217',stagger:.22,duration:1,ease:'none'});
          });
          scope.querySelectorAll<HTMLElement>('[data-project-story]').forEach(project=>{
            const mask=project.querySelector('.project-image-mask') as HTMLElement | null;
            const heading=project.querySelector('.project-heading') as HTMLElement | null;
            const open=project.querySelector('.project-open') as HTMLElement | null;
            const story=gsap.timeline({scrollTrigger:{trigger:project,start:'top 82%',end:'bottom 28%',scrub:.8}});
            story.fromTo(project,{'--story-progress':0},{'--story-progress':1,duration:1,ease:'none'},0);
            if(mask)story.fromTo(mask,{'--story-shift':'-12px'},{'--story-shift':'12px',duration:1,ease:'none'},0);
            if(heading)story.fromTo(heading,{x:-24},{x:0,duration:.32,ease:'none'},0);
            if(open)story.fromTo(open,{y:18,opacity:.55},{y:0,opacity:1,duration:.28,ease:MOTION.ease},.08);
          });
          scope.querySelectorAll('.project-image-mask').forEach(element=>gsap.fromTo(element,{clipPath:'inset(6% 3% 6% 3%)',scale:.96},{clipPath:'inset(0% 0% 0% 0%)',scale:1,ease:'none',scrollTrigger:{trigger:element,start:'top 90%',end:'top 30%',scrub:.65}}));
          const work=scope.querySelector('.experience-work');
          if(work)gsap.fromTo(work,{borderRadius:'48px 48px 0 0'},{borderRadius:'0px 0px 0 0',scrollTrigger:{trigger:work,start:'top 92%',end:'top 25%',scrub:.6}});
          scope.querySelectorAll('.project-detail-crop').forEach(crop=>{
            gsap.fromTo(crop.querySelector('img'),{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:crop,start:'top bottom',end:'bottom top',scrub:.8}});
          });
          const portrait=scope.querySelector('.about-image');
          if(portrait){
            const portraitImage=portrait.querySelector('img');
            const portraitMark=portrait.querySelector('.portrait-mark');
            const portraitCaption=portrait.querySelector('.portrait-caption');
            if(portraitImage)gsap.fromTo(portraitImage,{yPercent:-3,scale:1.08},{yPercent:3,scale:1.08,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.7}});
            if(portraitMark)gsap.fromTo(portraitMark,{y:34,rotation:-3},{y:-28,rotation:2,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.85}});
            if(portraitCaption)gsap.fromTo(portraitCaption,{y:-10},{y:14,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:1}});
          }
          const contactMark=scope.querySelector('.contact-mark');
          if(contactMark)gsap.fromTo(contactMark,{rotation:-8,y:45},{rotation:14,y:-20,ease:'none',scrollTrigger:{trigger:'.studio-contact',start:'top bottom',end:'bottom bottom',scrub:1}});
          const process=scope.querySelector('.process-grid');
          if(process)gsap.fromTo(process,{'--process-progress':0},{'--process-progress':1,ease:'none',scrollTrigger:{trigger:process,start:'top 85%',end:'center 45%',scrub:.5}});
          scope.querySelectorAll<HTMLElement>('.service-visual').forEach(visual=>{
            const sequence=gsap.timeline({scrollTrigger:{trigger:visual,start:'top 92%',end:'center 48%',scrub:.6}});
            if(visual.classList.contains('visual-web'))sequence.fromTo(visual.querySelector('.mini-browser'),{y:55,rotation:7,rotateY:-18,scale:.8},{y:0,rotation:-1,rotateY:0,scale:1,ease:'power2.out'});
            if(visual.classList.contains('visual-brand'))sequence.fromTo(visual.querySelector('.brand-specimen'),{x:-35,opacity:.3},{x:0,opacity:1}).fromTo(visual.querySelectorAll('.brand-swatches i'),{scaleY:.08},{scaleY:1,stagger:.12},0).fromTo(visual.querySelector('img'),{rotation:-20,x:40},{rotation:10,x:0},0);
            if(visual.classList.contains('visual-content'))sequence.fromTo(visual.querySelector('.sheet-one'),{y:65,rotation:-20},{y:0,rotation:-8}).fromTo(visual.querySelector('.sheet-two'),{y:100,rotation:25},{y:0,rotation:12},0);
          });
        });
        media.add('(max-width: 900px)',()=>{
          const hero=scope.querySelector<HTMLElement>('.experience-hero');
          const heroArt=scope.querySelector<HTMLElement>('.hero-art');
          const heroMessage=scope.querySelector<HTMLElement>('.hero-message');
          if(hero&&heroArt)gsap.to(heroArt,{y:28,scale:1.025,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.8}});
          if(hero&&heroMessage)gsap.to(heroMessage,{y:-12,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});

          scope.querySelectorAll<HTMLElement>('[data-project-story]').forEach(project=>{
            const mask=project.querySelector('.project-image-mask') as HTMLElement | null;
            const image=mask?.querySelector('img') as HTMLElement | null;
            const heading=project.querySelector('.project-heading') as HTMLElement | null;
            const open=project.querySelector('.project-open') as HTMLElement | null;
            const story=gsap.timeline({scrollTrigger:{trigger:project,start:'top 92%',end:'bottom 38%',scrub:.55}});
            story.fromTo(project,{'--story-progress':0},{'--story-progress':1,duration:1,ease:'none'},0);
            if(mask)story.fromTo(mask,{clipPath:'inset(5% 0 8% 0)',scale:.985},{clipPath:'inset(0% 0 0% 0)',scale:1,duration:.5,ease:'none'},0);
            if(image)story.fromTo(image,{yPercent:-2},{yPercent:2,duration:1,ease:'none'},0);
            if(heading)story.fromTo(heading,{x:-10,opacity:.72},{x:0,opacity:1,duration:.28,ease:'none'},0);
            if(open)story.fromTo(open,{y:10,opacity:.65},{y:0,opacity:1,duration:.24,ease:MOTION.ease},.1);
          });

          scope.querySelectorAll<HTMLElement>('.service-visual').forEach(visual=>{
            const sequence=gsap.timeline({scrollTrigger:{trigger:visual,start:'top 94%',end:'center 55%',scrub:.5}});
            if(visual.classList.contains('visual-web'))sequence.fromTo(visual.querySelector('.mini-browser'),{y:30,rotation:3,scale:.94},{y:0,rotation:-1,scale:1,ease:'power2.out'});
            if(visual.classList.contains('visual-brand'))sequence.fromTo(visual.querySelector('.brand-specimen'),{x:-18,opacity:.55},{x:0,opacity:1}).fromTo(visual.querySelectorAll('.brand-swatches i'),{scaleY:.2},{scaleY:1,stagger:.08},0);
            if(visual.classList.contains('visual-content'))sequence.fromTo(visual.querySelector('.sheet-one'),{y:38,rotation:-15},{y:0,rotation:-8}).fromTo(visual.querySelector('.sheet-two'),{y:55,rotation:18},{y:0,rotation:12},0);
          });

          const portrait=scope.querySelector<HTMLElement>('.about-image');
          if(portrait){
            const image=portrait.querySelector('img');
            const mark=portrait.querySelector('.portrait-mark');
            if(image)gsap.fromTo(image,{yPercent:-2,scale:1.04},{yPercent:2,scale:1.04,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.7}});
            if(mark)gsap.fromTo(mark,{y:20,rotation:-2},{y:-14,rotation:1,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.85}});
          }

          const process=scope.querySelector<HTMLElement>('.process-grid');
          if(process)gsap.fromTo(process,{'--process-progress':0},{'--process-progress':1,ease:'none',scrollTrigger:{trigger:process,start:'top 88%',end:'bottom 48%',scrub:.55}});
          const contactMark=scope.querySelector<HTMLElement>('.contact-mark');
          if(contactMark)gsap.fromTo(contactMark,{rotation:6,y:26},{rotation:14,y:-14,ease:'none',scrollTrigger:{trigger:'.studio-contact',start:'top bottom',end:'bottom bottom',scrub:.8}});
        });
        disposers.push(()=>media.revert());
        const revealTweens: ReturnType<typeof gsap.fromTo>[]=[];
        const observer=new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(!entry.isIntersecting)return;
            observer.unobserve(entry.target);
            const element=entry.target as HTMLElement;
            const kind=element.dataset.reveal;
            if(element.classList.contains('contact-title'))revealTweens.push(gsap.fromTo(element.querySelectorAll('.contact-line>b'),{yPercent:105},{yPercent:0,duration:.8,stagger:.1,ease:MOTION.ease}));
            else if(element.classList.contains('project-heading'))revealTweens.push(gsap.fromTo(element.querySelector('h3 a'),{yPercent:105,rotation:3},{yPercent:0,rotation:0,duration:.8,ease:MOTION.ease}));
            else if(element.classList.contains('footer-signature'))revealTweens.push(gsap.fromTo(element,{clipPath:'inset(0 0 85% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.85,ease:MOTION.ease}));
            else if(kind==='image')revealTweens.push(gsap.fromTo(element,{clipPath:'inset(0 0 14% 0)'},{clipPath:'inset(0 0 0% 0)',duration:MOTION.section,ease:MOTION.ease}));
            else if(kind==='lines')revealTweens.push(gsap.fromTo(element,{opacity:.25,y:20},{opacity:1,y:0,duration:MOTION.reveal,ease:MOTION.ease}));
            else if(kind==='stagger')revealTweens.push(gsap.fromTo(Array.from(element.children),{opacity:0,y:22},{opacity:1,y:0,duration:.72,stagger:.09,ease:MOTION.ease}));
            else if(element.classList.contains('service-visual'))revealTweens.push(gsap.fromTo(element,{opacity:.3,scale:.96},{opacity:1,scale:1,duration:MOTION.section,ease:MOTION.ease}));
            else revealTweens.push(gsap.fromTo(element,{opacity:0,y:kind==='step'?12:0},{opacity:1,y:0,duration:MOTION.reveal,ease:MOTION.ease}));
          });
        },{threshold:.16});
        scope.querySelectorAll('[data-reveal], .project-heading, .service-visual, .showcase-caption, .essential-teaser, .case-story, .case-details > div, .contact-title, .footer-signature').forEach(element=>observer.observe(element));
        disposers.push(()=>{observer.disconnect();revealTweens.forEach(tween=>tween.revert());});
      },scope);

      // Pause the single continuous animation outside the viewport or a hidden tab.
      const ribbon=scope.querySelector<HTMLElement>('.capability-ribbon');
      let ribbonVisible=false;
      const syncRibbon=()=>{if(ribbon)ribbon.dataset.playing=String(ribbonVisible&&!document.hidden);};
      const ribbonObserver=new IntersectionObserver(entries=>{ribbonVisible=entries[0]?.isIntersecting??false;syncRibbon();});
      if(ribbon)ribbonObserver.observe(ribbon);
      document.addEventListener('visibilitychange',syncRibbon);
      disposers.push(()=>{ribbonObserver.disconnect();document.removeEventListener('visibilitychange',syncRibbon);if(ribbon)delete ribbon.dataset.playing;});

      const pointerMedia=gsap.matchMedia();
      pointerMedia.add('(hover: hover) and (pointer: fine) and (min-width: 901px)',()=>{
        const pointerDisposers:(()=>void)[]=[];
        scope.querySelectorAll<HTMLElement>('[data-tilt], .primary-cta, .intent-send, .nav-contact').forEach(element=>{
          let pointerFrame=0;let x=0;let y=0;let rect:DOMRect;
          const enter=()=>{rect=element.getBoundingClientRect();};
          const move=(event:PointerEvent)=>{
            if(!rect)rect=element.getBoundingClientRect();
            x=(event.clientX-rect.left)/rect.width-.5;y=(event.clientY-rect.top)/rect.height-.5;
            if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;
              if(element.hasAttribute('data-tilt'))element.style.transform=`perspective(1400px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`;
              else element.style.transform=`translate(${x*7}px,${y*5}px)`;
            });
          };
          const leave=()=>{cancelAnimationFrame(pointerFrame);pointerFrame=0;element.style.removeProperty('transform');};
          element.addEventListener('pointerenter',enter);element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);
          pointerDisposers.push(()=>{leave();element.removeEventListener('pointerenter',enter);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);});
        });
        const art=scope.querySelector<HTMLElement>('.brand-orbit');const hero=scope.querySelector<HTMLElement>('.experience-hero');
        if(art&&hero){
          let pointerFrame=0;let x=0;let y=0;let px=72;let py=35;
          const move=(event:PointerEvent)=>{
            x=(event.clientX/innerWidth-.5)*14;y=(event.clientY/innerHeight-.5)*10;
            px=Math.round((event.clientX/innerWidth)*100);py=Math.round((event.clientY/innerHeight)*100);
            if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;art.style.transform=`translate(${x}px,${y}px)`;hero.style.setProperty('--pointer-x',`${px}%`);hero.style.setProperty('--pointer-y',`${py}%`);});
          };
          const leave=()=>{cancelAnimationFrame(pointerFrame);pointerFrame=0;art.style.removeProperty('transform');hero.style.removeProperty('--pointer-x');hero.style.removeProperty('--pointer-y');};
          hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);pointerDisposers.push(()=>{leave();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);});
        }
        return()=>pointerDisposers.forEach(dispose=>dispose());
      });
      disposers.push(()=>pointerMedia.revert());
      const refresh=()=>ScrollTrigger.refresh();
      window.addEventListener('load',refresh,{once:true});
      document.fonts.ready.then(()=>{if(!destroyed&&ticket===generation)refresh();});
      disposeMotion=()=>{disposers.forEach(dispose=>dispose());context.revert();window.removeEventListener('load',refresh);};
    };
    void setup();const preferenceChange=()=>{void setup();};reduced.addEventListener('change',preferenceChange);
    return()=>{destroyed=true;generation++;disposeMotion();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',preferenceChange);scope.style.removeProperty('--reading-progress');};
  },[root,route]);
}
