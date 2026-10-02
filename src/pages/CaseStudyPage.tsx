import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CASES } from '../data/cases';
import { COMMERCIAL_PROJECTS } from '../data/commercialProjects';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';

export function CaseStudyPage(){
  const {slug}=useParams();
  const commercial=COMMERCIAL_PROJECTS.find(project=>project.slug===slug);
  const concept=CASES.find(project=>project.slug===slug);
  const project=commercial || concept;
  const isCommercial=Boolean(commercial);

  const fallbackTitle = commercial
    ? `${commercial.name} | Projeto comercial de site | Agência Mello`
    : concept
      ? `${concept.name} | Estudo conceitual | Agência Mello`
      : 'Projeto não encontrado | Agência Mello';

  usePageTitle(fallbackTitle);

  if(!project)return <StudioShell><section className="wrap case-head"><h1>Esse projeto não está aqui.</h1><Link to="/#projetos" className="text-link">Voltar aos projetos ↗</Link></section></StudioShell>;

  if(commercial){
    const currentIndex=COMMERCIAL_PROJECTS.findIndex(item=>item.slug===commercial.slug);
    const next=COMMERCIAL_PROJECTS[(currentIndex+1)%COMMERCIAL_PROJECTS.length];

    return <StudioShell>
      <section className="case-head wrap commercial-case-head">
        <Link to="/#projetos" className="text-link">← Todos os projetos</Link>
        <div className="section-top">
          <SectionLabel number="Projeto comercial">{commercial.category}</SectionLabel>
          <span className="micro">{commercial.location} · Prévia comercial</span>
        </div>
        <h1>{commercial.name}</h1>
        <p className="case-intro">{commercial.intro}</p>
      </section>
      <figure className="case-figure wrap commercial-case-figure">
        <img src={commercial.image} alt={commercial.alt} width="1440" height="1000"/>
        <figcaption>{commercial.category} · {commercial.location} · Prévia comercial</figcaption>
      </figure>
      <section className="case-story wrap">
        <SectionLabel number="01">O projeto</SectionLabel>
        <div><h2>A proposta.</h2><p>{commercial.context}</p><p>{commercial.decision}</p></div>
      </section>
      <section className="case-details wrap">
        {commercial.details.map(([title,copy],index)=><div key={title}><span className="micro">0{index+1}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </section>
      <div className="case-note wrap commercial-case-note">
        <div>
          <span className="micro">Transparência</span>
          <p>{commercial.note}</p>
        </div>
        <a href={commercial.previewUrl} target="_blank" rel="noreferrer" className="text-link">Visitar demonstração <ArrowUpRight size={17} aria-hidden="true"/></a>
        <Link to={`/projetos/${next.slug}`} className="text-link">Próximo projeto: {next.name} ↗</Link>
      </div>
      <section className="copy-bridge wrap">
        <h2>Quer um site pro seu negócio?</h2>
        <p>Chama no WhatsApp e a gente começa pelo que sua empresa precisa comunicar.</p>
        <ContactLink messageKey="projetos" className="text-link">Quero meu site <span aria-hidden="true">↗</span></ContactLink>
      </section>
    </StudioShell>;
  }

  const conceptual=concept!;
  const next=CASES.find(item=>item.slug!==slug)!;
  return <StudioShell>
    <section className="case-head wrap">
      <Link to="/#projetos" className="text-link">← Todos os projetos</Link>
      <div className="section-top"><SectionLabel number="Estudo">{conceptual.discipline}</SectionLabel><span className="micro">Projeto conceitual</span></div>
      <h1>{conceptual.name}</h1><p className="case-intro">{conceptual.intro}</p>
    </section>
    <figure className="case-figure wrap"><img src={conceptual.image} alt={conceptual.alt} width="1024" height="768"/><figcaption>{conceptual.discipline} / Composição conceitual</figcaption></figure>
    <section className="case-story wrap"><SectionLabel number="01">O olhar por trás</SectionLabel><div><h2>A direção.</h2><p>{conceptual.context}</p><p>{conceptual.decision}</p></div></section>
    <section className="case-details wrap">{conceptual.details.map(([title,copy],index)=><div key={title}><span className="micro">0{index+1}</span><h3>{title}</h3><p>{copy}</p></div>)}</section>
    <div className="case-note wrap"><p>{conceptual.note}</p><Link to={`/projetos/${next.slug}`} className="text-link">Próximo estudo: {next.name} ↗</Link></div>
    {conceptual.slug === 'bellavista' && <section className="copy-bridge wrap"><h2>Quer um assim pro seu negócio?</h2><p>Chama no WhatsApp e a gente começa pela prévia do Site Essencial.</p><ContactLink messageKey="projetos" className="text-link">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink></section>}
    {conceptual.slug === 'solace' && <section className="copy-bridge wrap"><h2>Quer uma marca assim?</h2><p>Chama no WhatsApp e a gente começa pela conversa.</p><ContactLink messageKey="identidade" className="text-link">Quero minha identidade visual <span aria-hidden="true">↗</span></ContactLink></section>}
  </StudioShell>;
}
