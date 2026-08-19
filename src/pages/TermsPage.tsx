import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { SITE_INFO } from "../data/siteData";

export const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = "Termos de Uso | Agência Mello";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 py-32 px-5 sm:px-6 lg:px-8">
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
              <li>Apresentação de prévia demonstrativa personalizada sem compromisso inicial;</li>
              <li>Pagamento no valor anunciado (R$ 500 em até 3x) realizado apenas após a aprovação da prévia;</li>
              <li>Inclusão de até 2 (duas) rodadas de ajustes de textos e imagens após a aprovação;</li>
              <li>Custos recorrentes de domínio próprio e plano de hospedagem são detalhados e acordados antes da publicação.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Projetos Sob Medida</h2>
            <p>
              Projetos que envolvam lojas virtuais, sistemas de login, múltiplas páginas, automações ou identidades completas são orçados individualmente, com escopo, prazos e etapas documentadas em proposta específica.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Propriedade Intelectual e Direitos</h2>
            <p>
              Após a quitação integral dos serviços contratados, os direitos de uso dos materiais finais desenvolvidos (arquivos de layout, código publicado e marcas geradas) são transferidos ao cliente, resguardado à Agência Mello o direito de exibir as peças em seu portfólio profissional.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Responsabilidades do Cliente</h2>
            <p>
              O cliente é responsável pela veracidade e legalidade de todas as informações, textos, imagens e logotipos fornecidos para inserção no projeto, garantindo possuir as devidas autorizações de uso.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Contato e Foro</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo WhatsApp {SITE_INFO.whatsappFormatted}. Fica eleito o Foro da Comarca do Rio de Janeiro/RJ para dirimir eventuais controvérsias.
            </p>

            <p className="pt-6 text-sm text-muted-foreground border-t border-white/10">
              Última atualização: {new Date().getFullYear()} — {SITE_INFO.location}.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
