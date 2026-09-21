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
      if(reduced.matches)return;
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
          }
          scope.querySelectorAll('.project-image-mask').forEach(element=>gsap.fromTo(element,{clipPath:'inset(6% 3% 6% 3%)',scale:.96},{clipPath:'inset(0% 0% 0% 0%)',scale:1,ease:'none',scrollTrigger:{trigger:element,start:'top 90%',end:'top 30%',scrub:.65}}));
          const work=scope.querySelector('.experience-work');
          if(work)gsap.fromTo(work,{borderRadius:'48px 48px 0 0'},{borderRadius:'0px 0px 0 0',scrollTrigger:{trigger:work,start:'top 92%',end:'top 25%',scrub:.6}});
          scope.querySelectorAll('.project-detail-crop').forEach(crop=>{
            gsap.fromTo(crop.querySelector('img'),{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:crop,start:'top bottom',end:'bottom top',scrub:.8}});
          });
          const portrait=scope.querySelector('.about-image');
          if(portrait)gsap.fromTo(portrait.querySelector('img'),{yPercent:-3,scale:1.08},{yPercent:3,scale:1.08,ease:'none',scrollTrigger:{trigger:portrait,start:'top bottom',end:'bottom top',scrub:.7}});
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
        scope.querySelectorAll<HTMLElement>('[data-tilt], .primary-cta').forEach(element=>{
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
        if(art&&hero){let pointerFrame=0;let x=0;let y=0;const move=(event:PointerEvent)=>{x=(event.clientX/innerWidth-.5)*14;y=(event.clientY/innerHeight-.5)*10;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;art.style.transform=`translate(${x}px,${y}px)`;});};const leave=()=>{cancelAnimationFrame(pointerFrame);pointerFrame=0;art.style.removeProperty('transform');};hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);pointerDisposers.push(()=>{leave();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);});}
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
