import { Link } from 'react-router-dom';
import { ContactLink } from './Studio';
import { CASES } from '../../data/cases';

export function SocialServiceDetails() {
  return <section className="social-service-details" aria-labelledby="social-service-heading">
    <div>
      <span className="micro">Também para o dia a dia da sua marca</span>
      <h4 id="social-service-heading">Seu produto, serviço ou oferta<br/>no <span className="next-post-underline">próximo post.</span></h4>
      <p>Peças com a identidade da sua marca para divulgar novidades e promoções.</p>
      <dl className="art-prices"><div><dt>Arte avulsa para redes</dt><dd>R$ 35</dd></div><div><dt>Pacote de 10 artes</dt><dd>R$ 250</dd></div></dl>
      <ContactLink messageKey="conteudo" className="text-link">Pedir artes para minhas redes <span aria-hidden="true">↗</span></ContactLink>
    </div>
    <div className="social-client-showcase">
      <div className="social-client-pieces" data-editorial-reveal="card">
        <Link to="/projetos/sulsign" className="social-client-main" aria-label="Conhecer o projeto SulSign e ver as peças">
          <img src="/assets/sulsign/impacto-fachada.webp" alt="Arte de divulgação SulSign: Impacto Desde a Fachada, em preto e verde, com simulação de fachada." width="1122" height="1402" loading="lazy"/>
        </Link>
        <Link to="/projetos/sulsign" className="social-client-support" aria-label="Ver a peça Sua produção. Nossa precisão. no projeto SulSign">
          <img src="/assets/sulsign/producao-precisao.webp" alt="Peça SulSign Sua produção. Nossa precisão., apresentada em uma simulação de cartaz na parede." width="1536" height="1024" loading="lazy"/>
        </Link>
      </div>
      <Link to="/projetos/sulsign" className="social-client-project-link">SulSign · Peças de divulgação <span aria-hidden="true">↗</span></Link>
      <p className="visual-example-note">Trabalho para cliente Mello. Fachadas apresentadas como simulações nas peças.</p>
    </div>
  </section>;
}

export function BrandServiceChapter() {
  const study=CASES.find(item=>item.slug==='solace')!;
  return <section id="servico-marca" className="solution-chapter brand-service-chapter" aria-labelledby="brand-chapter-heading" data-service-index="2">
    <div className="solution-chapter-heading"><span className="micro">03 / Logo e identidade visual</span><h3 id="brand-chapter-heading">Uma marca que<br/>seu cliente reconhece.</h3><p>Logo, cores e tipografia para usar no perfil, nas artes e nos materiais do negócio.</p></div>
    <article className="brand-client-feature">
      <div className="brand-client-media" data-editorial-reveal="card">
        <figure>
          <Link className="brand-client-image" to="/projetos/sulsign" aria-label="Conhecer o sistema visual e as peças da SulSign"><img src="/assets/sulsign/producao-precisao.webp" alt="Aplicação da linguagem visual SulSign em um cartaz preto e verde, com logotipo e serviços em destaque." width="1536" height="1024" loading="lazy"/></Link>
          <figcaption>Peça de divulgação · Simulação de aplicação</figcaption>
        </figure>
        <ul className="brand-client-palette" aria-label="Paleta do sistema visual SulSign">
          {[
            ['Verde','#18D878'],['Preto','#080C0A'],['Grafite','#101815'],['Cinza','#93A59B'],['Branco','#FFFFFF'],
          ].map(([name,color])=><li key={name}><span className="brand-client-swatch" style={{backgroundColor:color}} aria-hidden="true"/><span>{name}</span></li>)}
        </ul>
      </div>
      <div className="study-copy brand-client-copy" data-editorial-reveal="copy">
        <span>Cliente Mello · Comunicação visual</span>
        <h4>SulSign</h4>
        <p>Uma linguagem visual para apresentar os serviços da marca com consistência.</p>
        <p>Paleta, tipografia, aplicações e peças de divulgação desenvolvidas a partir do logotipo existente.</p>
        <Link to="/projetos/sulsign" className="project-detail-link">Conhecer o projeto <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
    <article className="brand-study brand-study-secondary">
      <Link className="study-image" to={`/projetos/${study.slug}`} aria-label={`Ver o estudo ${study.name}`}><img src={study.image} alt={study.alt} width="1024" height="768" loading="lazy"/></Link>
      <div className="study-copy"><span>Estudo conceitual · Identidade visual</span><h4>{study.name}</h4><p>Exemplo autoral de logo, paleta e aplicações para um universo de cuidado. Sem vínculo com cliente contratado.</p><Link to={`/projetos/${study.slug}`} className="project-detail-link">Ver estudo <span aria-hidden="true">↗</span></Link></div>
    </article>
    <ContactLink messageKey="identidade" className="text-link brand-service-cta">Pedir orçamento de identidade visual <span aria-hidden="true">↗</span></ContactLink>
  </section>;
}
