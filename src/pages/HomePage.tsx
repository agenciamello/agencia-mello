import { Link } from 'react-router-dom';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';
import { ExperienceServices } from '../components/studio/ExperienceServices';

export function HomePage() {
  usePageTitle('Agência Mello — Design, tecnologia e presença.');
  return <StudioShell>
    <ExperienceHero/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Design, tecnologia, identidade e conteúdo"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>DESIGN <i>↗</i> TECNOLOGIA <i>↗</i> IDENTIDADE <i>↗</i> CONTEÚDO <i>↗</i> </span>)}</div></div>
    <ExperienceServices/>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência"><div className="about-image"><div className="portrait-window"><img data-reveal="image" src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Uma agência. Uma conversa direta.</SectionLabel><h2 data-reveal="lines">Prazer,<br/>Matheus<br/><span>Mello.</span></h2><p className="lead">Quem conversa com você<br/>também coloca a mão no projeto.</p><p>A Mello reúne design e desenvolvimento para pequenos negócios, artistas e marcas. Do Rio de Janeiro, criamos identidades, sites e conteúdo para quem quer se apresentar à altura do que entrega.</p><p>Proximidade para entender. Critério para criar. Espaço para construir junto.</p><ContactLink className="text-link">Fale com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
    <section id="processo" className="process-studio wrap"><SectionLabel number="04">Da conversa à presença</SectionLabel><h2 data-reveal="lines">Boa criação.<br/>Processo claro.</h2><div className="process-grid">{[
      ['01','Escutar','Seu negócio, seu público e o que precisa mudar. Antes do desenho, a conversa.'],
      ['02','Definir','Organizamos as informações e alinhamos a direção visual do projeto.'],
      ['03','Criar','A direção ganha forma. Você acompanha, avalia e participa dos ajustes.'],
      ['04','Entregar','Refinamos os detalhes e preparamos os materiais para você usar.'],
    ].map(([n,title,copy])=><div key={n} data-reveal="step"><span className="micro">{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
    <section className="essential-teaser wrap"><div><span className="micro">Para quem precisa dar o primeiro passo</span><h2>Comece pelo essencial.</h2><p>Um site de uma página, com escopo definido e uma prévia antes de contratar.</p></div><div className="teaser-price"><span>R$ 500 <small>em até 3x</small></span><Link to="/site-essencial" className="text-link">Conheça o Site Essencial <span aria-hidden="true">↗</span></Link></div></section>
  </StudioShell>;
}
