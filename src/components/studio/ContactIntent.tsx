import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../data/siteData';

const intents = [
  { label: 'Preciso de um site', key: 'sites' },
  { label: 'Preciso de uma identidade visual', key: 'identidade' },
  { label: 'Preciso de peças para redes sociais', key: 'conteudo' },
] as const;

export function ContactIntent() {
  const [selected, setSelected] = useState<string>('');
  const intent = intents.find(item=>item.key===selected);
  return <div className="contact-intent">
    <fieldset aria-describedby="intent-help"><legend>O que você precisa criar?</legend><p id="intent-help">Se quiser, escolha um serviço para começar a conversa.</p><div className="intent-options">{intents.map(item=><label key={item.key}><input type="radio" name="project-intent" value={item.key} checked={selected===item.key} onChange={()=>setSelected(item.key)}/><span>{item.label}<ArrowUpRight size={18} aria-hidden="true"/></span></label>)}</div></fieldset>
    <a className="intent-send" href={getWhatsAppUrl(intent?WHATSAPP_MESSAGES[intent.key]:WHATSAPP_MESSAGES.final)} target="_blank" rel="noopener noreferrer"><span>Conversar no WhatsApp</span><ArrowUpRight size={22} aria-hidden="true"/></a>
    <p>Você fala direto com Matheus Mello para entender o projeto e combinar os próximos passos.</p>
  </div>;
}
