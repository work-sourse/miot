/* Рендерер слайдов и навигация — Живая анатомия */

var ACCENT_COLORS = ['blue','purple','orange'];
var accentIdx = 0;
function nextAccent(){
  var c = ACCENT_COLORS[accentIdx % ACCENT_COLORS.length];
  accentIdx++;
  return c;
}

function md(s){
  if(!s) return '';
  var out = s.replace(/\{\{(.+?)\}\}/g, function(m, sym){
    var cls = 'mega-sym';
    if(sym === '+') cls += ' plus';
    else if(sym === '–' || sym === '-') cls += ' minus';
    else cls += ' emoji';
    return '<span class="'+cls+'">'+sym+'</span>';
  });
  // ~~слово~~ — обводка маркером (как будто обвели фломастером)
  out = out.replace(/~~(.+?)~~/g, function(m, txt){
    return '<span class="mark-ring mark-'+nextAccent()+'">'+txt+'</span>';
  });
  // ^^слово^^ — жирный текст с цветным акцентом
  out = out.replace(/\^\^(.+?)\^\^/g, function(m, txt){
    return '<strong class="accent-'+nextAccent()+'">'+txt+'</strong>';
  });
  // **слово** — обычное выделение жирным
  return out.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
}


// ── Фото со слотом-заглушкой: если файла нет, показываем подсказку, какой файл положить ──
function slot(src, label, cls){
  return '<div class="slot-wrap'+(cls?' '+cls:'')+'">'
    +'<img src="'+src+'" alt="" onerror="this.parentNode.classList.add(\'missing\')">'
    +'<div class="slot-ph">📷 '+md(label||'Фото')+'<small>'+src+'</small></div></div>';
}

