export const SITE_INFO = {
  name: "Agência Mello",
  location: "Rio de Janeiro, Brasil",
  instagram: {
    handle: "@agenciamello.co",
    url: "https://instagram.com/agenciamello.co",
  },
  whatsappPhone: "5521971859948",
  whatsappFormatted: "(21) 97185-9948",
  founder: "Matheus Mello",
  canonicalUrl: "https://agenciamello.vercel.app",
};

export const WHATSAPP_MESSAGES = {
  header: "Olá! Gostaria de conversar com a Agência Mello sobre um projeto.",
  hero: "Olá! Gostaria de conversar com a Agência Mello sobre um projeto para minha empresa.",
  sites: "Olá! Gostaria de saber mais sobre a criação de sites e presença digital da Agência Mello.",
  identidade: "Olá! Gostaria de saber mais sobre a criação de identidade visual da Agência Mello.",
  conteudo: "Olá! Gostaria de saber mais sobre a produção de conteúdo visual da Agência Mello.",
  destaque: "Olá! Gostaria de entender como funciona o Site Essencial de R$ 500 da Agência Mello.",
  projetos: "Olá! Vi os projetos da Agência Mello e gostaria de conversar sobre algo assim para o meu negócio.",
  final: "Olá! Gostaria de conversar com a Agência Mello sobre um projeto para meu negócio.",
  flutuante: "Olá! Gostaria de falar com a Agência Mello sobre um projeto.",
};

export const SITE_ESSENCIAL_MESSAGES = {
  header: "Olá! Gostaria de ver uma prévia do Site Essencial para o meu negócio.",
  hero: "Olá! Gostaria de ver uma prévia demonstrativa do Site Essencial para a minha empresa.",
  recursos: "Olá! Gostaria de entender mais sobre o que está incluso no Site Essencial.",
  preco: "Olá! Gostaria de entender os detalhes do investimento de R$ 500 do Site Essencial.",
  exemplos: "Olá! Gostaria de ver um exemplo do Site Essencial aplicado ao meu segmento.",
  processo: "Olá! Gostaria de solicitar uma prévia do Site Essencial para o meu negócio.",
  comparativo: "Olá! Gostaria de entender a diferença entre o Site Essencial e um projeto sob medida.",
  autoridade: "Olá! Gostaria de conversar com o Matheus Mello sobre o Site Essencial.",
  faq: "Olá! Tenho uma dúvida sobre o funcionamento do Site Essencial.",
  ctaFinal: "Olá! Gostaria de ver uma prévia demonstrativa do Site Essencial para a minha empresa.",
  barraMobile: "Olá! Gostaria de ver uma prévia do Site Essencial para o meu negócio.",
  flutuante: "Olá! Gostaria de tirar dúvidas sobre o Site Essencial.",
};

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE_INFO.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export const MAIN_NAV_LINKS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Site Essencial", href: "/site-essencial", to: "/site-essencial" },
  { label: "Projetos", href: "#projetos" },
  { label: "Como funciona", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
];

export const SITE_ESSENCIAL_NAV_LINKS = [
  { label: "Para quem é", href: "#para-quem" },
  { label: "O que inclui", href: "#incluso" },
  { label: "Exemplos", href: "#exemplos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Investimento", href: "#investimento" },
  { label: "Dúvidas", href: "#duvidas" },
];

export const FOOTER_SERVICES_LINKS = [
  { label: "Sites e presença digital", href: getWhatsAppUrl(WHATSAPP_MESSAGES.sites) },
  { label: "Site Essencial — R$ 500", href: "/site-essencial", to: "/site-essencial" },
  { label: "Identidade visual", href: getWhatsAppUrl(WHATSAPP_MESSAGES.identidade) },
  { label: "Conteúdo visual", href: getWhatsAppUrl(WHATSAPP_MESSAGES.conteudo) },
];

export const HOME_TRUST_ITEMS = [
  { iconName: "Sparkles", label: "Design profissional" },
  { iconName: "Zap", label: "Entrega ágil" },
  { iconName: "Users", label: "Atendimento próximo" },
  { iconName: "ShieldCheck", label: "Soluções sem burocracia" },
];

