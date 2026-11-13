# Assets do primeiro artigo — Issue #31

Material visual para “GTA VI e marketing: 5 lições de lançamento para aplicar no seu negócio”. A primeira versão tinha capa tipográfica própria. Em revisão posterior, o usuário aprovou a recriação ilustrada da referência fornecida, com a mulher fotografando pelo celular e o homem posando junto ao carro, e pediu usá-la como capa. Ela é derivada dessa referência e não é apresentada como arte oficial da Rockstar.

## Arquivos finais

Em `public/assets/blog/gta-vi/`:

- `capa-foto.webp`: capa atual, 1600 × 900, cópia otimizada da recriação com celular aprovada pelo usuário. Fonte PNG preservada no workspace, sem alteração criativa nesta integração.
- `game-celular.webp`: 1280 × 759, cópia WebP da imagem JPG fornecida pelo usuário que mostra um celular diante de uma imagem de GTA VI. Sem recorte ou ampliação.
- `campanha-fachada.webp`: 1280 × 859, cópia WebP da fotografia de fachada fornecida pelo usuário. Sem recorte ou ampliação.
- `capa.webp`: capa tipográfica anterior preservada, 1600 × 900, composição editorial em preto, papel e magenta, com cinco etapas da divulgação. `capa.svg` preserva texto editável, fontes incorporadas e logo oficial da Mello.
- `pizza-close.webp`: 1536 × 1024, ilustração fotográfica fictícia gerada com IA.
- `pizza-mesa.webp`: 1536 × 1024, cena fictícia gerada com IA usando a primeira imagem como referência de continuidade.
- `card-lancamento.png`: 1080 × 1350, frase exata “Seu lançamento começa antes do ‘já disponível’.” (aspas tipográficas duplas no arquivo). Versão editável em `card-lancamento.svg`.
- `card-missao.png`: 1080 × 1350, frase exata “Comprar de você precisa ser mais fácil que uma missão do GTA.”. Versão editável em `card-missao.svg`.
- `font-license-space-grotesk.txt` e `font-license-inter.txt`: licenças SIL OFL 1.1 das fontes incorporadas nos SVGs.

As fotos são exemplos de uma pizzaria fictícia. Não representam cliente Mello, produto real, campanha contratada ou evidência de resultados. As figuras do artigo precisam informar essa natureza ilustrativa. A capa tipográfica anterior e os cards são composições autorais com o PNG oficial de `public/assets/agencia-mello-logo.png` incorporado sem redesenho. A nova capa é uma recriação ilustrativa com IA a partir de referência fornecida; legenda e nota editorial deixam clara sua natureza não oficial.

## Origem e geração

### Revisão da capa aprovada

O PNG `gta-vi-foto-celular.png` aprovado pelo usuário tem 1672×941 e SHA-256 `d330b11b963549a12fdad8361c860389d3d720c8cb2c1ddb8389af970812d58f`. A integração exporta `capa-foto.webp` em 1600×900, qualidade 90, 252.506 bytes, sem texto ou alterações criativas. A diferença de proporção exige apenas 0,4785 px de corte vertical total na saída. SHA-256 do WebP: `83d9a5094e4784e29b91a65c397f43f8c92ccaf4af2560e84ec97d0bbcb90374`. O PNG aprovado e a versão tipográfica anterior permanecem preservados. Índice, artigo, HTML inicial e compartilhamento usam o novo caminho pela fonte de dados.

### Duas imagens JPG fornecidas pelo usuário

Origem imediata: anexos `1-937573.jpg` e `2-937650.jpg`, em `.codex-remote-attachments/01a16c30-1814-73f2-bf5a-a788ebe5236e/3310945c-afa4-4b24-9a4d-fde8790c583f/` na raiz original do workspace SITE. O usuário forneceu esses arquivos para a revisão do artigo. Os JPGs originais permanecem intactos.

| Fonte | Dimensões e bytes da fonte | Cópia WebP | Dimensões e bytes da cópia | Conversão |
| --- | --- | --- | --- | --- |
| `1-937573.jpg` | 1280 × 759; 67.990 bytes | `game-celular.webp` | 1280 × 759; 61.970 bytes | Sharp 0.34.5, qualidade 88, effort 6, smartSubsample; redução de 8,85% |
| `2-937650.jpg` | 1280 × 859; 190.243 bytes | `campanha-fachada.webp` | 1280 × 859; 167.468 bytes | Sharp 0.34.5, qualidade 82, effort 6, smartSubsample; redução de 11,97% |

SHA-256 para rastreabilidade:

- `1-937573.jpg`: `d305c3e55222a6db55055f51c0bc1f4ab9bfe5dec71410c868feb4731371926a`.
- `game-celular.webp`: `b831f9ce69b91d35b25e812ed5a082a674fd095ed27867354b888051702c8aec`.
- `2-937650.jpg`: `1e8b044d7457968ba689bd31b9608f47f2fac75ec5acb09d6853a1bacdba7d0d`.
- `campanha-fachada.webp`: `0ab106818fde95ce915256732c4db9b156f651fb4d6ecf7934fbe51e8d323fbe`.

