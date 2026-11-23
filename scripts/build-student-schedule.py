"""Build the student schedule without staff links or participant data."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "raspisanie.html"
OUTPUT = ROOT / "raspisanie-studentam.html"


def remove_between(html, start, end):
    if html.count(start) != 1:
        raise ValueError(f"Expected one section starting with {start!r}")
    first = html.index(start)
    last = html.index(end, first)
    return html[:first] + html[last:]


def replace_once(html, old, new):
    if html.count(old) != 1:
        raise ValueError(f"Expected one occurrence of {old!r}")
    return html.replace(old, new, 1)


def build():
    html = SOURCE.read_text(encoding="utf-8")
    html = replace_once(html, "(для сотрудников)</title>", "(для учеников)</title>")
    html = replace_once(html, ">Для сотрудников</span>", ">Для учеников</span>")
    html = replace_once(
        html,
        "МИОТ · внутренняя страница, не для публикации",
        "МИОТ · расписание для учеников",
    )
    html = remove_between(html, '  <div class="page-tabs"', '  <section id="panel-schedule"')
    html = replace_once(
        html,
        'id="panel-schedule" role="tabpanel" aria-labelledby="tab-schedule"',
        'aria-label="Расписание мероприятий"',
    )
    html = remove_between(html, '  <section id="panel-sites"', "\n</main>")
    html = remove_between(html, "/* Чаты участников:", "EVENTS.forEach((e, i) => {")
    html = remove_between(html, "  if (e.sheet) {", "  document.getElementById('modalBody').innerHTML = h;")
    html = remove_between(html, "const pageTabs =", "renderNext();")

    # Remove chat data stored directly on individual events, too.
    html = re.sub(r",\n    chats: \[[^\n]+\](?= \},)", "", html)
    removed_styles = (
        ".modal__chats", ".btn--sheet", ".btn--ghost", ".page-tabs",
        ".page-tab", ".sites-intro", ".sites-group", ".sites-list", ".site-link",
    )
    html = "\n".join(
        line for line in html.splitlines()
        if not line.lstrip().startswith(removed_styles)
    ) + "\n"

    forbidden = (
        "t.me/", "telegram.me/", "max.ru/join/", "docs.google.com/spreadsheets/",
        "CHATS", "SHEETS", "e.chats", "e.sheet", "chats:", "sheet:",
        "modal__chats", "page-tab", "panel-sites", "tab-sites",
        "Ссылки на все сайты", "Для сотрудников", "для сотрудников",
    )
    for value in forbidden:
        if value.casefold() in html.casefold():
            raise ValueError(f"Staff-only content remains: {value!r}")
    if '<meta name="robots" content="noindex, nofollow">' not in html:
        raise ValueError("The student page must preserve the noindex setting")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Built {OUTPUT.name}; staff links and data removed.")


if __name__ == "__main__":
    build()