export const SERVICES_DATA = [
  {
    iconName: "Globe",
    title: "Sites e presença digital",
    description: "Sites institucionais e landing pages criados para apresentar seu negócio com clareza e transformar visitas em contatos.",
    items: ["Sites institucionais", "Landing pages", "Integração com WhatsApp"],
    cta: "Quero falar sobre um site",
    whatsappKey: "sites" as const,
  },
  {
    iconName: "Palette",
    title: "Identidade visual",
    description: "Criamos marcas coerentes, reconhecíveis e preparadas para transmitir mais valor em todos os pontos de contato.",
    items: ["Logo e sistema visual", "Paleta e tipografia", "Direção de marca"],
    cta: "Quero fortalecer minha marca",
    whatsappKey: "identidade" as const,
  },
  {
    iconName: "LayoutGrid",
    title: "Conteúdo visual",
    description: "Conteúdo profissional para manter sua empresa ativa, consistente e bem apresentada nas redes sociais.",
    items: ["Posts e carrosséis", "Stories e flyers", "Materiais promocionais"],
    cta: "Quero melhorar meu conteúdo",
    whatsappKey: "conteudo" as const,
  },
];

export const PROJECTS_DATA = [
  {
    image: "/assets/portfolio-restaurant.webp",
    name: "Site para restaurante italiano",
    category: "Site • Restaurante",
    conceptual: true,
  },
  {
    image: "/assets/project-identidade.webp",
    name: "Identidade para estúdio de bem-estar",
    category: "Identidade visual • Bem-estar",
    conceptual: true,
  },
  {
    image: "/assets/project-conteudo.webp",
    name: "Conteúdo para marca fitness",
    category: "Conteúdo • Fitness",
    conceptual: true,
  },
  {
    image: "/assets/artes-eventos.webp",
    name: "Campanha visual para eventos",
    category: "Social media • Eventos",
    conceptual: true,
  },
];

export const HOME_PROCESS_STEPS = [
  {
    n: "01",
    title: "Entendemos seu negócio",
    text: "Conhecemos seus objetivos, seu público e o momento da marca.",
  },
  {
    n: "02",
    title: "Definimos a direção",
    text: "Organizamos as informações e traçamos a direção visual.",
  },
  {
    n: "03",
    title: "Criamos e ajustamos",
    text: "Desenvolvemos a solução e refinamos com o seu feedback.",
  },
  {
    n: "04",
    title: "Entregamos",
    text: "Você recebe o projeto pronto para publicar e usar.",
  },
];

export const COMPARISON_YOU_GET = [
  "Comunicação direta",
  "Escopo claro",
  "Processo organizado",
  "Entrega ágil",
];

export const HOME_FAQS = [
  {
    q: "O que é o Site Essencial?",
    a: "É o nosso produto de site profissional de uma página para negócios locais. Ele tem formato e escopo definidos, permitindo um valor acessível de R$ 500 em até 3x, com uma prévia demonstrativa antes da contratação.",
  },
  {
    q: "Todos os sites custam R$500?",
    a: "Não. O valor de R$ 500 é exclusivo do Site Essencial, que possui uma página e um escopo definido. Projetos com mais páginas, sistemas ou funcionalidades recebem orçamento personalizado.",
  },
  {
    q: "Preciso pagar antes de ver?",
    a: "Não. Quando a Agência Mello prepara uma prévia personalizada para sua empresa, você pode avaliar antes de decidir. O pagamento acontece somente depois que a proposta é aprovada.",
  },
  {
    q: "Quanto tempo leva?",
    a: "O prazo depende do envio das informações, da complexidade do conteúdo e da rapidez na aprovação. A estimativa é informada antes do início da etapa final.",
  },
  {
    q: "Vocês atendem fora do Rio de Janeiro?",
    a: "Sim. A Agência Mello está no Rio de Janeiro, mas atende clientes de outras cidades e estados de forma online.",
  },
  {
    q: "Como começar?",
    a: "Basta clicar em qualquer botão de WhatsApp deste site para falar direto conosco. Entendemos seu momento e indicamos a melhor solução.",
  },
];

// SITE ESSENCIAL DATA
export const SITE_ESSENCIAL_PRICE = "R$ 500";
export const SITE_ESSENCIAL_INSTALLMENTS = "em até 3x de R$ 166,67";

export const HOME_SITE_ESSENCIAL_INSTALLMENTS = "em até 3x";

