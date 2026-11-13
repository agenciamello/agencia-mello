import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Pause, Play, X } from 'lucide-react';
import { ContactLink } from './Studio';
import { SITE_INFO } from '../../data/siteData';
import './event-portfolio.css';

const PerspectiveTunnelHero = lazy(() => import('../ui/perspective-tunnel-hero'));

const EVENT_ARTWORKS = [
  { slug: 'sao-simao-folia', name: 'São Simão Folia', type: 'Flyer de evento', width: 1400, height: 1750, alt: 'Flyer São Simão Folia com Bruna Alves e DJs, em branco e magenta.' },
  { slug: 'pago-pra-ver-agenda', name: 'Pagô Pra Ver', type: 'Agenda de shows', width: 1080, height: 1350, alt: 'Agenda semanal do grupo Pagô Pra Ver, com os integrantes em uma composição clara e dourada.' },
  { slug: 'bloco-do-mello', name: 'Bloco do Mello', type: 'Flyer de carnaval', width: 1400, height: 1750, alt: 'Flyer Bloco do Mello com artistas e elementos de carnaval em magenta, azul e amarelo.' },
  { slug: 'conexao-dos-crias', name: 'Conexão dos Crias', type: 'Arte de lançamento', width: 1080, height: 1080, alt: 'Arte do medley Conexão dos Crias com DJ Magrinho e DJ LF de Campos, em preto e laranja.' },
  { slug: 'uma-noite-no-brega-funk', name: 'Uma Noite no Brega Funk', type: 'Arte promocional', width: 1400, height: 1749, alt: 'Arte Uma Noite no Brega Funk, em roxo e magenta, com retrato, palco e caixas de som.' },
  { slug: 'mc-poze-do-rodo', name: 'MC Poze do Rodo', type: 'Composição artística', width: 1080, height: 1349, alt: 'Composição artística MC Poze do Rodo com retratos, carro amarelo e assinatura da Agência Mello.' },
] as const;

const TUNNEL_ARTWORKS = EVENT_ARTWORKS.slice(0, 4);

type EventArtwork = typeof EVENT_ARTWORKS[number];

