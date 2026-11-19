/* Функциональная анатомия 2.0. Без внешних библиотек. */
'use strict';

const FIRST_SLIDE = SLIDES[0].n;
const LAST_SLIDE = SLIDES[SLIDES.length-1].n;
const slideDataByNumber = new Map(SLIDES.map(s=>[s.n,s]));

const $ = (id) => document.getElementById(id);
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function rich(text) {
  return escapeHtml(text)
    .replace(/^(Анатомическая связь\.|Что нашли\.|Что сделали\.|Как рассуждаем\.|Результат\.|Вопрос в зал\.|До обучения:|После:)/, '<strong>$1</strong>')
    .replace(/\b(Th8–Th10)\b/g, '<strong class="accent-purple">$1</strong>')
    .replace(/(Функциональная анатомия 2\.0|функциональной анатомии|функциональная анатомия|функциональную анатомию)/g, '<strong class="accent-purple">$1</strong>');
}

const h1 = (title) => '<h1>'+rich(title)+'</h1><div class="divider" aria-hidden="true"></div>';
const p = (text,cls='') => '<p'+(cls?' class="'+cls+'"':'')+'>'+rich(text)+'</p>';
const assetUrl = (src) => typeof EMBEDDED_IMAGES !== 'undefined' ? (EMBEDDED_IMAGES[src] || src) : src;
const image = (src,alt) => '<img src="'+assetUrl(src)+'" alt="'+escapeHtml(alt)+'" decoding="async">';
const result = (text) => '<div class="result-block">'+p(text)+'</div>';

const SLIDE_HIGHLIGHTS={
  6:['изучать анатомию','глубоко, детально и практично'],
  14:['Приглашённый спикер и эксперт','на месяцы вперёд','за 2 месяца','работать эффективнее'],
  23:['фундаментальное знание анатомии','быстрее и заметнее вы растёте как специалист'],
  38:['не название, а свойства и взаимосвязи','вот принцип обучения','рост уровня специалиста'],
  39:['хочу знать больше','кадавр-классах'],
  40:['Более 7 лет','больше 20 диссекций','лидеров по кадавр-классам в СНГ'],
  41:['Впервые в России','от стопы до черепа','слой за слоем'],
  42:['действительно непрерывны','Для практики это прорыв','увидели вживую'],
  43:['вы влияете на всю линию','можно увидеть и потрогать','видео фрагменты с кадаверным материалом'],
  45:['Как связаны затылок и язык?','С какой зоной вы бы начали работать?'],
  46:['Все симптомы ушли за 2 сеанса'],
  47:['курс лекарств не помог','Где ещё искать причину?'],
  48:['Th8–Th10','боль ушла'],
  49:['слабость большого пальца','заметного облегчения они не принесли'],
  50:['причину нужно искать выше','восстановилась практически сразу','онемение ушло'],
  51:['знание связей, а не названий','функциональная анатомия'],
  52:['Делитесь обратной связью'],
  55:['Попадаете в причину','создаёте техники','повышаете чек и заполняете запись'],
  56:['Лучше понимаете своё тело','эффективные техники','результативнее'],
  58:['До обучения:','После:','5–10 приёмов в неделю','7 000 ₽'],
  59:['До обучения:','После:'],
  60:['До обучения:','После:']
};
function highlightSlideCopy(html,n){
  return (SLIDE_HIGHLIGHTS[n]||[]).reduce((result,phrase)=>{
    const escaped=escapeHtml(phrase);
    return result.split(escaped).join('<span class="marker-highlight">'+escaped+'</span>');
  },html);
}


