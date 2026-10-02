export const SEO_SITE = {
  url: 'https://www.agenciamello.site',
  name: 'Agência Mello',
  locale: 'pt_BR',
  language: 'pt-BR',
  defaultImage: 'https://www.agenciamello.site/assets/og-home.jpg',
  defaultImageAlt: 'Agência Mello — sites, identidade visual e conteúdo para pequenos negócios',
  instagram: 'https://instagram.com/agenciamello.co',
  phone: '+5521971859948',
};

export const INDEX_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
export const NOINDEX_ROBOTS = 'noindex,follow,max-image-preview:large';

export const SEO_ROUTES = {
  '/': {
    title: 'Agência Mello | Sites e identidade visual para pequenos negócios',
    description: 'Sites, identidade visual e conteúdo para pequenos negócios. Veja seu Site Essencial pronto antes de pagar. Atendimento direto no Rio e online em todo o Brasil.',
    robots: INDEX_ROBOTS,
    type: 'website',
    schema: 'home',
  },
  '/site-essencial': {
    title: 'Site Essencial R$ 500 | Site profissional para pequenos negócios',
    description: 'Site profissional de uma página por R$ 500, com WhatsApp integrado, prévia grátis e privada e até duas rodadas de ajustes. Você só paga se aprovar.',
    robots: INDEX_ROBOTS,
    type: 'website',
    schema: 'service',
  },
  '/criacao-de-sites-nova-iguacu': {
    title: 'Criação de Sites em Nova Iguaçu | Agência Mello',
    description: 'Criação de sites profissionais em Nova Iguaçu para pequenos negócios, com WhatsApp integrado, atendimento direto e orçamento personalizado.',
    robots: INDEX_ROBOTS,
    type: 'website',
    schema: 'local-service',
    serviceName: 'Criação de Sites em Nova Iguaçu',
    serviceType: 'Criação de sites profissionais',
    areaName: 'Nova Iguaçu',
    faq: [
      ['Quanto custa criar um site em Nova Iguaçu?', 'Depende do escopo. O Site Essencial custa R$ 500. Projetos com mais páginas, funções ou necessidades específicas recebem orçamento personalizado.'],
      ['Quanto tempo leva para o site ficar pronto?', 'No Site Essencial, a estimativa inicial é uma prévia em cerca de 2 horas após receber o material e entrega em cerca de 24 horas após aprovação e ajustes. Projetos sob medida têm prazo definido no orçamento.'],
      ['Preciso ir presencialmente até a agência?', 'Não. Briefing, envio de material, ajustes e aprovação podem ser feitos online pelo WhatsApp.'],
      ['O site funciona bem no celular?', 'Sim. O layout é pensado para celular e computador, com atenção ao caminho até o WhatsApp e outras ações importantes.'],
      ['O site já sai preparado para o Google?', 'Configuramos título, descrição, estrutura semântica e SEO técnico básico. A posição nas buscas depende de concorrência, conteúdo, autoridade e outros fatores e não pode ser garantida.'],
      ['Domínio e hospedagem entram no orçamento?', 'O domínio é combinado à parte. A hospedagem pode usar plano gratuito quando o projeto se encaixa nos limites do provedor; qualquer custo adicional é informado antes.'],
    ],
  },
  '/projetos/animalis-pet': {
    title: 'Animalis Pet | Projeto comercial de site | Agência Mello',
    description: 'Conheça a prévia comercial criada pela Agência Mello para a Animalis Pet, clínica veterinária em Nova Iguaçu. Projeto não contratado, apresentado com transparência.',
    robots: INDEX_ROBOTS,
    type: 'article',
    schema: 'project',
    projectName: 'Animalis Pet',
    projectType: 'Prévia comercial de site para clínica veterinária em Nova Iguaçu',
    projectImage: 'https://www.agenciamello.site/assets/animalis-pet-site.jpg',
    projectImageAlt: 'Prévia comercial do site Animalis Pet em Nova Iguaçu',
  },
  '/projetos/viana-planejados': {
    title: 'Viana Planejados | Projeto comercial de site | Agência Mello',
    description: 'Conheça a prévia comercial criada pela Agência Mello para a Viana Planejados, marcenaria em Belford Roxo. Projeto em negociação.',
    robots: INDEX_ROBOTS,
    type: 'article',
    schema: 'project',
    projectName: 'Viana Planejados',
    projectType: 'Prévia comercial de site para marcenaria em Belford Roxo',
    projectImage: 'https://www.agenciamello.site/assets/viana-planejados-site.webp',
    projectImageAlt: 'Prévia comercial do site Viana Planejados em Belford Roxo',
  },
  '/projetos/durio-planejados': {
    title: 'Du-Rio Planejados | Projeto comercial de site | Agência Mello',
    description: 'Conheça a prévia comercial criada pela Agência Mello para a Du-Rio Planejados, marcenaria fina em Duque de Caxias. Projeto não contratado.',
    robots: INDEX_ROBOTS,
    type: 'article',
    schema: 'project',
    projectName: 'Du-Rio Planejados',
    projectType: 'Prévia comercial de site para marcenaria fina em Duque de Caxias',
    projectImage: 'https://www.agenciamello.site/assets/durio-planejados-site.jpg',
    projectImageAlt: 'Prévia comercial do site Du-Rio Planejados em Duque de Caxias',
  },
  '/projetos/bellavista': {
    title: 'Bellavista | Estudo de site para restaurante | Agência Mello',
    description: 'Estudo conceitual de site para restaurante criado pela Agência Mello, com foco em apresentação clara, experiência visual e contato pelo WhatsApp.',
    robots: INDEX_ROBOTS,
    type: 'article',
    schema: 'project',
    projectName: 'Bellavista',
    projectType: 'Estudo conceitual de site para restaurante',
    projectImage: 'https://www.agenciamello.site/assets/portfolio-restaurant.webp',
  },
  '/projetos/solace': {
    title: 'Solace | Estudo de identidade visual | Agência Mello',
    description: 'Estudo conceitual de identidade visual criado pela Agência Mello, explorando sistema de marca, tipografia, cor e aplicações com consistência.',
    robots: INDEX_ROBOTS,
    type: 'article',
    schema: 'project',
    projectName: 'Solace',
    projectType: 'Estudo conceitual de identidade visual',
    projectImage: 'https://www.agenciamello.site/assets/project-identidade.webp',
  },
  '/politica-de-privacidade': {
    title: 'Política de Privacidade | Agência Mello',
    description: 'Política de Privacidade da Agência Mello.',
    robots: NOINDEX_ROBOTS,
    type: 'website',
    schema: 'legal',
  },
  '/termos-de-uso': {
    title: 'Termos de Uso | Agência Mello',
    description: 'Termos de Uso do site da Agência Mello.',
    robots: NOINDEX_ROBOTS,
    type: 'website',
    schema: 'legal',
  },
};

