import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel, StudioShell, usePageTitle } from '../components/studio/Studio';
import { COMMERCIAL_PROJECTS } from '../data/commercialProjects';
import { LOCAL_SEO_CITIES, LOCAL_SEO_CITY_LIST, type LocalSeoCityKey } from '../data/localSeoCities';
import { getWhatsAppUrl } from '../data/siteData';
import '../local-seo.css';

const processSteps = [
  ['01', 'Você manda o básico', 'Serviços, fotos, Instagram e o que precisa destacar.'],
  ['02', 'A gente organiza', 'Definimos estrutura, conteúdo e caminho até o contato.'],
  ['03', 'Você acompanha', 'Recebe a prévia, avalia e pede os ajustes combinados.'],
  ['04', 'Publicamos', 'Com sua aprovação, colocamos o site no ar.'],
];

function LocalQuoteForm({ cityName }: { cityName: string }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nome = String(data.get('nome') || '').trim();
    const negocio = String(data.get('negocio') || '').trim();
    const tipo = String(data.get('tipo') || '').trim();
    const projeto = String(data.get('projeto') || '').trim();

    const message = [
      `Oi, Matheus! Vim pela página de criação de sites em ${cityName} e quero um orçamento personalizado.`,
      '',
      `Nome: ${nome}`,
      `Negócio: ${negocio}`,
      `Tipo de site: ${tipo}`,
      `Projeto: ${projeto}`,
    ].join('\n');

    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  return <form className="local-quote-form" onSubmit={handleSubmit}>
    <div className="local-form-grid">
      <label>
        <span>Seu nome</span>
        <input name="nome" autoComplete="name" required placeholder="Como podemos te chamar?" />
      </label>
      <label>
        <span>Nome do negócio</span>
        <input name="negocio" autoComplete="organization" required placeholder="Ex.: Studio, loja, clínica..." />
      </label>
    </div>
    <label>
      <span>O que você precisa?</span>
      <select name="tipo" required defaultValue="">
        <option value="" disabled>Selecione uma opção</option>
        <option>Site institucional</option>
        <option>Landing page</option>
        <option>Site Essencial</option>
        <option>Ainda não sei qual formato</option>
      </select>
    </label>
    <label>
      <span>Conte um pouco sobre o projeto</span>
      <textarea name="projeto" required rows={5} placeholder="Serviços, objetivo do site, referências ou o que você gostaria de melhorar na presença online." />
    </label>
    <button className="local-form-submit" type="submit">Pedir orçamento no WhatsApp <span aria-hidden="true">↗</span></button>
    <p className="local-form-note">Ao enviar, abrimos o WhatsApp com seu briefing preenchido. Nenhum dado é enviado antes disso.</p>
  </form>;
}

function LocalClusterNav({ current }: { current: LocalSeoCityKey }) {
  return <section className="local-cluster-bar" aria-label="Criação de sites na Baixada Fluminense">
    <div className="wrap local-cluster-inner">
      <span className="micro">Criação de sites na Baixada</span>
      <nav>
        {LOCAL_SEO_CITY_LIST.map(city =>
          <Link
            key={city.key}
            to={city.route}
            aria-current={city.key === current ? 'page' : undefined}
          >
            {city.name}
            {city.key !== current && <span aria-hidden="true">↗</span>}
          </Link>
        )}
      </nav>
    </div>
  </section>;
}

