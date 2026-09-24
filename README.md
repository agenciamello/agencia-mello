# Agência Mello

Site institucional da Agência Mello, construído com React, TypeScript, Vite e Tailwind CSS.

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

## Identidade e verificações

O redesign utiliza os arquivos oficiais `agencia-mello-logo.png` e `agencia-mello-icone.png`, retrato colorido de Matheus Mello e estudos conceituais identificados. A presença das imagens deve ser verificada no navegador; o aviso histórico de corrupção não substitui essa verificação.

`npm run typecheck` valida TypeScript. `npm test` exige Chrome instalado e a aplicação disponível em `SITE_URL` (padrão `http://127.0.0.1:3000`). `node tests/sprint.cjs` verifica a seleção de serviço e a mensagem do WhatsApp; defina a mesma `SITE_URL`.
