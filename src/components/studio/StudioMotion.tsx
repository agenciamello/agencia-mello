import { RefObject, useEffect } from 'react';

export const MOTION = { micro: .22, reveal: .62, section: .9, stagger: .08, ease: 'power3.out' } as const;

export function useStudioMotion(root: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
    let disposeMotion = () => {};
    let generation = 0;
    let destroyed = false;
    let frame = 0;

    const serviceLinks: HTMLElement[] = Array.from(scope.querySelectorAll('[data-service-nav]'));
    const servicePanels: HTMLElement[] = Array.from(scope.querySelectorAll('[data-service-index]'));
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      scope.style.setProperty('--reading-progress', String(max > 0 ? Math.min(1, scrollY / max) : 0));
      let active = 0;
      servicePanels.forEach((panel, index) => {
        if (panel.getBoundingClientRect().top < innerHeight * .58) active = index;
      });
      serviceLinks.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    const setup = async () => {
      const ticket = ++generation;
      disposeMotion();
      disposeMotion = () => {};

      const ribbon = scope.querySelector<HTMLElement>('.capability-ribbon');
      if (ribbon) delete ribbon.dataset.playing;
      if (reduced.matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (destroyed || ticket !== generation) return;
      gsap.registerPlugin(ScrollTrigger);

      const cleanups: Array<() => void> = [];
      const isDesktop = desktop.matches;
      const context = gsap.context(() => {
        const hero = scope.querySelector<HTMLElement>('.experience-hero');
        const symbol = scope.querySelector<HTMLElement>('.hero-art-plane');
        const message = scope.querySelector<HTMLElement>('.hero-message');
        const eyebrow = scope.querySelector<HTMLElement>('.hero-eyebrow');

        if (hero && symbol && isDesktop) {
          gsap.to(symbol, { y: 30, rotation: 1.5, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .75 } });
        }
        if (hero && message && isDesktop) {
          gsap.to(message, { y: -14, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .9 } });
        }        if (hero && eyebrow && isDesktop) {
          gsap.to(eyebrow, { y: -7, opacity: .72, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: '65% top', scrub: .9 } });
        }

        scope.querySelectorAll<HTMLElement>('[data-scroll-text]').forEach(title => {
          const lines = title.querySelectorAll(':scope > span');
          if (!lines.length) return;
          gsap.timeline({ scrollTrigger: {
            trigger: title, start: 'top 90%', end: 'bottom 48%', scrub: isDesktop ? .7 : .45,
          }})
            .fromTo(lines,
              { x: isDesktop ? -18 : -8, opacity: .58 },
              { x: 0, opacity: 1, stagger: .15, duration: 1, ease: 'none' });
        });

        scope.querySelectorAll<HTMLElement>('.showcase-image, .study-image').forEach(frameEl => {
          const image = frameEl.querySelector('img');
          if (!image) return;
          gsap.fromTo(image,
            { yPercent: isDesktop ? -2.5 : -1.2, scale: isDesktop ? 1.025 : 1.012 },
            { yPercent: isDesktop ? 2.5 : 1.2, scale: isDesktop ? 1.025 : 1.012, ease: 'none',
              scrollTrigger: { trigger: frameEl, start: 'top bottom', end: 'bottom top', scrub: .8 } });
        });

        scope.querySelectorAll<HTMLElement>('.service-visual').forEach(visual => {
          const sequence = gsap.timeline({ scrollTrigger: {
            trigger: visual, start: 'top 92%', end: 'center 52%', scrub: isDesktop ? .55 : .4,
          }});
          if (visual.classList.contains('visual-web')) {
            sequence.fromTo(visual.querySelector('.mini-browser'),
              { y: isDesktop ? 32 : 18, rotation: 2.5, scale: .96 },
              { y: 0, rotation: -2, scale: 1, ease: 'power2.out' });
          }          if (visual.classList.contains('visual-brand')) {
            sequence
              .fromTo(visual.querySelector('.brand-specimen'), { x: -18, opacity: .62 }, { x: 0, opacity: 1 }, 0)
              .fromTo(visual.querySelectorAll('.brand-swatches i'), { scaleY: .3 }, { scaleY: 1, stagger: .08 }, 0)
              .fromTo(visual.querySelector('img'), { rotation: -3, x: 16 }, { rotation: 0, x: 0 }, 0);
          }
          if (visual.classList.contains('visual-content')) {
            sequence
              .fromTo(visual.querySelector('.sheet-one'), { y: 28, rotation: -12 }, { y: 0, rotation: -8 }, 0)
              .fromTo(visual.querySelector('.sheet-two'), { y: 42, rotation: 17 }, { y: 0, rotation: 12 }, 0);
          }
        });

        const portrait = scope.querySelector<HTMLElement>('.about-image');
        if (portrait) {
          const image = portrait.querySelector('img');
          const mark = portrait.querySelector('.portrait-mark');
          if (image) gsap.fromTo(image, { yPercent: -2, scale: 1.025 }, { yPercent: 2, scale: 1.025, ease: 'none',
            scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: .8 } });
          if (mark) gsap.fromTo(mark, { y: 15, rotation: -1.5 }, { y: -12, rotation: 1, ease: 'none',
            scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: .9 } });
        }

        const contactMark = scope.querySelector<HTMLElement>('.contact-mark');
        if (contactMark) gsap.fromTo(contactMark, { y: 22, rotation: -3 }, { y: -12, rotation: 3, ease: 'none',
          scrollTrigger: { trigger: '.studio-contact', start: 'top bottom', end: 'bottom bottom', scrub: .9 } });        scope.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach(element => {
          gsap.fromTo(element, { y: 14, opacity: .72 }, { y: 0, opacity: 1, duration: MOTION.reveal, ease: MOTION.ease,
            scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
        });
        scope.querySelectorAll<HTMLElement>('[data-reveal="stagger"]').forEach(element => {
          gsap.fromTo(Array.from(element.children), { y: 16, opacity: .68 },
            { y: 0, opacity: 1, duration: .58, stagger: MOTION.stagger, ease: MOTION.ease,
              scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
        });

        const portraitImage = scope.querySelector<HTMLElement>('[data-reveal="image"]');
        if (portraitImage) {
          gsap.fromTo(portraitImage, { clipPath: 'inset(0 0 10% 0)', opacity: .78 },
            { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: MOTION.section, ease: MOTION.ease,
              scrollTrigger: { trigger: portraitImage, start: 'top 90%', once: true } });
        }

        const contactLines = scope.querySelectorAll<HTMLElement>('.contact-line>b');
        if (contactLines.length) {
          gsap.fromTo(contactLines, { yPercent: 104 },
            { yPercent: 0, duration: .72, stagger: .08, ease: MOTION.ease,
              scrollTrigger: { trigger: '.contact-title', start: 'top 88%', once: true } });
        }
        const footer = scope.querySelector<HTMLElement>('.footer-signature');
        if (footer) gsap.fromTo(footer, { y: 14, opacity: .72 }, { y: 0, opacity: 1, duration: .7, ease: MOTION.ease,
          scrollTrigger: { trigger: footer, start: 'top 94%', once: true } });
      }, scope);      let ribbonVisible = false;
      const syncRibbon = () => {
        if (ribbon) ribbon.dataset.playing = String(ribbonVisible && !document.hidden);
      };
      const ribbonObserver = new IntersectionObserver(entries => {
        ribbonVisible = entries[0]?.isIntersecting ?? false;
        syncRibbon();
      }, { threshold: .05 });
      if (ribbon) ribbonObserver.observe(ribbon);
      document.addEventListener('visibilitychange', syncRibbon);
      cleanups.push(() => {
        ribbonObserver.disconnect();
        document.removeEventListener('visibilitychange', syncRibbon);
        if (ribbon) delete ribbon.dataset.playing;
      });

      if (isDesktop) {
        const pointerDisposers: Array<() => void> = [];
        scope.querySelectorAll<HTMLElement>('.primary-cta, .nav-contact, .intent-send').forEach(element => {
          let rect: DOMRect | undefined;
          const enter = () => { rect = element.getBoundingClientRect(); };
          const move = (event: PointerEvent) => {
            rect ||= element.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - .5) * 5;
            const y = ((event.clientY - rect.top) / rect.height - .5) * 3;
            element.style.transform = `translate(${x}px,${y}px)`;
          };
          const leave = () => { rect = undefined; element.style.removeProperty('transform'); };
          element.addEventListener('pointerenter', enter);
          element.addEventListener('pointermove', move);
          element.addEventListener('pointerleave', leave);
          pointerDisposers.push(() => {
            leave(); element.removeEventListener('pointerenter', enter);
            element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave);
          });
        });        const hero = scope.querySelector<HTMLElement>('.experience-hero');
        const sculpture = scope.querySelector<HTMLElement>('.brand-sculpture');
        if (hero && sculpture) {
          const move = (event: PointerEvent) => {
            const x = (event.clientX / innerWidth - .5) * 8;
            const y = (event.clientY / innerHeight - .5) * 6;
            sculpture.style.transform = `translate(${x}px,${y}px)`;
          };
          const leave = () => sculpture.style.removeProperty('transform');
          hero.addEventListener('pointermove', move);
          hero.addEventListener('pointerleave', leave);
          pointerDisposers.push(() => {
            leave(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', leave);
          });
        }
        cleanups.push(() => pointerDisposers.forEach(dispose => dispose()));
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });
      document.fonts.ready.then(() => { if (!destroyed && ticket === generation) refresh(); });

      disposeMotion = () => {
        cleanups.forEach(cleanup => cleanup());
        context.revert();
        window.removeEventListener('load', refresh);
      };
    };

    void setup();
    const preferenceChange = () => { void setup(); };
    reduced.addEventListener('change', preferenceChange);
    desktop.addEventListener('change', preferenceChange);
    return () => {
      destroyed = true;
      generation++;
      disposeMotion();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', preferenceChange);
      desktop.removeEventListener('change', preferenceChange);
      scope.style.removeProperty('--reading-progress');
    };
  }, [root, route]);
}