function ArtworkImage({ artwork, expanded = false }: { artwork: EventArtwork; expanded?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const src = `/assets/eventos/${artwork.slug}.webp`;

  return <div className={expanded ? 'event-artwork event-artwork-expanded' : 'event-artwork'}>
    {!failed && <img key={attempt} src={attempt ? `${src}?retry=${attempt}` : src} alt={artwork.alt}
      width={artwork.width} height={artwork.height} loading={expanded ? 'eager' : 'lazy'}
      decoding="async" onError={() => setFailed(true)} />}
    {failed && <div className="event-image-error" role={expanded ? 'status' : undefined}>
      <span>Não foi possível carregar esta arte.</span>
      {expanded
        ? <button type="button" onClick={() => { setAttempt(value => value + 1); setFailed(false); }}>Tentar novamente</button>
        : <span>Abra para tentar novamente.</span>}
    </div>}
  </div>;
}

export function EventPortfolio() {
  const section = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<EventArtwork | null>(null);
  const [tunnelEnabled, setTunnelEnabled] = useState(false);
  const [compactTunnel, setCompactTunnel] = useState(false);
  const gallery = useRef<HTMLDivElement>(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselDirection = useRef(1);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: no-preference)');
    const compact = matchMedia('(max-width: 700px), (hover: none), (pointer: coarse)');
    const update = () => {
      setTunnelEnabled(media.matches);
      setCompactTunnel(compact.matches);
    };
    update();
    media.addEventListener('change', update);
    compact.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      compact.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    // Adding/removing the tunnel changes the positions of the site's later chapters.
    let active = true;
    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (active) ScrollTrigger.refresh();
    }).catch(() => {});
    return () => { active = false; };
  }, [tunnelEnabled, compactTunnel]);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  useEffect(() => {
    const element = gallery.current;
    if (!element || !tunnelEnabled) {
      if (element) {
        element.dataset.playing = 'false';
        element.scrollLeft = 0;
      }
      return;
    }

    let inView = false;
    let hovered = matchMedia('(hover: hover) and (pointer: fine)').matches && element.matches(':hover');
    const hasFocusedControl = (target: EventTarget | null) => target instanceof Element && target !== element && element.contains(target)
      && Boolean(target.closest('button, a, input, select, textarea, [tabindex]'));
    let focused = hasFocusedControl(document.activeElement);
    let frame = 0;
    let lastTime = 0;
    let position = element.scrollLeft;
    let speed = 0;
    let holdUntil = 0;

    const canPlay = () => inView && !document.hidden && !hovered && !focused && !carouselPaused && !selected;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      speed = 0;
      element.dataset.playing = 'false';
    };
    const tick = (time: number) => {
      frame = 0;
      if (!canPlay()) { stop(); return; }
      const max = element.scrollWidth - element.clientWidth;
      if (max <= 1) { stop(); return; }
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, .06) : 0;
      lastTime = time;
      if (time >= holdUntil) {
        const remaining = carouselDirection.current > 0 ? max - position : position;
        const targetSpeed = 20 * (.2 + .8 * Math.min(1, Math.max(0, remaining) / 48));
        speed += (targetSpeed - speed) * Math.min(1, elapsed * 5);
        position = Math.max(0, Math.min(max, position + carouselDirection.current * speed * elapsed));
        element.scrollLeft = position;
        if ((carouselDirection.current > 0 && position >= max) || (carouselDirection.current < 0 && position <= 0)) {
          carouselDirection.current *= -1;
          speed = 0;
          holdUntil = time + 650;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!canPlay()) { stop(); return; }
      if (frame) return;
      position = element.scrollLeft;
      element.dataset.playing = 'true';
      frame = requestAnimationFrame(tick);
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === 'mouse') { hovered = true; sync(); } };
    const leave = () => { hovered = false; sync(); };
    const focusIn = (event: FocusEvent) => { focused = hasFocusedControl(event.target); sync(); };
    const focusOut = (event: FocusEvent) => { focused = hasFocusedControl(event.relatedTarget); sync(); };
    const resize = new ResizeObserver(sync);
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      sync();
    }, { threshold: .08 });
    observer.observe(element);
    resize.observe(element);
    document.addEventListener('visibilitychange', sync);
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('focusin', focusIn);
    element.addEventListener('focusout', focusOut);
    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', sync);
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('focusin', focusIn);
      element.removeEventListener('focusout', focusOut);
    };
  }, [tunnelEnabled, carouselPaused, selected]);

  function moveArtwork(direction: number) {
    const element = gallery.current;
    if (!element) return;
    setCarouselPaused(true);
    const first = element.querySelector<HTMLElement>('.event-piece');
    const distance = (first?.getBoundingClientRect().width || element.clientWidth * .8) + parseFloat(getComputedStyle(element).gap || '0');
    element.scrollBy({ left: direction * distance, behavior: 'smooth' });
  }

  function closeArtwork() {
    setSelected(null);
    opener.current?.focus({ preventScroll: true });
  }

  return <section ref={section} id="eventos" className="event-portfolio" aria-labelledby="events-heading">
    <div className="event-intro">
      <div>
        <p className="event-eyebrow">Design para eventos <span aria-hidden="true">↗</span></p>
        <h4 id="events-heading">Artes para divulgar seu evento<br/><em>e vender mais ingressos.</em></h4>
      </div>
      <p>Data, atrações e informações de compra em destaque na sua divulgação.</p>
    </div>

    {tunnelEnabled && <Suspense fallback={<div className={`event-tunnel-loading${compactTunnel ? ' event-tunnel-loading-compact' : ''}`} aria-hidden="true"/>}><PerspectiveTunnelHero compact={compactTunnel} images={TUNNEL_ARTWORKS.map(artwork => ({
      src: `/assets/eventos/${artwork.slug}.webp`, title: artwork.name, width: artwork.width, height: artwork.height,
    }))}/></Suspense>}

    <div className="event-gallery" id="eventos-galeria" tabIndex={-1} role="region"
      aria-roledescription={tunnelEnabled ? 'carrossel' : undefined} aria-labelledby="event-gallery-heading" aria-live="off">
    <div className="event-gallery-heading">
      <p id="event-gallery-heading">Explore as artes<span>{tunnelEnabled ? 'Deslize para ver mais ou amplie uma peça.' : 'Amplie uma peça para ver os detalhes.'}</span></p>
      {tunnelEnabled && <div className="event-gallery-controls" role="group" aria-label="Controles do carrossel de artes">
        <button type="button" className="event-play-toggle" aria-label={carouselPaused ? 'Reproduzir carrossel' : 'Pausar carrossel'} onClick={() => setCarouselPaused(value => !value)}>
          {carouselPaused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}<span>{carouselPaused ? 'Reproduzir' : 'Pausar'}</span>
        </button>
        <button type="button" aria-label="Arte anterior" onClick={() => moveArtwork(-1)}><ArrowLeft size={18} aria-hidden="true"/></button>
        <button type="button" aria-label="Próxima arte" onClick={() => moveArtwork(1)}><ArrowRight size={18} aria-hidden="true"/></button>
      </div>}
    </div>
    <div ref={gallery} className={`event-stage${tunnelEnabled ? ' event-stage-carousel' : ''}`}
      onPointerDown={() => setCarouselPaused(true)} onWheel={event => { if (event.deltaX || event.shiftKey) setCarouselPaused(true); }}>
      {EVENT_ARTWORKS.map((artwork, index) => <figure className="event-piece" key={artwork.slug}>
        <button className="event-open" type="button" aria-label={`Ampliar arte: ${artwork.name}`}
          aria-haspopup="dialog" onClick={event => { setCarouselPaused(true); opener.current = event.currentTarget; setSelected(artwork); }}>
          <ArtworkImage artwork={artwork}/>
          <span className="event-expand"><Maximize2 size={15} aria-hidden="true"/><span>Ampliar</span></span>
        </button>
        <figcaption><span className="event-piece-number">0{index + 1}</span><div><h4>{artwork.name}</h4><p>{artwork.type}</p></div></figcaption>
      </figure>)}
    </div>
    </div>

    <div className="event-more-work">
      <a href={SITE_INFO.behance.url} target="_blank" rel="noopener noreferrer" aria-label="Ver mais trabalhos no Behance (abre em nova aba)">
        Ver mais trabalhos no Behance <ArrowUpRight size={15} aria-hidden="true"/>
      </a>
    </div>

    <div className="event-outro">
      <p>Tem evento marcado?<br/><span>Flyer: R$ 50 · Flyer + motion de 30s: R$ 80.</span></p>
      <ContactLink messageKey="eventos" className="event-cta">Pedir arte para meu evento <ArrowUpRight size={18} aria-hidden="true"/></ContactLink>
    </div>

    <dialog ref={dialog} className="event-lightbox" aria-labelledby="event-lightbox-title" aria-describedby="event-lightbox-description"
      onClose={closeArtwork} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const buttons = Array.from(event.currentTarget.querySelectorAll('button:not([disabled])')) as HTMLButtonElement[];
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      {selected && <div className="event-lightbox-content">
        <div className="event-lightbox-header"><div><h2 id="event-lightbox-title">{selected.name}</h2><p id="event-lightbox-description">{selected.type} · Design da Agência Mello</p></div>
          <button type="button" className="event-lightbox-close" aria-label="Fechar arte ampliada" onClick={() => dialog.current?.close()} autoFocus><X size={24} aria-hidden="true"/></button>
        </div>
        <ArtworkImage artwork={selected} expanded/>
      </div>}
    </dialog>
  </section>;
}
