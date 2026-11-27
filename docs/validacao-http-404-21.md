# Correção do fallback HTTP 404 — Issue #21

Issue: https://github.com/agenciamello/agencia-mello/issues/21
PR: https://github.com/agenciamello/agencia-mello/pull/35

## Problema e mudança

O rewrite global de `vercel.json` enviava endereços inexistentes para a home,
com HTTP 200, robots indexável e canonical da página inicial antes do JavaScript.
O teste HTTP reproduziu esse erro na produção anterior à correção.

A remoção desse rewrite deixa a Vercel servir o `dist/404.html` existente com
HTTP 404. O documento mantém título próprio e `noindex,nofollow`; canonical,
alternativas de idioma e `og:url` são removidos desse HTML compartilhado para não
anunciar um endereço fictício. A página visual e o link de retorno são preservados.

O teste do blog foi atualizado para exigir a ausência do fallback global.

## Validações executadas

- `npm run lint`: aprovado.
- `npm run build`: aprovado, 15 rotas e 404 gerados. Aviso de bundle maior que 500 kB.
- `node tests/blog-seo.cjs`: aprovado.
- `SITE_URL=http://127.0.0.1:4211 node tests/seo-navigation.cjs`: aprovado,
  15 rotas com barra final e cinco transições internas.
- `SITE_URL=http://127.0.0.1:4211 npm test`: aprovado, 13 rotas, seis larguras,
  interações, motion, teclado e verificações de acessibilidade sem violações reportadas.
- `SITE_URL=http://127.0.0.1:4211 node tests/sprint.cjs`: aprovado,
  intenções de contato, teclado, mensagens e movimento reduzido.
- `node tests/http-routing.cjs` na prévia Vercel: aprovado,
  cinco URLs inexistentes por GET e HEAD, metadados de erro no HTML inicial,
  15 rotas válidas com e sem barra final, arquivos estáticos e página 404 no
  navegador em 1440 e 390 px, sem overflow ou erros de JavaScript, com retorno
  à home e atualização dos metadados sem recarregar o documento.

Prévia inicial validada (código da aplicação em `10ba554`):
https://agenciamello-lw0hohuyl-matheus-projects-f7e9ddc4.vercel.app

O teste HTTP aceita `SITE_URL` com o link temporário de acesso à prévia protegida
e preserva os cookies de autenticação. Credenciais não são gravadas no repositório.
É necessário executar o teste a partir deste projeto, após o build, com Chrome
instalado. O servidor de desenvolvimento/preview do Vite não valida as regras HTTP
da Vercel; essa parte foi verificada no deployment real da branch.

## Publicação

Produção ainda não alterada. A Issue permanece aberta até a integração do PR,
deploy pela integração Git e repetição da verificação HTTP/navegador em produção.
