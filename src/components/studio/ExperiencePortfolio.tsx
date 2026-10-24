import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactLink } from './Studio';
import { CASES } from '../../data/cases';
import { COMMERCIAL_PROJECTS } from '../../data/commercialProjects';
import { EventPortfolio } from './EventPortfolio';
import { SiteEssentialOffer } from './SiteEssentialOffer';
import { SocialServiceDetails, BrandServiceChapter } from './ServiceChapters';
import './service-chapters.css';
import { TextReveal } from '../ui/text-reveal';

const [animalis, ...regionalProjects] = COMMERCIAL_PROJECTS;
const bellavista=CASES.find(project=>project.slug==='bellavista')!;

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Soluções">
    <div className="wrap">
      <p className="section-label"><span>Mello /</span> Conheça as soluções</p>
      <div className="work-introduction">
        <TextReveal as="h2" className="scroll-story-title" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>{'Negócios diferentes.\nSoluções diferentes.'}</TextReveal>
        <div>
          <p data-editorial-reveal="copy">Sites para apresentar seu negócio. Artes para divulgar. Identidade visual para dar unidade à sua marca.</p>
        </div>
      </div>

      <section id="servico-web" className="solution-chapter site-service-chapter" aria-labelledby="site-chapter-heading" data-service-index="0">
        <div className="solution-chapter-heading">
          <span className="micro">01 / Sites para negócios</span>
          <TextReveal as="h3" id="site-chapter-heading" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>{'Seu site pronto\nantes de você pagar.'}</TextReveal>
          <p data-editorial-reveal="copy">Sites institucionais e landing pages para apresentar seus serviços e facilitar o contato pelo WhatsApp. Conheça algumas propostas que desenvolvemos.</p>
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
              <TextReveal as="h5" className="project-thesis" per="word" preset="fade-in-blur" speedReveal={1.2} speedSegment={.6}>Do Google ao WhatsApp, o caminho precisa ser curto.</TextReveal>
              <p data-editorial-reveal="copy">{animalis.context}</p>
              <Link to={`/projetos/${animalis.slug}`} className="project-detail-link" data-editorial-reveal="copy">Conhecer o projeto <ArrowUpRight size={18} aria-hidden="true"/></Link>
            </div>
            <dl className="project-context">
              <div data-editorial-reveal="row"><dt>01 / Objetivo</dt><dd>Apresentar serviços e facilitar o caminho até o atendimento.</dd></div>
              <div data-editorial-reveal="row"><dt>02 / Estrutura</dt><dd>Serviços, planos, localização e WhatsApp em uma experiência própria.</dd></div>
              <div data-editorial-reveal="row"><dt>03 / Status</dt><dd>Prévia comercial · proposta desenvolvida.</dd></div>
            </dl>
          </div>
        </article>
      </div>
      <div className="study-introduction commercial-introduction">
        <span className="micro">Outras prévias comerciais</span>
        <h4 data-editorial-reveal="copy">Da marcenaria de bairro a uma presença mais editorial.</h4>
        <p data-editorial-reveal="copy">Propostas desenvolvidas para negócios reais da Baixada, cada uma com direção própria.</p>
      </div>
      <div className="study-grid commercial-project-grid">
        {regionalProjects.map(project => <article className="study-card commercial-card" data-editorial-reveal="card" key={project.slug}>
          <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.name}`}>
            <img src={project.image} alt={project.alt} width="1440" height="1000" loading="lazy"/>
          </Link>
          <div className="study-copy">
            <span>{project.category} · {project.location}</span>
            <h5>{project.name}</h5>
            <p>{project.intro}</p>
            <Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver projeto <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>

      <SiteEssentialOffer/>
      <details className="chapter-details conceptual-sites">
        <summary>Explore também um estudo autoral de site</summary>
        <div className="study-introduction conceptual-introduction"><span className="micro">Estudos autorais / Site</span><p>Exploração conceitual de direção visual, sem vínculo com cliente contratado.</p></div>
        <div className="study-grid conceptual-project-grid"><article className="study-card">
          <Link className="study-image" to={`/projetos/${bellavista.slug}`} aria-label={`Ver o estudo ${bellavista.name}`}><img src={bellavista.image} alt={bellavista.alt} width="1024" height="768" loading="lazy"/></Link>
          <div className="study-copy"><span>Site · Estudo conceitual</span><h4>{bellavista.name}</h4><Link to={`/projetos/${bellavista.slug}`} className="project-detail-link">Ver estudo <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
        </article></div>
      </details>
      </section>

      <section id="servico-conteudo" className="solution-chapter arts-service-chapter" aria-labelledby="arts-chapter-heading" data-service-index="1">
        <div className="solution-chapter-heading"><span className="micro">02 / Artes para redes e eventos</span><h3 id="arts-chapter-heading">Da próxima postagem<br/>ao próximo evento.</h3><p>Posts, carrosséis, flyers e artes com movimento. Cada peça com a direção visual que sua divulgação precisa.</p></div>
        <EventPortfolio/>
        <SocialServiceDetails/>
      </section>
      <BrandServiceChapter/>

      <p className="work-honesty">Animalis Pet e Du-Rio são prévias comerciais desenvolvidas para negócios reais. Viana Planejados é uma prévia comercial em negociação. Bellavista e Solace são estudos autorais. Resultados só são apresentados quando existem dados reais.</p>
      <div className="copy-bridge">
        <span className="micro">Depois de ver os projetos</span>
        <h2 className="copy-bridge-reveal" aria-label="Gostou de algum desses projetos?"><span aria-hidden="true"><span className="copy-bridge-word">Gostou</span><span className="copy-bridge-word">de</span><span className="copy-bridge-word">algum</span><span className="copy-bridge-word">desses</span><span className="copy-bridge-word">projetos?</span></span></h2>
        <p>Vamos conversar sobre o site, a identidade visual ou as artes que você precisa.</p>
        <ContactLink messageKey="projetos" className="text-link">Pedir um orçamento <span aria-hidden="true">↗</span></ContactLink>
      </div>
    </div>
  </section>;
}