function renderBlock(b){
  switch(b.t){
    case 'badge':
      return '<div class="badge badge-'+(b.color||'dark')+'">'+md(b.v)+'</div>';
    case 'h1': return '<h1>'+md(b.v)+'</h1><div class="divider"></div>';
    case 'h2': return '<h2>'+md(b.v)+'</h2>';
    case 'h3': return '<h3>'+md(b.v)+'</h3>';
    case 'p': return '<p>'+md(b.v)+'</p>';
    case 'boldline': return '<div class="boldline"><strong>'+md(b.v)+'</strong></div>';
    case 'ctaButton': return '<div class="cta-pill">'+md(b.v)+'<span class="arrow">→</span></div>';
    case 'small': return '<p class="small">'+md(b.v)+'</p>';
    case 'divider': return '<div class="divider"></div>';
    case 'bignum': return '<div class="bignum">'+md(b.v)+'</div>';

    case 'path':
      return '<div class="path-row">'+b.v.map(function(step,idx){
        var chip = '<span class="path-step step-'+(idx+1)+'">'+md(step)+'</span>';
        return idx < b.v.length-1 ? chip+'<span class="path-arrow">→</span>' : chip;
      }).join('')+'</div>';

    case 'list':
      return '<ul class="items'+(b.bullet===false?' no-dot':'')+'">'
        +b.v.map(function(i){return '<li>'+md(i)+'</li>';}).join('')+'</ul>';

    case 'checklist':
      return '<div class="checklist">'+b.v.map(function(i){
        var sub = i.sub ? '<ul class="items" style="margin-top:7px;margin-bottom:0">'
          +i.sub.map(function(s){return '<li>'+md(s)+'</li>';}).join('')+'</ul>' : '';
        return '<div class="check-item"><div class="check-ico">✓</div>'
          +'<div class="check-text">'+md(i.text)+sub+'</div></div>';
      }).join('')+'</div>';

    case 'groups':
      var groupsCls = 'groups-row' + (b.arrow ? ' with-arrow' : '') + (b.cols2 ? ' cols2' : '');
      var groupBlocks = b.v.map(function(g, gi){
        var sub = g.sub ? '<ul class="items" style="margin:0">'
          +g.sub.map(function(s){return '<li>'+md(s)+'</li>';}).join('')+'</ul>' : '';
        return '<div class="group-block group-'+(gi===0?'before':'after')+'"><div class="group-lead">'+md(g.lead)+'</div>'+sub+'</div>';
      });
      if (b.arrow && groupBlocks.length === 2)
        groupBlocks.splice(1, 0, '<div class="groups-arrow">→</div>');
      return '<div class="'+groupsCls+'">'+groupBlocks.join('')+'</div>';

    case 'numbered':
      return '<div class="num-list">'+b.v.map(function(i,idx){
        return '<div class="num-item"><div class="num-circle">'+(idx+1)+'</div>'
          +'<div class="num-text">'+md(i)+'</div></div>';
      }).join('')+'</div>';

    case 'quote':
      return '<div class="quote-block"><p>'+md(b.v)+'</p>'
        +(b.by?'<div class="by">— '+md(b.by)+'</div>':'')+'</div>';

    case 'result':
      return '<div class="result-block"><p>'+md(b.v)+'</p>'
        +(b.by?'<div class="by">'+md(b.by)+'</div>':'')+'</div>';

    case 'card':
      return '<div class="card-generic"><div class="label">'+md(b.label)+'</div>'
        +'<h3 style="margin-bottom:5px">'+md(b.title)+'</h3>'
        +'<p style="margin-bottom:0">'+md(b.v)+'</p></div>';

    case 'poll':
      return '<div class="tag-row">'+b.v.map(function(o){
        return '<span class="tag">'+md(o)+'</span>';
      }).join('')+'</div>';

    case 'price':
      var feats = '<ul class="items">'+b.features.map(function(f){
        return '<li>'+md(f)+'</li>';
      }).join('')+'</ul>';
      var plansHtml = '<div class="price-plans">'+b.plans.map(function(p){
        return '<div class="price-plan">'
          +'<div class="price-plan-label">'+md(p.label)+'</div>'
          +'<div class="price-tier full"><span class="pt-label">Без скидки</span><span class="pt-val">'+md(p.full)+'</span></div>'
          +'<div class="price-tier today"><span class="pt-label">Сегодня на эфире</span><span class="pt-val">'+md(p.today)+'</span></div>'
        +'</div>';
      }).join('')+'</div>';
      return '<div class="price-card"><div class="tier-name">'+md(b.name)+'</div>'
        +feats+'<div class="price-bottom">'+plansHtml+'</div></div>';

    case 'illus':
      var illusStyle = b.size ? ' style="max-height:'+b.size+'"' : '';
      return '<div class="illus-wrap"><img class="illus-img"'+illusStyle+' src="'+b.v+'" alt=""></div>';

    case 'photos':
      var photoCls = 'slide-photo' + (b.contain ? ' photo-contain' : '');
      var photoStyle = (b.objPos||b.size)
        ? ' style="'+(b.size?'max-height:'+b.size+';':'')+(b.objPos?'object-position:'+b.objPos:'')+'"' : '';
      return '<div class="photo-row">'+b.v.map(function(src){
        return '<img class="'+photoCls+'"'+photoStyle+' src="'+src+'" alt="">';
      }).join('')+'</div>';

    case 'photocols':
      var colRight = '';
      var textStyle = b.fontSize ? ' style="font-size:'+b.fontSize+'"' : '';
      if (b.tag) colRight += '<div class="badge">'+md(b.tag)+'</div>';
      if (b.h) colRight += '<h1 style="font-size:'+(b.fontSize ? 'clamp(30px,4vw,58px)' : 'clamp(26px,3.3vw,46px)')+'">'+md(b.h)+'</h1>';
      if (b.p) colRight += '<p'+textStyle+'>'+md(b.p)+'</p>';
      if (b.list) colRight += '<ul class="items">'+b.list.map(function(item){
        return '<li'+textStyle+'>'+md(item)+'</li>';
      }).join('')+'</ul>';
      if (b.quote) colRight += '<div class="quote-block"><p'+textStyle+'>'+md(b.quote.v)+'</p>'
        +(b.quote.by?'<div class="by">— '+md(b.quote.by)+'</div>':'')+'</div>';
      if (b.small) colRight += '<p class="small">'+md(b.small)+'</p>';
      var imgStyle = b.photoW ? ' style="width:'+b.photoW+'"' : '';
      var imgCls = 'photocols-img' + (b.imgContain ? ' img-contain' : '');
      var photocolsCls = 'photocols' + (b.photoRight ? ' photo-right' : '');
      return '<div class="'+photocolsCls+'"><img class="'+imgCls+'"'+imgStyle+' src="'+b.photo+'" alt="">'
        +'<div class="photocols-list">'+colRight+'</div></div>';

    case 'testimonial':
      return '<div class="testimonial-card"><div class="star">'+md(b.tag)+'</div>'
        +'<div class="name">'+md(b.name)+'</div><div class="meta">'+md(b.meta)+'</div>'
        +'<div class="quote-block" style="margin:0"><p>'+md(b.v)+'</p></div></div>';

    case 'segment':
      var bodyChips = b.body.split(/,\s*/).map(function(x){
        return '<span class="seg-chip body">'+md(x)+'</span>';
      }).join('');
      var psycheChips = b.psyche.split(/,\s*/).map(function(x){
        return '<span class="seg-chip psyche">'+md(x)+'</span>';
      }).join('');
      return '<div class="segment-card"><div class="big-num">'+md(b.num)+'</div><div class="card-body">'
        +'<h3>'+md(b.name.replace(/^\d+\.\s*/,''))+'</h3><p>'+md(b.cause)+'</p>'
        +'<div class="segment-two">'
          +'<div class="col"><h4>Тело</h4><div class="seg-chips">'+bodyChips+'</div></div>'
          +'<div class="col"><h4>Психика</h4><div class="seg-chips">'+psycheChips+'</div></div>'
        +'</div><p class="seg-resolve">'+md(b.resolve)+'</p></div></div>';

    case 'research':
      return '<div class="research-card"><div class="big-num">'+md(b.num)+'</div><div class="card-body">'
        +'<div class="cite">'+md(b.cite)+'</div><h4>'+md(b.title)+'</h4>'
        +'<p class="finding">'+md(b.v)+'</p><div class="doi">'+md(b.doi)+'</div></div></div>';

    case 'scientists':
      return '<div class="sci-row">'+b.v.map(function(s){
        var initials = s.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2);
        var imgHtml = s.img
          ? '<img src="'+s.img+'" alt="'+s.name+'" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">'
            +'<div class="sci-init" style="display:none">'+initials+'</div>'
          : '<div class="sci-init">'+initials+'</div>';
        return '<div class="sci-card"><div class="sci-avatar">'+imgHtml+'</div>'
          +'<div class="sci-name">'+s.name+'</div><div class="sci-years">'+s.years+'</div></div>';
      }).join('')+'</div>';

    case 'qcards':
      return '<div class="qcard-row">'+b.v.map(function(item,i){
        return '<div class="qcard"><div class="qcard-left"><div class="qcard-num">'+(i+1)+'</div>'
          +'<div class="qcard-icon">'+item.icon+'</div></div>'
          +'<div class="qcard-text">'+md(item.q)+'</div></div>';
      }).join('')+'</div>';

    case 'shot':
      return '<div class="shot'+(b.big?' big':'')+'">'+slot(b.src, b.label, b.contain?'contain':'')+'</div>';

    case 'video':
      return '<div class="shot big"><video src="'+b.src+'" poster="'+(b.poster||'')+'" autoplay muted loop playsinline controls preload="auto"></video></div>';

    case 'pair':
      return '<div class="pair'+(b.real2?' three':'')+'">'
        +'<figure><div class="pair-cap">'+md(b.capA||'Атлас')+'</div>'+slot(b.atlas, b.labelA||'Фото из атласа')+'</figure>'
        +'<figure><div class="pair-cap real">'+md(b.capB||'Диссекция')+'</div>'+slot(b.real, b.labelB||'Фото с диссекции')+'</figure>'
        +(b.real2?'<figure><div class="pair-cap real">&nbsp;</div>'+slot(b.real2, b.labelB||'Фото с диссекции')+'</figure>':'')
      +'</div>';

    case 'table':
      var cols = b.head.length;
      var tmpl = 'grid-template-columns:'+(b.first||'1.1fr')+' repeat('+(cols-1)+',1fr)';
      var hdr = '<div class="cmp-row" style="'+tmpl+'">'+b.head.map(function(c,ci){
        return '<div class="cmp-cell h'+(ci===cols-1?' win':'')+'">'+md(c)+'</div>';
      }).join('')+'</div>';
      var body = b.rows.map(function(r){
        return '<div class="cmp-row" style="'+tmpl+'">'+r.map(function(c,ci){
          return '<div class="cmp-cell'+(ci===0?' first':'')+(ci===cols-1?' win':'')+'">'+md(c)+'</div>';
        }).join('')+'</div>';
      }).join('');
      return '<div class="cmp">'+hdr+body+'</div>';

    default: return '';
  }
}

