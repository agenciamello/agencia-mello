import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';

const serviceOrientation = [
  ['01','Sites para negócios','web','Apresente seus serviços e receba pedidos de orçamento.'],
  ['02','Artes para redes e eventos','conteudo','Divulgue produtos, ofertas e sua próxima data.'],
  ['03','Logo e identidade visual','marca','Uma marca que seu cliente reconhece.'],
];

function ServiceOrientation() {
  return <section id="servicos" className="home-service-orientation" aria-label="Serviços da Agência Mello">
    <div className="wrap" id="solucoes">
      <span className="micro">O que fazemos</span>
      <nav className="home-service-links" aria-label="Ir para serviços">
        {serviceOrientation.map(([number,label,id,description], index)=><a href={`#servico-${id}`} key={id} data-service-nav={index}><span>{number}</span><span><strong>{label}</strong><small>{description}</small></span></a>)}
      </nav>
    </div>
  </section>;
}

export function HomePage() {
  usePageTitle('Agência Mello | Sites, marca e conteúdo pra pequenos negócios');
  return <StudioShell>
    <ExperienceHero/>
    <ServiceOrientation/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Site no ar, marca coerente, post com cara de marca e atendimento direto"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>SITE NO AR <i>·</i> MARCA COERENTE <i>·</i> POST COM CARA DE MARCA <i>·</i> ATENDIMENTO DIRETO <i>·</i> </span>)}</div></div>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência" data-about-cinematic><div className="about-image" data-about-portrait><div className="portrait-window"><img src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Contato direto com quem cria</SectionLabel><h2 className="about-title" aria-label="Matheus Mello."><span className="about-title-line">Matheus</span><span className="about-title-line about-title-accent">Mello<span className="about-title-dot" aria-hidden="true">.</span></span></h2><p className="lead" data-about-copy>Você fala direto com quem cria.</p><p data-about-copy>Sou designer e desenvolvedor. Do primeiro contato à entrega, você acompanha o projeto comigo.</p><p data-about-copy>Rio de Janeiro e atendimento online para todo o Brasil.</p><ContactLink messageKey="header" className="text-link about-cta">Falar com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
  </StudioShell>;
}