export function LocalSeoCityPage({ cityKey }: { cityKey: LocalSeoCityKey }) {
  const city = LOCAL_SEO_CITIES[cityKey];
  const featured = COMMERCIAL_PROJECTS.find(project => project.slug === city.featuredProjectSlug)!;
  const regionalProjects = COMMERCIAL_PROJECTS.filter(project => project.slug !== city.featuredProjectSlug);

  usePageTitle(`Criação de Sites em ${city.name} | Agência Mello`);

  return <StudioShell contact={false}>
    <section className="local-hero wrap">
      <SectionLabel number={city.label}>Criação de sites</SectionLabel>
      <div className="local-hero-grid">
        <div>
          <h1>Criação de sites em<br/><span>{city.name}</span> para<br/>negócios que querem aparecer.</h1>
          <p>{city.heroCopy}</p>
          <div className="local-hero-actions">
            <a href="#orcamento" className="solid-link">Quero um orçamento <span aria-hidden="true">↗</span></a>
            <a href="#portfolio-local" className="text-link">Ver projetos <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="local-hero-aside">
          <span className="micro">{city.heroAsideLabel}</span>
          <ul>
            <li>Sites institucionais</li>
            <li>Landing pages</li>
            <li>WhatsApp integrado</li>
            <li>SEO técnico básico</li>
          </ul>
          <p>{city.heroAsideCopy}</p>
        </div>
      </div>
    </section>

    <LocalClusterNav current={cityKey}/>

    <section className="local-solutions">
      <div className="wrap">
        <SectionLabel number="01">Site profissional</SectionLabel>
        <div className="local-section-heading">
          <h2>Seu negócio precisa de<br/>um endereço próprio.</h2>
          <p>Um bom site organiza o que você faz, facilita o contato e cria uma presença que não depende só do feed.</p>
        </div>
        <div className="local-solution-grid">
          <article>
            <span>01</span>
            <h3>Site institucional</h3>
            <p>Empresa, serviços, localização, portfólio e contato em uma estrutura clara.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Landing page</h3>
            <p>Uma página focada em um serviço, campanha ou objetivo comercial específico.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Site Essencial</h3>
            <p>Uma página, até seis seções e prévia antes do pagamento.</p>
            <Link to="/site-essencial">Conhecer o Site Essencial <ArrowUpRight size={17} aria-hidden="true"/></Link>
          </article>
        </div>
      </div>
    </section>

    <section className="local-process wrap">
      <SectionLabel number="02">Como funciona</SectionLabel>
      <div className="local-section-heading local-section-heading-dark">
        <h2>Do briefing ao<br/>site publicado.</h2>
        <p>Processo direto, com o projeto acompanhado pelo WhatsApp e escopo definido antes de começar.</p>
      </div>
      <div className="local-process-grid">
        {processSteps.map(([number,title,text]) => <article key={number}>
          <span className="micro">{number}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>
    </section>

    <section id="portfolio-local" className="local-portfolio">
      <div className="wrap">
        <SectionLabel number="03">Portfólio local</SectionLabel>
        <div className="local-section-heading">
          <h2>{city.portfolioHeading}</h2>
          <p>{city.portfolioCopy}</p>
        </div>
        <article className="local-featured-project">
          <Link to={`/projetos/${featured.slug}`} className="local-featured-image">
            <img src={featured.image} alt={featured.alt} width="1440" height="1000" loading="lazy"/>
          </Link>
          <div>
            <span className="micro">{featured.category} / {featured.location}</span>
            <h3>{featured.name}</h3>
            <p>{city.featuredDescription}</p>
            <Link to={`/projetos/${featured.slug}`} className="text-link">Ver projeto <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>
        <div className="local-study-grid local-commercial-grid">
          {regionalProjects.map(project => <article key={project.slug}>
            <Link to={`/projetos/${project.slug}`} className="local-study-image">
              <img src={project.image} alt={project.alt} width="1440" height="1000" loading="lazy"/>
            </Link>
            <span className="micro">{project.category} / {project.location}</span>
            <h3>{project.name}</h3>
            <p>{project.intro}</p>
            <Link to={`/projetos/${project.slug}`} className="text-link">Ver projeto <ArrowUpRight size={17} aria-hidden="true"/></Link>
          </article>)}
        </div>
        <p className="local-portfolio-note">Animalis Pet e Du-Rio são prévias comerciais desenvolvidas para negócios reais. Viana Planejados é uma prévia comercial em negociação. Resultados só são publicados quando houver dados reais.</p>
      </div>
    </section>

    <section className="local-business wrap">
      <SectionLabel number="04">{city.name}</SectionLabel>
      <div className="local-section-heading local-section-heading-dark">
        <h2>{city.businessHeading}</h2>
        <p>{city.businessCopy}</p>
      </div>
      <p className="local-place-context">{city.placeContext}</p>
      <div className="local-business-grid">
        {city.businessCards.map(card => <article key={card.title}>
          <strong>{card.title}</strong>
          <span>{card.text}</span>
        </article>)}
      </div>
      <div className="local-internal-links">
        <Link to="/#servicos">Conhecer todos os serviços <ArrowUpRight size={17} aria-hidden="true"/></Link>
        <Link to="/#servico-marca">Identidade visual <ArrowUpRight size={17} aria-hidden="true"/></Link>
        <Link to="/#servico-conteudo">Design para redes sociais <ArrowUpRight size={17} aria-hidden="true"/></Link>
      </div>
    </section>

    <section id="orcamento" className="local-quote">
      <div className="wrap local-quote-layout">
        <div>
          <SectionLabel number="05">Orçamento personalizado</SectionLabel>
          <h2>{city.quoteHeading}</h2>
          <p>{city.quoteCopy}</p>
        </div>
        <LocalQuoteForm cityName={city.name}/>
      </div>
    </section>

    <section className="local-faq wrap">
      <SectionLabel number="06">Dúvidas frequentes</SectionLabel>
      <h2>Antes de começar.</h2>
      {city.faqs.map(faq => <details key={faq.q}>
        <summary>{faq.q}</summary>
        <p>{faq.a}</p>
      </details>)}
    </section>
  </StudioShell>;
}
