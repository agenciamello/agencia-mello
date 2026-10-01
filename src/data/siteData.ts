export const SITE_ESSENCIAL_CONDITIONS = {
  "domain": "Domínio .com.br à parte: cerca de R$ 40/ano, confirmado antes.",
  "hosting": "Hospedagem sem mensalidade no plano gratuito da Netlify. Se precisar mudar de plano, combinamos antes.",
  "timing": "Estimativa: prévia em cerca de 2h após receber o material; entrega em cerca de 24h após aprovação e ajustes. Domínio, DNS ou mudanças podem alterar o prazo."
};

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
  canonicalUrl: "https://www.agenciamello.site",
};

export const WHATSAPP_MESSAGES = {
  header: "Oi, Matheus! Vim pelo site da Agência Mello e queria conversar sobre um projeto. Meu negócio é",
  hero: "Oi, Matheus! Vim pelo site e quero ver uma prévia do meu site. Meu negócio é",
  sites: "Oi, Matheus! Vim pelo site e preciso de um site pro meu negócio. Ele é",
  identidade: "Oi, Matheus! Vim pelo site e preciso de uma identidade visual pro meu negócio. Ele é",
  conteudo: "Oi, Matheus! Vim pelo site e preciso de peças pras redes sociais do meu negócio. Ele é",
  destaque: "Oi, Matheus! Vi o Site Essencial de R$ 500 e quero ver uma prévia. Meu negócio é",
  projetos: "Oi, Matheus! Vi os projetos no site e quero algo assim pro meu negócio. Ele é",
  final: "Oi, Matheus! Quero ver como meu site ficaria. Meu negócio é",
  flutuante: "Oi, Matheus! Vim pelo site e queria tirar uma dúvida.",
};

export const SITE_ESSENCIAL_MESSAGES = {
  header: "Oi, Matheus! Quero ver a prévia do Site Essencial pro meu negócio. Ele é",
  hero: "Oi, Matheus! Quero ver uma prévia do meu site. Meu negócio é",
  recursos: "Oi, Matheus! Queria entender o que está incluso no Site Essencial.",
  preco: "Oi, Matheus! Queria entender como funciona o pagamento do Site Essencial (R$ 500).",
  exemplos: "Oi, Matheus! Queria ver um exemplo de Site Essencial pro meu tipo de negócio. Ele é",
  processo: "Oi, Matheus! Quero pedir minha prévia do Site Essencial. Meu negócio é",
  comparativo: "Oi, Matheus! Queria entender a diferença entre o Site Essencial e um projeto sob medida.",
  autoridade: "Oi, Matheus! Queria conversar com você sobre o Site Essencial.",
  faq: "Oi, Matheus! Tenho uma dúvida sobre o Site Essencial.",
  ctaFinal: "Oi, Matheus! Quero minha prévia do Site Essencial. Meu negócio é",
  barraMobile: "Oi, Matheus! Quero ver minha prévia do Site Essencial. Meu negócio é",
  flutuante: "Oi, Matheus! Tenho uma dúvida sobre o Site Essencial.",
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
    a: "Não. O valor de R$ 500 é exclusivo do Site Essencial, que possui uma página e o que está incluso definido. Projetos com mais páginas, sistemas ou funcionalidades recebem orçamento personalizado.",
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
    a: "Sim. A gente está no Rio, mas atende online em todo o Brasil.",
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
    "n": "01",
    "title": "Você manda o básico",
    "text": "Serviços, fotos, Instagram e contato. Tudo pelo WhatsApp."
  },
  {
    "n": "02",
    "title": "A gente cria a prévia",
    "text": "Uma prévia privada do seu site, sem custo."
  },
  {
    "n": "03",
    "title": "Você avalia com calma",
    "text": "Gostou? Seguimos. Não gostou? Você não paga."
  },
  {
    "n": "04",
    "title": "Aprova, ajusta e publica",
    "text": "Até duas rodadas de ajustes e publicação."
  }
];

export const SITE_ESSENCIAL_INCLUDED_LIST = [
  "Uma página, até seis seções",
  "WhatsApp em destaque",
  "Celular e computador",
  "SEO básico (título e descrição)",
  "Até duas rodadas de ajustes",
  "Pagamento só após aprovação"
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
    "q": "O que está incluído nos R$ 500?",
    "a": "Uma página com até seis seções, versão mobile e desktop, WhatsApp e até duas rodadas de ajustes."
  },
  {
    "q": "Quando eu pago?",
    "a": "Só depois de ver a prévia e aprovar."
  },
  {
    "q": "Quantos ajustes eu posso pedir?",
    "a": "Até duas rodadas. Mudanças estruturais ou extras são orçados à parte."
  },
  {
    "q": "Quem fornece textos e imagens?",
    "a": "Você manda serviços, fotos e Instagram. Se faltar algo, avisamos antes de fechar."
  },
  {
    "q": "Domínio e hospedagem estão inclusos?",
    "a": "Domínio .com.br é à parte, cerca de R$ 40/ano. Hospedagem sem mensalidade no plano gratuito da Netlify, dentro dos limites do plano."
  },
  {
    "q": "O site vai aparecer no Google?",
    "a": "Ele sai com configuração básica de SEO. Posição no Google não pode ser garantida."
  },
  {
    "q": "Quanto tempo leva?",
    "a": "Estimativa: prévia em cerca de 2h e entrega em cerca de 24h após aprovação e ajustes."
  },
  {
    "q": "Todo site custa R$ 500?",
    "a": "Não. R$ 500 é o Site Essencial. Mais páginas ou funcionalidades têm orçamento próprio."
  },
  {
    "q": "Vocês atendem fora do Rio?",
    "a": "Sim. Atendemos online em todo o Brasil."
  }
];
