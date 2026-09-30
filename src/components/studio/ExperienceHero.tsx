import { ContactLink } from './Studio';

export function ExperienceHero() {
  return <section className="experience-hero" id="inicio" data-chapter="Início">
    <div className="hero-grid" aria-hidden="true" />
    <div className="wrap hero-scene">
      <div className="hero-eyebrow"><span className="hero-edition">Design + tecnologia</span></div>
      <div className="hero-composition">
        <div className="hero-message">
          <h1 aria-label="Seu negócio já é bom. Faça isso aparecer."><span className="line-mask"><span>Seu negócio</span></span><span className="line-mask"><span>já é bom.</span></span><span className="line-mask hero-emphasis"><span>Faça isso aparecer<span className="headline-period">.</span></span></span></h1>
          <p className="hero-description">Sites, identidade visual e conteúdo para pequenos negócios se apresentarem com clareza e personalidade.</p>
          <div className="hero-actions"><ContactLink className="primary-cta" messageKey="hero">Fale com o Matheus <span aria-hidden="true">↗</span></ContactLink><a href="#projetos" className="quiet-link">Explore os projetos <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-art" role="img" aria-label="Estudo visual da marca Agência Mello">
          <div className="brand-orbit" aria-hidden="true"><svg className="brand-framework" viewBox="0 0 500 550" fill="none"><path pathLength="1" className="framework-plane plane-back" d="M60 400 240 50 460 400Z"/><path pathLength="1" className="framework-plane plane-front" d="M25 455 250 120 485 455Z"/><path pathLength="1" className="framework-axis" d="M240 50 250 120M60 400 25 455M460 400 485 455M25 455 460 400"/></svg></div>
          <div className="hero-art-plane" data-depth>
            <div className="brand-sculpture" aria-hidden="true"><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" fetchPriority="high"/><span className="sculpture-rule"/><span className="sculpture-label">M / expressão em construção</span></div>
          </div>
          <span className="art-coordinate" aria-hidden="true">Ideia → forma → presença</span>
        </div>
      </div>
      <div className="hero-baseline"><span>Direto com Matheus Mello.<br/><strong>Quem conversa com você também cria.</strong></span><a href="#projetos" className="scroll-cue"><span aria-hidden="true">↓</span> Conheça o trabalho</a><span className="hero-location">No Rio de Janeiro.<br/>Online para todo o Brasil.</span></div>
    </div>
  </section>;
}