function exactLines(lines) {
  return lines.map(line=>{
    if(line.startsWith('* ')) return '<p class="source-line source-bullet"><span class="source-marker" aria-hidden="true">•</span> <span>'+rich(line.slice(2))+'</span></p>';
    const cls=/^Источники?:/.test(line)?' source-citation':'';
    return '<p class="source-line'+cls+'">'+rich(line)+'</p>';
  }).join('\n');
}
function exactHeading(title) { return '<h1 class="source-title">'+rich(title)+'</h1>\n<div class="divider" aria-hidden="true"></div>\n'; }
function visualAsset(key) { return key.startsWith('img/')?key:'img/new/'+key+'.png'; }
function sourcePicture(s) {
  const extras={};
  const spec=VISUAL_CONTENT[s.n]||extras[s.n];
  return spec?'<figure class="source-art'+(spec.photo?' source-photo':'')+'">'+image(visualAsset(spec.art),s.title)+'</figure>':'';
}
function exactTable(s) {
  const cells=s.lines.slice(2);let rows='';
  for(let i=0;i<cells.length;i+=3) rows+='<tr>'+cells.slice(i,i+3).map((c,j)=>'<'+(j===0?'th scope="row"':'td')+'>'+rich(c)+'</'+(j===0?'th':'td')+'>').join('\n')+'</tr>\n';
  return exactHeading(s.title)+'<table class="source-table"><colgroup><col style="width:20%"><col style="width:28%"><col style="width:52%"></colgroup><thead><tr><th></th>\n<th scope="col">'+rich(s.lines[0])+'</th>\n<th scope="col">'+rich(s.lines[1])+'</th></tr></thead>\n<tbody>'+rows+'</tbody></table>';
}
function exactTariffs(s) {
  const split=s.lines.findIndex(line=>line.startsWith('Продвинутый:'));
  const columns=[s.lines.slice(0,split),s.lines.slice(split)];
  return exactHeading(s.title)+'<div class="source-tariffs">'+columns.map((lines,i)=>'<section class="source-tariff'+(i?' source-tariff-advanced':'')+'"><h2>'+rich(lines[0])+'</h2>\n'+exactLines(lines.slice(1))+'</section>').join('\n')+'</div>';
}
function exactBonuses(s) {
  return exactHeading(s.title)+'<div class="source-bonuses">'+s.lines.map((line)=>'<section class="source-bonus">'+exactLines([line])+'</section>').join('\n')+'</div>';
}
function exactSignal(s) {
  return exactHeading(s.title)+'<div class="signal-grid">'+s.lines.map(line=>{const m=line.match(/^(\d+)\s+(.+)$/);return '<div class="signal-row"><strong class="signal-number">'+m[1]+'</strong> <span class="signal-label">'+rich(m[2])+'</span></div>';}).join('\n')+'</div>';
}
function exactProfile(s) {
  const highlights=[
    'Приглашённый спикер и эксперт',
    'на месяцы вперёд',
    'за 2 месяца',
    'работать эффективнее',
    'передаю их другим специалистам'
  ];
  return exactHeading(s.title)+'<div class="profile-points">'+s.lines.map((line,i)=>{
    const displayLine=line.startsWith('* ')?line.slice(2):line;
    const focus=highlights[i];
    const decorated=focus?escapeHtml(displayLine).replace(escapeHtml(focus),'<strong>'+escapeHtml(focus)+'</strong>'):rich(displayLine);
    return '<p class="source-line source-profile-line"><span>'+decorated+'</span></p>';
  }).join('\n')+'</div>';
}
function exactRecommendation(s) {
  const first=escapeHtml(s.lines[0]).replace('фундаментальное знание анатомии','<strong>фундаментальное знание анатомии</strong>');
  const second=escapeHtml(s.lines[1]).replace('тем быстрее и заметнее вы растёте как специалист!','<strong>тем быстрее и заметнее вы растёте как специалист!</strong>');
  return exactHeading(s.title)+'<div class="recommendation-points"><p class="source-line recommendation-main">'+first+'</p>\n<p class="source-line recommendation-result">'+second+'</p></div>';
}
function exactApproaches(s) {
  const split=s.lines.indexOf('Классический подход');
  const groups=[s.lines.slice(0,split),s.lines.slice(split)];
  return exactHeading(s.title)+'<div class="approach-compare">'+groups.map((group,index)=>'<section class="approach-column approach-'+(index?'classic':'functional')+'"><h2>'+rich(group[0])+'</h2>'+exactLines(group.slice(1))+'</section>').join('')+'</div>';
}
function exactTeaching(s) {
  const lines=[
    escapeHtml(s.lines[0]).replace('не название, а свойства и взаимосвязи','<strong class="hand-underline">не название, а свойства и взаимосвязи</strong>'),
    escapeHtml(s.lines[1]).replace('вот принцип обучения','<strong class="marker-highlight">вот принцип обучения</strong>'),
    escapeHtml(s.lines[2]).replace('рост уровня специалиста','<strong class="marker-highlight">рост уровня специалиста</strong>')
  ];
  return exactHeading(s.title)+lines.map(line=>'<p class="source-line">'+line+'</p>').join('');
}
/* Visual structures use the original copy verbatim: they only give the narrative
   a clinical reading path while the new illustration assets are being prepared. */