function renderSlide(s, idx){
  var cls = 'slide';
  if(s.bg==='cta') cls+=' cta-slide';
  else if(s.bg==='orange') cls+=' surf-c';
  else if(s.bg==='case') cls+=' surf-b';
  else if(idx%2===1) cls+=' surf-b';
  if(s.center) cls+=' center-slide';
  if(s.bigText) cls+=' big-text';
  if(s.fillSlide) cls+=' fill-slide';
  if(s.fillText) cls+=' fill-slide fill-text';
  if(s.atlasSlide) cls+=' atlas';
  if(s.review) cls+=' review';
  if(s.boldText) cls+=' bold-text';

  var head = '<div class="hd">'
    +'<div class="hd-num">'+(idx+1)+'</div>'
    +'<div class="hd-chip">'+s.sec+'</div>'
    +'<div class="brand">Живая анатомия · МИОТ</div>'
  +'</div>';

  var body = '<div class="scroll-content'+(s.center?' center':'')+'">'
    + s.blocks.map(renderBlock).join('')
  +'</div>';

  var bar = '<div class="progress-bar"><i id="progress-'+idx+'"></i></div>';

  return '<div class="'+cls+'" data-slide="'+(idx+1)+'">'+head+body+bar+'</div>';
}

// ── Сборка сцены ──
var stage = document.getElementById('stage');
stage.innerHTML = SLIDES.map(renderSlide).join('');

