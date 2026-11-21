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
  2:['смотреть с компьютера','поверните телефон горизонтально','сядьте удобно и освободите руки'],
  3:['напишите в чате','Какой ваш запрос','Поставьте «+»'],
  4:['Главная причина','3 анатомические ошибки','диссекция мышечных цепей','Новые кейсы','Живая практика'],
  5:['Напишите в комментариях!'],
  6:['изучать анатомию','глубоко, детально и практично'],
  7:['схожие или одинаковые приёмы'],
  8:['схожие или одинаковые приёмы','одних и тех же учителей'],
  9:['схожие или одинаковые приёмы','одних и тех же учителей','смежной аудиторией'],
  10:['схожие или одинаковые приёмы','одних и тех же учителей','смежной аудиторией','неполной записью','сложностями с онлайн-продажами'],
  11:['схожие или одинаковые приёмы','одних и тех же учителей','смежной аудиторией','неполной записью','сложностями с онлайн-продажами','похожие страхи','не дать результат'],
  17:['узкое горлышко'],
  18:['Ставьте «1» в чат'],
  20:['Вам не нужно знать 4000 техник'],
  21:['кризис в работе','фундаментальное изучение','ресурса, уверенности и вдохновения'],
  22:['пока наша база не сильнее, чем у большинства, мы сливаемся с большинством.'],
  25:['3 анатомические ошибки','Напишите в чате «узнал себя»','хотя бы одну у себя'],
  26:['место, где тело перестало справляться','причина часто находится в другой зоне','Работаем по месту боли','клиент возвращается с тем же запросом'],
  27:['временный эффект','биомеханической цепочке','Давайте поднимемся по цепочке выше','корректируем всю цепочку','регионарной взаимозависимостью'],
  28:['Название не помогает в работе','Помогает понимание того, как структура живёт в теле'],
  29:['для работы важнее понять, с чем она связана','работают как одна линия','источником боли','понимать и анатомию, и биомеханику','тело целиком и объёмно'],
  30:['без понимания','невозможно понять, сработала техника или нет','объяснить клиенту'],
  31:['Ощущение под руками без знания структур остаётся догадкой','На курсе мы не просто учим названия','находим и пальпируем на теле человека'],
  32:['пониманием функциональной анатомии'],
  33:['обновлённой программе','Функциональная анатомия 2.0','оставьте заявку','Менеджер свяжется с вами','условиях и бонусах'],
  35:['как применить это знание на практике','с клиентами или в своих занятиях'],
  37:['долго и сложно учить анатомию','быстро её забыть','не понять, что с ней делать дальше'],
  14:['Приглашённый спикер и эксперт','на месяцы вперёд','за 2 месяца','работать эффективнее'],
  23:['быстрее и заметнее вы растёте как специалист'],
  38:['не название, а свойства и взаимосвязи','вот принцип обучения','рост уровня специалиста'],
  39:['хочу знать больше','кадавр-классах'],
  40:['Более 7 лет','больше 20 диссекций','лидеров по кадавр-классам в СНГ'],
  41:['Впервые в России','от стопы до черепа','слой за слоем'],
  42:['действительно непрерывны','Для практики это прорыв','увидели вживую'],
  43:['вы влияете на всю линию','можно увидеть и потрогать','видео фрагменты с кадаверным материалом'],
  47:['курс лекарств не помог','Где ещё искать причину?'],
  48:['Th8–Th10','боль ушла'],
  49:['слабость большого пальца','заметного облегчения они не принесли'],
  50:['причину нужно искать выше','восстановилась практически сразу','онемение ушло'],
  51:['знание связей, а не названий','функциональная анатомия'],
  52:['Делитесь обратной связью'],
  54:['заявку','уже сейчас','Кнопка под эфиром','Менеджер свяжется с вами','условиях и бонусах'],
  55:['Попадаете в причину','создаёте техники','повышаете чек и заполняете запись'],
  56:['Лучше понимаете своё тело','эффективные техники','результативнее'],
  58:['До обучения:','После:','5–10 приёмов в неделю','7 000 ₽'],
  59:['До обучения:','После:'],
  60:['До обучения:','После:'],
  65:['Напишите в чат'],
  66:['связи в теле','небольшое воздействие','заметный результат','материалы по пальпации и самопальпации','на себе','с клиентами'],
  72:['набор техник','по протоколу','Результат держится пару дней','строение тела','Находит причину','создаёт технику','проверяет результат','К кому из них пойдут клиенты? И кем хотите быть вы?'],
  73:['ваш ключ','чувствуют и ценят клиенты','реальным решением'],
  77:['Модуль 0. Вводный','первая практика','с нуля'],
  78:['8 регионам','полную картину','взаимосвязей'],
  79:['практики саморегуляции','где искать причину дисфункции'],
  80:['Нервная, иммунная и эндокринная системы','организм целостно'],
  81:['библиотека диссекций','кадавр-семинаров'],
  82:['Видеоуроки','Пальпация и самопальпация','3D-визуализация','Личный куратор','2 месяца'],
  83:['Системное понимание тела','единое целое'],
  84:['Умение находить причину','источник проблемы'],
  85:['Пальпаторные навыки','на себе и на клиенте'],
  86:['Свои техники','под конкретного человека'],
  87:['Уверенность в работе','страх навредить'],
  88:['Реальную анатомию','настоящем теле'],
  89:['Поддержку куратора','на протяжении всего обучения'],
  90:['Сертификаты и реестр МИОТ','переводом на английский'],
  92:['должен стоить'],
  94:['специальные условия'],
  96:['стоимость выросла','сохраняем старую цену','до 27 ноября'],
  98:['Только бонусы стоят 35 000 ₽','почти 80%','только для участников вебинара'],
  99:['Запись конференции «Секреты ЖКТ»','10 спикеров','9 часов','анатомия ЖКТ на реальном материале','дополняет модуль 2 курса'],
  100:['Интенсив «Остео Детокс»','активации всех систем детоксикации','самостоятельно','рекомендации по самокоррекции клиентам'],
  101:['Интенсив «Краниосакральная самокоррекция»','нервной системой','головную боль','красоту и молодость лица','расширяет арсенал техник и способов диагностики'],
  102:['Интенсив «Тазовая диафрагма»','гармонизацию тонуса тазовой диафрагмы','гармонизацию тонуса брюшной стенки','восстановление нормальной осанки','нормализацию внутрибрюшного давления'],
  103:['применить и на себе','в работе с подопечными'],
  104:['Внесите предоплату','сохранить за собой условия','удобным для вас способом','от 2 000 ₽ в месяц'],
  105:['Программа обновлена','Для тех, кто уже проходил Функциональную анатомию','особые условия','базовый тариф за 20 000 ₽','продвинутый за 40 000 ₽','Оставьте заявку по кнопке под эфиром'],
  106:['однозначно потянете','полноценный вводный модуль','начинает с нуля','вы ясно поняли'],
  107:['новую глубину','расширяю инструменты воздействия','Курс практически ориентирован','Клинические взаимосвязи и кадаверный материал','даже опытному специалисту'],
  108:['2 месяца','в своём темпе','9 месяцев на базовом тарифе','год на продвинутом','куратор с медицинским образованием'],
  109:['из любой точки мира','оплата для РФ','рассрочка','предоплата','оплата из-за рубежа','обучающей платформе GetCourse'],
  113:['Внесите предоплату','сохранить за собой условия','удобным для вас способом','от 2 000 ₽ в месяц'],
  114:['реальную анатомию','не представление о ней','Welcome на обучение, кудесники']
};
const SLIDE_UNDERLINES={
  13:['профессиональные страхи','выгорание','нехватку клиентов и денег','ощущение, что я что-то упускаю','мне чего-то не хватает как специалисту']
};
function highlightSlideCopy(html,n){
  const configured=SLIDE_HIGHLIGHTS[n]||[];
  const keyPhrases=(n===22?configured.slice(0,1):configured.filter((phrase)=>phrase.length<=38).slice(0,3));
  if([55,56,72,95,97,113].includes(n)){
    return keyPhrases.reduce((current,phrase)=>{
      const escaped=escapeHtml(phrase);
      return current.split(escaped).join('<span class="plain-emphasis">'+escaped+'</span>');
    },html);
  }
  let result=keyPhrases.reduce((current,phrase)=>{
    const escaped=escapeHtml(phrase);
    return current.split(escaped).join('<span class="marker-highlight">'+escaped+'</span>');
  },html);
  if(n===32){
    const phrase='пониманием <strong class="accent-purple">функциональной анатомии</strong>';
    result=result.split(phrase).join('<span class="marker-highlight">'+phrase+'</span>');
  }
  return result;
}
function underlineSlideCopy(html,n){
  return (SLIDE_UNDERLINES[n]||[]).reduce((result,phrase)=>{
    const escaped=escapeHtml(phrase);
    return result.split(escaped).join('<span class="hand-underline">'+escaped+'</span>');
  },html);
}