function exactInsight(s) {
  return exactHeading(s.title)+'<div class="insight-flow">'+s.lines.map((line,i)=>
    '<p class="source-line insight-line" data-step="'+(i+1)+'">'+rich(line)+'</p>'
  ).join('')+'</div><div class="cyber-orbit" aria-hidden="true"><i></i><b></b><em></em></div>';
}
function exactCasePrompt(s) {
  return exactHeading(s.title)+'<div class="case-prompt">'+s.lines.map((line,i)=>
    '<p class="source-line '+(i===s.lines.length-1?'case-question':'case-context')+'">'+rich(line)+'</p>'
  ).join('')+'</div><div class="clinical-scan" aria-hidden="true"><i></i><i></i><i></i></div>';
}
function exactCaseResult(s) {
  return exactHeading(s.title)+'<div class="case-flow">'+s.lines.map((line,i)=>
    '<section class="case-step" data-step="'+(i+1)+'"><p class="source-line">'+rich(line)+'</p></section>'
  ).join('')+'</div>';
}
function exactNumberPath(s) {
  return exactHeading(s.title)+'<div class="number-path">'+s.lines.map((line,i)=>
    '<p class="source-line number-path-line" data-step="'+(i+1)+'">'+rich(line)+'</p>'
  ).join('')+'</div>';
}
function exactFeedback(s) {
  return exactHeading(s.title)+'<div class="feedback-field">'+s.lines.map(line=>'<p class="source-line">'+rich(line)+'</p>').join('')+'</div><div class="feedback-pulse" aria-hidden="true"><i></i><i></i><i></i></div>';
}
function exactOffer(s) {
  return exactHeading(s.title)+'<div class="source-offer">'+s.lines.slice(0,2).map((line,i)=>{const m=line.match(/^(.+): (\d[\d ]+ ₽) (\d[\d ]+ ₽)$/);return '<section class="source-offer-plan'+(i?' source-offer-advanced':'')+'"><h2>'+rich(m[1])+':</h2>\n<s>'+rich(m[2])+'</s> <strong>'+rich(m[3])+'</strong></section>';}).join('\n')+'</div>\n'+exactLines(s.lines.slice(2));
}
function bodyFor(s) {
  if(s.n===0) return '<div class="webinar-cover"><div class="cover-copy"><div class="badge cover-badge">Вебинар</div><h1 class="cover-title">Функциональная<br>анатомия <span class="mark-ring">2.0</span></h1><div class="divider" aria-hidden="true"></div><p class="cover-author">'+escapeHtml(s.lines[0])+'</p></div><figure class="cover-art">'+image('img/cyber/cyber-body-network.png','Образная иллюстрация взаимосвязей в теле')+'</figure></div>';
  let exact= s.n===1?exactSignal(s):s.n===14?exactProfile(s):s.n===23?exactRecommendation(s):s.n===36?exactApproaches(s):s.n===38?exactTeaching(s):[39,40,41,42,43].includes(s.n)?exactInsight(s):[45,47,49].includes(s.n)?exactCasePrompt(s):[46,48,50].includes(s.n)?exactCaseResult(s):s.n===51?exactInsight(s):s.n===52?exactFeedback(s):[55,56].includes(s.n)?exactNumberPath(s):s.n===74?exactTable(s):s.n===92?exactTariffs(s):(s.n===94||s.n===110)?exactOffer(s):(s.n===96||s.n===111)?exactBonuses(s):exactHeading(s.title)+exactLines(s.lines);
  exact=highlightSlideCopy(exact,s.n);
  if(s.n===90) exact+='<video class="reviews-video" controls playsinline preload="none" aria-label="Отзывы студентов"><source src="https://dr-agape.ru/lectures/cases-video.mp4" type="video/mp4"></video>';
  const content='<div class="source-content" data-exact-copy>'+exact+'</div>';
  return '<div class="source-layout">'+content+sourcePicture(s)+'</div>';
}
const gradient=new Set([0,6,15,24,32,33,54,63,67,68,70,73,93,103,112,113]);
function renderSlide(s) {
  const cls=['slide',s.n%3===0?'surf-c':s.n%2===0?'surf-b':''];
  if(s.n===0)cls.push('webinar-cover-slide');else cls.push('source-slide');
  if(gradient.has(s.n))cls.push('cta-slide');
  if(s.title.length>95)cls.push('source-long-title');
  if(s.text.length>1000)cls.push('source-dense');else if(s.text.length>650)cls.push('source-long');else if(s.text.length>380)cls.push('source-medium');
  if(s.n===74)cls.push('source-table-slide');
  if(s.n===92)cls.push('source-tariffs-slide');
  if(s.n===96||s.n===111)cls.push('source-bonuses-slide');
  if([39,40,41,42,43,51].includes(s.n))cls.push('insight-slide');
  if([45,47,49].includes(s.n))cls.push('case-prompt-slide');
  if([46,48,50].includes(s.n))cls.push('case-result-slide');
  if(s.n===52)cls.push('feedback-slide');
  if([55,56].includes(s.n))cls.push('number-path-slide');
  if(!sourcePicture(s)&&s.n!==0)cls.push('source-no-art');
  return '<section class="'+cls.filter(Boolean).join(' ')+'" data-slide="'+s.n+'" data-source-text="'+escapeHtml(s.text)+'" aria-roledescription="слайд" aria-label="'+s.n+' из '+LAST_SLIDE+'. '+escapeHtml(s.title)+'" aria-hidden="true" inert>'
    +'<div class="hd"><div class="hd-num">'+s.n+'</div><div class="hd-chip">'+escapeHtml(s.sec)+'</div><div class="brand">МИОТ · Анатомия 2.0</div></div>'
    +'<div class="scroll-content">'+bodyFor(s)+'</div><div class="progress-bar" aria-hidden="true"><i style="width:'+(s.n/LAST_SLIDE*100).toFixed(2)+'%"></i></div></section>';
}

