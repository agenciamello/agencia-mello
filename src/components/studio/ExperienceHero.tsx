import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { ContactLink } from './Studio';

function HeroMotionMark() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [failed, setFailed] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setReducedMotion(media.matches);
    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    const rect = video.getBoundingClientRect();
    let visible = rect.bottom > 0 && rect.top < window.innerHeight;
    const syncPlayback = () => {
      if (pausedByUser || document.hidden || !visible) {
        video.pause();
      } else {
        void video.play().catch(error => {
          if (!disposed && error.name === 'NotAllowedError') setPausedByUser(true);
        });
      }
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      syncPlayback();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [reducedMotion, failed, pausedByUser]);

  if (reducedMotion || failed) {
    return <div className="brand-sculpture brand-sculpture-static"><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" fetchPriority="high"/></div>;
  }
  return <><div className="brand-sculpture brand-sculpture-video">
    <video
      ref={videoRef}
      className="hero-motion-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/agencia-mello-icone.png"
      onError={() => setFailed(true)}
      aria-hidden="true"
    >
      <source src="/assets/agencia-mello-hero-motion.webm" type="video/webm"/>
      <source src="/assets/agencia-mello-hero-motion.mp4" type="video/mp4"/>
    </video>
  </div><button className="hero-video-control" type="button"
    aria-label={pausedByUser ? 'Reproduzir animação' : 'Pausar animação'}
    title={pausedByUser ? 'Reproduzir animação' : 'Pausar animação'}
    onClick={() => setPausedByUser(value => !value)}>
    {pausedByUser ? <Play size={18} aria-hidden="true"/> : <Pause size={18} aria-hidden="true"/>}
  </button></>;
}

export function ExperienceHero() {
  return <section className="experience-hero" id="inicio" data-chapter="Início">
    <div className="wrap hero-scene">
      <div className="hero-eyebrow"><span>Design + presença digital</span><span className="hero-edition">Para pequenos negócios</span></div>
      <div className="hero-composition">
        <div className="hero-message">
          <h1 aria-label="Seu negócio já é bom. Faça isso aparecer."><span className="line-mask"><span>Seu negócio</span></span><span className="line-mask"><span>já é bom.</span></span><span className="line-mask hero-emphasis"><span>Faça isso</span></span><span className="line-mask hero-emphasis"><span>aparecer<span className="headline-period">.</span></span></span></h1>
          <p className="hero-description">Sua presença online à altura do seu trabalho.</p>
          <p className="hero-scope">Sites para pequenos negócios · Identidade visual · Conteúdo</p>
          <div className="hero-actions"><ContactLink className="primary-cta" messageKey="hero">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink><a href="#processo" className="quiet-link">Como funciona <span aria-hidden="true">↓</span></a></div>
        </div>        <div className="hero-art">
          <div className="hero-art-plane" data-depth>
            <HeroMotionMark/>
          </div>
          <span className="art-coordinate" aria-hidden="true">Ideia → forma → presença</span>
        </div>
      </div>
      <div className="hero-baseline"><span>Atendimento direto.</span><a href="#projetos" className="scroll-cue"><span aria-hidden="true">↓</span> Ver projetos</a><span className="hero-location">Rio de Janeiro.<br/>Online em todo o Brasil.</span></div>
    </div>
  </section>;
}
