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
          gsap.to(symbol, { y: 44, rotation: 1.35, scale: .975, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .78 } });
        }
        if (hero && message && isDesktop) {
          gsap.to(message, { y: -18, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .92 } });
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

        const thesis = scope.querySelector<HTMLElement>('.project-thesis');
        if (thesis) {
          const words = thesis.querySelectorAll<HTMLElement>('.project-thesis-word');
          const ending = thesis.querySelector<HTMLElement>('.project-thesis-end');
          if (words.length) {
            const thesisTimeline = gsap.timeline({ scrollTrigger: {
              trigger: thesis, start: isMobile ? 'top 86%' : 'top 84%', once: true,
            }});
            thesisTimeline.fromTo(words,
              { y: isMobile ? 14 : 18, opacity: .14, filter: 'blur(10px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .48 : .54,
                stagger: isMobile ? .045 : .05, ease: 'power3.out' });
            if (ending) thesisTimeline.to(ending,
              { '--thesis-line': 1, duration: .38, ease: 'power2.out' });
          }
        }

        const bridgeReveal = scope.querySelector<HTMLElement>('.copy-bridge-reveal');
        if (bridgeReveal) {
          const words = bridgeReveal.querySelectorAll<HTMLElement>('.copy-bridge-word');
          if (words.length) {
            gsap.fromTo(words,
              { y: isMobile ? 14 : 16, opacity: .14, filter: 'blur(10px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .5 : .54,
                stagger: isMobile ? .055 : .06, ease: 'power3.out',
                scrollTrigger: {
                  trigger: bridgeReveal,
                  start: isMobile ? 'top 88%' : 'top 86%',
                  once: true,
                },
              });
          }
        }

        const processTypewriter = scope.querySelector<HTMLElement>('.process-typewriter');
        if (processTypewriter) {
          const chars = processTypewriter.querySelectorAll<HTMLElement>('.process-typewriter-char');
          const caret = processTypewriter.querySelector<HTMLElement>('.process-typewriter-caret');
          if (chars.length) {
            gsap.set(chars, { opacity: 0 });
            if (caret) gsap.set(caret, { opacity: 0 });
            processTypewriter.classList.remove('is-typed');
            const typingTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: processTypewriter,
                start: isMobile ? 'top 90%' : 'top 84%',
                once: true,
              },
              onComplete: () => processTypewriter.classList.add('is-typed'),
            });
            typingTimeline.to(chars, {
              opacity: 1,
              duration: .01,
              stagger: isMobile ? .028 : .034,
              ease: 'none',
            });
            if (caret) typingTimeline.set(caret, { opacity: 1 });
            cleanups.push(() => processTypewriter.classList.remove('is-typed'));
          }
        }

        const processTimeline = scope.querySelector<HTMLElement>('[data-process-timeline]');
        if (processTimeline) {
          const steps = Array.from(processTimeline.querySelectorAll('[data-process-step]')) as HTMLElement[];
          const nodes = Array.from(processTimeline.querySelectorAll('.process-step-node')) as HTMLElement[];
          const compactTimeline = window.innerWidth <= 900;
          gsap.set(processTimeline, { '--timeline-progress': 0 });

          if (compactTimeline) {
            gsap.to(processTimeline, {
              '--timeline-progress': 1,
              ease: 'none',
              scrollTrigger: {
                trigger: processTimeline,
                start: 'top 78%',
                end: 'bottom 34%',
                scrub: .62,
              },
            });

            steps.forEach((step, index) => {
              const node = step.querySelector<HTMLElement>('.process-step-node');
              const copy = step.querySelectorAll<HTMLElement>('.micro, h3, p');
              if (node) {
                gsap.fromTo(node,
                  { scale: .2, opacity: .25, backgroundColor: '#0b0b0d' },
                  { scale: 1, opacity: 1, backgroundColor: '#ec4899', ease: 'none',
                    scrollTrigger: {
                      trigger: step,
                      start: 'top 83%',
                      end: 'top 58%',
                      scrub: .45,
                    },
                  });
              }
              if (copy.length) {
                gsap.fromTo(copy,
                  { x: index % 2 === 0 ? 14 : 20, y: 14, opacity: .3 },
                  { x: 0, y: 0, opacity: 1, stagger: .07, ease: 'none',
                    scrollTrigger: {
                      trigger: step,
                      start: 'top 86%',
                      end: 'center 62%',
                      scrub: .5,
                    },
                  });
              }
            });
          } else {
            gsap.set(nodes, { scale: .2, opacity: .25, backgroundColor: '#0b0b0d' });
            gsap.set(steps, { y: 34, opacity: .28 });
            const journey = gsap.timeline({
              scrollTrigger: {
                trigger: processTimeline,
                start: 'top 84%',
                end: 'bottom 44%',
                scrub: .72,
              },
              defaults: { ease: 'none' },
            });
            journey
              .to(processTimeline, { '--timeline-progress': 1, duration: 1 }, 0)
              .to(nodes, {
                scale: 1,
                opacity: 1,
                backgroundColor: '#ec4899',
                stagger: .2,
                duration: .22,
              }, .04)
              .to(steps, {
                y: 0,
                opacity: 1,
                stagger: .18,
                duration: .32,
              }, .08);
          }
        }

        scope.querySelectorAll<HTMLElement>('.showcase-image, .study-image').forEach(frameEl => {
          const image = frameEl.querySelector('img');
          if (!image) return;
          gsap.fromTo(image,
            { yPercent: isDesktop ? -2.5 : -1.2, scale: isDesktop ? 1.025 : 1.012 },
            { yPercent: isDesktop ? 2.5 : 1.2, scale: isDesktop ? 1.025 : 1.012, ease: 'none',
              scrollTrigger: { trigger: frameEl, start: 'top bottom', end: 'bottom top', scrub: .8 } });
        });

        if (isDesktop) {
          const serviceIntro = scope.querySelector<HTMLElement>('[data-service-intro]');
          if (serviceIntro) {
            const introLines = serviceIntro.querySelectorAll<HTMLElement>('.service-title-line');
            const introLabel = serviceIntro.querySelector<HTMLElement>('.section-label');
            const introParagraph = serviceIntro.querySelector<HTMLElement>(':scope > p');
            const introLinks = serviceIntro.querySelectorAll<HTMLElement>('[data-service-nav]');
            const introTimeline = gsap.timeline({ scrollTrigger: {
              trigger: serviceIntro, start: 'top 82%', end: 'bottom 38%', scrub: .78,
            }});
            if (introLabel) introTimeline.fromTo(introLabel,
              { x: -24, opacity: .42 }, { x: 0, opacity: 1, duration: .3, ease: 'none' }, 0);
            if (introLines.length) introTimeline.fromTo(introLines,
              { x: (index: number) => index === 1 ? 34 : -34, opacity: .3, scale: .975 },
              { x: 0, opacity: 1, scale: 1, stagger: .13, duration: .76, ease: 'none' }, .02);
            introTimeline.to(serviceIntro, { '--service-accent': 1, duration: .38, ease: 'none' }, .34);
            if (introParagraph) introTimeline.fromTo(introParagraph,
              { y: 24, opacity: .4 }, { y: 0, opacity: 1, duration: .48, ease: 'none' }, .42);
            if (introLinks.length) introTimeline.fromTo(introLinks,
              { x: 20, opacity: .42 }, { x: 0, opacity: 1, stagger: .06, duration: .5, ease: 'none' }, .5);
          }

          scope.querySelectorAll('[data-service-chapter]').forEach((chapterNode, index) => {
            const chapter = chapterNode as HTMLElement;
            const top = chapter.querySelector('.service-chapter-top') as HTMLElement | null;
            const visual = chapter.querySelector('.service-visual') as HTMLElement | null;
            const copies = chapter.querySelectorAll('[data-service-copy]');
            const action = chapter.querySelector('.text-link') as HTMLElement | null;

            gsap.to(chapter, { '--chapter-progress': 1, ease: 'none',
              scrollTrigger: { trigger: chapter, start: 'top 80%', end: 'bottom 46%', scrub: .65 } });

            if (top) gsap.fromTo(top,
              { x: -20, opacity: .46 }, { x: 0, opacity: 1, ease: 'none',
                scrollTrigger: { trigger: top, start: 'top 88%', end: 'top 64%', scrub: .52 } });

            if (visual) {
              gsap.fromTo(visual,
                { y: 72, scale: .9, rotation: index === 1 ? -2.8 : index === 2 ? 3.2 : 2.4,
                  clipPath: 'inset(6% 5% 6% 5%)', opacity: .58 },
                { y: 0, scale: 1, rotation: 0, clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'none',
                  scrollTrigger: { trigger: visual, start: 'top 88%', end: 'center 48%', scrub: .68 } });

              const scan = visual.querySelector<HTMLElement>('.service-scan-line');
              if (scan) gsap.fromTo(scan,
                { y: -2, opacity: 0 },
                { y: () => Math.max(160, visual.clientHeight + 4), opacity: .72, ease: 'none',
                  scrollTrigger: { trigger: visual, start: 'top 84%', end: 'bottom 38%', scrub: .62 } });
            }

            copies.forEach((copy, copyIndex) => {
              gsap.fromTo(copy,
                { y: 26, x: copyIndex === 0 ? -12 : 12, opacity: .4 },
                { y: 0, x: 0, opacity: 1, ease: 'none',
                  scrollTrigger: { trigger: copy, start: 'top 88%', end: 'top 62%', scrub: .5 } });
            });

            if (action) gsap.fromTo(action,
              { y: 18, opacity: .45 }, { y: 0, opacity: 1, ease: 'none',
                scrollTrigger: { trigger: action, start: 'top 90%', end: 'top 70%', scrub: .44 } });
          });
        }

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
              { y: isDesktop ? 76 : isMobile ? 46 : 18, rotation: isDesktop ? 6 : isMobile ? 6 : 2.5, scale: isDesktop ? .88 : isMobile ? .9 : .96 },
              { y: 0, rotation: -2, scale: 1, ease: isDesktop || isMobile ? 'none' : 'power2.out' });
          }
          if (visual.classList.contains('visual-brand')) {
            sequence
              .fromTo(visual.querySelector('.brand-specimen'),
                { x: isDesktop ? -70 : isMobile ? -44 : -18, opacity: isDesktop ? .22 : isMobile ? .28 : .62 },
                { x: 0, opacity: 1, ease: isDesktop || isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelectorAll('.brand-swatches i'),
                { scaleY: isDesktop || isMobile ? .05 : .3, transformOrigin: 'bottom' },
                { scaleY: 1, stagger: .08, ease: isDesktop || isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelector('img'),
                { rotation: isDesktop ? -16 : isMobile ? -14 : -3, x: isDesktop ? 54 : isMobile ? 38 : 16, scale: isDesktop ? .8 : isMobile ? .84 : 1 },
                { rotation: 8, x: 0, scale: 1, ease: isDesktop || isMobile ? 'none' : 'power2.out' }, 0);
          }
          if (visual.classList.contains('visual-content')) {
            sequence
              .fromTo(visual.querySelector('.sheet-one'),
                { y: isDesktop ? 88 : isMobile ? 62 : 28, x: isDesktop ? -34 : isMobile ? -20 : 0, rotation: isDesktop ? -25 : isMobile ? -22 : -12 },
                { y: 0, x: 0, rotation: -5, ease: isDesktop || isMobile ? 'none' : 'power2.out' }, 0)
              .fromTo(visual.querySelector('.sheet-two'),
                { y: isDesktop ? 104 : isMobile ? 76 : 42, x: isDesktop ? 36 : isMobile ? 20 : 0, rotation: isDesktop ? 29 : isMobile ? 26 : 17 },
                { y: 0, x: 0, rotation: 8, ease: isDesktop || isMobile ? 'none' : 'power2.out' }, 0);
          }
        });

        const aboutSection = scope.querySelector<HTMLElement>('[data-about-cinematic]');
        if (aboutSection) {
          const portraitWindow = aboutSection.querySelector<HTMLElement>('.portrait-window');
          const portraitCaption = aboutSection.querySelector<HTMLElement>('.portrait-caption');
          const portraitMark = aboutSection.querySelector<HTMLElement>('.portrait-mark');
          const sectionLabel = aboutSection.querySelector<HTMLElement>('.section-label');
          const titleLines = aboutSection.querySelectorAll<HTMLElement>('.about-title-line');
          const titleAccent = aboutSection.querySelector<HTMLElement>('.about-title-accent');
          const titleDot = aboutSection.querySelector<HTMLElement>('.about-title-dot');
          const copyBlocks = aboutSection.querySelectorAll<HTMLElement>('[data-about-copy]');
          const cta = aboutSection.querySelector<HTMLElement>('.about-cta');

          if (portraitWindow) {
            gsap.set(portraitWindow, { clipPath: 'inset(0 0 100% 0)', opacity: .45 });
            ScrollTrigger.create({
              trigger: aboutSection,
              start: isMobile ? 'top 90%' : 'top 82%',
              once: true,
              onEnter: () => gsap.to(portraitWindow, {
                clipPath: 'inset(0 0 0% 0)', opacity: 1,
                duration: isMobile ? .82 : 1.02, ease: 'power3.inOut',
              }),
            });
          }

          if (portraitCaption) {
            gsap.set(portraitCaption, { y: 12, opacity: 0 });
            ScrollTrigger.create({
              trigger: aboutSection,
              start: isMobile ? 'top 86%' : 'top 78%',
              once: true,
              onEnter: () => gsap.to(portraitCaption, {
                y: 0, opacity: 1, duration: .48, delay: .12, ease: MOTION.ease,
              }),
            });
          }

          if (portraitMark) {
            gsap.set(portraitMark, { scale: .72, opacity: 0 });
            ScrollTrigger.create({
              trigger: aboutSection,
              start: isMobile ? 'top 84%' : 'top 76%',
              once: true,
              onEnter: () => gsap.to(portraitMark, {
                scale: 1, opacity: 1, duration: .68, ease: 'back.out(1.35)',
              }),
            });
          }

          const titleTrigger = aboutSection.querySelector<HTMLElement>('.about-title');
          if (titleTrigger && titleLines.length) {
            if (sectionLabel) gsap.set(sectionLabel, { x: -18, opacity: .35 });
            gsap.set(titleLines, { y: isMobile ? 28 : 40, opacity: .12, filter: 'blur(7px)' });
            if (titleAccent) gsap.set(titleAccent, { x: isMobile ? -10 : -16 });
            if (titleDot) gsap.set(titleDot, { scale: 0, opacity: 0, rotation: -14 });

            const aboutTitleTl = gsap.timeline({ paused: true });
            if (sectionLabel) aboutTitleTl.to(sectionLabel,
              { x: 0, opacity: 1, duration: .34, ease: MOTION.ease }, 0);
            aboutTitleTl.to(titleLines,
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .58 : .68,
                stagger: isMobile ? .10 : .12, ease: MOTION.ease }, .08);
            if (titleAccent) aboutTitleTl.to(titleAccent,
              { x: 0, duration: .42, ease: MOTION.ease }, .28);
            if (titleDot) aboutTitleTl.to(titleDot,
              { scale: 1, opacity: 1, rotation: 0, duration: .44, ease: 'back.out(1.7)' }, .62);

            ScrollTrigger.create({
              trigger: titleTrigger,
              start: isMobile ? 'top 88%' : 'top 82%',
              once: true,
              onEnter: () => aboutTitleTl.play(0),
            });
          }

          if (copyBlocks.length) {
            gsap.set(copyBlocks, { y: isMobile ? 20 : 26, opacity: .18 });
            ScrollTrigger.create({
              trigger: copyBlocks[0],
              start: isMobile ? 'top 90%' : 'top 84%',
              once: true,
              onEnter: () => gsap.to(copyBlocks, {
                y: 0, opacity: 1, duration: isMobile ? .58 : .66,
                stagger: isMobile ? .12 : .15, ease: MOTION.ease,
              }),
            });
          }

          if (cta) {
            gsap.set(cta, { y: 16, opacity: .2, '--about-cta-line': 0 });
            ScrollTrigger.create({
              trigger: cta,
              start: isMobile ? 'top 92%' : 'top 88%',
              once: true,
              onEnter: () => gsap.to(cta, {
                y: 0, opacity: 1, '--about-cta-line': 1,
                duration: .68, ease: MOTION.ease,
              }),
            });
          }
        }

        const portrait = scope.querySelector<HTMLElement>('.about-image');
        if (portrait) {
          const image = portrait.querySelector('img');
          const mark = portrait.querySelector('.portrait-mark');
          if (image) gsap.fromTo(image, { yPercent: -2, scale: 1.06 }, { yPercent: 2, scale: 1.025, ease: 'none',
            scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: .8 } });
          if (mark) gsap.fromTo(mark, { y: 15, rotation: -1.5 }, { y: -12, rotation: 1, ease: 'none',
            scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: .9 } });
        }

        // Subpages share the same motion grammar as the Home: restrained reveals,
        // image depth and staggered information hierarchy.
        if (['/criacao-de-sites-nova-iguacu','/criacao-de-sites-belford-roxo','/criacao-de-sites-duque-de-caxias'].includes(route)) {
          const hero = scope.querySelector<HTMLElement>('.local-hero');
          if (hero) {
            const label = hero.querySelector<HTMLElement>('.section-label');
            const title = hero.querySelector<HTMLElement>('h1');
            const copy = hero.querySelector<HTMLElement>('h1 + p');
            const actions = hero.querySelector<HTMLElement>('.local-hero-actions');
            const aside = hero.querySelector<HTMLElement>('.local-hero-aside');
            const heroTl = gsap.timeline({ defaults: { ease: MOTION.ease } });
            if (label) heroTl.fromTo(label, { x: -18, opacity: .2 }, { x: 0, opacity: 1, duration: .42 }, 0);
            if (title) heroTl.fromTo(title,
              { y: isMobile ? 28 : 42, opacity: .08, filter: 'blur(10px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .66 : .78 }, .06);
            if (copy) heroTl.fromTo(copy,
              { y: 22, opacity: .2 }, { y: 0, opacity: 1, duration: .58 }, .28);
            if (actions) heroTl.fromTo(actions,
              { y: 18, opacity: .18 }, { y: 0, opacity: 1, duration: .54 }, .38);
            if (aside) heroTl.fromTo(aside,
              { x: isMobile ? 0 : 34, y: isMobile ? 20 : 0, opacity: .14 },
              { x: 0, y: 0, opacity: 1, duration: .66 }, .24);
          }

          scope.querySelectorAll<HTMLElement>('.local-solutions, .local-process, .local-portfolio, .local-business, .local-quote, .local-faq').forEach(section => {
            const label = section.querySelector<HTMLElement>('.section-label');
            const heading = section.querySelector<HTMLElement>('.local-section-heading');
            if (label) gsap.fromTo(label,
              { x: -18, opacity: .3 }, { x: 0, opacity: 1, duration: .5, ease: MOTION.ease,
                scrollTrigger: { trigger: label, start: 'top 90%', once: true } });
            if (heading) {
              const title = heading.querySelector<HTMLElement>('h2');
              const paragraph = heading.querySelector<HTMLElement>('p');
              const tl = gsap.timeline({ scrollTrigger: {
                trigger: heading, start: isMobile ? 'top 92%' : 'top 86%', once: true,
              }});
              if (title) tl.fromTo(title,
                { y: isMobile ? 24 : 34, opacity: .18, filter: 'blur(7px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: .66, ease: MOTION.ease }, 0);
              if (paragraph) tl.fromTo(paragraph,
                { y: 18, opacity: .22 }, { y: 0, opacity: 1, duration: .54, ease: MOTION.ease }, .16);
            }
          });

          const localGroups = [
            '.local-solution-grid article',
            '.local-process-grid article',
            '.local-study-grid article',
            '.local-business-grid article',
          ];
          localGroups.forEach(selector => {
            const items = scope.querySelectorAll<HTMLElement>(selector);
            if (!items.length) return;
            gsap.fromTo(items,
              { y: isMobile ? 22 : 30, opacity: .16 },
              { y: 0, opacity: 1, duration: .58, stagger: isMobile ? .08 : .1, ease: MOTION.ease,
                scrollTrigger: { trigger: items[0], start: 'top 90%', once: true } });
          });

          const featured = scope.querySelector<HTMLElement>('.local-featured-project');
          if (featured) {
            const imageFrame = featured.querySelector<HTMLElement>('.local-featured-image');
            const copy = featured.querySelector<HTMLElement>(':scope > div');
            if (imageFrame) gsap.fromTo(imageFrame,
              { clipPath: 'inset(0 0 14% 0)', y: 28, opacity: .58 },
              { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1, duration: .82, ease: MOTION.ease,
                scrollTrigger: { trigger: featured, start: 'top 88%', once: true } });
            if (copy) gsap.fromTo(copy,
              { x: isMobile ? 0 : 26, y: isMobile ? 18 : 0, opacity: .18 },
              { x: 0, y: 0, opacity: 1, duration: .64, ease: MOTION.ease,
                scrollTrigger: { trigger: featured, start: 'top 84%', once: true } });
          }

          scope.querySelectorAll<HTMLElement>('.local-featured-image, .local-study-image').forEach(frameEl => {
            const image = frameEl.querySelector<HTMLElement>('img');
            if (!image) return;
            gsap.fromTo(image,
              { yPercent: isDesktop ? -2.2 : -1, scale: isDesktop ? 1.035 : 1.018 },
              { yPercent: isDesktop ? 2.2 : 1, scale: isDesktop ? 1.035 : 1.018, ease: 'none',
                scrollTrigger: { trigger: frameEl, start: 'top bottom', end: 'bottom top', scrub: .75 } });
          });

          const form = scope.querySelector<HTMLElement>('.local-quote-form');
          if (form) gsap.fromTo(form,
            { y: isMobile ? 24 : 38, clipPath: 'inset(5% 0 8% 0)', opacity: .42 },
            { y: 0, clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: .76, ease: MOTION.ease,
              scrollTrigger: { trigger: form, start: 'top 90%', once: true } });

          const faqItems = scope.querySelectorAll<HTMLElement>('.local-faq details');
          if (faqItems.length) gsap.fromTo(faqItems,
            { x: isMobile ? 0 : 18, y: 14, opacity: .22 },
            { x: 0, y: 0, opacity: 1, duration: .5, stagger: .07, ease: MOTION.ease,
              scrollTrigger: { trigger: faqItems[0], start: 'top 90%', once: true } });
        }

        if (route === '/site-essencial') {
          const hero = scope.querySelector<HTMLElement>('.essential-hero');
          if (hero) {
            const label = hero.querySelector<HTMLElement>('.section-label');
            const title = hero.querySelector<HTMLElement>('h1');
            const layout = hero.querySelector<HTMLElement>('.essential-layout');
            const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });
            if (label) tl.fromTo(label, { x: -18, opacity: .2 }, { x: 0, opacity: 1, duration: .42 }, 0);
            if (title) tl.fromTo(title,
              { y: isMobile ? 30 : 44, opacity: .08, filter: 'blur(10px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .66 : .8 }, .06);
            if (layout) tl.fromTo(Array.from(layout.children),
              { y: 24, opacity: .16 }, { y: 0, opacity: 1, duration: .56, stagger: .12 }, .28);
          }

          const scopeSection = scope.querySelector<HTMLElement>('.essential-scope');
          if (scopeSection) {
            const label = scopeSection.querySelector<HTMLElement>('.section-label');
            const columns = scopeSection.querySelectorAll<HTMLElement>('.scope-grid > div');
            const items = scopeSection.querySelectorAll<HTMLElement>('li');
            if (label) gsap.fromTo(label,
              { x: -18, opacity: .25 }, { x: 0, opacity: 1, duration: .48, ease: MOTION.ease,
                scrollTrigger: { trigger: scopeSection, start: 'top 88%', once: true } });
            if (columns.length) gsap.fromTo(columns,
              { y: 28, opacity: .18 }, { y: 0, opacity: 1, duration: .62, stagger: .12, ease: MOTION.ease,
                scrollTrigger: { trigger: columns[0], start: 'top 90%', once: true } });
            if (items.length) gsap.fromTo(items,
              { x: -12, opacity: .24 }, { x: 0, opacity: 1, duration: .38, stagger: .055, ease: MOTION.ease,
                scrollTrigger: { trigger: items[0], start: 'top 92%', once: true } });
          }

          const process = scope.querySelector<HTMLElement>('.essential-process');
          if (process) {
            const heading = process.querySelector<HTMLElement>('h2');
            const steps = process.querySelectorAll<HTMLElement>('.process-grid > div');
            if (heading) gsap.fromTo(heading,
              { y: 28, opacity: .15, filter: 'blur(7px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: .64, ease: MOTION.ease,
                scrollTrigger: { trigger: heading, start: 'top 90%', once: true } });
            if (steps.length) gsap.fromTo(steps,
              { y: isMobile ? 22 : 34, opacity: .14 },
              { y: 0, opacity: 1, duration: .58, stagger: .1, ease: MOTION.ease,
                scrollTrigger: { trigger: steps[0], start: 'top 90%', once: true } });
          }

          const faq = scope.querySelector<HTMLElement>('.essential-faq');
          if (faq) {
            const heading = faq.querySelector<HTMLElement>('h2');
            const items = faq.querySelectorAll<HTMLElement>('details');
            if (heading) gsap.fromTo(heading,
              { x: -20, opacity: .18 }, { x: 0, opacity: 1, duration: .56, ease: MOTION.ease,
                scrollTrigger: { trigger: heading, start: 'top 92%', once: true } });
            if (items.length) gsap.fromTo(items,
              { y: 14, opacity: .2 }, { y: 0, opacity: 1, duration: .46, stagger: .055, ease: MOTION.ease,
                scrollTrigger: { trigger: items[0], start: 'top 92%', once: true } });
          }

          const finalContact = scope.querySelector<HTMLElement>('.studio-contact');
          if (finalContact) {
            const label = finalContact.querySelector<HTMLElement>('.section-label');
            const title = finalContact.querySelector<HTMLElement>('.contact-title');
            const copy = finalContact.querySelector<HTMLElement>(':scope .wrap > p');
            const contactTl = gsap.timeline({ paused: true });
            if (label) contactTl.fromTo(label,
              { x: -18, opacity: .18 }, { x: 0, opacity: 1, duration: .4, ease: MOTION.ease }, 0);
            if (title) contactTl.fromTo(title,
              { y: isMobile ? 26 : 38, opacity: .08, filter: 'blur(8px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: .68, ease: MOTION.ease }, .06);
            if (copy) contactTl.fromTo(copy,
              { y: 16, opacity: .2 }, { y: 0, opacity: 1, duration: .48, ease: MOTION.ease }, .28);
            ScrollTrigger.create({
              trigger: finalContact,
              start: isMobile ? 'top 90%' : 'top 84%',
              once: true,
              onEnter: () => contactTl.play(0),
            });
          }
        }

        if (route.startsWith('/projetos/')) {
          const head = scope.querySelector<HTMLElement>('.case-head');
          if (head) {
            const back = head.querySelector<HTMLElement>(':scope > .text-link');
            const meta = head.querySelector<HTMLElement>('.section-top');
            const title = head.querySelector<HTMLElement>('h1');
            const intro = head.querySelector<HTMLElement>('.case-intro');
            const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });
            if (back) tl.fromTo(back, { x: -16, opacity: .2 }, { x: 0, opacity: 1, duration: .4 }, 0);
            if (meta) tl.fromTo(meta, { y: 14, opacity: .18 }, { y: 0, opacity: 1, duration: .44 }, .06);
            if (title) tl.fromTo(title,
              { y: isMobile ? 30 : 46, opacity: .08, filter: 'blur(10px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', duration: isMobile ? .68 : .82 }, .12);
            if (intro) tl.fromTo(intro,
              { y: 22, opacity: .18 }, { y: 0, opacity: 1, duration: .58 }, .32);
          }

          const figure = scope.querySelector<HTMLElement>('.case-figure');
          if (figure) {
            const image = figure.querySelector<HTMLElement>('img');
            gsap.fromTo(figure,
              { clipPath: 'inset(0 0 12% 0)', y: 26, opacity: .56 },
              { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1, duration: .86, ease: MOTION.ease,
                scrollTrigger: { trigger: figure, start: 'top 90%', once: true } });
            if (image) gsap.fromTo(image,
              { yPercent: -2, scale: 1.035 },
              { yPercent: 2, scale: 1.035, ease: 'none',
                scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: .8 } });
          }

          const story = scope.querySelector<HTMLElement>('.case-story');
          if (story) {
            const label = story.querySelector<HTMLElement>('.section-label');
            const copy = story.querySelector<HTMLElement>(':scope > div');
            if (label) gsap.fromTo(label,
              { x: -18, opacity: .24 }, { x: 0, opacity: 1, duration: .48, ease: MOTION.ease,
                scrollTrigger: { trigger: story, start: 'top 88%', once: true } });
            if (copy) gsap.fromTo(copy,
              { y: 28, opacity: .16 }, { y: 0, opacity: 1, duration: .64, ease: MOTION.ease,
                scrollTrigger: { trigger: copy, start: 'top 90%', once: true } });
          }

          const details = scope.querySelectorAll<HTMLElement>('.case-details > div');
          if (details.length) gsap.fromTo(details,
            { y: 26, opacity: .16 },
            { y: 0, opacity: 1, duration: .56, stagger: .09, ease: MOTION.ease,
              scrollTrigger: { trigger: details[0], start: 'top 90%', once: true } });

          const note = scope.querySelector<HTMLElement>('.case-note');
          if (note) gsap.fromTo(Array.from(note.children),
            { y: 18, opacity: .2 },
            { y: 0, opacity: 1, duration: .5, stagger: .08, ease: MOTION.ease,
              scrollTrigger: { trigger: note, start: 'top 92%', once: true } });
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
