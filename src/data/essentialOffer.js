// Oferta vigente confirmada pelo usuário em 24/10/2026.
export const ESSENTIAL_OFFER = {
  price: 297,
  previousPrice: 500,
  currency: 'BRL',
  installments: 3,
};
const brl = value => `R$ ${value.toFixed(2).replace('.', ',')}`;
export const ESSENTIAL_PRICE = brl(ESSENTIAL_OFFER.price);
export const ESSENTIAL_PREVIOUS_PRICE = brl(ESSENTIAL_OFFER.previousPrice);
export const ESSENTIAL_INSTALLMENTS = `em até ${ESSENTIAL_OFFER.installments}x de ${brl(ESSENTIAL_OFFER.price / ESSENTIAL_OFFER.installments)}`;
