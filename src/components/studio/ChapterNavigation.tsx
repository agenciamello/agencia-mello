import { useEffect, useState } from 'react';
const chapters = [{id:'inicio',name:'Início'},{id:'servico-web',name:'Sites'},{id:'servico-conteudo',name:'Artes'},{id:'servico-marca',name:'Identidade'},{id:'sobre',name:'Agência'},{id:'contato',name:'Contato'}];
export function ChapterNavigation(){
  const [active,setActive]=useState('inicio');
  useEffect(()=>{
    let frame=0;
    const measure=()=>{frame=0;let current='inicio';for(const chapter of chapters){const element=document.getElementById(chapter.id);if(element && element.getBoundingClientRect().top<innerHeight*.48)current=chapter.id;}setActive(previous=>previous===current?previous:current);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);measure();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[]);
  return <nav className="chapter-nav" aria-label="Capítulos da página">{chapters.map((chapter,index)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={active===chapter.id?'location':undefined}><span>0{index+1}</span><i/><b>{chapter.name}</b></a>)}</nav>;
}
