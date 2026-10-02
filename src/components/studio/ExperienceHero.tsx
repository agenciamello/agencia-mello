import { useEffect, useRef, useState } from 'react';
import { ContactLink } from './Studio';

function HeroMotionMark() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [failed, setFailed] = useState(false);
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
    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    void video.play().catch(() => {});
  }, [reducedMotion]);

  if (reducedMotion || failed) {
    return <div className="brand-sculpture brand-sculpture-static"><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" fetchPriority="high"/></div>;
  }  return <div className="brand-sculpture brand-sculpture-video">
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
  </div>;
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
        </div>        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-plane" data-depth>
            <HeroMotionMark/>
          </div>
          <span className="art-coordinate">Ideia → forma → presença</span>
        </div>
      </div>
      <div className="hero-baseline"><span>Atendimento direto.</span><a href="#projetos" className="scroll-cue"><span aria-hidden="true">↓</span> Ver projetos</a><span className="hero-location">Rio de Janeiro.<br/>Online em todo o Brasil.</span></div>
    </div>
  </section>;
}