// ── Меню ──
var menuList = document.getElementById('menuList');
var lastSec = null;
var menuHtml = '';
SLIDES.forEach(function(s, idx){
  if(s.sec !== lastSec){
    menuHtml += '<div class="menu-sec">'+s.sec+'</div>';
    lastSec = s.sec;
  }
  menuHtml += '<div class="menu-item" data-idx="'+idx+'" onclick="goTo('+(idx+1)+');closeMenu()">'
    +'<div class="menu-num">'+(idx+1)+'</div>'
    +'<div class="menu-label">'+s.nav+'</div>'
  +'</div>';
});
menuList.innerHTML = menuHtml;

// ── Навигация ──
var slideEls = document.querySelectorAll('.slide');
var menuItems = document.querySelectorAll('.menu-item');
var total = slideEls.length;
var current = 1;

function fitContent(slide){
  var sc = slide.querySelector('.scroll-content');
  if(!sc) return;
  if(slide.classList.contains('fill-text')){
    sc.style.transform=''; sc.style.width='';
    var k=1; slide.style.setProperty('--k',1);
    while(k>0.5 && sc.scrollHeight > sc.clientHeight+2){ k-=0.04; slide.style.setProperty('--k',k.toFixed(2)); }
    return;
  }
  if(slide.classList.contains('fill-slide')){ sc.style.transform=''; sc.style.width=''; return; }
  sc.style.transform = '';
  sc.style.transformOrigin = 'top left';
  sc.style.width = '';
  var minScale = window.innerWidth <= 900 ? 0.34 : 0.36;
  var clientHeight = sc.clientHeight;
  var scale = 1;
  // Расширение блока (компенсация масштаба) меняет перенос строк текста,
  // из-за чего высота контента при разной ширине скачет между двумя
  // состояниями. Чтобы не зациклиться на невыгодной фазе, на каждом
  // проходе берём масштаб не больше предыдущего — гарантированно сходится.
  for(var i=0; i<4; i++){
    var scrollHeight = sc.scrollHeight;
    if(scrollHeight <= clientHeight + 8) break;
    var candidate = Math.max(clientHeight / scrollHeight, minScale);
    scale = Math.min(scale, candidate);
    sc.style.transform = 'scale('+scale.toFixed(3)+')';
    sc.style.width = (100/scale).toFixed(1)+'%';
  }
}

