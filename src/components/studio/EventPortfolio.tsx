import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';
import { ContactLink } from './Studio';
import { SITE_INFO } from '../../data/siteData';
import './event-portfolio.css';

const PerspectiveTunnelHero = lazy(() => import('../ui/perspective-tunnel-hero'));

const EVENT_ARTWORKS = [
  { slug: 'sao-simao-folia', name: 'São Simão Folia', type: 'Flyer de evento', width: 1400, height: 1750, alt: 'Flyer São Simão Folia com Bruna Alves e DJs, em branco e magenta.' },
  { slug: 'pago-pra-ver-agenda', name: 'Pagô Pra Ver', type: 'Agenda de shows', width: 1080, height: 1350, alt: 'Agenda semanal do grupo Pagô Pra Ver, com os integrantes em uma composição clara e dourada.' },
  { slug: 'bloco-do-mello', name: 'Bloco do Mello', type: 'Flyer de carnaval', width: 1400, height: 1750, alt: 'Flyer Bloco do Mello com artistas e elementos de carnaval em magenta, azul e amarelo.' },
  { slug: 'conexao-dos-crias', name: 'Conexão dos Crias', type: 'Arte de lançamento', width: 1080, height: 1080, alt: 'Arte do medley Conexão dos Crias com DJ Magrinho e DJ LF de Campos, em preto e laranja.' },
] as const;

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

  useEffect(() => {
    const media = matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setTunnelEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Adding/removing the tunnel changes the positions of the site's later chapters.
    let active = true;
    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (active) ScrollTrigger.refresh();
    }).catch(() => {});
    return () => { active = false; };
  }, [tunnelEnabled]);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  function closeArtwork() {
    setSelected(null);
    opener.current?.focus({ preventScroll: true });
  }

  return <section ref={section} id="eventos" className="event-portfolio" aria-labelledby="events-heading">
    <div className="event-intro">
      <div>
        <p className="event-eyebrow">Design para eventos <span aria-hidden="true">↗</span></p>
        <h4 id="events-heading">Sua próxima data.<br/><em>Uma arte à altura.</em></h4>
      </div>
      <p>Flyers, agendas e peças de divulgação criadas pela Mello. Uma seleção do que já saiu da nossa mesa para anunciar eventos e lançamentos.</p>
    </div>

    {tunnelEnabled && <Suspense fallback={<div className="event-tunnel-loading" aria-hidden="true"/>}><PerspectiveTunnelHero images={EVENT_ARTWORKS.map(artwork => ({
      src: `/assets/eventos/${artwork.slug}.webp`, title: artwork.name, width: artwork.width, height: artwork.height,
    }))}/></Suspense>}

    <div className="event-stage" id="eventos-galeria" tabIndex={-1}>
      {EVENT_ARTWORKS.map((artwork, index) => <figure className="event-piece" key={artwork.slug}>
        <button className="event-open" type="button" aria-label={`Ampliar arte: ${artwork.name}`}
          aria-haspopup="dialog" onClick={event => { opener.current = event.currentTarget; setSelected(artwork); }}>
          <ArtworkImage artwork={artwork}/>
          <span className="event-expand"><Maximize2 size={15} aria-hidden="true"/><span>Ampliar</span></span>
        </button>
        <figcaption><span className="event-piece-number">0{index + 1}</span><div><h4>{artwork.name}</h4><p>{artwork.type}</p></div></figcaption>
      </figure>)}
    </div>

    <div className="event-more-work">
      <a href={SITE_INFO.behance.url} target="_blank" rel="noopener noreferrer" aria-label="Ver mais trabalhos no Behance (abre em nova aba)">
        Ver mais trabalhos no Behance <ArrowUpRight size={15} aria-hidden="true"/>
      </a>
    </div>

    <div className="event-outro">
      <p>Tem evento marcado?<br/><span>Flyer: R$ 50 · Flyer + motion de 30s: R$ 80.</span></p>
      <ContactLink messageKey="eventos" className="event-cta">Pedir uma arte para meu evento <ArrowUpRight size={18} aria-hidden="true"/></ContactLink>
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
