#!/usr/bin/env python3
"""Build the Renata referral copy from the generated student schedule."""
from html import escape, unescape
from pathlib import Path
import re
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent


def tagged_url(raw):
    parts = urlsplit(unescape(raw))
    query = [(key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True) if key != 'utm_source']
    query.append(('utm_source', 'Renata'))
    return escape(urlunsplit(parts._replace(query=urlencode(query))), quote=True)


def build():
    html = (ROOT / 'raspisanie-studentam.html').read_text(encoding='utf-8')
    html, count = re.subn(r'(<a\b[^>]*?\bhref=")([^"]+)(")', lambda match: match[0] if match[2].startswith('${') else match[1] + tagged_url(match[2]) + match[3], html)
    if count != 6:
        raise ValueError(f'Expected five static links and one dynamic link; found {count}. Review referral tagging.')
    old = '${encodeURI(e.url)}'
    if html.count(old) != 1:
        raise ValueError('Cannot find unique dynamic event link')
    html = html.replace(old, '${esc(renataUrl(e.url))}')
    marker = '\nrenderNext();\nrender();'
    if html.count(marker) != 1:
        raise ValueError('Cannot find script insertion point')
    script = '''
// Keep the referral source on dynamically generated event links and this page.
function renataUrl(raw) {
  const url = new URL(raw, window.location.href);
  url.searchParams.set('utm_source', 'Renata');
  return url.href;
}
const referralPageUrl = renataUrl(window.location.href);
if (referralPageUrl !== window.location.href) history.replaceState(history.state, '', referralPageUrl);
'''
    html = html.replace(marker, '\n' + script + marker)
    (ROOT / 'raspisanie-renata.html').write_text(html, encoding='utf-8')
    print('Built raspisanie-renata.html with Renata referral links.')


if __name__ == '__main__':
    build()
