import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StudioShell } from "../components/studio/Studio";

import { Button } from "../components/ui/Button";
import { SITE_INFO } from "../data/siteData";

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = "Política de Privacidade | Agência Mello";
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
            Política de Privacidade
          </h1>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 leading-relaxed text-[15px]">
            <p>
              A <strong>Agência Mello</strong> valoriza a privacidade de seus clientes e visitantes. Esta política descreve como tratamos as informações coletadas por meio de nossos canais de atendimento e website.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Coleta de Informações</h2>
            <p>
              Coletamos apenas as informações voluntariamente fornecidas por você ao entrar em contato conosco via WhatsApp, e-mail ou redes sociais, tais como seu nome, telefone, endereço de e-mail e informações sobre seu negócio ou projeto.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Uso das Informações</h2>
            <p>
              As informações fornecidas são utilizadas exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Responder a solicitações de orçamento e dúvidas comerciais;</li>
              <li>Desenvolver prévias demonstrativas e propostas personalizadas;</li>
              <li>Prestar os serviços de design, desenvolvimento e suporte contratados;</li>
              <li>Cumprir obrigações legais e fiscais aplicáveis.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Compartilhamento de Dados</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. Informações técnicas podem ser processadas por plataformas de hospedagem e infraestrutura estritamente necessárias para a operação dos sites criados.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Segurança</h2>
            <p>
              Adotamos práticas adequadas de segurança para proteger seus dados contra acessos não autorizados, alterações ou destruição indevida.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Seus Direitos</h2>
            <p>
              Você pode, a qualquer momento, solicitar a confirmação, correção ou exclusão de seus dados pessoais entrando em contato direto conosco através do WhatsApp {SITE_INFO.whatsappFormatted}.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Alterações nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias em nossos processos. Recomendamos a consulta regular desta página.
            </p>

            <p className="pt-6 text-sm text-muted-foreground border-t border-white/10">
              Última atualização: {new Date().getFullYear()} — {SITE_INFO.location}.
            </p>
          </div>
        </div>
      </section>
      </StudioShell>
  );
};