function exactLines(lines) {
  return lines.map(line=>{
    if(line.startsWith('* ')) return '<p class="source-line source-bullet">'+rich(line.slice(2))+'</p>';
    const cls=/^Источники?:/.test(line)?' source-citation':'';
    return '<p class="source-line'+cls+'">'+rich(line)+'</p>';
  }).join('\n');
}
function exactHeading(title) { return '<h1 class="source-title">'+rich(title)+'</h1>\n<div class="divider" aria-hidden="true"></div>\n'; }
function visualAsset(key) { return key.startsWith('img/')?key:'img/new/'+key+'.png'; }
function sourcePicture(s) {
  const extras={};
  const spec=VISUAL_CONTENT[s.n]||extras[s.n];
  if(!spec) return '';
  const arts=spec.arts||[spec.art];
  return '<figure class="source-art'+(spec.photo?' source-photo':'')+(arts.length>1?' source-art-multi':'')+'">'+arts.map(art=>image(visualAsset(art),s.title)).join('')+'</figure>';
}
function exactTable(s) {
  const cells=s.lines.slice(2);let rows='';
  for(let i=0;i<cells.length;i+=3) rows+='<tr>'+cells.slice(i,i+3).map((c,j)=>'<'+(j===0?'th scope="row"':'td')+'>'+rich(c)+'</'+(j===0?'th':'td')+'>').join('\n')+'</tr>\n';
  return exactHeading(s.title)+'<table class="source-table"><colgroup><col style="width:20%"><col style="width:28%"><col style="width:52%"></colgroup><thead><tr><th></th>\n<th scope="col">'+rich(s.lines[0])+'</th>\n<th scope="col">'+rich(s.lines[1])+'</th></tr></thead>\n<tbody>'+rows+'</tbody></table>';
}
function exactProgramComparison(s) {
  const cards=[];
  for(let i=2;i<s.lines.length;i+=3) {
    const [label,before,after]=s.lines.slice(i,i+3);
    cards.push('<article class="program-delta"><h2>'+rich(label||'')+'</h2><div class="program-delta-state"><span>Было</span><p>'+rich(before||'')+'</p></div><div class="program-delta-state program-delta-after"><span>Стало</span><p>'+rich(after||'')+'</p></div></article>');
  }
  return exactHeading(s.title)+'<div class="program-delta-grid">'+cards.join('')+'</div>';
}
function exactTariffs(s) {
  const split=s.lines.findIndex(line=>line.startsWith('Продвинутый:'));
  const columns=[s.lines.slice(0,split),s.lines.slice(split)];
  return exactHeading(s.title)+'<div class="source-tariffs">'+columns.map((lines,i)=>{
    const m=lines[0].match(/^(.+):\s*(.+)$/);
    const heading=m?'<h2><span class="tariff-name">'+rich(m[1])+'</span><strong class="tariff-price">'+rich(m[2])+'</strong></h2>':'<h2>'+rich(lines[0])+'</h2>';
    const features=lines.slice(1).map(line=>'<p class="tariff-feature">'+rich(line.replace(/^\*\s*/,''))+'</p>').join('');
    return '<section class="source-tariff'+(i?' source-tariff-advanced':'')+'">'+heading+'<div class="tariff-feature-grid">'+features+'</div></section>';
  }).join('\n')+'</div>';
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
  const first=escapeHtml(s.lines[0]);
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
function exactDisciplines(s) {
  return exactHeading(s.title)+'<div class="discipline-path" aria-label="Связь принципов и техник">'+
    '<section class="discipline-node discipline-principles"><h2>'+rich(s.lines[0])+'</h2></section>'+
    '<section class="discipline-node discipline-techniques"><h2>'+rich(s.lines[1])+'</h2></section>'+
  '</div>';
}
function exactErrorFirst(s) {
  return exactHeading(s.title)+exactLines(s.lines);
}
function exactErrorSolution(s) {
  return exactHeading(s.title)+exactLines(s.lines);
}
function exactFoundationCare(s) {
  const title=escapeHtml(s.title.replace(/\s*🙌🏻/u, ''))
    .replace('мы волшебники', '<span class="foundation-emphasis">мы волшебники</span>')
    .replace('наша работа помогает людям', '<span class="foundation-emphasis">наша работа помогает людям</span>');
  return '<h1 class="source-title">'+title+'</h1>\n<div class="divider" aria-hidden="true"></div>\n';
}

function exactFoundationReflection(s) {
  return exactHeading(s.title.replace(/\s*⚡️/u, ''));
}
function exactLongErrorExample(s) {
  const column=(lines)=>lines.map((line)=>{
    const clean=line.replace(/^\*\s*/, '');
    const citation=/^Источники?:/.test(clean);
    return '<p class="source-line error-example-line'+(citation?' source-citation':'')+'">'+rich(clean)+'</p>';
  }).join('');
  return exactHeading(s.title)+'<div class="error-example-columns"><section>'+column(s.lines.slice(0,4))+'</section><section>'+column(s.lines.slice(4))+'</section></div>';
}
function exactEvidenceExample(s) {
  const column=(lines)=>lines.map((line)=>{
    const citation=/^Источник:/.test(line);
    return '<p class="source-line evidence-example-line'+(citation?' source-citation':'')+'">'+rich(line)+'</p>';
  }).join('');
  return exactHeading(s.title)+'<div class="evidence-example-columns"><section>'+column(s.lines.slice(0,2))+'</section><section>'+column(s.lines.slice(2))+'</section></div>';
}
function exactSystemOffer(s) {
  return exactHeading(s.title)+'<div class="system-offer">'+s.lines.map((line,i)=>'<p class="source-line system-offer-line system-offer-line-'+(i+1)+'">'+rich(line)+'</p>').join('')+'</div>';
}
function exactFunctionalQuestion(s) {
  return exactHeading(s.title)+exactLines(s.lines);
}
function exactApplication(s) {
  const list=s.lines.slice(0,-1);
  const focus=s.lines[s.lines.length-1];
  return exactHeading(s.title)+'<div class="application-layout"><div class="application-list">'+list.map(line=>'<p class="source-line application-node">'+rich(line.replace(/^\* /,''))+'</p>').join('')+'</div></div><p class="source-line application-focus">'+rich(focus)+'</p>';
}
/* Visual structures use the original copy verbatim: they only give the narrative
   a clinical reading path while the new illustration assets are being prepared. */
function exactInsight(s) {
  return exactHeading(s.title)+'<div class="insight-flow">'+s.lines.map(line=>
    '<p class="source-line insight-line">'+rich(line)+'</p>'
  ).join('')+'</div>';
}
function exactCasePrompt(s) {
  return exactHeading(s.title)+'<div class="case-prompt">'+s.lines.map((line,i)=>
    '<p class="source-line '+(i===s.lines.length-1?'case-question':'case-context')+'">'+rich(line)+'</p>'
  ).join('')+'</div>';
}
function exactCaseResult(s) {
  return exactHeading(s.title)+'<div class="case-flow">'+s.lines.map((line,i)=>
    '<section class="case-step"><p class="source-line">'+rich(line)+'</p></section>'
  ).join('')+'</div>';
}
function exactNumberPath(s) {
  return exactHeading(s.title)+'<div class="number-path">'+s.lines.map((line,i)=>
    '<p class="source-line number-path-line">'+rich(line.replace(/^\d+\.\s*/,''))+'</p>'
  ).join('')+'</div>';
}
function exactFeedback(s) {
  return exactHeading(s.title)+'<div class="feedback-field">'+s.lines.map(line=>'<p class="source-line">'+rich(line)+'</p>').join('')+'</div>';
}
function exactStudentResult(s) {
  const card=(line,kind)=>{
    const label=kind==='before'?'До обучения:':'После:';
    const text=line.startsWith(label)?line.slice(label.length):line;
    return '<p class="source-line student-result-'+kind+'"><span class="student-result-label">'+label+'</span>'+rich(text)+'</p>';
  };
  return exactHeading(s.title)+'<div class="student-result">'+card(s.lines[0],'before')+card(s.lines[1],'after')+'</div>';
}
function exactBeforeAfter(s) {
  const cards=s.lines.map(line=>{
    const clean=line.replace(/^\*\s*/, '');
    const divider=clean.indexOf(': было ');
    if(divider===-1)return '<article class="before-after-row"><p class="before-after-name">'+rich(clean)+'</p></article>';
    const person=clean.slice(0,divider);
    const values=clean.slice(divider+7);
    const becameAt=values.indexOf(', стало ');
    const before=becameAt===-1?values:values.slice(0,becameAt);
    const after=becameAt===-1?'':values.slice(becameAt+8);
    const durationAt=after.indexOf(' за ');
    const outcome=durationAt===-1?after:after.slice(0,durationAt);
    const duration=durationAt===-1?'':after.slice(durationAt+4);
    return '<article class="before-after-row"><p class="before-after-name">'+rich(person)+'</p><p class="before-after-value"><span>Было</span>'+rich(before)+'</p><p class="before-after-value before-after-current"><span>Стало</span>'+rich(outcome)+'</p><p class="before-after-term">'+(duration?'<span>Срок</span>'+rich(duration):'')+'</p></article>';
  }).join('');
  return exactHeading(s.title)+'<div class="before-after-list">'+cards+'</div>';
}
function exactIncomeResults(s) {
  const cards=s.lines.map(line=>{
    const clean=line.replace(/^\*\s*/, '');
    const divider=clean.indexOf(': было ');
    const person=divider===-1?clean:clean.slice(0,divider);
    const values=divider===-1?'':clean.slice(divider+7);
    const becameAt=values.indexOf(', стало ');
    const before=becameAt===-1?values:values.slice(0,becameAt);
    const after=becameAt===-1?'':values.slice(becameAt+8);
    const durationAt=after.indexOf(' за ');
    const outcome=durationAt===-1?after:after.slice(0,durationAt);
    const duration=durationAt===-1?'':after.slice(durationAt+4);
    const comma=person.indexOf(',');
    const name=comma===-1?person:person.slice(0,comma);
    const role=comma===-1?'':person.slice(comma+1).trim();
    return '<article class="income-result-card"><header><h2>'+rich(name)+'</h2>'+(role?'<p>'+rich(role)+'</p>':'')+'</header><div class="income-result-metrics"><p class="income-result-before"><span>Было</span>'+rich(before)+'</p><p class="income-result-after"><span>Стало</span>'+rich(outcome)+'</p></div>'+(duration?'<p class="income-result-term">'+rich(duration)+'</p>':'')+'</article>';
  }).join('');
  return exactHeading(s.title)+'<div class="income-results-grid">'+cards+'</div>';
}
function exactIncomeImpact(s) {
  return exactHeading(s.title);
}
function exactStudentCta(s) {
  const prompt='Оставьте заявку по кнопке под эфиром, пока идёт эфир.';
  const line=s.lines[0];
  const rest=line.startsWith(prompt)?line.slice(prompt.length).trim():line;
  return exactHeading(s.title)+'<div class="student-cta"><p class="source-line student-cta-action">'+escapeHtml(prompt)+'</p><p class="source-line student-cta-details">'+rich(rest)+'</p></div><p class="source-line student-cta-next">'+rich(s.lines[1])+'</p>';
}
function exactCareCta(s) {
  return exactHeading(s.title)+'<div class="student-cta care-cta"><p class="source-line student-cta-details">'+rich(s.lines[0])+'</p></div>';
}
function exactFunctionalResult(s) {
  return exactHeading(s.title)+'<div class="functional-result"><p class="source-line">'+rich(s.lines[0])+'</p></div>';
}
function exactQuestionBubble(s) {
  return '<div class="question-bubble"><i class="thought-dot thought-dot-1" aria-hidden="true"></i><i class="thought-dot thought-dot-2" aria-hidden="true"></i><i class="thought-dot thought-dot-3" aria-hidden="true"></i><h1 class="source-title">'+rich(s.title)+'</h1></div>';
}
function exactAudience(s) {
  const accents=['Массажистам, остеопатам, врачам','Специалистам по лицу и телу','Тренерам, инструкторам йоги и пилатеса','Телесным терапевтам','новую профессию с нуля','понимать своё тело','самокоррекцией'];
  const emphasize=(line)=>accents.reduce((html,phrase)=>html.split(escapeHtml(phrase)).join('<span class="plain-emphasis">'+escapeHtml(phrase)+'</span>'),rich(line.replace(/^\*\s*/,'')));
  return exactHeading(s.title)+'<div class="audience-grid">'+s.lines.map((line,i)=>'<p class="source-line audience-card audience-card-'+(i+1)+'">'+emphasize(line)+'</p>').join('')+'</div>';
}
function exactApproachContrast(s) {
  return exactHeading(s.title)+'<div class="approach-contrast"><section class="approach-card approach-card-protocol"><h2>'+rich(s.lines[0])+'</h2><p class="source-line">'+rich(s.lines[1])+'</p></section><section class="approach-card approach-card-functional"><h2>'+rich(s.lines[2])+'</h2><p class="source-line">'+rich(s.lines[3])+'</p></section></div><p class="source-line approach-question">'+rich(s.lines[4])+'</p>';
}
function exactKeyResult(s) {
  return exactHeading(s.title)+'<div class="key-result"><p class="source-line">'+rich(s.lines[0])+'</p></div>';
}
function exactProgramModule(s) {
  const [label='',copy='']=s.lines;
  return exactHeading(s.title)+'<div class="program-module"><p class="source-line program-module-label">'+rich(label)+'</p><p class="source-line">'+rich(copy)+'</p></div>';
}
function exactLiveLessonList(s) {
  const cards=[];
  for(let i=0;i<s.lines.length;i+=2) {
    const [title='',details='']=s.lines.slice(i,i+2);
    cards.push('<section class="live-lesson-card"><h2>'+rich(title)+'</h2><p class="source-line">'+rich(details).replace(/\n/g,'<br>')+'</p></section>');
  }
  return exactHeading(s.title)+'<div class="live-lesson-grid">'+cards.join('')+'</div>';
}
function exactUpdatedLessonVideo(s) {
  const src=assetUrl('media/updated-functional-anatomy-lesson-web.mp4');
  return exactHeading(s.title)+'<div class="updated-lesson-video"><p class="source-line">'+rich(s.lines[0])+'</p><video controls playsinline preload="metadata" aria-label="Фрагмент обновлённого урока"><source src="'+src+'" type="video/mp4">Ваш браузер не поддерживает воспроизведение видео.</video></div>';
}
function exactCourseFormat(s) {
  return exactHeading(s.title)+'<div class="course-format-grid">'+s.lines.map((line,i)=>'<p class="source-line course-format-card course-format-card-'+(i+1)+'">'+rich((line||'').replace(/^\*\s*/,''))+'</p>').join('')+'</div>';
}
function exactBenefit(s) {
  return exactHeading(s.title)+'<div class="benefit-layout"><p class="source-line benefit-name">'+rich(s.lines[0])+'</p><p class="source-line benefit-copy">'+rich(s.lines[1])+'</p></div>';
}
function exactPriceQuestion(s) {
  return exactHeading(s.title);
}
function exactSpecialConditions(s) {
  return '<h1 class="source-title">Но сегодня<br><span>для участников вебинара</span><br>действуют специальные условия</h1>\n<div class="divider" aria-hidden="true"></div>\n';
}
function exactInstitute(s) {
  const schoolPhotos=assetUrl('img/real/medical-school-photo-pair.png');
  return exactHeading(s.title)+'<div class="institute-story"><p class="source-line">'+rich(s.lines[0])+'</p><figure class="institute-photos"><img src="'+schoolPhotos+'" alt="Фотографии Олега со времён учёбы в медицинском институте" decoding="async"></figure></div>';
}
function exactReviews(s) {
  const reviews=[
    'review-04-clinical.jpeg',
    'review-04-detail.jpeg',
    'review-06-insight.jpeg',
    'review-07-detail.jpeg',
    'review-08-insight.jpeg'
  ];
  return exactHeading(s.title)+'<div class="review-gallery">'+reviews.map((name,index)=>'<figure><img src="'+assetUrl('img/reviews/'+name)+'" alt="Отзыв ученика '+(index+1)+'" decoding="async"></figure>').join('')+'</div>';
}
function exactReminder(s) {
  const start='Кнопка под эфиром. ';
  const line=s.lines[0];
  const location=line.startsWith(start)?start.trim():'';
  const rest=location?line.slice(start.length):line;
  return exactHeading(s.title)+'<div class="reminder-cta"><p class="source-line">'+(location?'<span class="reminder-location">'+escapeHtml(location)+'</span> ':'')+rich(rest)+'</p></div>';
}
function exactOffer(s) {
  return exactHeading(s.title)+'<div class="source-offer">'+s.lines.slice(0,2).map((line,i)=>{const m=line.match(/^(.+): (\d[\d ]+ ₽) (\d[\d ]+ ₽)$/);return '<section class="source-offer-plan'+(i?' source-offer-advanced':'')+'"><h2>'+rich(m[1])+':</h2>\n<s>'+rich(m[2])+'</s> <strong>'+rich(m[3])+'</strong></section>';}).join('\n')+'</div>\n'+exactLines(s.lines.slice(2));
}
function exactWebinarOffer(s) {
  const plans=s.lines.slice(0,2).map((line,i)=>{
    const m=line.match(/^(.+):\s*(\d[\d ]+ ₽)\s*(\d[\d ]+ ₽)$/);
    return '<section class="webinar-offer-plan webinar-offer-plan-'+(i+1)+'"><p class="webinar-offer-name">'+rich(m[1])+'</p><s>'+rich(m[2])+'</s><strong>'+rich(m[3])+'</strong></section>';
  }).join('');
  return exactHeading(s.title)+'<div class="webinar-offer">'+plans+'</div><p class="offer-deadline">'+rich(s.lines[2])+'</p>';
}
function exactWhyNow(s) {
  return exactHeading(s.title)+'<div class="why-now"><p class="source-line why-now-prices">'+rich(s.lines[0])+'</p><p class="source-line why-now-save">'+rich(s.lines[1])+'</p></div>';
}
function exactBonusCards(s) {
  return exactHeading(s.title)+'<div class="bonus-card-grid">'+s.lines.map((line,i)=>{
    const m=line.replace(/^\*\s*/, '').match(/^(.+)\.\s*(Стоимость\s+[\d ]+ ₽)$/);
    return '<section class="bonus-card"><p>'+rich(m?m[1]:line)+'</p><strong>'+rich(m?m[2]:'')+'</strong></section>';
  }).join('')+'</div>';
}
function exactBonusValue(s) {
  return exactHeading(s.title)+'<div class="bonus-value"><p class="source-line">'+rich(s.lines[0])+'</p><p class="source-line">'+rich(s.lines[1])+'</p></div>';
}
function exactBonusDetail(s) {
  const lead=s.lines[0];
  const content=s.lines.slice(1).map((line,i)=>'<p class="source-line bonus-detail-copy bonus-detail-copy-'+(i+1)+'">'+rich(line.replace(/^\*\s*/,''))+'</p>').join('');
  return exactHeading(s.title)+'<div class="bonus-detail"><p class="bonus-detail-name">'+rich(lead)+'</p><div class="bonus-detail-points">'+content+'</div></div>';
}
function exactBonusConclusion(s) {
  return exactHeading(s.title);
}
function exactPaymentOptions(s) {
  const options=s.lines[1].split(' / ');
  return exactHeading(s.title)+'<div class="payment-options"><p class="source-line payment-note">'+rich(s.lines[0])+'</p><div class="payment-option-grid">'+options.map((option,i)=>'<p class="payment-option payment-option-'+(i+1)+'">'+rich(option)+'</p>').join('')+'</div></div>';
}
function exactWelcome(s) {
  return exactHeading(s.title)+'<p class="welcome-line">'+rich(s.lines[0].replace(' 🫴🏻',''))+'</p>';
}
function bodyFor(s) {
  if(s.n===0) return '<div class="webinar-cover"><div class="cover-copy"><div class="badge cover-badge">Вебинар</div><h1 class="cover-title">Функциональная<br>анатомия <span class="mark-ring">2.0</span></h1><div class="divider" aria-hidden="true"></div><p class="cover-author">'+escapeHtml(s.lines[0])+'</p></div><figure class="cover-art">'+image('img/cyber/cyber-medical-cutout-v3.png','Кибер-медицинская анатомическая визуализация')+'</figure></div>';
  let exact= s.n===1?exactSignal(s):s.n===12?exactFoundationCare(s):s.n===21?exactFoundationReflection(s):s.n===14?exactProfile(s):s.n===19?exactDisciplines(s):s.n===23?exactRecommendation(s):s.n===26?exactErrorFirst(s):s.n===27?exactLongErrorExample(s):s.n===29?exactLongErrorExample(s):s.n===31?exactEvidenceExample(s):s.n===32?exactErrorSolution(s):s.n===33?exactSystemOffer(s):s.n===34?exactFunctionalQuestion(s):s.n===35?exactApplication(s):s.n===36?exactApproaches(s):s.n===37?exactInstitute(s):s.n===38?exactTeaching(s):[39,40,41,42,43].includes(s.n)?exactInsight(s):[45,47,49].includes(s.n)?exactCasePrompt(s):[46,48,50].includes(s.n)?exactCaseResult(s):s.n===51?exactInsight(s):s.n===52?exactFeedback(s):s.n===54?exactReminder(s):[55,56].includes(s.n)?exactNumberPath(s):[58,59,60].includes(s.n)?exactStudentResult(s):s.n===61?exactIncomeImpact(s):s.n===62?exactIncomeResults(s):s.n===63?exactStudentCta(s):s.n===66?exactFunctionalResult(s):s.n===68?exactCareCta(s):s.n===69?exactQuestionBubble(s):s.n===71?exactAudience(s):s.n===72?exactApproachContrast(s):s.n===73?exactKeyResult(s):s.n===74?exactProgramComparison(s):s.n===75?exactLiveLessonList(s):s.n===76?exactUpdatedLessonVideo(s):[77,78,79,80,81].includes(s.n)?exactProgramModule(s):s.n===82?exactCourseFormat(s):[83,84,85,86,87,88,89,90].includes(s.n)?exactBenefit(s):s.n===91?exactReviews(s):s.n===92?exactPriceQuestion(s):s.n===94?exactSpecialConditions(s):[95,111].includes(s.n)?exactWebinarOffer(s):s.n===96?exactWhyNow(s):[97,112].includes(s.n)?exactBonusCards(s):s.n===98?exactBonusValue(s):[99,100,101,102].includes(s.n)?exactBonusDetail(s):s.n===103?exactBonusConclusion(s):[104,113].includes(s.n)?exactPaymentOptions(s):s.n===114?exactWelcome(s):s.n===93?exactTariffs(s):exactHeading(s.title)+exactLines(s.lines);
  exact=highlightSlideCopy(underlineSlideCopy(exact,s.n),s.n);
  const content='<div class="source-content" data-exact-copy>'+exact+'</div>';
  return '<div class="source-layout">'+content+sourcePicture(s)+'</div>';
}
const gradient=new Set([0,6,15,24,32,33,54,63,67,68,70,73,94,104,113,114]);
function renderSlide(s) {
  const cls=['slide',s.n%3===0?'surf-c':s.n%2===0?'surf-b':''];
  if(s.n===0)cls.push('webinar-cover-slide');else cls.push('source-slide');
  if(gradient.has(s.n))cls.push('cta-slide');
  if(s.title.length>95)cls.push('source-long-title');
  if(s.text.length>1000)cls.push('source-dense');else if(s.text.length>650)cls.push('source-long');else if(s.text.length>380)cls.push('source-medium');
  if(s.n===74)cls.push('source-table-slide');
  if(s.n===93)cls.push('source-tariffs-slide');
  if(s.n===97||s.n===112)cls.push('source-bonuses-slide');
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
  /* Минимальный кегль — правило презентации: текст нельзя «спасать» микромасштабом. */
  if(['35','41'].includes(slide.dataset.slide)) {
    slide.dataset.fit='1.0000';
    slide.dataset.overflowY=String(content.scrollHeight-content.clientHeight);
    slide.dataset.overflowX=String(content.scrollWidth-content.clientWidth);
    return;
  }
  if(!fits()&&slide.classList.contains('source-slide'))slide.classList.add('source-compact');
  let lo=.78,hi=1;
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
