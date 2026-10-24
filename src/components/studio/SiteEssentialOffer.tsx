import { Link } from 'react-router-dom';
import { ContactLink } from './Studio';
import { ESSENTIAL_PRICE, ESSENTIAL_PREVIOUS_PRICE, ESSENTIAL_INSTALLMENTS } from '../../data/essentialOffer.js';
import { SITE_ESSENCIAL_PROCESS_STEPS } from '../../data/siteData';

export function SiteEssentialOffer() {
  return <>
    <section id="oferta-site-essencial" className="essential-teaser chapter-offer" aria-labelledby="essential-offer-heading">
      <div>
        <span className="micro">Gostou das prévias? Conheça o Site Essencial</span>
        <h4 id="essential-offer-heading">Comece pelo<br/>Site Essencial.</h4>
        <p>Uma página, até seis seções, WhatsApp e até duas rodadas de ajustes. Prévia privada e grátis: você só paga se aprovar.</p>
        <p>Domínio à parte. Mais páginas ou funções? Orçamento sob medida.</p>
      </div>
      <div className="teaser-price">
        <del className="previous-price">De {ESSENTIAL_PREVIOUS_PRICE}</del>
        <span><small className="offer-label">Por somente</small>{ESSENTIAL_PRICE}<small>{ESSENTIAL_INSTALLMENTS}, só depois de aprovar</small></span>
        <ContactLink messageKey="destaque" className="text-link">Quero minha prévia grátis <span aria-hidden="true">↗</span></ContactLink>
        <Link to="/site-essencial" className="text-link">Veja tudo que está incluído <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    <p className="offer-scope-note">As prévias comerciais mostram propostas com escopos próprios. O valor de {ESSENTIAL_PRICE} é exclusivo do formato Site Essencial descrito acima.</p>
    <details id="processo" className="chapter-details site-process-details">
      <summary>Como funciona o Site Essencial</summary>
      <ol className="chapter-process">{SITE_ESSENCIAL_PROCESS_STEPS.map(step=><li key={step.n}><span className="micro">{step.n}</span><h5>{step.title}</h5><p>{step.text}</p></li>)}</ol>
      <p>Projetos maiores ou fora desse formato recebem orçamento e processo próprios.</p>
    </details>
    <div className="service-local-links chapter-local-links" aria-label="Criação de sites na Baixada Fluminense">
      <span className="micro">Criação de sites na Baixada</span>
      <Link to="/criacao-de-sites-nova-iguacu" className="service-local-link">Nova Iguaçu <span aria-hidden="true">↗</span></Link>
      <Link to="/criacao-de-sites-belford-roxo" className="service-local-link">Belford Roxo <span aria-hidden="true">↗</span></Link>
      <Link to="/criacao-de-sites-duque-de-caxias" className="service-local-link">Duque de Caxias <span aria-hidden="true">↗</span></Link>
    </div>
  </>;
}
