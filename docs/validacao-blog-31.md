# Sprint Blog — Issue #31

Entrega: `/blog` e `/blog/gta-vi-marketing-licoes-lancamento`, com navegação compartilhada, matéria aprovada, fontes oficiais, exemplos fictícios e cards próprios. Solicitação atual: prévia revisável, sem integração/publicação em produção.

## Conteúdo e imagens

- Fonte única em `src/data/blogPosts.js`, usada por páginas, SEO e HTML inicial. Cinco lições e listas na ordem aprovada, autoria institucional, data de 13/11/2026 e estimativa de seis minutos de leitura.
- Data anunciada de GTA VI (19/11/2026) e referências verificadas no site oficial em 13/11/2026. Revisar o texto temporal antes de publicar após o lançamento.
- Capa tipográfica inicial e dois cards com logo oficial preservado, fontes incorporadas nos SVGs editáveis e PNGs de download 1080×1350. Duas fotos fictícias geradas com IA e identificadas nas legendas. A capa foi posteriormente substituída pela recriação aprovada conforme registro abaixo. Proveniência em `docs/blog-assets-31.md`.
- Sem arquivos oficiais Rockstar baixados e incorporados diretamente, clientes/métricas inventados, CMS/login, comentários, afiliados, rastreadores ou novos pacotes comerciais. A nova capa é uma recriação derivada de referência fornecida, identificada como imagem não oficial.

## Validações locais executadas

Servidor de build: `http://127.0.0.1:4191`.

- `npm run lint`, `npm run build` e `git diff --check`: passaram. Build gerou 15 rotas + 404. Mantém aviso de bundle principal acima de 500 kB (aproximadamente 571,5 kB / 176 kB gzip nesta revisão).
- `node tests/blog-seo.cjs`: conteúdo inicial completo, listas na ordem correta, um h1/JSON-LD, Blog/BlogPosting/BreadcrumbList, canonical/OG/Twitter/article, autor/publisher/datas, dimensões dos assets, sitemap único e rewrites explícitos antes do fallback SPA. Home/404 isoladas.
- `SITE_URL=http://127.0.0.1:4191 node tests/blog.cjs`: 1440/1024/768/390/360/320, índice/artigo/carga direta/barra final/desconhecido, texto, menu/teclado/foco/sumário, PNGs baixáveis, compartilhar/cópia/manual/cancelamento e movimento reduzido dinâmico. Quatro escopos axe e ausência de overflow/erros. Token fictício de revisão preservado ao navegar; sem persistência. Rede do PNG bloqueada no teste sem atrasar a chamada de compartilhamento de texto/link.
- O Vite preview não aplica rewrites Vercel. O teste sem JavaScript local lê os arquivos `index.html` gerados; as URLs naturais e o HTML bruto precisam ser conferidos novamente no deployment da prévia.
- `SITE_URL=... node tests/experience.cjs`: seis larguras × 13 rotas existentes (78 verificações), interações/motion e 14 escopos axe, sem erros.
- `SITE_URL=... node tests/sprint.cjs`: CTAs, destinos/mensagens, teclado e reduced motion passaram.
- `SITE_URL=... node tests/seo-navigation.cjs`: 15 rotas com barra final e cinco transições SPA passaram.
- `SITE_URL=... node tests/technical-seo.cjs`: metadados estáticos, schema, sitemap/robots/manifest/icons e controles de rota passaram.
- Após a revisão visual, o WhatsApp flutuante foi ocultado somente nas rotas novas para não cobrir os controles dos cards. Lint/build e testes focados de Blog/SEO foram repetidos e passaram, incluindo a presença do flutuante na home. Sem mudanças no comportamento das rotas anteriores.
- Inspeção visual desktop/mobile, capa, fotos, exemplos, cards, console e foco. Contraste do sumário corrigido. Revisão independente confirmou correção dos rewrites e preparação antecipada do arquivo para compartilhamento.

Evidências locais ignoradas pelo Git: `artifacts/blog-31/qa`, `artifacts/blog-31/visual`, `artifacts/blog-31/assets-report.json`.

## Limites e prévia

Chrome e emulação responsiva; sem aceitação em aparelho físico ou Safari. Compartilhamento nativo e suas falhas simulados nos testes; nenhuma mensagem enviada. Os testes axe cobrem os escopos exercitados e não comprovam conformidade WCAG integral. A interface nativa e os aplicativos de destino variam conforme o dispositivo. Download PNG continua disponível.

Prévia Git e identificadores de deployment/commit registrados no [PR #32](https://github.com/agenciamello/agencia-mello/pull/32). Smoke remoto em sessões limpas de 390/1440 passou: índice/artigo, conteúdo e metadados nas URLs naturais com e sem barra final, imagens e PNGs, cópia do endereço do ambiente, reduced motion e ausência de overflow/erros. Navegação índice → artigo também conferida com JavaScript desativado no deployment Vercel.

O provedor pode consumir `_vercel_share` no redirecionamento inicial e autenticar por cookie antes de executar a aplicação. O helper preserva o token quando ele está disponível ao app; links externos de revisão são fornecidos completos e testados em sessão limpa, sem gravar o token em arquivos ou mensagens do PR. Produção permanece na versão anterior até aprovação específica.

## Revisão — nova capa ilustrada

Por solicitação do usuário, `capa-foto.webp` substitui a capa tipográfica no índice, artigo, HTML inicial e OG/Twitter/BlogPosting. Imagem WebP de 1600×900 e aproximadamente 247 KiB, preservando o enquadramento aprovado; alt descreve a fotografia entre os personagens e legenda/nota editorial identificam recriação com IA e imagem não oficial. A versão anterior e o PNG original foram preservados.

Validação local desta revisão: lint, build, diff, `tests/blog-seo.cjs` e `tests/blog.cjs` passaram. Conferência em seis larguras, downloads/compartilhamento e demais fluxos do Blog sem regressões; inspeção visual desktop/mobile e console sem erros. Uma revisão independente confirmou uso consistente da nova imagem e ausência de caminhos antigos ativos. O PR #32 reúne o deployment correspondente e o registro da conferência remota. Não há autorização de merge ou produção nesta revisão.
