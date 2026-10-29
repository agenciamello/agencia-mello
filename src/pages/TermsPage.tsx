import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StudioShell, usePageTitle } from "../components/studio/Studio";

import { SITE_INFO, SITE_ESSENCIAL_CONDITIONS } from "../data/siteData";
import { ESSENTIAL_PRICE, ESSENTIAL_INSTALLMENTS } from "../data/essentialOffer.js";
import { COMMERCIAL_OFFERS, COMMERCIAL_PAYMENT, COMMERCIAL_REVISIONS, formatOfferPrice } from "../data/commercialOffers.js";

export const TermsPage: React.FC = () => {
  usePageTitle("Termos de Uso | Agência Mello");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <StudioShell contact={false}>

      <section className="flex-1 py-32 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao início</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Termos de Uso
          </h1>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-[15px]">
            <p>
              Ao navegar neste website e contratar os serviços da <strong>Agência Mello</strong>, você concorda com os termos e condições descritos a seguir.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Objeto e Serviços</h2>
            <p>
              A Agência Mello presta serviços de design visual, desenvolvimento de websites institucionais, landing pages, identidades visuais e produção de conteúdo gráfico.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Site Essencial — Condições Específicas</h2>
            <p>
              O produto <strong>Site Essencial</strong> possui formato e escopo definidos:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Site institucional de uma página contendo até 6 seções;</li>
              <li>Prévia personalizada, privada e gratuita, exclusiva deste formato. Não há cobrança pela prévia caso o cliente não aprove; ela apresenta a proposta e não equivale à entrega final do site;</li>
              <li>Pagamento no valor anunciado ({ESSENTIAL_PRICE} {ESSENTIAL_INSTALLMENTS}) realizado apenas após a aprovação da prévia;</li>
              <li>Inclusão de até 2 (duas) rodadas de ajustes de textos e imagens após a aprovação;</li>
              <li>{SITE_ESSENCIAL_CONDITIONS.domain}</li><li>{SITE_ESSENCIAL_CONDITIONS.hosting}</li><li>{SITE_ESSENCIAL_CONDITIONS.timing}</li><li>Publicação somente após aprovação do cliente. Alterações e suporte após a entrega são combinados à parte.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Site + Divulgação e Site para Campanha</h2>
            <p>
              Os dois pacotes incluem uma página responsiva de até 6 seções, integração com WhatsApp e roteiro inicial de atendimento adaptado ao negócio. {COMMERCIAL_REVISIONS} {COMMERCIAL_PAYMENT} A publicação acontece após a aprovação final e o pagamento do saldo. A prévia gratuita e o pagamento somente após aprovação do Site Essencial não se aplicam a estes pacotes.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>{COMMERCIAL_OFFERS.divulgacao.name} — {formatOfferPrice(COMMERCIAL_OFFERS.divulgacao.price)}:</strong> página de apresentação do negócio e {COMMERCIAL_OFFERS.divulgacao.creativeCount} criativos estáticos originais, cada um em formato para Feed e Stories, totalizando {COMMERCIAL_OFFERS.divulgacao.fileCount} arquivos;</li>
              <li><strong>{COMMERCIAL_OFFERS.campanha.name} — {formatOfferPrice(COMMERCIAL_OFFERS.campanha.price)}:</strong> página para uma oferta específica e {COMMERCIAL_OFFERS.campanha.creativeCount} criativos estáticos originais em Feed e Stories, totalizando {COMMERCIAL_OFFERS.campanha.fileCount} arquivos. Inclui configuração de uma propriedade GA4 e um Pixel em contas do cliente, com verificação de visitas e cliques no WhatsApp. Esses eventos não comprovam conversas ou vendas;</li>
              <li>Uma adaptação de formato não é um novo criativo. Novos conceitos, ofertas, formatos ou funcionalidades fora do escopo recebem orçamento separado;</li>
              <li>No {COMMERCIAL_OFFERS.campanha.name}, os {COMMERCIAL_OFFERS.campanha.supportDays} dias após a publicação cobrem correções de falhas técnicas do escopo entregue, sem cota de correções dessas falhas. Não incluem manutenção recorrente, novos recursos, alterações de conteúdo, relatórios contínuos ou mudanças de serviços de terceiros;</li>
              <li>O cliente fornece materiais e acesso às contas necessárias. Prazo, escopo final e condições da configuração são combinados antes do início;</li>
              <li>Domínio à parte. A hospedagem pode usar plano gratuito, respeitando os limites do provedor; custos adicionais são combinados antes. Gestão de anúncios, verba de mídia, CRM e integrações adicionais não estão incluídos;</li>
              <li>O objetivo comercial orienta o projeto, sem garantia de volume de contatos, faturamento, vendas ou posição nas buscas.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Projetos Sob Medida</h2>
            <p>
              Projetos que envolvam lojas virtuais, sistemas de login, múltiplas páginas, automações ou identidades completas são orçados individualmente, com escopo, prazos e etapas documentadas em proposta específica.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Propriedade Intelectual e Direitos</h2>
            <p>
              Após a quitação integral dos serviços contratados, os direitos de uso dos materiais finais desenvolvidos (arquivos de layout, código publicado e marcas geradas) são transferidos ao cliente, resguardado à Agência Mello o direito de exibir as peças em seu portfólio profissional.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Responsabilidades do Cliente</h2>
            <p>
              O cliente é responsável pela veracidade e legalidade de todas as informações, textos, imagens e logotipos fornecidos para inserção no projeto, garantindo possuir as devidas autorizações de uso.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">7. Contato e Foro</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo WhatsApp {SITE_INFO.whatsappFormatted}. Fica eleito o Foro da Comarca do Rio de Janeiro/RJ para dirimir eventuais controvérsias.
            </p>

            <p className="pt-6 text-sm text-muted-foreground border-t border-white/10">
              Última atualização: 28/10/2026 — {SITE_INFO.location}.
            </p>
          </div>
        </div>
      </section>
      </StudioShell>
  );
};