export const HOME_SITE_ESSENCIAL_BENEFITS = [
  "Site profissional de uma página",
  "Até 6 seções",
  "Responsivo para celular e computador",
  "WhatsApp integrado",
  "Você aprova antes da publicação",
];

export const SITE_ESSENCIAL_TRUST_ITEMS = [
  { iconName: "Eye", label: "Você vê antes de pagar" },
  { iconName: "Smartphone", label: "Site adaptado ao celular" },
  { iconName: "MessageCircle", label: "Integração com WhatsApp" },
  { iconName: "CheckCircle", label: "Publicação após aprovação" },
];

export const SITE_ESSENCIAL_SEGMENTS = [
  { iconName: "Scissors", label: "Barbearias e salões" },
  { iconName: "Sparkles", label: "Clínicas e espaços de estética" },
  { iconName: "Utensils", label: "Restaurantes e comércios" },
  { iconName: "User", label: "Profissionais autônomos" },
  { iconName: "Calendar", label: "Empresas de eventos" },
  { iconName: "Wrench", label: "Prestadores de serviços" },
  { iconName: "Dumbbell", label: "Academias e estúdios" },
  { iconName: "Building2", label: "Outros negócios locais" },
];

export const SITE_ESSENCIAL_TAGS = [
  { iconName: "Sparkles", label: "Beleza" },
  { iconName: "Utensils", label: "Alimentação" },
  { iconName: "Calendar", label: "Eventos" },
  { iconName: "Wrench", label: "Serviços locais" },
];

export const SITE_ESSENCIAL_NO_SITE = [
  "Informações espalhadas.",
  "Serviços difíceis de encontrar.",
  "Dependência de algoritmos.",
  "Menor controle sobre a apresentação.",
  "Mais dúvidas antes do contato.",
];

export const SITE_ESSENCIAL_WITH_SITE = [
  "Serviços apresentados com clareza.",
  "Botão direto para o WhatsApp.",
  "Informações organizadas.",
  "Experiência adaptada ao celular.",
  "Mais confiança no primeiro contato.",
];

export const SITE_ESSENCIAL_FEATURES = [
  {
    iconName: "Layers",
    title: "Uma página com até 6 seções",
    text: "Início, apresentação da empresa, serviços, diferenciais, localização e contato.",
  },
  {
    iconName: "Smartphone",
    title: "Design adaptado ao celular",
    text: "Layout planejado prioritariamente para quem acessa pelo smartphone.",
  },
  {
    iconName: "MessageCircle",
    title: "Botão direto para o WhatsApp",
    text: "Facilita o início de conversas e reduz o caminho até o contato.",
  },
  {
    iconName: "Sliders",
    title: "Até duas rodadas de ajustes",
    text: "Refinamos textos, imagens e detalhes após sua primeira avaliação.",
  },
  {
    iconName: "Rocket",
    title: "Entrega ágil",
    text: "Processo direto, sem etapas confusas ou espera desnecessária.",
  },
  {
    iconName: "Search",
    title: "Configuração básica para busca",
    text: "Título, descrição e estrutura preparados para mecanismos de pesquisa.",
  },
];

export const SITE_ESSENCIAL_EXAMPLES = [
  {
    image: "/assets/demo-barbearia.jpg",
    name: "Barbearia de bairro",
    segment: "Barbearia e salão",
    description: "Estrutura direta com serviços, valores de referência, horários e contato pelo WhatsApp.",
  },
  {
    image: "/assets/demo-estetica.jpg",
    name: "Espaço de estética e bem-estar",
    segment: "Estética e bem-estar",
    description: "Apresentação suave dos procedimentos, diferenciais e canais de atendimento.",
  },
  {
    image: "/assets/demo-restaurante.jpg",
    name: "Restaurante de bairro",
    segment: "Restaurante e comércio local",
    description: "Cardápio resumido, localização, horário de funcionamento e pedido por WhatsApp.",
  },
];

export const SITE_ESSENCIAL_PROCESS_STEPS = [
  {
    n: "01",
    title: "Você envia as informações do negócio",
    text: "Compartilha serviços, fotos, links das redes sociais e dados de contato.",
  },
  {
    n: "02",
    title: "Criamos uma prévia personalizada",
    text: "Desenvolvemos uma demonstração privada para você ver como seu site ficaria.",
  },
  {
    n: "03",
    title: "Você avalia com calma",
    text: "Analisa a proposta e decide se o Site Essencial faz sentido para seu momento.",
  },
  {
    n: "04",
    title: "Você aprova, ajustamos e publicamos",
    text: "Se a proposta fizer sentido, confirmamos a contratação e o pagamento, realizamos até duas rodadas de ajustes e organizamos a publicação.",
  },
];