export function canonicalFor(pathname) {
  return `${SEO_SITE.url}${pathname === '/' ? '/' : pathname}`;
}

export function getSeoForPath(pathname, fallbackTitle = 'Agência Mello') {
  const route = SEO_ROUTES[pathname];
  if (route) return { ...route, canonical: canonicalFor(pathname), image: route.projectImage || SEO_SITE.defaultImage, imageAlt: route.projectImageAlt || SEO_SITE.defaultImageAlt };

  return {
    title: fallbackTitle,
    description: 'Página não encontrada no site da Agência Mello.',
    robots: 'noindex,nofollow',
    type: 'website',
    schema: 'not-found',
    canonical: canonicalFor(pathname),
    image: SEO_SITE.defaultImage,
    imageAlt: SEO_SITE.defaultImageAlt,
  };
}

export function buildStructuredData(pathname, fallbackTitle) {
  const meta = getSeoForPath(pathname, fallbackTitle);
  if (meta.schema === 'not-found') return [];

  const organizationId = `${SEO_SITE.url}/#organization`;
  const founderId = `${SEO_SITE.url}/#matheus-mello`;
  const websiteId = `${SEO_SITE.url}/#website`;
  const pageId = `${meta.canonical}#webpage`;

  const person = {
    '@type': 'Person',
    '@id': founderId,
    name: 'Matheus Mello',
    jobTitle: 'Designer e desenvolvedor',
    worksFor: { '@id': organizationId },
  };

  const organization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: SEO_SITE.name,
    url: SEO_SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SEO_SITE.url}/assets/agencia-mello-logo.png`,
      width: 803,
      height: 289,
    },
    image: SEO_SITE.defaultImage,
    founder: { '@id': founderId },
    sameAs: [SEO_SITE.instagram],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Rio de Janeiro' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_SITE.phone,
      contactType: 'customer service',
      availableLanguage: ['Portuguese'],
      areaServed: 'BR',
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: SEO_SITE.url,
    name: SEO_SITE.name,
    inLanguage: SEO_SITE.language,
    publisher: { '@id': organizationId },
  };

  const webpage = {
    '@type': 'WebPage',
    '@id': pageId,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    inLanguage: SEO_SITE.language,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: meta.image,
      width: 1200,
      height: 630,
    },
  };

  const graph = [person, organization, website, webpage];

  if (meta.schema === 'home') {
    graph.push(
      {
        '@type': 'Service',
        '@id': `${SEO_SITE.url}/#service-sites`,
        name: 'Criação de sites e landing pages',
        serviceType: 'Criação de sites',
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        url: SEO_SITE.url,
      },
      {
        '@type': 'Service',
        '@id': `${SEO_SITE.url}/#service-identidade`,
        name: 'Identidade visual',
        serviceType: 'Design de identidade visual',
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        url: SEO_SITE.url,
      },
      {
        '@type': 'Service',
        '@id': `${SEO_SITE.url}/#service-conteudo`,
        name: 'Design e conteúdo para redes sociais',
        serviceType: 'Design para redes sociais',
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        url: SEO_SITE.url,
      },
    );
  }

  if (meta.schema === 'service') {
    const serviceId = `${meta.canonical}#service`;
    graph.push(
      {
        '@type': 'Service',
        '@id': serviceId,
        name: 'Site Essencial',
        description: meta.description,
        serviceType: 'Criação de site profissional de uma página',
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'Brasil' },
        url: meta.canonical,
        offers: {
          '@type': 'Offer',
          price: '500',
          priceCurrency: 'BRL',
          url: meta.canonical,
          offeredBy: { '@id': organizationId },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${meta.canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Agência Mello', item: `${SEO_SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Site Essencial', item: meta.canonical },
        ],
      },
    );
    webpage.mainEntity = { '@id': serviceId };
  }

  if (meta.schema === 'local-service') {
    const serviceId = `${meta.canonical}#service`;
    const breadcrumbId = `${meta.canonical}#breadcrumb`;
    const faqId = `${meta.canonical}#faq`;

    graph.push(
      {
        '@type': 'Service',
        '@id': serviceId,
        name: meta.serviceName,
        description: meta.description,
        serviceType: meta.serviceType,
        provider: { '@id': organizationId },
        areaServed: { '@type': 'City', name: meta.areaName },
        url: meta.canonical,
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: meta.canonical,
          servicePhone: SEO_SITE.phone,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Agência Mello', item: `${SEO_SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: meta.serviceName, item: meta.canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        mainEntity: (meta.faq || []).map(([question,answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        })),
      },
    );
    webpage.mainEntity = { '@id': serviceId };
  }

  if (meta.schema === 'project') {
    const creativeWorkId = `${meta.canonical}#project`;
    graph.push(
      {
        '@type': 'CreativeWork',
        '@id': creativeWorkId,
        name: meta.projectName,
        description: meta.projectType,
        url: meta.canonical,
        image: meta.projectImage,
        inLanguage: SEO_SITE.language,
        creator: { '@id': organizationId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${meta.canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Agência Mello', item: `${SEO_SITE.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Projetos', item: `${SEO_SITE.url}/#projetos` },
          { '@type': 'ListItem', position: 3, name: meta.projectName, item: meta.canonical },
        ],
      },
    );
    webpage.mainEntity = { '@id': creativeWorkId };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
