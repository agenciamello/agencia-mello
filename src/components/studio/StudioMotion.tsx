import { RefObject, useEffect } from 'react';

export const MOTION = { micro: .22, reveal: .62, section: .9, stagger: .08, ease: 'power3.out' } as const;

export function useStudioMotion(root: RefObject<HTMLDivElement | null>, route: string) {
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
    const mobile = matchMedia('(max-width: 700px)');
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
      const isMobile = mobile.matches;
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

        if (isMobile) {
          const serviceIntro = scope.querySelector<HTMLElement>('[data-service-intro]');
          if (serviceIntro) {
            const introLines = serviceIntro.querySelectorAll<HTMLElement>('.service-title-line');
            const introLabel = serviceIntro.querySelector<HTMLElement>('.section-label');
            const introParagraph = serviceIntro.querySelector<HTMLElement>(':scope > p');
            const introLinks = serviceIntro.querySelectorAll<HTMLElement>('[data-service-nav]');
            const introTimeline = gsap.timeline({ scrollTrigger: {
              trigger: serviceIntro, start: 'top 92%', end: 'bottom 42%', scrub: .62,
            }});
            if (introLabel) introTimeline.fromTo(introLabel,
              { x: -16, opacity: .45 }, { x: 0, opacity: 1, duration: .3, ease: 'none' }, 0);
            if (introLines.length) introTimeline.fromTo(introLines,
              { x: (index: number) => index === 1 ? 24 : -24, opacity: .28, scale: .965 },
              { x: 0, opacity: 1, scale: 1, stagger: .12, duration: .72, ease: 'none' }, .04);
            introTimeline.to(serviceIntro, { '--service-accent': 1, duration: .4, ease: 'none' }, .34);
            if (introParagraph) introTimeline.fromTo(introParagraph,
              { y: 22, opacity: .35 }, { y: 0, opacity: 1, duration: .5, ease: 'none' }, .42);
            if (introLinks.length) introTimeline.fromTo(introLinks,
              { x: 18, opacity: .38 }, { x: 0, opacity: 1, stagger: .07, duration: .52, ease: 'none' }, .5);
          }

          scope.querySelectorAll('[data-service-chapter]').forEach((chapterNode, index) => {
            const chapter = chapterNode as HTMLElement;
            const top = chapter.querySelector('.service-chapter-top') as HTMLElement | null;
            const visual = chapter.querySelector('.service-visual') as HTMLElement | null;
            const copies = chapter.querySelectorAll('[data-service-copy]');
            const action = chapter.querySelector('.text-link') as HTMLElement | null;

            gsap.to(chapter, { '--chapter-progress': 1, ease: 'none',
              scrollTrigger: { trigger: chapter, start: 'top 88%', end: 'bottom 48%', scrub: .55 } });

            if (top) gsap.fromTo(top,
              { x: -16, opacity: .45 }, { x: 0, opacity: 1, ease: 'none',
                scrollTrigger: { trigger: top, start: 'top 94%', end: 'top 70%', scrub: .45 } });

            if (visual) {
              gsap.fromTo(visual,
                { y: 46, scale: .925, rotation: index === 1 ? 2.4 : index === 2 ? -2.8 : 1.8,
                  clipPath: 'inset(7% 4% 7% 4%)', opacity: .64 },
                { y: 0, scale: 1, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'none',
                  scrollTrigger: { trigger: visual, start: 'top 94%', end: 'center 52%', scrub: .52 } });

              const scan = visual.querySelector<HTMLElement>('.service-scan-line');
              if (scan) gsap.fromTo(scan,
                { y: -2, opacity: 0 },
                { y: () => Math.max(120, visual.clientHeight + 4), opacity: .78, ease: 'none',
                  scrollTrigger: { trigger: visual, start: 'top 91%', end: 'bottom 44%', scrub: .5 } });
            }

            copies.forEach((copy, copyIndex) => {
              gsap.fromTo(copy,
                { y: 24, x: copyIndex === 0 ? -12 : 10, opacity: .36 },
                { y: 0, x: 0, opacity: 1, ease: 'none',
                  scrollTrigger: { trigger: copy, start: 'top 93%', end: 'top 66%', scrub: .45 } });
            });

            if (action) gsap.fromTo(action,
              { y: 16, opacity: .45 }, { y: 0, opacity: 1, ease: 'none',
                scrollTrigger: { trigger: action, start: 'top 94%', end: 'top 76%', scrub: .4 } });
          });
        }

        scope.querySelectorAll<HTMLElement>('.service-visual').forEach(visual => {
          const sequence = gsap.timeline({ scrollTrigger: {
            trigger: visual, start: 'top 92%', end: 'center 52%', scrub: isDesktop ? .55 : isMobile ? .5 : .4,
          }});
          if (visual.classList.contains('visual-web')) {
            sequence.fromTo(visual.querySelector('.mini-browser'),
              { y: isDesktop ? 32 : isMobile ? 46 : 18, rotation: isMobile ? 6 : 2.5, scale: isMobile ? .9 : .96 },
              { y: 0, rotation: -2, scale: 1, ease: isMobile ? 'none' : 'power2.out' });
          }
          if (visual.classList.contains('visual-brand')) {
            sequence
              .fromTo(visual.querySelector('.brand-specimen'),
                { x: isMobile ? -44 : -18, opacity: isMobile ? .28 : .62 },
                { x: 0, opacity: 1, ease: isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelectorAll('.brand-swatches i'),
                { scaleY: isMobile ? .05 : .3, transformOrigin: 'bottom' },
                { scaleY: 1, stagger: .08, ease: isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelector('img'),
                { rotation: isMobile ? -14 : -3, x: isMobile ? 38 : 16, scale: isMobile ? .84 : 1 },
                { rotation: 8, x: 0, scale: 1, ease: isMobile ? 'none' : 'power2.out' }, 0);
          }
          if (visual.classList.contains('visual-content')) {
            sequence
              .fromTo(visual.querySelector('.sheet-one'),
                { y: isMobile ? 62 : 28, x: isMobile ? -20 : 0, rotation: isMobile ? -22 : -12 },
                { y: 0, x: 0, rotation: -5, ease: isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelector('.sheet-two'),
                { y: isMobile ? 76 : 42, x: isMobile ? 20 : 0, rotation: isMobile ? 26 : 17 },
                { y: 0, x: 0, rotation: 8, ease: isMobile ? 'none' : 'power2.out' }, 0);
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
    mobile.addEventListener('change', preferenceChange);
    return () => {
      destroyed = true;
      generation++;
      disposeMotion();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', preferenceChange);
      desktop.removeEventListener('change', preferenceChange);
      mobile.removeEventListener('change', preferenceChange);
      scope.style.removeProperty('--reading-progress');
    };
  }, [root, route]);
}