export const SITE_ESSENCIAL_INCLUDED_LIST = [
  "Uma página",
  "Até seis seções",
  "Estrutura objetiva",
  "Integração com WhatsApp",
  "Até duas rodadas de ajustes",
  "Sem pagamento antecipado",
];

export const SITE_ESSENCIAL_NOT_INCLUDED_LIST = [
  "Loja virtual",
  "Sistema de pagamento",
  "Área de login",
  "Cadastro de usuários",
  "Painel administrativo",
  "Múltiplas páginas",
];

export const SITE_ESSENCIAL_POST_APPROVAL = [
  {
    title: "Domínio",
    text: "É o endereço utilizado para acessar seu site, como suaempresa.com.br.",
  },
  {
    title: "Hospedagem",
    text: "É o serviço que mantém o site disponível na internet.",
  },
  {
    title: "Suporte",
    text: "São as condições para futuras alterações, manutenção e atendimento após a entrega.",
  },
];

export const SITE_ESSENCIAL_FAQS = [
  {
    q: "O que exatamente está incluído nos R$ 500?",
    a: "O valor inclui um site profissional de uma página, com até seis seções, versão responsiva, integração com WhatsApp, apresentação dos serviços, informações comerciais e até duas rodadas de ajustes dentro do escopo.",
  },
  {
    q: "Quando faço o pagamento?",
    a: "O pagamento acontece somente depois que você aprova a prévia e decide contratar o Site Essencial. Após a confirmação, realizamos os ajustes previstos e seguimos para a publicação.",
  },
  {
    q: "Preciso pagar para receber a prévia?",
    a: "Não. Quando a Agência Mello prepara uma prévia personalizada para sua empresa, você pode avaliar antes de decidir. O pagamento acontece somente depois que a proposta é aprovada.",
  },
  {
    q: "O site será publicado sem minha autorização?",
    a: "Não. A prévia é privada e demonstrativa. O site só será publicado oficialmente depois da sua aprovação.",
  },
  {
    q: "Quantas alterações posso solicitar?",
    a: "O Site Essencial inclui até duas rodadas de ajustes dentro do escopo contratado. Mudanças estruturais ou solicitações adicionais podem ser avaliadas separadamente.",
  },
  {
    q: "Quem fornece os textos e imagens?",
    a: "Utilizamos as informações fornecidas pela empresa e, quando aplicável, conteúdos já disponíveis nos canais oficiais do negócio. Necessidades de produção de texto, fotografia ou materiais adicionais são alinhadas antes da contratação.",
  },
  {
    q: "O domínio está incluído nos R$ 500?",
    a: "As opções e os custos de domínio são informados antes da publicação. Caso a empresa já possua um domínio, também poderemos avaliar sua utilização.",
  },
  {
    q: "Existe mensalidade?",
    a: "As condições de hospedagem, manutenção e suporte são explicadas antes da contratação. Nenhuma cobrança recorrente é adicionada sem aprovação.",
  },
  {
    q: "O site vai aparecer no Google?",
    a: "O site recebe uma configuração básica de título, descrição e estrutura. O posicionamento nos resultados do Google depende de diversos fatores e não pode ser garantido.",
  },
  {
    q: "Quanto tempo leva para ficar pronto?",
    a: "O prazo depende do envio das informações, da complexidade do conteúdo e da rapidez na aprovação. A estimativa é informada antes do início da etapa final.",
  },
  {
    q: "O que acontece se eu não gostar da prévia?",
    a: "Você pode informar que a proposta não faz sentido para seu momento e não haverá cobrança pela prévia apresentada.",
  },
  {
    q: "Todos os tipos de site custam R$ 500?",
    a: "Não. O valor de R$ 500 é exclusivo do Site Essencial, que possui uma página e um escopo definido. Projetos com mais páginas, sistemas ou funcionalidades recebem orçamento personalizado.",
  },
  {
    q: "Vocês atendem fora do Rio de Janeiro?",
    a: "Sim. A Agência Mello está no Rio de Janeiro, mas atende clientes de outras cidades e estados de forma online.",
  },
];
