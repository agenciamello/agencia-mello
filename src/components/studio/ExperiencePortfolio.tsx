import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactLink } from './Studio';
import { COMMERCIAL_PROJECTS } from '../../data/commercialProjects';
import { EventPortfolio } from './EventPortfolio';
import { SiteEssentialOffer } from './SiteEssentialOffer';
import { SocialServiceDetails, BrandServiceChapter } from './ServiceChapters';
import './service-chapters.css';
import { TextReveal } from '../ui/text-reveal';

const [animalis, ...regionalProjects] = COMMERCIAL_PROJECTS;

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Soluções">
    <div className="wrap">
      <p className="section-label"><span>Mello /</span> Conheça as soluções</p>
      <div className="work-introduction">
        <TextReveal as="h2" className="scroll-story-title" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>{'Negócios diferentes.\nSoluções diferentes.'}</TextReveal>
        <div>
          <p data-editorial-reveal="copy">Conheça propostas e trabalhos da Mello.</p>
        </div>
      </div>

      <section id="servico-web" className="solution-chapter site-service-chapter" aria-labelledby="site-chapter-heading" data-service-index="0">
        <div className="solution-chapter-heading">
          <span className="micro">01 / Sites para negócios</span>
          <TextReveal as="h3" id="site-chapter-heading" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>{'Apresente seus serviços.\nFacilite o pedido de orçamento.'}</TextReveal>
          <p data-editorial-reveal="copy">Seu negócio em um site próprio, com informações claras, versão para celular e WhatsApp em destaque.</p>
        </div>
        <p className="commercial-preview-label micro">Prévias comerciais · Negócios da Baixada Fluminense</p>
      <div className="showcase-list showcase-commercial-list">
        <article className="showcase-project showcase-commercial" data-project-story="0">
          <div className="project-heading">
            <h4><Link to={`/projetos/${animalis.slug}`}>{animalis.name}</Link></h4>
            <span className="project-status">{animalis.category} · {animalis.location}<br/><strong>Prévia comercial</strong></span>
          </div>
          <Link className="showcase-image" to={`/projetos/${animalis.slug}`} aria-label={`Ver projeto ${animalis.name}`}>
            <div className="project-image-mask"><img src={animalis.image} alt={animalis.alt} width="1440" height="1000" loading="lazy"/></div>
            <span className="project-open">Ver projeto <ArrowUpRight size={20} aria-hidden="true"/></span>
          </Link>
          <div className="project-editorial">
            <div className="project-argument">
              <span className="commercial-kicker">Prévia comercial · Nova Iguaçu</span>
              <TextReveal as="h5" className="project-thesis" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>Serviços, localização e contato no mesmo lugar.</TextReveal>
              <p data-editorial-reveal="copy">Uma proposta de site para apresentar a clínica e facilitar o caminho até o atendimento.</p>
              <Link to={`/projetos/${animalis.slug}`} className="project-detail-link" data-editorial-reveal="copy">Conhecer a proposta <ArrowUpRight size={18} aria-hidden="true"/></Link>
            </div>
            <dl className="project-context">
              <div data-editorial-reveal="row"><dt>01 / Objetivo</dt><dd>Apresentar serviços e facilitar o caminho até o atendimento.</dd></div>
              <div data-editorial-reveal="row"><dt>02 / Estrutura</dt><dd>Serviços, localização e WhatsApp em destaque.</dd></div>
              <div data-editorial-reveal="row"><dt>03 / Status</dt><dd>Prévia comercial · proposta desenvolvida.</dd></div>
            </dl>
          </div>
        </article>
      </div>
      <div className="study-introduction commercial-introduction">
        <span className="micro">Outras prévias comerciais</span>
        <h4 data-editorial-reveal="copy">Projetos e serviços que merecem ser vistos.</h4>
      </div>
      <div className="study-grid commercial-project-grid">
        {regionalProjects.map(project => <article className="study-card commercial-card" data-editorial-reveal="card" key={project.slug}>
          <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.name}`}>
            <img src={project.image} alt={project.alt} width="1440" height="1000" loading="lazy"/>
          </Link>
          <div className="study-copy">
            <span>{project.category} · {project.location}{project.slug === 'viana-planejados' ? ' · Em negociação' : ''}</span>
            <h5>{project.name}</h5>
            <p>{project.intro}</p>
            <Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver proposta <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>

      <SiteEssentialOffer/>
      </section>

      <section id="servico-conteudo" className="solution-chapter arts-service-chapter" aria-labelledby="arts-chapter-heading" data-service-index="1">
        <div className="solution-chapter-heading"><span className="micro">02 / Artes para redes e eventos</span><h3 id="arts-chapter-heading">Sua divulgação precisa chamar atenção<br/>e gerar interesse.</h3><p>Posts, carrosséis, flyers e peças com movimento para divulgar o que você oferece.</p></div>
        <EventPortfolio/>
        <SocialServiceDetails/>
      </section>
      <BrandServiceChapter/>

      <p className="work-honesty">Sites apresentados como prévias comerciais. Solace é um estudo autoral.</p>
      <div className="copy-bridge">
        <span className="micro">Depois de ver os projetos</span>
        <h2 className="copy-bridge-reveal" aria-label="Vamos conversar sobre seu projeto."><span aria-hidden="true"><span className="copy-bridge-word">Vamos</span><span className="copy-bridge-word">conversar</span><span className="copy-bridge-word">sobre</span><span className="copy-bridge-word">seu</span><span className="copy-bridge-word">projeto.</span></span></h2>
        <p>Site, identidade visual ou artes para divulgar.</p>
        <ContactLink messageKey="projetos" className="text-link">Falar sobre meu projeto <span aria-hidden="true">↗</span></ContactLink>
      </div>
    </div>
  </section>;
}
