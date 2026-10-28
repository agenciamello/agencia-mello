import { Link } from 'react-router-dom';
import { ContactLink } from './Studio';
import { ESSENTIAL_PRICE, ESSENTIAL_PREVIOUS_PRICE, ESSENTIAL_INSTALLMENTS } from '../../data/essentialOffer.js';
import { COMMERCIAL_OFFERS, COMMERCIAL_PAYMENT, COMMERCIAL_REVISIONS, formatOfferPrice } from '../../data/commercialOffers.js';

export function SiteEssentialOffer() {
  const { divulgacao, campanha } = COMMERCIAL_OFFERS;
  return <>
    <section id="pacotes-sites" className="site-offers" aria-label="Pacotes de sites">
      <article id="oferta-site-essencial" className="package-card package-essential" data-offer="essencial" aria-labelledby="essential-offer-heading">
        <span className="micro">Para apresentar seu negócio</span>
        <h4 id="essential-offer-heading">Site Essencial</h4>
        <p className="package-promise">Veja a prévia.<br/>Só pague se aprovar.</p>
        <p>Uma página com até seis seções, adaptada ao celular, com WhatsApp, configuração básica para busca e até duas rodadas de ajustes.</p>
        <div className="package-price"><del className="previous-price">De {ESSENTIAL_PREVIOUS_PRICE}</del><span className="offer-label">Por somente</span><strong>{ESSENTIAL_PRICE}</strong><small>{ESSENTIAL_INSTALLMENTS}</small></div>
        <p className="package-payment">Prévia privada e gratuita. Pagamento após aprovação.</p>
        <ContactLink messageKey="destaque" className="text-link package-cta">Quero minha prévia grátis <span aria-hidden="true">↗</span></ContactLink>
        <Link to="/site-essencial" className="package-details-link">Ver tudo que está incluído <span aria-hidden="true">↗</span></Link>
      </article>
      <article id="oferta-site-divulgacao" className="package-card" data-offer="divulgacao" aria-labelledby="divulgacao-offer-heading">
        <span className="micro">Para começar a divulgar</span>
        <h4 id="divulgacao-offer-heading">{divulgacao.name}</h4>
        <p className="package-promise">Seu site e as peças<br/>para divulgar o lançamento.</p>
        <ul><li>Página no formato Essencial, com celular, WhatsApp e busca básica.</li><li>{divulgacao.creativeCount} criativos para Feed e Stories: {divulgacao.fileCount} arquivos finais.</li><li>Roteiro inicial de atendimento pelo WhatsApp, adaptado ao negócio.</li></ul>
        <div className="package-price"><strong>{formatOfferPrice(divulgacao.price)}</strong></div>
        <p className="package-payment">{COMMERCIAL_PAYMENT}</p>
        <ContactLink messageKey="divulgacao" className="text-link package-cta">Quero meu site com divulgação <span aria-hidden="true">↗</span></ContactLink>
      </article>
      <article id="oferta-site-campanha" className="package-card" data-offer="campanha" aria-labelledby="campanha-offer-heading">
        <span className="micro">Para uma oferta específica</span>
        <h4 id="campanha-offer-heading">{campanha.name}</h4>
        <p className="package-promise">Uma página focada<br/>na oferta que você quer vender.</p>
        <ul><li>Uma página de até seis seções.</li><li>{campanha.creativeCount} criativos para Feed e Stories: {campanha.fileCount} arquivos finais.</li><li>Roteiro inicial de atendimento pelo WhatsApp.</li><li>Analytics e Pixel da Meta para visitas e cliques no WhatsApp.</li><li>{campanha.supportDays} dias de correções de falhas técnicas da entrega.</li></ul>
        <div className="package-price"><strong>{formatOfferPrice(campanha.price)}</strong></div>
        <p className="package-payment">{COMMERCIAL_PAYMENT}</p>
        <ContactLink messageKey="campanha" className="text-link package-cta">Planejar minha campanha <span aria-hidden="true">↗</span></ContactLink>
      </article>
    </section>
    <p className="offer-scope-note">Domínio à parte. O valor de {ESSENTIAL_PRICE} corresponde ao Essencial; as prévias do portfólio têm escopos próprios.</p>
    <details id="processo" className="chapter-details site-process-details">
      <summary>Como funciona o Site Essencial</summary>
      <ol className="chapter-process">
        <li><span className="micro">01</span><h5>Você envia</h5><p>As informações, fotos e contato do seu negócio.</p></li>
        <li><span className="micro">02</span><h5>Você recebe</h5><p>Uma prévia privada e gratuita para avaliar.</p></li>
        <li><span className="micro">03</span><h5>Você decide</h5><p>Aprovou a prévia? Seguimos com contratação e pagamento. Se não aprovar, não há cobrança.</p></li>
        <li><span className="micro">04</span><h5>Ajustamos e publicamos</h5><p>Até duas rodadas de ajustes. Publicação com sua aprovação final.</p></li>
      </ol>
    </details>
    <details id="condicoes-pacotes" className="chapter-details package-conditions">
      <summary>Condições dos pacotes e dúvidas</summary>
      <dl>
        <div><dt>Como funcionam Divulgação e Campanha?</dt><dd>{COMMERCIAL_PAYMENT} {COMMERCIAL_REVISIONS} A prévia gratuita antes da contratação é exclusiva do Site Essencial.</dd></div>
        <div><dt>O que preciso enviar?</dt><dd>Informações do negócio, imagens e acessos necessários. Cada criativo é uma composição estática original em dois formatos, Feed e Stories.</dd></div>
        <div><dt>Domínio, hospedagem e prazo?</dt><dd>Domínio contratado à parte. Hospedagem sem mensalidade no plano gratuito, dentro dos limites do serviço. Qualquer mudança de plano é combinada antes. O prazo é confirmado conforme materiais, aprovações e agenda.</dd></div>
        <div><dt>O que cobre o acompanhamento da Campanha?</dt><dd>Correções de falhas técnicas da entrega por {campanha.supportDays} dias após a publicação. Mudanças de conteúdo, novas funções e serviços recorrentes recebem orçamento próprio.</dd></div>
        <div><dt>O que a medição acompanha?</dt><dd>Visitas e cliques no WhatsApp, com Analytics e Pixel nas contas do cliente e testes dos eventos. Um clique não comprova conversa ou venda. Gestão e verba de anúncios, CRM e relatórios recorrentes têm escopo separado.</dd></div>
      </dl>
      <Link to="/termos-de-uso" className="package-terms-link">Ler todas as condições <span aria-hidden="true">↗</span></Link>
    </details>
    <div className="service-local-links chapter-local-links" aria-label="Criação de sites na Baixada Fluminense">
      <span className="micro">Criação de sites na Baixada</span>
      <Link to="/criacao-de-sites-nova-iguacu" className="service-local-link">Nova Iguaçu <span aria-hidden="true">↗</span></Link>
      <Link to="/criacao-de-sites-belford-roxo" className="service-local-link">Belford Roxo <span aria-hidden="true">↗</span></Link>
      <Link to="/criacao-de-sites-duque-de-caxias" className="service-local-link">Duque de Caxias <span aria-hidden="true">↗</span></Link>
    </div>
  </>;
}