$('stage').innerHTML=SLIDES.map(renderSlide).join('');
let current=FIRST_SLIDE, lastFocus=null;
const slideEls=[...document.querySelectorAll('.slide')];
const slideElementByNumber=new Map(slideEls.map(el=>[Number(el.dataset.slide),el]));

function menuHtml(query='') {
  const q=query.trim().toLocaleLowerCase('ru');
  let prevSec='',count=0;
  $('menuList').innerHTML=SLIDES.filter((s)=>!q||String(s.n)===q||s.text.toLocaleLowerCase('ru').includes(q)).map((s)=>{
    let str='';
    if(prevSec!==s.sec){str='<div class="menu-sec">'+escapeHtml(s.sec)+'</div>';prevSec=s.sec;}
    count++;
    return str+'<button type="button" class="menu-item'+(s.n===current?' active':'')+'" data-go="'+s.n+'"'+(s.n===current?' aria-current="step"':'')+'><span class="menu-num">'+s.n+'</span><span class="menu-label">'+escapeHtml(s.title)+'</span></button>';
  }).join('');
  $('menuEmpty').hidden=count>0;
}

function fitContent(slide) {
  const content=slide.querySelector('.scroll-content');
  const fits=()=>content.scrollHeight<=content.clientHeight+1&&content.scrollWidth<=content.clientWidth+1;
  content.style.setProperty('--fit','1');slide.classList.remove('source-compact');
  if(!fits()&&slide.classList.contains('source-slide'))slide.classList.add('source-compact');
  let lo=.12,hi=1;
  if(!fits()) {
    for(let i=0;i<16;i++){const mid=(lo+hi)/2;content.style.setProperty('--fit',String(mid));if(fits())lo=mid;else hi=mid;}
    content.style.setProperty('--fit',String(lo));
  }else lo=1;
  slide.dataset.fit=lo.toFixed(4);
  slide.dataset.overflowY=String(content.scrollHeight-content.clientHeight);
  slide.dataset.overflowX=String(content.scrollWidth-content.clientWidth);
}

function goTo(n,writeUrl=true) {
  if(!Number.isInteger(n)||!slideElementByNumber.has(n))return;
  const prev=slideElementByNumber.get(current);
  if(prev){prev.classList.remove('active');prev.setAttribute('aria-hidden','true');prev.inert=true;prev.querySelectorAll('video').forEach((v)=>v.pause());}
  current=n;
  const el=slideElementByNumber.get(n);el.classList.add('active');el.setAttribute('aria-hidden','false');el.inert=false;
  $('prev').disabled=n===FIRST_SLIDE;$('next').disabled=n===LAST_SLIDE;
  $('counter').textContent=n+' / '+LAST_SLIDE;
  $('menuCounter').textContent=n+' / '+LAST_SLIDE;
  document.querySelectorAll('.menu-item').forEach((item)=>{
    const active=Number(item.dataset.go)===n;item.classList.toggle('active',active);
    if(active)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
  });
  if(writeUrl)history.replaceState(null,'','#slide='+n);
  fitContent(el);
  if(!$('notesBackdrop').hidden)showNotesText();
}

