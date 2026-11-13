# Assets do primeiro artigo — Issue #31

Material próprio para “GTA VI e marketing: 5 lições de lançamento para aplicar no seu negócio”. Nenhuma screenshot, arte, personagem, fonte ou logotipo da Rockstar foi incorporado. A expressão GTA VI aparece em tipografia editorial da Mello para identificar o assunto analisado.

## Arquivos finais

Em `public/assets/blog/gta-vi/`:

- `capa.webp`: 1600 × 900, composição editorial em preto, papel e magenta, com cinco etapas da divulgação. `capa.svg` preserva texto editável, fontes incorporadas e logo oficial da Mello.
- `pizza-close.webp`: 1536 × 1024, ilustração fotográfica fictícia gerada com IA.
- `pizza-mesa.webp`: 1536 × 1024, cena fictícia gerada com IA usando a primeira imagem como referência de continuidade.
- `card-lancamento.png`: 1080 × 1350, frase exata “Seu lançamento começa antes do ‘já disponível’.” (aspas tipográficas duplas no arquivo). Versão editável em `card-lancamento.svg`.
- `card-missao.png`: 1080 × 1350, frase exata “Comprar de você precisa ser mais fácil que uma missão do GTA.”. Versão editável em `card-missao.svg`.
- `font-license-space-grotesk.txt` e `font-license-inter.txt`: licenças SIL OFL 1.1 das fontes incorporadas nos SVGs.

As fotos são exemplos de uma pizzaria fictícia. Não representam cliente Mello, produto real, campanha contratada ou evidência de resultados. As figuras do artigo precisam informar essa natureza ilustrativa. A capa e os cards são composições tipográficas autorais com o PNG oficial de `public/assets/agencia-mello-logo.png` incorporado sem redesenho. Fotos sem texto, marca ou logotipo.

## Origem e geração

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

- Conferência visual das duas fotos, capa e dois cards.
- Dimensões verificadas por metadados após exportação; proporção 3:2 nas duas fotos e 4:5 nos cards.
- Textos e acentos conferidos nas fontes SVG e na renderização, incluindo as duas frases completas.
- Logo oficial incorporado como arquivo original, sem redesenho.
- Arquivos WebP/PNG finais somam aproximadamente 691 KiB; os SVGs editáveis, com fontes incorporadas, não precisam ser carregados pela página.
- Relatório local completo em `artifacts/blog-31/assets-report.json`.
