# Agência Mello — sistema da experiência

## Direção
Presença em construção. Composição editorial, clareza comercial e profundidade derivada do símbolo oficial. React/Vite preservados. Nenhum case, cliente, prêmio ou resultado inventado.

## Identidade
- Base: #0c0b0e / #101014.
- Papel: #eeeae4.
- Magenta: #ec4899, herdado da identidade existente.
- Texto escuro: #141217.
- Fontes: Space Grotesk em títulos, Inter em texto; serifada pontual na conclusão.
- Usar os arquivos oficiais agencia-mello-logo.png e agencia-mello-icone.png; não substituir por um wordmark improvisado.
- Retrato colorido e nome completo: Matheus Mello.

## Composição
Hero quase uma viewport com headline dominante, WhatsApp e caminho para projetos. Símbolo oficial em camadas com estudo em perspectiva. Portfólio em superfície clara com imagens grandes e assimetria. Serviços com índice sticky em desktop e capítulos independentes. Mobile usa fluxo contínuo, sem pinning ou interações que dependam de mouse. Conclusão em magenta e footer com assinatura oficial.

## Motion
Tokens em StudioMotion.tsx e experience.css:
- Micro: 220 ms.
- Reveal: 800 ms.
- Transição: 1150 ms.
- Stagger: 110 ms.
- Ease: power3.out / cubic-bezier(.22,1,.36,1).

Entrada do hero por linhas e planos. GSAP/ScrollTrigger importados dinamicamente para máscaras e profundidade ligadas à rolagem. Sticky nativo no índice de serviços. Tilt máximo de 1,5 grau por eixo e efeito magnético abaixo de 4 px, somente mouse/desktop. Marquee único pausado fora da viewport e em aba inativa. Sem canvas, vídeo ou WebGL na experiência ativa. Sem rolagem artificial ou cursor substituto.

## Acessibilidade e comportamento
Conteúdo disponível sem depender de animação. Reduced motion desliga os efeitos, marquee e rolagem animada. Foco visível, skip link, Escape no menu, fechamento ao selecionar a mesma âncora. Cleanup dos observers, listeners e tweens na troca de rota/preferência.

## Verificação
Testes reproduzíveis em tests/experience.cjs. A aplicação deve estar disponível em SITE_URL (padrão http://127.0.0.1:3000). Execute npm test em um ambiente Node funcional com Chrome instalado. npm run lint e npm run typecheck executam TypeScript; o repositório não contém um linter separado. npm run build gera dist.

Capturas, relatório de rotas, axe e medições de laboratório estão em artifacts. O diretório é local e ignorado pelo versionamento.

## Sprint de impacto — 18/09/2026
Hero sem card sobreposto, com logo oficial preservada e planos vetoriais derivados de sua geometria. Planos respondem ao cursor e abrem com o scroll em desktop. Portfólio em dois capítulos de largura ampla, com direção criativa factual e recortes das imagens existentes. Serviços usam sequências próprias ligadas ao scroll no desktop; no celular preservam fluxo nativo. Contato oferece três intenções opcionais com mensagens específicas para WhatsApp; nenhuma mensagem é enviada automaticamente. Reduced motion mantém tudo disponível sem coreografia. Nenhuma dependência adicionada.