function goTo(n){
  if(n < 1 || n > total) return;
  slideEls[current-1].classList.remove('active');
  slideEls[current-1].classList.add('exit-left');
  setTimeout(function(){ slideEls[current-1].classList.remove('exit-left'); }, 400);
  menuItems[current-1].classList.remove('active');
  current = n;
  slideEls[current-1].classList.add('active');
  menuItems[current-1].classList.add('active');
  menuItems[current-1].scrollIntoView({block:'nearest', behavior:'smooth'});
  document.getElementById('menuCounter').textContent = current + ' / ' + total;
  document.getElementById('prev').disabled = current === 1;
  document.getElementById('next').disabled = current === total;
  fitContent(slideEls[current-1]);
  var pct = (current/total*100).toFixed(1);
  var prog = slideEls[current-1].querySelector('.progress-bar i');
  if(prog) prog.style.width = pct + '%';
}
function nextSlide(){ goTo(current+1); }
function prevSlide(){ goTo(current-1); }

function openMenu(){ document.getElementById('menuBackdrop').classList.add('open'); }
function closeMenu(){ document.getElementById('menuBackdrop').classList.remove('open'); }
document.getElementById('menuToggle').addEventListener('click', function(){
  document.getElementById('menuBackdrop').classList.toggle('open');
});
document.getElementById('menuBackdrop').addEventListener('click', function(e){
  if(e.target === this) closeMenu();
});

document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){ closeMenu(); return; }
  if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){ e.preventDefault(); nextSlide(); }
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){ e.preventDefault(); prevSlide(); }
});

var tx = 0;
stage.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
stage.addEventListener('touchend', function(e){
  var dx = tx - e.changedTouches[0].clientX;
  if(Math.abs(dx) > 40){ dx > 0 ? nextSlide() : prevSlide(); }
}, {passive:true});

slideEls.forEach(function(s){ fitContent(s); });
goTo(1);

// Пересчитываем масштаб после подгрузки картинок (иначе высота слайда
// на момент первого fitContent ещё не учитывает реальные фото)
stage.querySelectorAll('img').forEach(function(img){
  function refit(){
    var slide = img.closest('.slide');
    if(slide) fitContent(slide);
  }
  if(img.complete) refit();
  else { img.addEventListener('load', refit); img.addEventListener('error', refit); }
});

var resizeTimer;
window.addEventListener('resize', function(){
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    var sc = slideEls[current-1].querySelector('.scroll-content');
    if(sc){ sc.style.transform=''; sc.style.width=''; }
    fitContent(slideEls[current-1]);
  }, 120);
});
