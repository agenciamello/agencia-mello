import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CASES } from '../data/cases';
import { StudioShell, SectionLabel, usePageTitle } from '../components/studio/Studio';
export function CaseStudyPage(){
  const {slug}=useParams();const project=CASES.find(p=>p.slug===slug);
  usePageTitle(project?`${project.name} — Estudo conceitual | Agência Mello`:'Projeto não encontrado | Agência Mello');
  if(!project)return <StudioShell><section className="wrap case-head"><h1>Esse projeto não está aqui.</h1><Link to="/#projetos" className="text-link">Voltar aos projetos ↗</Link></section></StudioShell>;
  const next=CASES.find(p=>p.slug!==slug)!;
  return <StudioShell><section className="case-head wrap"><Link to="/#projetos" className="text-link">← Todos os projetos</Link><div className="section-top"><SectionLabel number="Estudo">{project.discipline}</SectionLabel><span className="micro">Projeto conceitual</span></div><h1>{project.name}</h1><p className="case-intro">{project.intro}</p></section>
  <figure className="case-figure wrap"><img src={project.image} alt={project.alt} width="1024" height="768"/><figcaption>{project.discipline} / Composição conceitual</figcaption></figure>
  <section className="case-story wrap"><SectionLabel number="01">O olhar por trás</SectionLabel><div><h2>A direção.</h2><p>{project.context}</p><p>{project.decision}</p></div></section>
  <section className="case-details wrap">{project.details.map(([title,copy],index)=><div key={title}><span className="micro">0{index+1}</span><h3>{title}</h3><p>{copy}</p></div>)}</section><div className="case-note wrap"><p>{project.note}</p><Link to={`/projetos/${next.slug}`} className="text-link">Próximo estudo: {next.name} ↗</Link></div></StudioShell>;
}
