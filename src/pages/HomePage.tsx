import { Link } from 'react-router-dom';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';
import { ExperienceServices } from '../components/studio/ExperienceServices';

export function HomePage() {
  usePageTitle('Agência Mello — Sites, identidade visual e conteúdo.');
  return <StudioShell>
    <ExperienceHero/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Design, tecnologia, identidade e conteúdo"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>DESIGN <i>↗</i> TECNOLOGIA <i>↗</i> IDENTIDADE <i>↗</i> CONTEÚDO <i>↗</i> </span>)}</div></div>
    <ExperienceServices/>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência"><div className="about-image"><div className="portrait-window"><img data-reveal="image" src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Contato direto com quem cria</SectionLabel><h2 data-reveal="lines">Prazer,<br/>Matheus<br/><span>Mello.</span></h2><p className="lead">Quem conversa com você<br/>também coloca a mão no projeto.</p><p>Sou Matheus Mello, designer, desenvolvedor e fundador da Mello. Crio sites, identidades e conteúdo visual para pequenos negócios, profissionais autônomos e marcas.</p><p>Você fala comigo para entender o projeto, alinhar o escopo e acompanhar a criação. Atendimento no Rio de Janeiro e online para todo o Brasil.</p><ContactLink className="text-link">Fale com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
    <section id="processo" className="process-studio wrap"><SectionLabel number="04">Projetos sob medida</SectionLabel><h2 data-reveal="lines">Boa criação.<br/>Processo claro.</h2><div className="process-grid" data-reveal="stagger">{[
      ['01','Entender','Você conta o que faz, quem quer alcançar e o que precisa melhorar. A conversa começa pelo WhatsApp.'],
      ['02','Combinar','Alinhamos o escopo, o investimento e a direção do projeto antes da contratação.'],
      ['03','Criar','A direção ganha forma. Você acompanha o trabalho, avalia e participa dos ajustes previstos.'],
      ['04','Entregar','Refinamos os detalhes e preparamos o site ou os materiais definidos no escopo.'],
    ].map(([n,title,copy])=><div key={n}><span className="micro">{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
    <section className="essential-teaser wrap" data-reveal="stagger"><div><span className="micro">Para quem precisa dar o primeiro passo</span><h2>Site Essencial.</h2><p>Uma página, até seis seções e WhatsApp integrado. Você avalia uma prévia gratuita antes de contratar.</p><p>Precisa de mais páginas ou funcionalidades? O projeto sob medida tem escopo e investimento próprios.</p></div><div className="teaser-price"><span>R$ 500 <small>em até 3x</small></span><Link to="/site-essencial" className="text-link">Conheça o Site Essencial <span aria-hidden="true">↗</span></Link></div></section>
  </StudioShell>;
}
