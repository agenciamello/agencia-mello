import { Link } from 'react-router-dom';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';
import { ExperienceServices } from '../components/studio/ExperienceServices';

export function HomePage() {
  usePageTitle('Agência Mello | Sites, marca e conteúdo pra pequenos negócios');
  return <StudioShell>
    <ExperienceHero/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Site no ar, marca coerente, post com cara de marca e atendimento direto"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>SITE NO AR <i>·</i> MARCA COERENTE <i>·</i> POST COM CARA DE MARCA <i>·</i> ATENDIMENTO DIRETO <i>·</i> </span>)}</div></div>
    <ExperienceServices/>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência"><div className="about-image"><div className="portrait-window"><img data-reveal="image" src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Contato direto com quem cria</SectionLabel><h2 data-reveal="lines">Prazer,<br/>Matheus<br/><span>Mello.</span></h2><p className="lead">Atendimento transparente. Sem telefone sem fio.</p><p>Você conversa diretamente com quem pensa e executa o projeto.</p><p>Sou Matheus Mello, designer, desenvolvedor e fundador da Mello. Crio sites, identidades e conteúdo visual para pequenos negócios, profissionais autônomos e marcas.</p><p>Sem intermediário e sem recado atravessado. Você fala comigo pra entender o projeto, combinar o que está incluso e acompanhar cada etapa. Atendimento no Rio de Janeiro e online para todo o Brasil.</p><ContactLink messageKey="header" className="text-link">Falar com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
    <section id="processo" className="process-studio wrap"><SectionLabel number="04">Como funciona</SectionLabel><h2 data-reveal="lines">Do primeiro papo à entrega,<br/>você acompanha cada etapa.</h2><div className="process-grid" data-reveal="stagger">{[
      ['01','Entender','Você conta o que faz, quem quer alcançar e o que precisa melhorar. A conversa começa pelo WhatsApp.'],
      ['02','Combinar','Combinamos o que está incluso, o investimento e a direção do projeto antes da contratação.'],
      ['03','Criar','A direção ganha forma. Você acompanha o trabalho, avalia e participa dos ajustes previstos.'],
      ['04','Entregar','Refinamos os detalhes e preparamos o site ou os materiais combinados.'],
    ].map(([n,title,copy])=><div key={n}><span className="micro">{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
    <section className="essential-teaser wrap" data-reveal="stagger"><div><span className="micro">Pra quem quer dar o primeiro passo</span><h2>Site Essencial.</h2><p>Uma página, até seis seções e WhatsApp integrado. Você avalia uma prévia gratuita antes de contratar.</p><p>Precisa de mais páginas ou funcionalidades? Projeto sob medida, com orçamento próprio.</p></div><div className="teaser-price"><span>R$ 500 <small>em até 3x</small></span><Link to="/site-essencial" className="text-link">Conheça o Site Essencial <span aria-hidden="true">↗</span></Link></div></section>
  </StudioShell>;
}
