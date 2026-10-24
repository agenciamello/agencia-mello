# Text reveal — Issue #25 / PR #26

## Projeto e localização
React 19, TypeScript, Tailwind 4 e `motion/react` já estão instalados. Nenhuma dependência nova é necessária. O diretório compartilhado é `src/components/ui`, onde já vive o túnel. Centralizar o componente nessa pasta mantém os efeitos reutilizáveis e evita cópias por seção; não criar uma segunda pasta `components/ui` fora de `src`.

- Componente: `src/components/ui/text-reveal.tsx`.
- Demonstração do exemplo: `src/components/ui/text-reveal-demo.tsx`, sem nova rota pública.
- Estilos específicos: `src/components/ui/text-reveal.css`.
- Tokens compartilhados: `src/lib/motion-tokens.ts`; o ritmo GSAP existente foi preservado.
- Tailwind global: `src/index.css`; estilos do site: `studio.css`, `experience.css` e `service-chapters.css`.

O alias `@` existente aponta à raiz, não a `src`. A integração usa imports relativos e não altera a resolução global. O componente dispensa o helper `cn` do snippet: composição de classes é feita localmente, sem instalar utilitários que esta integração não usa. Não exige providers, estado global, imagens adicionais ou troca de logos.

## Comportamento escolhido
Textos factuais existentes, fornecidos como strings: abertura das soluções, título de sites e tese do Animalis. Revelação por palavras com `fade-in-blur` leve; dispara na entrada da viewport e não reinicia ao voltar. Textos, linhas Objetivo/Estrutura/Status e cards comerciais usam entradas discretas em GSAP. Cada elemento tem um único controlador; a antiga timeline da tese foi removida.

Preservados os presets `blur`, `fade-in-blur`, `scale`, `fade`, `slide`, segmentação `word`/`char`/`line`, transições/variantes e callbacks do snippet. Adicionados `id` para âncoras semânticas e `startOnView` (padrão true); false reproduz a entrada ao montar da demo original. Corrigida a quebra de linha para `\n`. Espaços não recebem stagger e palavras não são cortadas; caracteres Unicode são segmentados com `Array.from`.

Uma cópia acessível é anunciada; os segmentos visuais ficam fora da árvore assistiva em todos os modos. O primeiro HTML é estático. Movimento reduzido, inclusive quando alterado durante a sessão, entrega texto estático imediatamente. Observers/listeners são removidos ao desmontar. Oferta/preço e efeito de eventos não foram alterados.

## shadcn CLI (opcional, não executado)
O layout de UI é compatível com o padrão de componentes locais, mas o repositório não tem `components.json` inicializado para gerar componentes pelo CLI. Isso não bloqueia o componente fornecido. Para habilitar futuramente a geração:

1. Usar a [instalação oficial para projeto Vite existente](https://ui.shadcn.com/docs/installation/vite#existing-project).
2. Preservar o Tailwind já configurado; não substituir `src/index.css` nem a identidade do site.
3. Executar `npx shadcn@latest init` no checkout conectado e revisar o diff gerado.
4. Configurar os aliases de componentes/UI para os diretórios existentes, levando em conta que aqui `@` aponta à raiz (`@/src/components`, `@/src/components/ui`). Não mudar esse alias silenciosamente para `src`.

Não é necessário recriar o projeto, instalar Tailwind/TypeScript novamente ou adicionar fotos de estoque para um efeito de texto.
