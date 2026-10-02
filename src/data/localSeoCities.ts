export type LocalSeoCityKey = 'nova-iguacu' | 'belford-roxo' | 'duque-de-caxias';

type BusinessCard = {
  title: string;
  text: string;
};

type Faq = {
  q: string;
  a: string;
};

export type LocalSeoCity = {
  key: LocalSeoCityKey;
  route: string;
  name: string;
  label: string;
  featuredProjectSlug: 'animalis-pet' | 'viana-planejados' | 'durio-planejados';
  heroCopy: string;
  heroAsideLabel: string;
  heroAsideCopy: string;
  portfolioHeading: string;
  portfolioCopy: string;
  featuredDescription: string;
  businessHeading: string;
  businessCopy: string;
  placeContext: string;
  businessCards: BusinessCard[];
  quoteHeading: string;
  quoteCopy: string;
  faqs: Faq[];
};

const commonFaqs = {
  timing: {
    q: 'Quanto tempo leva para o site ficar pronto?',
    a: 'No Site Essencial, a estimativa inicial é uma prévia em cerca de 2 horas após receber o material e entrega em cerca de 24 horas após aprovação e ajustes. Projetos sob medida têm prazo definido no orçamento.',
  },
  mobile: {
    q: 'O site funciona bem no celular?',
    a: 'Sim. O layout é pensado para celular e computador, com atenção ao caminho até o WhatsApp e outras ações importantes.',
  },
  google: {
    q: 'O site já sai preparado para o Google?',
    a: 'Configuramos título, descrição, estrutura semântica e SEO técnico básico. A posição nas buscas depende de concorrência, conteúdo, autoridade e outros fatores e não pode ser garantida.',
  },
  domain: {
    q: 'Domínio e hospedagem entram no orçamento?',
    a: 'O domínio é combinado à parte. A hospedagem pode usar plano gratuito quando o projeto se encaixa nos limites do provedor; qualquer custo adicional é informado antes.',
  },
};

