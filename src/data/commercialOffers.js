// Pacotes aprovados na Sprint Vendas — 28/10/2026 — Issue #27.
export const COMMERCIAL_OFFERS = {
  divulgacao: { name: 'Site + Divulgação', price: 697, creativeCount: 3, fileCount: 6, supportDays: 0 },
  campanha: { name: 'Site para Campanha', price: 1297, creativeCount: 5, fileCount: 10, supportDays: 30 },
};

export const formatOfferPrice = value => `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
export const COMMERCIAL_PAYMENT = '50% para iniciar e 50% antes da publicação.';
export const COMMERCIAL_REVISIONS = 'Até duas rodadas de ajustes na página e uma rodada consolidada nas artes.';
