import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '../../data/siteData';

const intents = [
  { label: 'Preciso de um site', key: 'sites' },
  { label: 'Quero trabalhar minha marca', key: 'identidade' },
  { label: 'Preciso de conteúdo', key: 'conteudo' },
] as const;

export function ContactIntent() {
  const [selected, setSelected] = useState<string>('');
  const intent = intents.find(item=>item.key===selected);
  return <div className="contact-intent">
    <fieldset><legend>Por onde começamos?</legend><div className="intent-options">{intents.map(item=><label key={item.key}><input type="radio" name="project-intent" value={item.key} checked={selected===item.key} onChange={()=>setSelected(item.key)}/><span>{item.label}<ArrowUpRight size={18} aria-hidden="true"/></span></label>)}</div></fieldset>
    <a className="intent-send" href={getWhatsAppUrl(intent?WHATSAPP_MESSAGES[intent.key]:WHATSAPP_MESSAGES.final)} target="_blank" rel="noopener noreferrer"><span key={selected}>{intent?'Conversar sobre esse projeto':'Vamos descobrir juntos'}</span><ArrowUpRight size={22} aria-hidden="true"/></a>
    <p>A conversa começa no WhatsApp, direto com Matheus Mello.</p>
  </div>;
}
