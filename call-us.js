/*
 * «Есть вопросы? Позвоните нам!» — телефон команды Олега Агапэ на всех страницах сайта.
 *  - Сверху страницы: тонкая полоса с номером (фиксированную шапку сдвигаем вниз, пока полоса видна).
 *  - Под каждой формой заявки (виджеты GetCourse и <form>): карточка с номером.
 *  - В подвале (<footer>): строка с номером; если подвала нет — добавляем её в конец страницы.
 * Номер меняется здесь, в одном месте.
 */
(function () {
  'use strict';

  if (window.top !== window.self || window.__callUs) return;
  window.__callUs = true;

  var PHONE_HREF = 'tel:+79604787810';
  var PHONE_TEXT = '+7 960 478-78-10';
  var TITLE = 'Есть вопросы? Позвоните нам!';
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';

  var CSS =
    '.callus-top{position:relative;z-index:9999;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px 10px;margin:0;padding:7px 16px;background:#111827;color:#e5e7eb;font:500 14px/1.35 Inter,Montserrat,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:center}' +
    '.callus-top a{display:inline-flex;align-items:center;gap:6px;color:#fff;font-weight:700;text-decoration:none;white-space:nowrap}' +
    '.callus-top a:hover{text-decoration:underline}' +
    '.callus-top svg{width:15px;height:15px}' +
    '.callus-top--abs{position:absolute;top:0;left:0;right:0}' +
    '@media (max-width:420px){.callus-top{gap:2px 6px;padding:6px 10px;font-size:12.5px}.callus-top svg{display:none}}' +
    '.callus-card{display:flex;align-items:center;gap:14px;box-sizing:border-box;width:100%;max-width:520px;margin:16px auto 0;padding:14px 16px;border:1px solid rgba(17,24,39,.14);border-radius:14px;background:#fff;color:#374151;font:400 15px/1.35 Inter,Montserrat,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:left;text-decoration:none;transition:box-shadow .2s,border-color .2s}' +
    '.callus-card:hover{border-color:rgba(17,24,39,.35);box-shadow:0 10px 24px -14px rgba(17,24,39,.5)}' +
    '.callus-card__ico{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:#111827;color:#fff}' +
    '.callus-card__ico svg{width:20px;height:20px}' +
    '.callus-card b{display:block;margin-top:2px;color:#111827;font-size:18px;font-weight:800;white-space:nowrap}' +
    '.callus-foot{box-sizing:border-box;width:100%;margin:0;padding:14px 16px;border-top:1px solid;border-color:inherit;color:inherit;font:inherit;font-size:15px;line-height:1.4;text-align:center}' +
    '.callus-foot a{color:inherit;font-weight:700;text-decoration:none;white-space:nowrap}' +
    '.callus-foot a:hover{text-decoration:underline}' +
    '.callus-foot--page{border-top:0;font-family:Inter,Montserrat,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
    '@media print{.callus-top,.callus-card{display:none}}';

  function hasPhone(el) {
    return !!(el && el.querySelector('a[href="' + PHONE_HREF + '"]'));
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    n.className = cls;
    n.innerHTML = html;
    return n;
  }

  function addStyles() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Полоса сверху. Фиксированную шапку опускаем на видимую высоту полосы.
  function addTopBar() {
    var bar = el('div', 'callus-top',
      '<span>' + TITLE + '</span><a href="' + PHONE_HREF + '">' + ICON + PHONE_TEXT + '</a>');
    document.body.insertBefore(bar, document.body.firstChild);

    // Страница-карточка, отцентрованная flex/grid: полосу ставим поверх, а не в поток.
    var bodyDisplay = getComputedStyle(document.body).display;
    if (/flex|grid/.test(bodyDisplay)) {
      bar.classList.add('callus-top--abs');
      var pad = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      document.body.style.paddingTop = (pad + bar.offsetHeight) + 'px';
    }

    var fixed = [], baseTop = [];
    // Шапки часто становятся fixed уже после загрузки (стили, анимации) — ищем несколько раз.
    // Сдвигаем всё фиксированное у верхнего края (шапку и полоски над/под ней), сохраняя их отступ.
    function scan() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var all = document.body.getElementsByTagName('*');
      for (var i = 0; i < all.length; i++) {
        var n = all[i];
        if (n === bar || bar.contains(n) || fixed.indexOf(n) !== -1) continue;
        var cs = getComputedStyle(n);
        if (cs.position !== 'fixed') continue;
        var top = parseFloat(cs.top);
        if (isNaN(top) || top < 0 || top > 150) continue;
        var r = n.getBoundingClientRect();
        if (r.width < vw * 0.5 || r.height === 0 || r.height > vh * 0.5) continue;
        fixed.push(n);
        baseTop.push(top);
      }
      shift();
    }
    function shift() {
      var add = Math.max(0, bar.offsetHeight - window.pageYOffset);
      for (var j = 0; j < fixed.length; j++) fixed[j].style.top = (baseTop[j] + add) + 'px';
    }
    scan();
    window.addEventListener('load', scan);
    setTimeout(scan, 1500);
    window.addEventListener('scroll', shift, { passive: true });
    window.addEventListener('resize', shift);
  }

  // Карточка под каждой формой заявки. Виджет GetCourse может успеть загрузиться
  // и удалить свой <script> раньше нас — тогда ищем его по iframe.
  function addFormCards() {
    var targets = [];
    var widgets = document.querySelectorAll('script[src*="/pl/lite/widget/script"], iframe[src*="/pl/lite/widget/widget"]');
    for (var i = 0; i < widgets.length; i++) targets.push(widgets[i].parentNode);
    var forms = document.getElementsByTagName('form');
    for (var k = 0; k < forms.length; k++) targets.push(forms[k]);

    for (var j = 0; j < targets.length; j++) {
      var t = targets[j];
      if (!t || t === document.body || t === document.head || t.__callus) continue;
      t.__callus = true;
      if (t.closest('footer') || hasPhone(t) || hasPhone(t.parentNode)) continue;
      var card = el('a', 'callus-card',
        '<span class="callus-card__ico">' + ICON + '</span><span>' + TITLE + '<b>' + PHONE_TEXT + '</b></span>');
      card.href = PHONE_HREF;
      if (t.tagName === 'FORM') t.parentNode.insertBefore(card, t.nextSibling);
      else t.appendChild(card);
    }
  }

  // Строка в подвале.
  function addFooterLine() {
    var html = TITLE + ' <a href="' + PHONE_HREF + '">' + PHONE_TEXT + '</a>';
    var footers = document.getElementsByTagName('footer');
    var footer = footers[footers.length - 1];
    if (footer) {
      if (!hasPhone(footer)) footer.insertBefore(el('div', 'callus-foot', html), footer.firstChild);
      return;
    }
    document.body.appendChild(el('div', 'callus-foot callus-foot--page', html));
  }

  function init() {
    addStyles();
    addFormCards();
    addFooterLine();
    addTopBar();
    window.addEventListener('load', addFormCards);
    setTimeout(addFormCards, 3000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
