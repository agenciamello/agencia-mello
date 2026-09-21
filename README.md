# Agência Mello

Site institucional da Agência Mello, construído com React, TypeScript, Vite e Tailwind CSS.

## Trabalho com agentes, Issues e PRs

Leia [AGENTS.md](AGENTS.md) antes de trabalhar no projeto. As regras se aplicam a qualquer modelo ou ferramenta: toda Correção, Melhoria ou Nova função precisa de uma Issue no GitHub e deve ser entregue por PR, mencionando obrigatoriamente a Issue na descrição. Deploys seguem o fluxo do PR e da branch de produção configurada.

Os modelos estão em [.github/ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE) e [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md). Enquanto o repositório não estiver conectado, acompanhe os rascunhos em [docs/GITHUB-PENDENCIAS.md](docs/GITHUB-PENDENCIAS.md); rascunhos não substituem Issues reais.

## Desenvolvimento local

Requisitos: Node.js 20 ou superior.

```sh
npm install
npm run dev
```

Validações disponíveis:

```sh
npm run lint
npm run build
```

## Publicação e rotas

O projeto usa `BrowserRouter`. Em produção, o servidor ou a plataforma de hospedagem precisa aplicar um SPA rewrite: toda rota que não corresponder a um arquivo estático deve servir `/index.html`. Sem essa regra, acessos diretos e recarregamentos em rotas como `/site-essencial`, `/politica-de-privacidade` e `/termos-de-uso` retornam 404.

O fallback deve servir `index.html` sem redirecionar a URL do navegador. A sintaxe exata depende da plataforma de hospedagem.

## Assets pendentes de substituição

Os 17 arquivos de imagem versionados em `public` estão binariamente corrompidos. Eles não foram recriados nem alterados nesta sprint. Substitua cada arquivo por sua cópia original, mantendo exatamente o mesmo caminho e nome:

- `public/favicon.png`
- `public/assets/artes-eventos.webp`
- `public/assets/demo-barbearia.jpg`
- `public/assets/demo-estetica.jpg`
- `public/assets/demo-hero-local.jpg`
- `public/assets/demo-restaurante.jpg`
- `public/assets/hero-composition-480.webp`
- `public/assets/hero-composition-768.webp`
- `public/assets/hero-composition.webp`
- `public/assets/logo.png`
- `public/assets/matheus-mello.jpg`
- `public/assets/matheus-mello.webp`
- `public/assets/og-home.jpg`
- `public/assets/portfolio-restaurant.webp`
- `public/assets/project-conteudo.webp`
- `public/assets/project-identidade.webp`
- `public/assets/site-essencial-preview.jpg`

Não converta os arquivos corrompidos nem use imagens geradas como substitutos. A restauração correta exige os binários originais.
