/*
 * UTM-метки: сохраняем при заходе на любую страницу сайта, храним 30 дней.
 *  - Метки в адресе есть  -> сохраняем (старые стираются целиком).
 *  - Меток в адресе нет   -> ничего не перезаписываем, берём сохранённые (если не истекли).
 *  - Сохранённые метки дописываются в адрес страницы (history.replaceState) ДО загрузки
 *    виджетов GetCourse — виджет читает метки из адреса, так они попадают в форму.
 *  - Сохранённые метки добавляются во все ссылки на GetCourse (agape-course.com / .ru, getcourse.*).
 *    Если в самой ссылке уже есть своя метка, она остаётся как есть.
 * Проверка: в консоли браузера  siteUtm.get()  — покажет сохранённые метки, siteUtm.clear() — сотрёт.
 */
(function () {
  'use strict';

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var NAME = 'site_utm';
  var TTL_MS = 30 * 24 * 60 * 60 * 1000;
  var MAX_LEN = 200;

  function readCookie() {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i++) {
      var eq = parts[i].indexOf('=');
      if (parts[i].slice(0, eq) === NAME) {
        try { return decodeURIComponent(parts[i].slice(eq + 1)); } catch (e) { return null; }
      }
    }
    return null;
  }

  function writeStore(data) {
    var value = JSON.stringify({ d: data, t: Date.now() });
    try {
      document.cookie = NAME + '=' + encodeURIComponent(value) +
        '; path=/; max-age=' + Math.floor(TTL_MS / 1000) + '; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) {}
    try { localStorage.setItem(NAME, value); } catch (e) {}
  }

  function clearStore() {
    try { document.cookie = NAME + '=; path=/; max-age=0; SameSite=Lax'; } catch (e) {}
    try { localStorage.removeItem(NAME); } catch (e) {}
  }

  function readStore() {
    var raw = readCookie();
    if (!raw) { try { raw = localStorage.getItem(NAME); } catch (e) {} }
    if (!raw) return null;
    var obj;
    try { obj = JSON.parse(raw); } catch (e) { clearStore(); return null; }
    if (!obj || !obj.d || !obj.t || Date.now() - obj.t > TTL_MS) { clearStore(); return null; }
    return obj.d;
  }

  function fromUrl() {
    var found = {}, any = false, params;
    try { params = new URLSearchParams(location.search); } catch (e) { return null; }
    KEYS.forEach(function (k) {
      var v = (params.get(k) || '').trim().slice(0, MAX_LEN);
      if (v) { found[k] = v; any = true; }
    });
    return any ? found : null;
  }

  var current = fromUrl();
  var data;
  if (current) {
    writeStore(current);          // новые метки целиком заменяют старые
    data = current;
  } else {
    data = readStore();           // меток в адресе нет — ничего не трогаем, берём сохранённые
  }

  window.siteUtm = {
    get: function () { return data ? JSON.parse(JSON.stringify(data)) : null; },
    clear: function () { clearStore(); data = null; }
  };

  if (!data) return;

  // 1) метки в адрес страницы — оттуда их читают виджеты GetCourse
  try {
    var url = new URL(location.href), changed = false;
    KEYS.forEach(function (k) {
      if (data[k] && !url.searchParams.has(k)) { url.searchParams.set(k, data[k]); changed = true; }
    });
    if (changed && window.history && history.replaceState) {
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    }
  } catch (e) {}

  // 2) метки во все ссылки на GetCourse
  function isGetCourse(host) {
    host = host.toLowerCase();
    if (host.indexOf('fs.') === 0) return false; // файловое хранилище, не страницы школы
    return /(^|\.)agape-course\.(com|ru)$/.test(host) || /(^|\.)getcourse\.(ru|io)$/.test(host);
  }

  function decorate(a) {
    if (!a || !a.getAttribute) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return;
    if (!isGetCourse(u.hostname)) return;
    var changed = false;
    KEYS.forEach(function (k) {
      if (data[k] && !u.searchParams.has(k)) { u.searchParams.set(k, data[k]); changed = true; }
    });
    if (changed) a.href = u.toString();
  }

  function decorateAll(root) {
    if (root.nodeType !== 1) return;
    if (root.tagName === 'A') decorate(root);
    var list = root.querySelectorAll ? root.querySelectorAll('a[href]') : [];
    for (var i = 0; i < list.length; i++) decorate(list[i]);
  }

  function start() {
    decorateAll(document.documentElement);
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          for (var i = 0; i < m.addedNodes.length; i++) decorateAll(m.addedNodes[i]);
        });
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    // страховка: ссылка, созданная скриптом без наблюдателя, получит метки в момент клика
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (a) decorate(a);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