export const LOCAL_SEO_CITIES: Record<LocalSeoCityKey, LocalSeoCity> = {
  'nova-iguacu': {
    key: 'nova-iguacu',
    route: '/criacao-de-sites-nova-iguacu',
    name: 'Nova Iguaçu',
    label: 'Nova Iguaçu / RJ',
    featuredProjectSlug: 'animalis-pet',
    heroCopy: 'Sites profissionais para apresentar seus serviços, gerar confiança e levar o cliente direto ao contato.',
    heroAsideLabel: 'Para negócios locais',
    heroAsideCopy: 'Atendimento online e direto com quem cria o projeto.',
    portfolioHeading: 'Projetos para negócios da Baixada.',
    portfolioCopy: 'A Animalis Pet traz o recorte mais local: uma proposta criada para uma clínica real de Nova Iguaçu, acompanhada por outras prévias comerciais da região.',
    featuredDescription: 'Uma prévia comercial pensada para organizar serviços, localização e contato de uma clínica veterinária em Nova Iguaçu.',
    businessHeading: 'Para negócios de Nova Iguaçu que precisam ser encontrados.',
    businessCopy: 'Um site pode reunir serviços, endereço, horários, portfólio, mapa e contato em um só lugar, com atendimento e processo feitos online.',
    placeContext: 'Do Centro e Posse a Comendador Soares e Miguel Couto, a cidade reúne polos e bairros com negócios que disputam atenção primeiro pelo celular e pelas buscas.',
    businessCards: [
      { title: 'Comércio & alimentação', text: 'Lojas, restaurantes, bares e negócios de bairro que dependem de descoberta local.' },
      { title: 'Saúde & bem-estar', text: 'Clínicas, veterinárias, estética e serviços que precisam transmitir confiança antes do contato.' },
      { title: 'Profissionais & empresas', text: 'Autônomos, escritórios, eventos e serviços especializados com apresentação própria.' },
    ],
    quoteHeading: 'Quer um orçamento para criar seu site em Nova Iguaçu – RJ?',
    quoteCopy: 'Conte o básico do projeto e já começamos a conversa com o contexto certo para o seu negócio.',
    faqs: [
      {
        q: 'Quanto custa criar um site em Nova Iguaçu?',
        a: 'Depende do escopo. O Site Essencial custa R$ 500. Projetos com mais páginas, funções ou necessidades específicas recebem orçamento personalizado.',
      },
      commonFaqs.timing,
      {
        q: 'Vocês atendem negócios de quais regiões de Nova Iguaçu?',
        a: 'O processo é online e pode atender negócios de qualquer bairro do município. Centro, Posse, Comendador Soares e Miguel Couto são alguns exemplos de regiões atendidas sem necessidade de reunião presencial.',
      },
      commonFaqs.mobile,
      commonFaqs.google,
      commonFaqs.domain,
    ],
  },
  'belford-roxo': {
    key: 'belford-roxo',
    route: '/criacao-de-sites-belford-roxo',
    name: 'Belford Roxo',
    label: 'Belford Roxo / RJ',
    featuredProjectSlug: 'viana-planejados',
    heroCopy: 'Sites para apresentar serviços, portfólio e orçamento com uma presença própria — sem depender só do Instagram.',
    heroAsideLabel: 'Para negócios de Belford Roxo',
    heroAsideCopy: 'Briefing, ajustes e aprovação podem acontecer online pelo WhatsApp.',
    portfolioHeading: 'Um projeto de Belford Roxo como ponto de partida.',
    portfolioCopy: 'A Viana Planejados mostra como um negócio local pode ganhar um endereço próprio para organizar serviços, projetos e pedido de orçamento.',
    featuredDescription: 'Prévia comercial para uma marcenaria real de Belford Roxo, criada para apresentar projetos e orçamento fora da dependência exclusiva das redes sociais.',
    businessHeading: 'Presença digital para negócios de Belford Roxo.',
    businessCopy: 'O site organiza o que a empresa faz e encurta o caminho até o contato, seja para quem vende produto, serviço ou projeto sob medida.',
    placeContext: 'O processo é online e funciona para negócios de diferentes regiões do município — do Centro e Heliópolis a Areia Branca e Lote XV — sem depender de deslocamento para briefing e ajustes.',
    businessCards: [
      { title: 'Casa & projetos', text: 'Marcenarias, móveis planejados, reformas e serviços que precisam mostrar acabamento e portfólio.' },
      { title: 'Comércio & alimentação', text: 'Lojas, bares, delivery e negócios de bairro com contato rápido pelo WhatsApp.' },
      { title: 'Serviços & profissionais', text: 'Autônomos e empresas locais que precisam explicar melhor o serviço e passar confiança.' },
    ],
    quoteHeading: 'Quer criar um site para o seu negócio em Belford Roxo – RJ?',
    quoteCopy: 'Conte o que você vende, como atende e o que precisa mostrar. A partir daí definimos o formato certo.',
    faqs: [
      {
        q: 'Quanto custa criar um site em Belford Roxo?',
        a: 'Depende do escopo. O Site Essencial custa R$ 500. Projetos com mais páginas, funções ou necessidades específicas recebem orçamento personalizado.',
      },
      commonFaqs.timing,
      {
        q: 'Preciso ir presencialmente para fazer o site?',
        a: 'Não. O processo pode ser feito online pelo WhatsApp, do briefing à aprovação. Atendemos negócios de diferentes regiões de Belford Roxo, como Centro, Heliópolis, Areia Branca e Lote XV.',
      },
      commonFaqs.mobile,
      commonFaqs.google,
      commonFaqs.domain,
    ],
  },
  'duque-de-caxias': {
    key: 'duque-de-caxias',
    route: '/criacao-de-sites-duque-de-caxias',
    name: 'Duque de Caxias',
    label: 'Duque de Caxias / RJ',
    featuredProjectSlug: 'durio-planejados',
    heroCopy: 'Sites para apresentar valor, serviços e contato com clareza — do primeiro clique ao WhatsApp.',
    heroAsideLabel: 'Para negócios de Duque de Caxias',
    heroAsideCopy: 'Estrutura pensada para celular, portfólio e conversão em contato.',
    portfolioHeading: 'Uma direção mais editorial para um negócio de Caxias.',
    portfolioCopy: 'A Du-Rio Planejados mostra como um site pode transformar serviço sob medida em uma apresentação mais clara, visual e profissional.',
    featuredDescription: 'Prévia comercial para uma marcenaria fina real de Duque de Caxias, com foco em acabamento, processo, projeto sob medida e pedido de orçamento.',
    businessHeading: 'Sites para negócios de Duque de Caxias.',
    businessCopy: 'Uma presença própria ajuda a organizar serviço, portfólio e contato em uma cidade com diferentes polos comerciais e distritos.',
    placeContext: 'O atendimento é online e pode servir negócios do Centro e Jardim 25 de Agosto a Campos Elíseos, Imbariê e Xerém, com o mesmo processo de briefing e aprovação.',
    businessCards: [
      { title: 'Casa, móveis & construção', text: 'Marcenarias, arquitetura, reformas e negócios que vendem projeto, acabamento e execução.' },
      { title: 'Comércio & operação local', text: 'Lojas, alimentação e empresas que precisam concentrar informações e contato em um endereço próprio.' },
      { title: 'Serviços & profissionais', text: 'Prestadores, escritórios e especialistas que precisam apresentar autoridade antes da conversa.' },
    ],
    quoteHeading: 'Quer um orçamento para criar seu site em Duque de Caxias – RJ?',
    quoteCopy: 'Conte o básico do seu negócio e do projeto. A conversa já começa com objetivo, escopo e próximo passo claros.',
    faqs: [
      {
        q: 'Quanto custa criar um site em Duque de Caxias?',
        a: 'Depende do escopo. O Site Essencial custa R$ 500. Projetos com mais páginas, funções ou necessidades específicas recebem orçamento personalizado.',
      },
      commonFaqs.timing,
      {
        q: 'Vocês atendem diferentes regiões de Duque de Caxias?',
        a: 'Sim. O processo é online e pode atender negócios de todo o município, incluindo Centro, Jardim 25 de Agosto, Campos Elíseos, Imbariê e Xerém.',
      },
      commonFaqs.mobile,
      commonFaqs.google,
      commonFaqs.domain,
    ],
  },
};

export const LOCAL_SEO_CITY_LIST = Object.values(LOCAL_SEO_CITIES);