As conversões mantêm a composição e a proporção completas, sem resize, upscale, recorte, correção criativa, adição de texto ou nova geração de IA. A inspeção visual confirmou a conservação do enquadramento e dos elementos visíveis, respeitando a definição limitada dos JPGs. O nome `game-celular.webp` descreve o assunto visual e não comprova que o jogo esteja sendo executado em um celular. Autoria das fotografias, oficialidade do material e licença de publicação não foram verificadas; não atribuir esses estados ou uma plataforma de gameplay a partir das imagens.

Modo usado: ferramenta integrada `image_gen`, sem CLI/API de geração. Originais PNG preservados em `artifacts/blog-31/originals/` (pasta ignorada pelo Git) e no diretório original da ferramenta. A segunda geração utilizou a primeira como referência e manteve o produto/ingredientes.

Prompt da primeira fotografia:

> Photorealistic professional food photograph, horizontal 3:2, of one Brazilian calabresa pizza with thin calabresa sausage slices, red onion, melted mozzarella, fresh basil and handmade golden crust. Complete round pizza on a simple round wooden board and a dark wooden table, elevated three-quarter angle, warm welcoming restaurant light, natural soft shadows and realistic appetizing texture. Comfortable space around the centered pizza. No people, no printed text, no brand, no logo, no watermark. Fictitious pizzeria example.

Prompt da segunda fotografia:

> Use the first image as product continuity: the same pizza, handmade golden crust, thin calabresa sausage, red onion, mozzarella and basil. New horizontal 3:2 editorial lifestyle photograph of the same pizza and board on a shared dark wooden dinner table on a relaxed Friday evening. Two naturally posed adult hands from opposite edges serve sliced portions onto plain plates; one slice lifted naturally. Soft warm lighting, natural anatomy, no visible faces required, no extra toppings, no brand, text, logo or watermark. Illustrative fictitious dining scene, not video game imagery.

## Composição e reprodução

`scripts/generate-blog-art.mjs` cria os SVGs editáveis, rasteriza os três gráficos e otimiza as fotografias em cópias WebP. Mantém os originais e não chama geração de IA. Usa `@resvg/resvg-js` 2.6.2 e `sharp` 0.34.5 em ferramentas locais ignoradas, sem nova dependência da aplicação.

As fontes vieram dos repositórios oficiais Google Fonts (`ofl/spacegrotesk/SpaceGrotesk[wght].ttf` e `ofl/inter/Inter[opsz,wght].ttf`) e foram instanciadas localmente em Space Grotesk 600 e Inter 500/opsz 18 com fontTools 4.61.1. Os arquivos de entrada ficam em `artifacts/blog-31/tools`; o SVG final é autossuficiente e as licenças acompanham o conjunto.

Com as ferramentas/fontes e as duas fotos de entrada já preparadas, executar na raiz do checkout:

```text
node scripts/generate-blog-art.mjs
```

É possível informar outro diretório de ferramentas locais por `BLOG_ASSET_TOOLS`. A geração dos gráficos é determinística; novas fotos exigem uma nova solicitação à ferramenta integrada. Os PNGs dos cards são os arquivos de download; o site não precisa das ferramentas locais para exibir os assets.

## Verificação

### Trailer e evidência histórica — revisão editorial

O primeiro trailer é incorporado pelo player externo do YouTube somente após clique, sem baixar ou republicar o vídeo. O identificador `QdBZY2fkU-0` foi confirmado no link do [blog oficial do YouTube, de 5/12/2023](https://blog.youtube/culture-and-trends/grand-theft-auto-breaks-record/), que leva ao [Trailer 1](https://www.youtube.com/watch?v=QdBZY2fkU-0). A [página da Rockstar](https://www.rockstargames.com/VI/trailer-1) confirma o título e dezembro de 2023. A apresentação anterior ao clique é tipográfica, sem thumbnail externa ou capa com IA atribuída ao vídeo.

O marco de mais de 90 milhões de visualizações/24h é apresentado como dado histórico de dezembro de 2023, conforme [registro do Guinness](https://www.guinnessworldrecords.com/world-records/407081-most-viewed-videogame-reveal-on-youtube-in-24-hours). Não representa desempenho atual nem resultado de campanhas de clientes. Referência editorial V4 estudada para estrutura; a redação desta revisão é própria.

- Conferência visual das duas fotos, capa e dois cards.
- Dimensões verificadas por metadados após exportação; proporção 3:2 nas duas fotos e 4:5 nos cards.
- Textos e acentos conferidos nas fontes SVG e na renderização, incluindo as duas frases completas.
- Logo oficial incorporado como arquivo original, sem redesenho.
- Na primeira versão, WebP/PNG usados somavam aproximadamente 691 KiB. O arquivo da nova capa é otimizado separadamente; os SVGs editáveis da versão tipográfica, com fontes incorporadas, permanecem preservados e não precisam ser carregados pela página.
- Relatório local completo em `artifacts/blog-31/assets-report.json`.
