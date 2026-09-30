import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../data/siteData';

const intents = [
  { label: 'Preciso de um site', key: 'sites' },
  { label: 'Preciso de uma identidade visual', key: 'identidade' },
  { label: 'Preciso de peças pras redes sociais', key: 'conteudo' },
] as const;

export function ContactIntent() {
  const [selected, setSelected] = useState<string>('');
  const intent = intents.find(item=>item.key===selected);
  return <div className="contact-intent">
    <fieldset aria-describedby="intent-help"><legend>O que você precisa?</legend><p id="intent-help">Escolha uma opção e a conversa já começa adiantada.</p><div className="intent-options">{intents.map(item=><label key={item.key}><input type="radio" name="project-intent" value={item.key} checked={selected===item.key} onChange={()=>setSelected(item.key)}/><span>{item.label}<ArrowUpRight size={18} aria-hidden="true"/></span></label>)}</div></fieldset>
    <a className="intent-send" href={getWhatsAppUrl(intent?WHATSAPP_MESSAGES[intent.key]:WHATSAPP_MESSAGES.final)} target="_blank" rel="noopener noreferrer"><span>Chamar no WhatsApp</span><ArrowUpRight size={22} aria-hidden="true"/></a>
    <p>Você fala direto com o Matheus e já começa a conversa com o contexto certo.</p>
  </div>;
}
