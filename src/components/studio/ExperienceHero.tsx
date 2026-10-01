import { ContactLink } from './Studio';

export function ExperienceHero() {
  return <section className="experience-hero" id="inicio" data-chapter="Início">
    <div className="wrap hero-scene">
      <div className="hero-eyebrow"><span>Design + presença digital</span><span className="hero-edition">Para pequenos negócios</span></div>
      <div className="hero-composition">
        <div className="hero-message">
          <h1 aria-label="Seu negócio já é bom. Faça isso aparecer."><span className="line-mask"><span>Seu negócio</span></span><span className="line-mask"><span>já é bom.</span></span><span className="line-mask hero-emphasis"><span>Faça isso</span></span><span className="line-mask hero-emphasis"><span>aparecer<span className="headline-period">.</span></span></span></h1>
          <p className="hero-description">Sua presença online deveria estar à altura do seu trabalho. É isso que fazemos.</p>
          <p className="hero-scope">Sites · Identidade visual · Conteúdo</p>
          <div className="hero-actions"><ContactLink className="primary-cta" messageKey="hero">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink><a href="#processo" className="quiet-link">Como funciona <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-plane" data-depth>
            <div className="brand-sculpture"><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" fetchPriority="high"/></div>
          </div>
          <span className="art-coordinate">Ideia → forma → presença</span>
        </div>
      </div>
      <div className="hero-baseline"><span>Atendimento transparente. Sem telefone sem fio.<br/><strong>Você conversa diretamente com quem pensa e executa o projeto.</strong></span><a href="#projetos" className="scroll-cue"><span aria-hidden="true">↓</span> Ver projetos</a><span className="hero-location">No Rio de Janeiro.<br/>Online para todo o Brasil.</span></div>
    </div>
  </section>;
}