function openMenu() {
  closeNotes();lastFocus=document.activeElement;
  $('menuBackdrop').hidden=false;$('menuToggle').setAttribute('aria-expanded','true');
  $('menuSearch').value='';menuHtml();$('menuSearch').focus();
  const item=$('menuList').querySelector('.active');if(item)item.scrollIntoView({block:'center'});
}
function closeMenu() {
  if($('menuBackdrop').hidden)return;
  $('menuBackdrop').hidden=true;$('menuToggle').setAttribute('aria-expanded','false');
  if(lastFocus&&lastFocus.isConnected)lastFocus.focus();
}
function showNotesText() {
  $('notesCounter').textContent=current+' / '+LAST_SLIDE;
  $('notesText').textContent=slideDataByNumber.get(current).text;
}
function openNotes() {
  closeMenu();lastFocus=document.activeElement;showNotesText();
  $('notesBackdrop').hidden=false;$('notesToggle').setAttribute('aria-expanded','true');$('notesClose').focus();
}
function closeNotes() {
  if($('notesBackdrop').hidden)return;
  $('notesBackdrop').hidden=true;$('notesToggle').setAttribute('aria-expanded','false');
  if(lastFocus&&lastFocus.isConnected)lastFocus.focus();
}
async function fullscreen() {
  try{
    if(document.fullscreenElement)await document.exitFullscreen();
    else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
  }catch(_error){/* Встроенный браузер может запретить полноэкранный режим. */}
}

$('prev').addEventListener('click',()=>goTo(current-1));
$('next').addEventListener('click',()=>goTo(current+1));
$('menuToggle').addEventListener('click',()=>openMenu());
$('menuClose').addEventListener('click',closeMenu);
$('menuSearch').addEventListener('input',(e)=>menuHtml(e.target.value));
$('menuList').addEventListener('click',(e)=>{const button=e.target.closest('[data-go]');if(button){goTo(Number(button.dataset.go));closeMenu();}});
$('menuBackdrop').addEventListener('click',(e)=>{if(e.target===$('menuBackdrop'))closeMenu();});
$('notesToggle').addEventListener('click',openNotes);
$('notesClose').addEventListener('click',closeNotes);
$('notesBackdrop').addEventListener('click',(e)=>{if(e.target===$('notesBackdrop'))closeNotes();});
$('fullscreen').addEventListener('click',fullscreen);

document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){closeMenu();closeNotes();return;}
  const dialog=!$('notesBackdrop').hidden?$('notesPanel'):!$('menuBackdrop').hidden?$('menuPanel'):null;
  if(dialog){
    if(e.key==='Tab'){
      const focusables=[...dialog.querySelectorAll('button,input,[tabindex="0"]')].filter((el)=>!el.disabled&&!el.hidden);
      const first=focusables[0],last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    return;
  }
  if(e.altKey||e.metaKey||e.ctrlKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
  if(e.target.closest('video'))return;
  if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)||(e.key===' '&&e.target.tagName!=='BUTTON')){e.preventDefault();goTo(current+1);}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goTo(current-1);}
  else if(e.key==='Home'){e.preventDefault();goTo(FIRST_SLIDE);}
  else if(e.key==='End'){e.preventDefault();goTo(LAST_SLIDE);}
  else if(e.key.toLowerCase()==='m'||e.key.toLowerCase()==='ь')openMenu();
  else if(e.key.toLowerCase()==='t'||e.key.toLowerCase()==='е')openNotes();
  else if(e.key.toLowerCase()==='f'||e.key.toLowerCase()==='а')fullscreen();
});

let touch=null;
$('stage').addEventListener('touchstart',(e)=>{
  if(e.target.closest('button,a,video,input'))return;
  touch={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
$('stage').addEventListener('touchend',(e)=>{
  if(!touch)return;
  const dx=touch.x-e.changedTouches[0].clientX,dy=touch.y-e.changedTouches[0].clientY;
  touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)goTo(current+(dx>0?1:-1));
},{passive:true});

function readHash(){const m=location.hash.match(/^#(?:slide=)?(\d+)(?:&part=\d+)?$/);const n=m?Number(m[1]):FIRST_SLIDE;return slideDataByNumber.has(n)?n:FIRST_SLIDE;}
window.addEventListener('hashchange',()=>goTo(readHash(),false));
let resizeFrame;
window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>slideEls.forEach(fitContent));});
window.addEventListener('beforeprint',()=>slideEls.forEach(fitContent));
document.querySelectorAll('.slide img').forEach((img)=>img.addEventListener('load',()=>fitContent(img.closest('.slide'))));
document.querySelectorAll('video').forEach((v)=>v.addEventListener('error',()=>{v.insertAdjacentHTML('afterend','<p class="small">Видеоотзывы доступны на странице курса МИОТ.</p>');},{once:true}));
menuHtml();goTo(readHash());
requestAnimationFrame(()=>slideEls.forEach(fitContent));
